import React, { useEffect, useState } from 'react'
import { SafeAreaView, Dimensions } from 'react-native'
import CustomModal from '../Shared/CustomModal'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { Text, Button, ScrollView, Divider, HStack, View } from 'native-base'
import { List } from 'react-native-paper'
import { SceneMap, TabBar, TabBarProps, TabView } from 'react-native-tab-view'
import { startCase, find, keyBy } from 'lodash'
import { groupBySpeciesForkLength, calcAvgValue } from '../../utils/utils'
import * as Print from 'expo-print'
import { shareAsync } from 'expo-sharing'

const initialLayout = { width: Dimensions.get('window').width }

const hiddenFields = [
  'isWaterTurbidityPresent',
  'recordTurbidityInPostProcessing',
  'trapName',
]

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
  if ('trapVisitTime' in filteredTrapOperationsState) {
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

  if (visitSetupState?.stream === 'Toe Drain') {
    delete filteredTrapPostProcessingState.trapVisitStartTime
    delete filteredTrapPostProcessingState.endingTrapStatus
  }
  return filteredTrapPostProcessingState
}

const getProgramFormFieldsLookup = (
  visitSetupState: any,
  visitSetupDefaultState: any
) => {
  if (!visitSetupDefaultState || !visitSetupDefaultState.programs) return {}
  const programId = visitSetupState.programId
  const selectedProgramObj = find(
    visitSetupDefaultState.programs,
    (program: any) => program.id === programId
  )
  const programFormFields = selectedProgramObj.programFormFields
  const programFormFieldsObj = programFormFields?.length
    ? keyBy(programFormFields, 'fieldName')
    : {}
  return programFormFieldsObj
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

export function generateAccordionHtmlFromTabValues({
  routes,
  formValues,
  visitSetupDefaultState,
  fieldCheck,
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
            if (title === 'Fish Input') {
              displayValue = `${displayValue} (Count: ${value.length})`
            }
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
          table td { padding: 4px 8px; vertical-align: top; }
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
        // const filteredTrapOps = { ...trapOperationsState }

        const fishInputLookupObj = fishInputState
          ? groupBySpeciesForkLength(fishInputState)
          : undefined

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
          sectionHtml('Fish Input', fishInputLookupObj, programFormFieldsObj),
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
      if (sectionTitle === 'Fish Input') {
        fieldValue = `${fieldValue} (Count: ${sectionValues[field].length})`
      }
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

const AccordionView = ({
  tabValues,
  visitSetupDefaultState,
}: {
  tabValues?: any
  visitSetupDefaultState?: any
}) => {
  const filteredTrapOperationsState = getFilteredTrapOperationsState(
    tabValues.trapOperationsState
  )

  const filteredTrapPostProcessingState = getFilteredPostProcessingState(
    tabValues.trapPostProcessingState,
    tabValues.visitSetupState
  )
  const fishInputLookupObj = tabValues.fishInputState
    ? groupBySpeciesForkLength(tabValues.fishInputState)
    : {}

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
      <List.Accordion title='Fish Input' titleStyle={{ fontSize: 20 }}>
        {tabValues.fishInputState ? (
          Object.keys(fishInputLookupObj).map(key => {
            return (
              <AccordionListItem
                field={key}
                sectionValues={fishInputLookupObj}
                sectionTitle='Fish Input'
                programFormFieldsObj={programFormFieldsObj}
              />
            )
          })
        ) : (
          <List.Item
            title={'No Fish Caught'}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
          />
        )}
      </List.Accordion>
      <List.Accordion
        title='Trap Post-Processing'
        titleStyle={{ fontSize: 20 }}
      >
        {filteredTrapPostProcessingState ? (
          Object.keys(filteredTrapPostProcessingState).map(key => {
            return (
              <AccordionListItem
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
      // tabStyle={{ color: '#007C7C' }}
    />
  )

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const html = generateAccordionHtmlFromTabValues({
      routes,
      formValues,
      visitSetupDefaultState,
      fieldCheck,
    })
    const { uri } = await Print.printToFileAsync({ html })
    try {
      await shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      })
      handleCloseReviewValuesModal()
    } catch (error) {
      console.error('Error sharing file:', error)
      alert('Error sharing file. Please try again.')
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
              minWidth={300}
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
              minWidth={300}
              bgColor='primary'
              colorScheme='coolGray'
              onPress={printToFile}
            >
              <Text fontSize='xl' color='white'>
                Export as File
              </Text>
            </Button>
          </HStack>
        </>
      </CustomModal>
    </SafeAreaView>
  )
}

export default ReviewValuesModal
