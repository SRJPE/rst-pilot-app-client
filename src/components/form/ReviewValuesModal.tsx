import React, { useEffect, useState } from 'react'
import { SafeAreaView, Dimensions } from 'react-native'
import CustomModal from '../Shared/CustomModal'
import CustomModalHeader from '../Shared/CustomModalHeader'
import {
  Text,
  Button,
  ScrollView,
  Divider,
  HStack,
  VStack,
  View,
} from 'native-base'
import { List } from 'react-native-paper'
import { SceneMap, TabBar, TabBarProps, TabView } from 'react-native-tab-view'
import { startCase, snakeCase, find } from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { calcAvgValue, getProgramFormFieldsLookup } from '../../utils/utils'
import * as Print from 'expo-print'
import { shareAsync } from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import JSZip from 'jszip'
import {
  formatDateString_MM_DD_YY,
  getTimeProperty,
} from '../../utils/helpers/helperFunctions'

const initialLayout = { width: Dimensions.get('window').width }

const hiddenFields = [
  'isWaterTurbidityPresent',
  'recordTurbidityInPostProcessing',
  'trapName',
]

// Fish detail formatting helpers
function formatAppliedMark(mark: any): string {
  const parts = [
    mark.markType,
    mark.markCode ? `Code: ${mark.markCode}` : null,
    mark.markColor ? `Color: ${mark.markColor}` : null,
    mark.markPosition ? `Pos: ${mark.markPosition}` : null,
    mark.crewMember ? `Crew: ${mark.crewMember}` : null,
    mark.comments ? `Notes: ${mark.comments}` : null,
  ].filter(Boolean)
  return parts.join(' | ')
}

function formatGeneticSample(sample: any): string {
  console.log('sample', sample)
  const sampleTypes = [
    sample.mucusSwab ? 'Mucus Swab' : null,
    sample.finClip ? 'Fin Clip' : null,
  ].filter(Boolean)
  const parts = [
    sample.sampleId ? `ID: ${sample.sampleId}` : null,
    sampleTypes.length ? sampleTypes.join('+') : null,
    sample.crewMember ? `Crew: ${sample.crewMember}` : null,
    sample.comments ? `Notes: ${sample.comments}` : null,
  ].filter(Boolean)
  return parts.join(' | ')
}

type Props = {
  handleCloseReviewValuesModal: () => void
  formValues: any
  isOpen: boolean
  tabState: any
  visitSetupDefaultState?: any
  fieldCheck?: any
}

const getFilteredTrapOperationsState = (trapOperationsState: any) => {
  let filteredTrapOperationsState = {
    ...trapOperationsState,
  }
  delete filteredTrapOperationsState.trapVisitStartTime

  const dateKeysToCheck = ['trapVisitTime', 'sampleTime', 'startTime']
  if (dateKeysToCheck.some(key => key in filteredTrapOperationsState)) {
    delete filteredTrapOperationsState.trapVisitStopTime
  }

  if ('turbidity1' in filteredTrapOperationsState) {
    const meanFNU = calcAvgValue([
      trapOperationsState.turbidity1,
      trapOperationsState.turbidity2,
      trapOperationsState.turbidity3,
    ])?.toFixed(2)
    const orderedObj = {} as any
    for (const [key, value] of Object.entries(filteredTrapOperationsState)) {
      orderedObj[key] = value
      if (key === 'turbidity3') {
        orderedObj['meanFNU'] = meanFNU
      }
    }
    filteredTrapOperationsState = orderedObj
  }

  return filteredTrapOperationsState
}

const getFilteredPostProcessingState = (
  trapPostProcessingState: any,
  visitSetupState: any
) => {
  let filteredTrapPostProcessingState = {
    ...trapPostProcessingState,
  }
  delete filteredTrapPostProcessingState.fishProcessedResult

  if (
    ['Toe Drain', 'Clear Creek', 'Battle Creek'].includes(
      visitSetupState?.stream
    )
  ) {
    delete filteredTrapPostProcessingState.trapVisitStartTime
    delete filteredTrapPostProcessingState.endingTrapStatus
  }
  return filteredTrapPostProcessingState
}

const getUnitAbbreviation = ({
  field,
  sectionValues,
  programFormFieldsObj,
}: {
  field: string
  sectionValues: any
  programFormFieldsObj: any
}) => {
  let unit = sectionValues[`${field}Unit`] || ''

  if (programFormFieldsObj && programFormFieldsObj[field]) {
    if (programFormFieldsObj[field].unitDefinition) {
      const unitAbbrev =
        programFormFieldsObj[field].unitDefinition?.match(/\(([^)]+)\)/)?.[1] ||
        undefined
      unit = unitAbbrev || unit
    }
  }

  return unit
}

function fishInputSpeciesTableHtml(fishInputState: any): string {
  if (!fishInputState) return ''
  const allFish = Object.values(fishInputState) as any[]
  if (!allFish.length) return ''

  const bySpecies: Record<string, { individuals: any[]; plusCounts: any[] }> =
    {}
  allFish.forEach((fish: any) => {
    const sp = fish.species || 'Unknown'
    if (!bySpecies[sp]) bySpecies[sp] = { individuals: [], plusCounts: [] }
    if (fish.plusCount) bySpecies[sp].plusCounts.push(fish)
    else bySpecies[sp].individuals.push(fish)
  })

  const td = (content: string, extra = '') =>
    `<td style="padding:5px 6px;border:1px solid #ddd;text-align:center;width:56px;${extra}">${content}</td>`
  const labelTd = (content: string, extra = '') =>
    `<td style="padding:4px 8px;border:1px solid #ddd;font-style:italic;white-space:nowrap;font-size:11px;width:110px;${extra}">${content}</td>`
  const headerTd = (content: string, label = false) =>
    `<td style="padding:6px 8px;border:1px solid #ddd;background:#e5e7eb;text-align:center;font-weight:bold;font-size:14px;${label ? 'width:110px;' : 'width:56px;'}">${content}</td>`

  const formatFlCell = (fish: any): string => {
    const fl = fish.forkLength != null ? String(fish.forkLength) : '—'
    const sup = [
      fish.eggs
        ? '<sup style="font-size:8px;vertical-align:super;color:#555;">E</sup>'
        : '',
      fish.milting
        ? '<sup style="font-size:8px;vertical-align:super;color:#555;">M</sup>'
        : '',
    ].join('')
    const inner = `${fl}${sup}`
    if (fish.dead) {
      return `<span style="display:inline-block;border:2px solid #333;border-radius:50%;padding:2px 6px;">${inner}</span>`
    }
    return inner
  }

  const COLS = 10

  let html = `<h2>Fish Input (${allFish.length} records)</h2><div style="overflow-x:auto;">`

  Object.entries(bySpecies).forEach(
    ([species, { individuals, plusCounts }]) => {
      const has = (fn: (f: any) => boolean) => individuals.some(fn)
      const hasRun = has(f => f.run && f.run !== 'not recorded')
      const hasAdipose = has(f => f.adiposeClipped != null)
      const hasWeight = has(f => f.weight != null)
      const hasStage = has(f => f.lifeStage && f.lifeStage !== 'not recorded')
      const hasGenetics = has(
        f => Array.isArray(f.geneticSamples) && f.geneticSamples.length
      )
      const hasComments = has(f => f.comments)

      const plusLabel = plusCounts
        .map((f: any) => `+${f.numFishCaught}`)
        .join(', ')

      const chunks: (any | null)[][] = []
      for (let i = 0; i < Math.max(individuals.length, 1); i += COLS) {
        const chunk = individuals.slice(i, i + COLS)
        while (chunk.length < COLS) chunk.push(null)
        chunks.push(chunk)
      }
      if (!individuals.length) chunks[0] = Array(COLS).fill(null)

      const total = individuals.length
      html += `<table style="border-collapse:collapse;font-size:13px;margin-bottom:12px;border:1px solid #ccc;border-radius:8px;">`
      html += `<tr><td colspan="${COLS + 1}" style="background:#e5e7eb;padding:6px 10px;border-bottom:1px solid #ccc;">
        <strong>Species:</strong> ${species} &nbsp;|&nbsp; <strong>Measured:</strong> ${total}${plusLabel ? ` &nbsp;|&nbsp; <strong>Plus Count:</strong> ${plusLabel}` : ''}
      </td></tr>`

      chunks.forEach((chunk, ci) => {
        const first = ci === 0

        if (first)
          html += `<tr>${headerTd('FL (mm)', true)}${chunk.map((_, i) => headerTd(String(i + 1))).join('')}</tr>`

        html += `<tr>
        <td style="padding:4px 8px;border:1px solid #ddd;background:#f0fffe;width:110px;"></td>
        ${chunk.map(f => td(f ? formatFlCell(f) : '', 'background:#f0fffe;font-size:16px;')).join('')}
      </tr>`

        if (hasRun)
          html += `<tr>${labelTd('Run')}${chunk.map(f => td(f && f.run && f.run !== 'not recorded' ? f.run : '')).join('')}</tr>`
        if (hasAdipose && species.toLowerCase().includes('chinook'))
          html += `<tr>${labelTd('Ad +/-')}${chunk.map(f => td(f ? (f.adiposeClipped == null ? '' : f.adiposeClipped ? '+' : '−') : '')).join('')}</tr>`
        if (hasWeight)
          html += `<tr>${labelTd('Wt. (g)')}${chunk.map(f => td(f && f.weight != null ? String(f.weight) : '')).join('')}</tr>`
        if (hasStage)
          html += `<tr>${labelTd('Stage')}${chunk.map(f => td(f && f.lifeStage && f.lifeStage !== 'not recorded' ? f.lifeStage.charAt(0).toUpperCase() : '')).join('')}</tr>`
        if (hasComments)
          html += `<tr>${labelTd('Comments')}${chunk.map(f => td(f ? f.comments || '' : '', 'font-size:10px;')).join('')}</tr>`
        if (hasGenetics)
          html += `<tr>${labelTd('Genetics')}${chunk
            .map(f => {
              if (!f) return td('')
              const ids =
                Array.isArray(f.geneticSamples) && f.geneticSamples.length
                  ? f.geneticSamples
                      .map((s: any) => s.sampleId || '?')
                      .join(', ')
                  : ''
              return td(ids, 'font-size:10px;')
            })
            .join('')}</tr>`

        if (ci < chunks.length - 1)
          html += `<tr><td colspan="${COLS + 1}" style="height:4px;background:#b0cfd0;border:none;"></td></tr>`
      })

      html += `</table>`
    }
  )

  html += `</div><hr/>`
  return html
}

function fishGeneticsTableHtml(
  fishInputState: any,
  dropdownValues: any
): string {
  if (!fishInputState) return ''
  const detailedFish = (Object.values(fishInputState) as any[]).filter(
    (f: any) =>
      (Array.isArray(f.geneticSamples) && f.geneticSamples.length > 0) ||
      (Array.isArray(f.appliedMarks) && f.appliedMarks.length > 0)
  )
  if (!detailedFish.length) return ''

  const hdr = (content: string, w = '') =>
    `<th style="padding:5px 6px;border:1px solid #ddd;background:#e5e7eb;text-align:center;font-size:11px;${w ? `width:${w};` : ''}">${content}</th>`
  const cell = (content: string, w = '') =>
    `<td style="padding:4px 6px;border:1px solid #ddd;text-align:center;font-size:11px;vertical-align:middle;${w ? `width:${w};` : ''}">${content}</td>`

  const rows = detailedFish.map((fish: any, idx: number) => {
    const samples: any[] = Array.isArray(fish.geneticSamples)
      ? fish.geneticSamples
      : []
    const geneticIds = samples.length
      ? samples.map((s: any) => s.sampleId || '?').join(', ')
      : '—'
    const geneticTypes = samples.length
      ? samples
          .map((s: any) =>
            [s.mucusSwab ? 'Swab' : null, s.finClip ? 'Clip' : null]
              .filter(Boolean)
              .join('+')
          )
          .join(', ')
      : '—'
    const marks =
      Array.isArray(fish.appliedMarks) && fish.appliedMarks.length
        ? fish.appliedMarks.map(formatAppliedMark).join('; ')
        : '—'

    const capitalize = (v: any) =>
      typeof v === 'string' && v ? v.charAt(0).toUpperCase() + v.slice(1) : null

    const lookupCode = (table: string, id: any) => {
      if (id == null) return '—'
      const item = find(dropdownValues?.[table], { id })
      return item?.code || item?.definition || item?.description || '—'
    }

    const sampleCondition = samples.find(
      (s: any) => s.condition != null
    )?.condition
    const conditions =
      sampleCondition != null
        ? lookupCode('condition', sampleCondition)
        : Array.isArray(fish.fishConditions) && fish.fishConditions.length
          ? fish.fishConditions.map(capitalize).filter(Boolean).join(', ')
          : '—'

    const sampleTake = samples.find((s: any) => s.take != null)?.take
    const takeVal = sampleTake != null ? lookupCode('take', sampleTake) : '—'

    // Comments: aggregate from genetic samples, fall back to fish comments
    const sampleComments = samples
      .map((s: any) => s.comments)
      .filter(Boolean)
      .join('; ')
    const commentsVal = sampleComments || fish.comments || '—'

    const geneticYN = samples.some((s: any) => s.genetic)
      ? 'Y'
      : samples.length
        ? 'N'
        : '—'

    return `<tr style="background:${idx % 2 === 0 ? 'white' : '#f9f9f9'}">
      ${cell(String(idx + 1), '28px')}
      ${cell(geneticIds)}
      ${cell(fish.adiposeClipped == null ? '—' : fish.adiposeClipped ? '+' : '−', '38px')}
      ${cell(fish.dead ? 'Y' : 'N', '32px')}
      ${cell(conditions)}
      ${cell(takeVal, '38px')}
      ${cell(geneticYN, '38px')}
      ${cell(geneticTypes)}
      ${cell(commentsVal)}
    </tr>`
  })

  return `<h2>Genetics &amp; Marks (${detailedFish.length} records)</h2>
    <div style="overflow-x:auto;">
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr>
        ${hdr('#', '28px')}
        ${hdr('Genetic ID')}
        ${hdr('Ad +/-', '38px')}
        ${hdr('Dead', '32px')}
        ${hdr('Condition')}
        ${hdr('Take', '38px')}
        ${hdr('Genetic', '38px')}
        ${hdr('Sample Type')}
        ${hdr('Comments')}
      </tr></thead>
      <tbody>${rows.join('\n')}</tbody>
    </table>
    </div><hr/>`
}

export function generateAccordionHtmlFromTabValues({
  routes,
  formValues,
  visitSetupDefaultState,
  fieldCheck,
  dropdownValues,
}: any) {
  const sectionHtml = (
    title: string,
    data: Record<string, any>,
    programFormFieldsObj: any = {}
  ) => {
    if (!data)
      return `<h2>${title}</h2><table style="width:100%;border-collapse:collapse;">No Data</table><hr/>`
    const rows = Object.entries(data)
      .filter(
        ([key]) =>
          !key.includes('Unit') &&
          !hiddenFields.includes(key) &&
          !key.includes('Id')
      )
      .map(([key, value]) => {
        let displayKey = /\d/.test(key) ? key.toUpperCase() : startCase(key)
        let displayValue = value

        if (value instanceof Date) {
          displayValue = value.toLocaleString()
        } else if (typeof value === 'boolean') {
          displayValue = value ? 'Yes' : 'No'
        } else if (Array.isArray(value)) {
          if (value.length) {
            displayValue = value.join(', ')
          } else {
            displayValue = ''
          }
        }

        const unit = getUnitAbbreviation({
          field: key,
          sectionValues: data,
          programFormFieldsObj,
        })

        return displayValue
          ? `<tr><td><strong>${displayKey}</strong></td><td style="text-align:right">${displayValue} ${unit}</td></tr>`
          : ''
      })
      .join('\n')

    return rows
      ? `<h2>${title}</h2><table style="width:100%;border-collapse:collapse;">${rows}</table><hr/>`
      : ''
  }

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h2 { margin-top: 24px; border-bottom: 1px solid #ccc; }
          table td, table th { padding: 4px 8px; vertical-align: top; border: 1px solid #ddd; }
          hr { margin: 24px 0; }
        </style>
      </head>
      <body>
      ${routes.map((route: any) => {
        const visitSetupState = {
          ...formValues?.visitSetupState?.[route.key]?.values,
          fieldCheck,
        }
        const trapOperationsState = getFilteredTrapOperationsState(
          formValues?.trapOperationsState?.[route.key]?.values
        )
        const fishProcessingState =
          formValues?.fishProcessingState?.[route.key]?.values
        const fishInputState =
          formValues?.fishInputState?.[route.key]?.fishStore
        const trapPostProcessingState = getFilteredPostProcessingState(
          formValues?.trapPostProcessingState?.[route.key]?.values,
          formValues?.visitSetupState?.[route.key]?.values
        )

        const programFormFieldsObj = getProgramFormFieldsLookup(
          visitSetupState,
          visitSetupDefaultState
        )

        const htmlSections = [
          sectionHtml('Visit Setup', visitSetupState, programFormFieldsObj),
          sectionHtml(
            'Trap Operations',
            trapOperationsState,
            programFormFieldsObj
          ),
          sectionHtml(
            'Fish Processing',
            fishProcessingState,
            programFormFieldsObj
          ),
          fishInputSpeciesTableHtml(fishInputState),
          fishGeneticsTableHtml(fishInputState, dropdownValues),
          sectionHtml(
            'Trap Post-Processing',
            trapPostProcessingState,
            programFormFieldsObj
          ),
        ]
        return `
          <h1>${route.title}</h1>
          ${htmlSections.join('\n')}
        `
      })}
      </body>
    </html>
  `
}

const AccordionListItem = ({
  field,
  sectionValues,
  sectionTitle,
  programFormFieldsObj,
}: {
  field: string
  sectionValues: any
  sectionTitle: string
  programFormFieldsObj?: any
}) => {
  // if unit field, do not show
  if (field.includes('Unit')) return null
  if (hiddenFields.includes(field)) return null

  let fieldName = field
  // if field has a number in it, capitalize
  if (/\d/.test(field)) {
    fieldName = field.toUpperCase()
  } else if (field === 'ph') {
    fieldName = 'pH'
  } else if (field === 'ysiNum') {
    fieldName = 'YSI #'
  } else {
    fieldName = startCase(field)
  }

  let fieldValue = sectionValues[field]

  if (sectionValues[field] instanceof Date) {
    fieldValue = fieldValue.toLocaleString()
  } else if (typeof fieldValue === 'boolean') {
    fieldValue = fieldValue ? 'Yes' : 'No'
  } else if (Array.isArray(sectionValues[field])) {
    if (sectionValues[field].length) {
      fieldValue = fieldValue.join(', ')
    }
  }

  const unitValue = getUnitAbbreviation({
    field,
    sectionValues,
    programFormFieldsObj,
  })

  return field && fieldValue ? (
    <List.Item
      title={fieldName}
      titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
      style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
      right={() => (
        <View style={{ width: '50%', alignItems: 'flex-end' }}>
          <Text fontSize={'md'}>
            {fieldValue} {unitValue}
          </Text>
        </View>
      )}
    />
  ) : null
}

const FishInputSpeciesTable = ({ fishList }: { fishList: any[] }) => {
  if (!fishList.length) {
    return (
      <List.Item
        title='No Fish Caught'
        titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
        style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
      />
    )
  }

  const bySpecies: Record<
    string,
    { individuals: (any | null)[]; plusCounts: any[] }
  > = {}
  fishList.forEach((fish: any) => {
    const sp = fish.species || 'Unknown'
    if (!bySpecies[sp]) bySpecies[sp] = { individuals: [], plusCounts: [] }
    if (fish.plusCount) bySpecies[sp].plusCounts.push(fish)
    else bySpecies[sp].individuals.push(fish)
  })

  const COLS = 10
  const LABEL_W = 110
  const HEADER_H = 41
  const FL_H = 50
  const SUB_H = 38

  const FLCellContent = ({ fish }: { fish: any }) => {
    const fl = fish.forkLength != null ? String(fish.forkLength) : '—'
    const inner = (
      <HStack alignItems='flex-start' space={0} justifyContent='center'>
        <Text fontSize={18}>{fl}</Text>
        {(fish.eggs || fish.milting) && (
          <Text
            fontSize={11}
            color='gray.600'
            style={{ lineHeight: 14, marginTop: 2 }}
          >
            {[fish.eggs ? 'E' : '', fish.milting ? 'M' : '']
              .filter(Boolean)
              .join('')}
          </Text>
        )}
      </HStack>
    )
    if (fish.dead) {
      return (
        <View
          style={{
            borderWidth: 2,
            borderRadius: 50,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderColor: '#333',
            alignItems: 'center',
          }}
        >
          {inner}
        </View>
      )
    }
    return inner
  }

  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
      {Object.entries(bySpecies).map(
        ([species, { individuals, plusCounts }]) => {
          const has = (fn: (f: any) => boolean) =>
            (individuals.filter(Boolean) as any[]).some(fn)
          const hasRun = has(f => f.run && f.run !== 'not recorded')
          const hasAdipose = has(f => f.adiposeClipped != null)
          const hasGenetics = has(
            f => Array.isArray(f.geneticSamples) && f.geneticSamples.length
          )
          const hasWeight = has(f => f.weight != null)
          const hasStage = has(
            f => f.lifeStage && f.lifeStage !== 'not recorded'
          )
          const hasComments = has(f => f.comments)

          const plusLabel = plusCounts
            .map((f: any) => `+${f.numFishCaught}`)
            .join(', ')
          const totalCount = individuals.filter(Boolean).length

          const chunks: (any | null)[][] = []
          for (let i = 0; i < Math.max(individuals.length, 1); i += COLS) {
            const chunk = (individuals as any[]).slice(i, i + COLS)
            while (chunk.length < COLS) chunk.push(null)
            chunks.push(chunk)
          }
          if (!individuals.length) chunks[0] = Array(COLS).fill(null)

          return (
            <View
              key={species}
              style={{
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 15,
                overflow: 'hidden',
              }}
            >
              {/* Top info bar */}
              <HStack
                style={{
                  backgroundColor: '#e5e7eb',
                  borderBottomWidth: 1,
                  borderBottomColor: '#d1d5db',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <Text fontSize={16}>
                  <Text fontWeight='bold'>Species: </Text>
                  {species}
                </Text>
                <Text fontSize={16}>
                  <Text fontWeight='bold'>Measured: </Text>
                  {totalCount}
                </Text>
                {!!plusLabel && (
                  <Text fontSize={16}>
                    <Text fontWeight='bold'>Plus Count: </Text>
                    {plusLabel}
                  </Text>
                )}
              </HStack>

              {chunks.map((chunk, ci) => (
                <View key={ci}>
                  {/* Number header row — first chunk only */}
                  {ci === 0 && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: HEADER_H,
                          backgroundColor: '#e5e7eb',
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#d1d5db',
                        }}
                      >
                        <Text fontSize={14} fontWeight='bold' color='gray.700'>
                          FL (mm)
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((_, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: HEADER_H,
                              backgroundColor: '#e5e7eb',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#d1d5db',
                            }}
                          >
                            <Text fontSize={18} fontWeight='bold'>
                              {i + 1}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}

                  {/* FL row */}
                  <HStack>
                    <View
                      style={{
                        width: LABEL_W,
                        height: FL_H,
                        backgroundColor: '#f0fffe',
                        justifyContent: 'center',
                        paddingHorizontal: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#d1d5db',
                      }}
                    />
                    <HStack flex={1}>
                      {chunk.map((fish, i) => (
                        <View
                          key={i}
                          style={{
                            flex: 1,
                            height: FL_H,
                            backgroundColor: '#f0fffe',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: '#d1d5db',
                          }}
                        >
                          {fish ? <FLCellContent fish={fish} /> : null}
                        </View>
                      ))}
                    </HStack>
                  </HStack>

                  {/* Sub-rows */}
                  {hasRun && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Run
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish && fish.run && fish.run !== 'not recorded'
                                ? fish.run
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasAdipose && species.toLowerCase().includes('chinook') && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Ad +/-
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish
                                ? fish.adiposeClipped == null
                                  ? ''
                                  : fish.adiposeClipped
                                    ? '+'
                                    : '−'
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasWeight && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Wt. (g)
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish && fish.weight != null
                                ? String(fish.weight)
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasStage && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Stage
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish &&
                              fish.lifeStage &&
                              fish.lifeStage !== 'not recorded'
                                ? fish.lifeStage.charAt(0).toUpperCase()
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasComments && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Comments
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text
                              fontSize={10}
                              textAlign='center'
                              numberOfLines={2}
                            >
                              {fish ? fish.comments || '' : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasGenetics && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Genetics
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text
                              fontSize={12}
                              textAlign='center'
                              numberOfLines={2}
                            >
                              {fish &&
                              Array.isArray(fish.geneticSamples) &&
                              fish.geneticSamples.length
                                ? fish.geneticSamples
                                    .map((s: any) => s.sampleId || '?')
                                    .join(', ')
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                </View>
              ))}
            </View>
          )
        }
      )}
    </View>
  )
}

const FishGeneticsTable = ({
  fishList,
  dropdownValues,
}: {
  fishList: any[]
  dropdownValues: any
}) => {
  const detailedFish = fishList.filter(
    (f: any) =>
      (Array.isArray(f.geneticSamples) && f.geneticSamples.length > 0) ||
      (Array.isArray(f.appliedMarks) && f.appliedMarks.length > 0)
  )

  if (!detailedFish.length) return null

  const COLS = [
    { label: '#', flex: 0.4 },
    { label: 'Genetic ID', flex: 1.5 },
    { label: 'Ad +/-', flex: 0.5 },
    { label: 'Dead', flex: 0.5 },
    { label: 'Cond.', flex: 0.7 },
    { label: 'Take', flex: 0.5 },
    { label: 'Genetic', flex: 0.5 },
    { label: 'Sample Type', flex: 1 },
    { label: 'Comments', flex: 1.2 },
  ]

  const getRowValues = (fish: any, idx: number): string[] => {
    const samples: any[] = Array.isArray(fish.geneticSamples)
      ? fish.geneticSamples
      : []
    const geneticIds = samples.length
      ? samples.map((s: any) => s.sampleId || '?').join(', ')
      : '—'
    const geneticTypes = samples.length
      ? samples
          .map((s: any) =>
            [s.mucusSwab ? 'Swab' : null, s.finClip ? 'Clip' : null]
              .filter(Boolean)
              .join('+')
          )
          .join(', ')
      : '—'
    const marks =
      Array.isArray(fish.appliedMarks) && fish.appliedMarks.length
        ? fish.appliedMarks.map(formatAppliedMark).join('; ')
        : '—'

    const capitalize = (v: any) =>
      typeof v === 'string' && v ? v.charAt(0).toUpperCase() + v.slice(1) : null

    const lookupCode = (table: string, id: any) => {
      if (id == null) return '—'
      const item = find(dropdownValues?.[table], { id })
      return item?.code || item?.definition || item?.description || '—'
    }

    const sampleCondition = samples.find(
      (s: any) => s.condition != null
    )?.condition
    const conditions =
      sampleCondition != null
        ? lookupCode('condition', sampleCondition)
        : Array.isArray(fish.fishConditions) && fish.fishConditions.length
          ? fish.fishConditions.map(capitalize).filter(Boolean).join(', ')
          : '—'

    const sampleTake = samples.find((s: any) => s.take != null)?.take
    const takeVal = sampleTake != null ? lookupCode('take', sampleTake) : '—'

    // Comments: aggregate from genetic samples, fall back to fish comments
    const sampleComments = samples
      .map((s: any) => s.comments)
      .filter(Boolean)
      .join('; ')
    const commentsVal = sampleComments || fish.comments || '—'

    const geneticYN = samples.some((s: any) => s.genetic)
      ? 'Y'
      : samples.length
        ? 'N'
        : '—'

    return [
      String(idx + 1),
      geneticIds,
      fish.adiposeClipped == null ? '—' : fish.adiposeClipped ? '+' : '−',
      fish.dead ? 'Y' : 'N',
      conditions,
      takeVal,
      geneticYN,
      geneticTypes,
      commentsVal,
    ]
  }

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 15,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <HStack
        style={{
          backgroundColor: '#e5e7eb',
          borderBottomWidth: 1,
          borderBottomColor: '#d1d5db',
        }}
      >
        {COLS.map((col, i) => (
          <View
            key={i}
            style={{
              flex: col.flex,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 4,
              borderLeftWidth: i > 0 ? 1 : 0,
              borderLeftColor: '#d1d5db',
            }}
          >
            <Text
              fontSize={12}
              fontWeight='bold'
              textAlign='center'
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {col.label}
            </Text>
          </View>
        ))}
      </HStack>
      {/* Rows */}
      {detailedFish.map((fish, idx) => {
        const vals = getRowValues(fish, idx)
        return (
          <HStack
            key={idx}
            style={{
              backgroundColor: idx % 2 === 0 ? 'white' : '#f9f9f9',
              borderBottomWidth: idx < detailedFish.length - 1 ? 1 : 0,
              borderBottomColor: '#e5e7eb',
            }}
          >
            {COLS.map((col, i) => (
              <View
                key={i}
                style={{
                  flex: col.flex,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 4,
                  borderLeftWidth: i > 0 ? 1 : 0,
                  borderLeftColor: '#e5e7eb',
                }}
              >
                <Text fontSize={11} textAlign='center' numberOfLines={3}>
                  {vals[i]}
                </Text>
              </View>
            ))}
          </HStack>
        )
      })}
    </View>
  )
}

const AccordionView = ({
  tabValues,
  visitSetupDefaultState,
  dropdownValues,
}: {
  tabValues?: any
  visitSetupDefaultState?: any
  dropdownValues?: any
}) => {
  const filteredTrapOperationsState = getFilteredTrapOperationsState(
    tabValues.trapOperationsState
  )

  const filteredTrapPostProcessingState = getFilteredPostProcessingState(
    tabValues.trapPostProcessingState,
    tabValues.visitSetupState
  )

  const fishList: any[] = tabValues.fishInputState
    ? Object.values(tabValues.fishInputState)
    : []

  const programFormFieldsObj = getProgramFormFieldsLookup(
    tabValues.visitSetupState,
    visitSetupDefaultState
  )
  return (
    <ScrollView>
      <List.Accordion title='Visit Setup' titleStyle={{ fontSize: 20 }}>
        <AccordionListItem
          field={'crew'}
          sectionValues={tabValues.visitSetupState}
          sectionTitle='Visit Setup'
          programFormFieldsObj={programFormFieldsObj}
        />
        {'dataRecorder' in tabValues.visitSetupState && (
          <AccordionListItem
            field={'dataRecorder'}
            sectionValues={tabValues.visitSetupState}
            sectionTitle='Visit Setup'
            programFormFieldsObj={programFormFieldsObj}
          />
        )}
        {'fieldCheck' in tabValues.incompleteSectionsState && (
          <AccordionListItem
            field={'fieldCheck'}
            sectionValues={tabValues.incompleteSectionsState}
            sectionTitle='Visit Setup'
            programFormFieldsObj={programFormFieldsObj}
          />
        )}
        <Divider width={'97%'} alignSelf={'center'} />
      </List.Accordion>
      <List.Accordion title='Trap Operations' titleStyle={{ fontSize: 20 }}>
        {Object.keys(filteredTrapOperationsState).length
          ? Object.keys(filteredTrapOperationsState).map(key => {
              return (
                <AccordionListItem
                  key={key}
                  field={key}
                  sectionValues={filteredTrapOperationsState}
                  sectionTitle='Trap Operations'
                  programFormFieldsObj={programFormFieldsObj}
                />
              )
            })
          : null}
      </List.Accordion>
      <List.Accordion title='Fish Processing' titleStyle={{ fontSize: 20 }}>
        {tabValues.fishProcessingState ? (
          Object.keys(tabValues.fishProcessingState).map(key => {
            return (
              <AccordionListItem
                key={key}
                field={key}
                sectionValues={tabValues.fishProcessingState}
                sectionTitle='Fish Processing'
                programFormFieldsObj={programFormFieldsObj}
              />
            )
          })
        ) : (
          <List.Item
            title={'No Fish Processed'}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
          />
        )}
      </List.Accordion>
      <List.Accordion
        title={`Fish Input (${fishList.length} records)`}
        titleStyle={{ fontSize: 20 }}
      >
        <FishInputSpeciesTable fishList={fishList} />
      </List.Accordion>
      <List.Accordion
        title={`Genetics & Marks (${fishList.filter((f: any) => (Array.isArray(f.geneticSamples) && f.geneticSamples.length > 0) || (Array.isArray(f.appliedMarks) && f.appliedMarks.length > 0)).length} records)`}
        titleStyle={{ fontSize: 20 }}
      >
        <FishGeneticsTable
          fishList={fishList}
          dropdownValues={dropdownValues}
        />
      </List.Accordion>
      <List.Accordion
        title='Trap Post-Processing'
        titleStyle={{ fontSize: 20 }}
      >
        {filteredTrapPostProcessingState ? (
          Object.keys(filteredTrapPostProcessingState).map(key => {
            return (
              <AccordionListItem
                key={key}
                field={key}
                sectionValues={filteredTrapPostProcessingState}
                sectionTitle='Trap Post-Processing'
                programFormFieldsObj={programFormFieldsObj}
              />
            )
          })
        ) : (
          <List.Item
            title={'No Post-Processing Values'}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
          />
        )}
      </List.Accordion>
    </ScrollView>
  )
}

const ReviewValuesModal = ({
  handleCloseReviewValuesModal,
  formValues,
  isOpen,
  tabState,
  visitSetupDefaultState,
  fieldCheck,
}: Props) => {
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const [index, setIndex] = useState(0)
  const [routes, setRoutes] = useState(
    [] as Array<{ key: string; title: string }>
  )
  const [sceneMapObj, setSceneMapObj] = useState({}) as any

  useEffect(() => {
    const tabRoutes = Object.keys(tabState.tabs).map((tabId: any) => ({
      key: tabId,
      title: tabState.tabs[tabId].name,
    }))
    setRoutes(tabRoutes)

    console.log('fip', formValues?.fishInputState)

    const tabScenesMapObj = {} as any
    tabRoutes.forEach((tab: any) => {
      tabScenesMapObj[tab.key] = () => (
        <AccordionView
          tabValues={{
            visitSetupState: formValues?.visitSetupState?.[tab.key]?.values,
            trapOperationsState:
              formValues?.trapOperationsState?.[tab.key]?.values,
            fishProcessingState:
              formValues?.fishProcessingState?.[tab.key]?.values,
            fishInputState: formValues?.fishInputState?.[tab.key]?.fishStore,
            trapPostProcessingState:
              formValues?.trapPostProcessingState?.[tab.key]?.values,
            incompleteSectionsState: {
              fieldCheck,
            },
          }}
          visitSetupDefaultState={visitSetupDefaultState}
          dropdownValues={dropdownValues}
        />
      )
    })
    setSceneMapObj(tabScenesMapObj)
  }, [tabState, formValues])

  const renderScene = SceneMap(sceneMapObj)

  const renderTabBar = (props: TabBarProps<any>) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#007C7C' }}
      style={{ backgroundColor: 'white' }}
    />
  )

  const printToFile = async () => {
    const html = generateAccordionHtmlFromTabValues({
      routes,
      formValues,
      visitSetupDefaultState,
      fieldCheck,
      dropdownValues,
    })
    const firstKey = routes?.[0]?.key
    const visitSetupVals = formValues?.visitSetupState?.[firstKey]?.values
    const trapOpsVals = formValues?.trapOperationsState?.[firstKey]?.values
    const timeProperty = getTimeProperty(trapOpsVals)
    const trapSite = visitSetupVals?.trapSite || 'trap'
    const dateStr = formatDateString_MM_DD_YY(
      timeProperty ? trapOpsVals?.[timeProperty] : new Date()
    )
    const filename = `${trapSite}_${dateStr}.pdf`
    const { uri } = await Print.printToFileAsync({ html })
    try {
      const destUri = `${FileSystem.documentDirectory}${filename}`
      await FileSystem.copyAsync({ from: uri, to: destUri })
      await shareAsync(destUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      })
      handleCloseReviewValuesModal()
    } catch (error) {
      console.error('Error sharing file:', error)
      alert('Error sharing file. Please try again.')
    }
  }

  // helper: convert array of objects to CSV
  function arrayToCSV(rows: any[]) {
    if (rows.length === 0) return ''
    let headers = Object.keys(rows[0])
    headers = headers.filter(h => !h.includes('Id') && !h.includes('Unit'))
    const csv = [
      headers.join(','), // header row
      ...rows.map(row =>
        headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
      ),
    ]
    return csv.join('\n')
  }

  // helper: flatten nested objects into single-level row, skip nulls
  function flattenObject(obj: any) {
    if (obj == null) return {}
    return Object.keys(obj).reduce((acc: any, key) => {
      const value = obj[key]
      const newKey = key

      if (value === null || value === undefined || value === '') {
        // skip null/undefined
        return acc
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        // recurse into nested objects
        Object.assign(acc, flattenObject(value))
      } else if (Array.isArray(value)) {
        // collapse array into comma-separated string
        if (value.length > 0) {
          acc[newKey] = value.join(', ')
        }
      } else {
        acc[newKey] = value
      }

      return acc
    }, {})
  }

  const exportDataZip = async () => {
    try {
      const zip = new JSZip()

      routes.forEach((route: any) => {
        const visitSetupState = {
          ...formValues?.visitSetupState?.[route.key]?.values,
          fieldCheck,
        }
        const trapOperationsState = getFilteredTrapOperationsState(
          formValues?.trapOperationsState?.[route.key]?.values
        )
        const fishProcessingState =
          formValues?.fishProcessingState?.[route.key]?.values
        const fishInputState =
          formValues?.fishInputState?.[route.key]?.fishStore
        const trapPostProcessingState = getFilteredPostProcessingState(
          formValues?.trapPostProcessingState?.[route.key]?.values,
          formValues?.visitSetupState?.[route.key]?.values
        )

        const timeProperty = getTimeProperty(trapOperationsState)

        const formattedTrapSite = snakeCase(visitSetupState.trapSite)
        const formattedSampleTime = formatDateString_MM_DD_YY(
          timeProperty ? trapOperationsState[timeProperty] : new Date()
        )
        // --- 1. visit_summary.csv ---
        const wideRow = {
          ...flattenObject(visitSetupState),
          ...flattenObject(trapOperationsState),
          ...flattenObject(fishProcessingState),
          ...flattenObject(trapPostProcessingState),
        }
        const visitCSV = arrayToCSV([wideRow])
        zip.file(
          `trap_visit_${formattedTrapSite}_${formattedSampleTime}.csv`,
          visitCSV
        )

        // --- 2. fish_input.csv ---
        if (fishInputState) {
          const fishRows = Object.values(fishInputState).map((fish: any) => {
            const appliedMarksStr =
              Array.isArray(fish.appliedMarks) && fish.appliedMarks.length
                ? fish.appliedMarks.map(formatAppliedMark).join('; ')
                : ''
            const geneticSamplesStr =
              Array.isArray(fish.geneticSamples) && fish.geneticSamples.length
                ? fish.geneticSamples.map(formatGeneticSample).join('; ')
                : ''
            const existingMarksStr =
              Array.isArray(fish.existingMarks) && fish.existingMarks.length
                ? fish.existingMarks
                    .map((m: any) =>
                      typeof m === 'object'
                        ? m.markCode || m.markType || JSON.stringify(m)
                        : String(m)
                    )
                    .join('; ')
                : ''
            const fishConditionsStr =
              Array.isArray(fish.fishConditions) && fish.fishConditions.length
                ? fish.fishConditions.join(', ')
                : ''

            return {
              trapSite: visitSetupState.trapSite,
              species: fish.species,
              forkLength: fish.forkLength,
              run: fish.run,
              lifeStage: fish.lifeStage,
              weight: fish.weight,
              adiposeClipped: fish.adiposeClipped,
              dead: fish.dead,
              eggs: fish.eggs,
              milting: fish.milting,
              fishConditions: fishConditionsStr,
              existingMarks: existingMarksStr,
              plusCount: fish.plusCount,
              numFishCaught: fish.numFishCaught,
              willBeUsedInRecapture: fish.willBeUsedInRecapture,
              plusCountMethod: fish.plusCountMethod,
              comments: fish.comments,
              marksTagsApplied: appliedMarksStr,
              geneticSamples: geneticSamplesStr,
            }
          })
          if (fishRows.length) {
            const fishCSV = arrayToCSV(fishRows)
            zip.file(
              `catch_${formattedTrapSite}_${formattedSampleTime}.csv`,
              fishCSV
            )
          }
        }

        // --- 3. genetics_detailed.csv ---
        const detailedFish = Object.values(fishInputState || {}).filter(
          (fish: any) =>
            (Array.isArray(fish.geneticSamples) &&
              fish.geneticSamples.length > 0) ||
            (Array.isArray(fish.appliedMarks) &&
              fish.appliedMarks.length > 0) ||
            fish.weight != null
        )
        if (detailedFish.length) {
          const sampleDate = formatDateString_MM_DD_YY(
            timeProperty ? trapOperationsState[timeProperty] : new Date()
          )
          const lookupCode = (table: string, id: any) => {
            if (id == null) return ''
            const item = find(dropdownValues?.[table], { id })
            return item?.code || item?.definition || item?.description || ''
          }
          const marksTagsApplied = (fish: any) =>
            Array.isArray(fish.appliedMarks)
              ? fish.appliedMarks.map(formatAppliedMark).join('; ')
              : ''
          const existingMarks = (fish: any) =>
            Array.isArray(fish.existingMarks)
              ? fish.existingMarks
                  .map((m: any) =>
                    typeof m === 'object'
                      ? m.markCode || m.markType || JSON.stringify(m)
                      : String(m)
                  )
                  .join('; ')
              : ''
          // Column order matches the genetics table in the review modal / PDF:
          // context | Genetic ID | Ad+/- | Dead | Condition | Take | Sample Type | Marks/Tags | Comments
          const geneticsRows = (detailedFish as any[]).flatMap((fish: any) => {
            const samples: any[] = Array.isArray(fish.geneticSamples)
              ? fish.geneticSamples
              : []
            const makeRow = (s: any | null) => ({
              Date: sampleDate,
              SiteCode: visitSetupState.trapSite || '',
              Species: fish.species || '',
              'FL (mm)': fish.forkLength ?? '',
              'Field Wt (g)': fish.weight ?? '',
              Run: fish.run && fish.run !== 'not recorded' ? fish.run : '',
              Stage:
                fish.lifeStage && fish.lifeStage !== 'not recorded'
                  ? fish.lifeStage
                  : '',
              // genetics table column order starts here
              'Genetic ID': s?.sampleId || '',
              'Ad +/-':
                fish.adiposeClipped == null
                  ? ''
                  : fish.adiposeClipped
                    ? '+'
                    : '-',
              Dead: fish.dead ? 'Y' : 'N',
              Condition: s ? lookupCode('condition', s.condition) : '',
              Take: s ? lookupCode('take', s.take) : '',
              Genetic: s ? (s.genetic ? 'Y' : 'N') : '',
              'Mucus Swab': s ? (s.mucusSwab ? 'Y' : 'N') : '',
              'Fin Clip': s ? (s.finClip ? 'Y' : 'N') : '',
              'Crew Member': s?.crewMember || '',
              Comments: s?.comments || fish.comments || '',
            })
            if (!samples.length) return [makeRow(null)]
            return samples.map(makeRow)
          })
          zip.file(
            `genetics_${formattedTrapSite}_${formattedSampleTime}.csv`,
            arrayToCSV(geneticsRows)
          )
        }
      })

      // --- 4. Generate zip ---
      const base64zip = await zip.generateAsync({ type: 'base64' })
      const zipUri =
        FileSystem.cacheDirectory + `visit_summary_${Date.now()}.zip`
      await FileSystem.writeAsStringAsync(zipUri, base64zip, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // --- 5. Share zip ---
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(zipUri, {
          mimeType: 'application/zip',
          UTI: 'public.zip-archive',
        })
      } else {
        alert('Sharing not available on this device')
      }
    } catch (err) {
      console.error('Error exporting ZIP:', err)
      alert('Error exporting data. Please try again.')
    }
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <CustomModal
        isOpen={isOpen}
        closeModal={handleCloseReviewValuesModal}
        height='100%'
      >
        <>
          <CustomModalHeader
            headerText={
              'Review all trap visit form sections and values before submission'
            }
            headerStyle={{ fontSize: 23, fontWeight: '300' }}
            showHeaderButton={false}
            closeModal={handleCloseReviewValuesModal}
          />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            commonOptions={{ labelStyle: { color: '#007C7C' } }}
          />
          <HStack>
            <Button
              my={5}
              mx='auto'
              minWidth={200}
              bgColor='gray.400'
              onPress={handleCloseReviewValuesModal}
            >
              <Text fontSize='xl' color='white'>
                Close
              </Text>
            </Button>
            <Button
              my={5}
              mx='auto'
              minWidth={200}
              bgColor='primary'
              colorScheme='coolGray'
              onPress={printToFile}
            >
              <Text fontSize='xl' color='white'>
                Export as PDF
              </Text>
            </Button>
            <Button
              my={5}
              mx='auto'
              minWidth={200}
              bgColor='primary'
              colorScheme='coolGray'
              onPress={exportDataZip}
            >
              <Text fontSize='xl' color='white'>
                Export as CSV ZIP
              </Text>
            </Button>
          </HStack>
        </>
      </CustomModal>
    </SafeAreaView>
  )
}

export default ReviewValuesModal
