import React from 'react'
import { Box, Button, HStack, ScrollView, Spinner, Text, VStack } from 'native-base'
import { find, startCase } from 'lodash'
import CustomModal from './Shared/CustomModal'
import CustomModalHeader from './Shared/CustomModalHeader'
import { FishInputSpeciesTable } from './form/FishInputSpeciesTable'

// trapVisit fields whose value is an id resolvable via dropdownsState.values
// to a {id, definition} entry's definition, mapped to that lookup array's key.
const TRAP_VISIT_LOOKUP_FIELDS: Record<string, string> = {
  visitTypeId: 'visitType',
  fishProcessed: 'fishProcessed',
  whyFishNotProcessed: 'whyFishNotProcessed',
  trapFunctioning: 'trapFunctionality',
  whyTrapNotFunctioning: 'whyTrapNotFunctioning',
  trapStatusAtEnd: 'trapStatusAtEnd',
  sampleGearId: 'equipment',
}

// trapVisit fields whose value is an id resolvable via dropdownsState.values
// to a {id, code, description} entry (a different shape than the
// definition-based fields above - dropdownsState.values is populated wholesale
// from the server's trap-visit/dropdowns response, same as the dashboard's
// useDropdownLookups, it's just not reflected in the stale local TS types).
// useDescription matches the dashboard's buildLookupIndex choice per field.
const TRAP_VISIT_CODE_LOOKUP_FIELDS: Record<
  string,
  { table: string; useDescription?: boolean }
> = {
  substrate: { table: 'substrate' },
  gearStatus: { table: 'gearStatus' },
  flowDirection: { table: 'flowDirection' },
  tideCode: { table: 'tideCode' },
  vegetationCode: { table: 'vegetationCode' },
  weatherCode: { table: 'weatherCode' },
  ysiNum: { table: 'ysiNum' },
  conditionCode: { table: 'conditionCode', useDescription: true },
}

// Shown separately (identity header), rendered specially below, or not
// useful to a reviewer.
const TRAP_VISIT_HIDDEN_FIELDS = new Set([
  'trapVisitUid',
  'programId',
  'trapLocationId',
  'trapVisitTimeStart',
  'trapVisitTimeEnd',
  'crew',
  'trapVisitEnvironmental',
  'comments',
  'id',
  'trapCoordinates',
  'createdBy',
  'qcCompletedBy',
])

function resolvePersonnelName(crewMembers: any[], personnelId: any): string {
  if (personnelId == null) return '—'
  const match = find(
    crewMembers,
    (m: any) => (m.personnelId ?? m.id) === personnelId
  )
  return match
    ? `${match.firstName ?? ''} ${match.lastName ?? ''}`.trim()
    : `Personnel #${personnelId}`
}

// trapCoordinates is an object ({xCoord, yCoord, datum, projection}), not a
// scalar - the generic field list below would otherwise stringify it as
// "[object Object]". Returns null when there's nothing to show (every
// sub-field null), matching how other empty fields are already omitted.
function formatTrapCoordinates(coords: any): string | null {
  if (!coords || typeof coords !== 'object') return null
  const { xCoord, yCoord, datum, projection } = coords
  if (xCoord == null && yCoord == null && datum == null && projection == null) {
    return null
  }
  const parts = [
    xCoord != null ? `X: ${xCoord}` : null,
    yCoord != null ? `Y: ${yCoord}` : null,
    datum ? `Datum: ${datum}` : null,
    projection ? `Projection: ${projection}` : null,
  ].filter(Boolean)
  return parts.join(', ')
}

// Converts one envelope catchRaw record (post-transformation - resolved
// FK ids, not the live form's display strings) into the shape
// FishInputSpeciesTable expects (the same shape the live fishInputState
// fishStore produces) - resolving taxonCode/captureRunClass/lifeStage back
// to display text via dropdownsState, same as the live form already shows.
function buildFishListEntry(record: any, dropdownsState: any) {
  const taxonMatch = find(
    dropdownsState?.values?.taxon,
    (t: any) => t.code === record.taxonCode
  )
  const runMatch = find(
    dropdownsState?.values?.run,
    (r: any) => r.id === record.captureRunClass
  )
  const lifeStageMatch = find(
    dropdownsState?.values?.lifeStage,
    (l: any) => l.id === record.lifeStage
  )

  return {
    ...record,
    species:
      taxonMatch?.commonname ??
      (record.taxonCode != null ? `Taxon #${record.taxonCode}` : 'Unknown'),
    run: runMatch?.definition ?? record.captureRunClass,
    lifeStage: lifeStageMatch?.definition ?? record.lifeStage,
    geneticSamples: record.geneticSamplingData,
  }
}

function resolveLookupValue(
  dropdownsState: any,
  field: string,
  value: any
): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'

  const definitionKey = TRAP_VISIT_LOOKUP_FIELDS[field]
  if (definitionKey) {
    const match = find(
      dropdownsState?.values?.[definitionKey],
      (d: any) => d.id === value
    )
    if (match?.definition) return match.definition
  }

  const codeLookup = TRAP_VISIT_CODE_LOOKUP_FIELDS[field]
  if (codeLookup) {
    const match = find(
      dropdownsState?.values?.[codeLookup.table],
      (d: any) => d.id === value
    )
    if (match) {
      return (codeLookup.useDescription ? match.description : match.code) ?? String(value)
    }
  }

  // Safety net for any other object/array-valued field that isn't
  // specially handled elsewhere - String() on an object produces
  // "[object Object]", which is worse than just hiding it.
  if (typeof value === 'object') return '—'
  return String(value)
}

const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <HStack justifyContent='space-between' py='1'>
    <Text color='gray.500' fontSize='sm'>
      {label}
    </Text>
    <Text fontSize='sm' fontWeight='medium' textAlign='right' ml='4' flexShrink={1}>
      {value}
    </Text>
  </HStack>
)

type Props = {
  isOpen: boolean
  onClose: () => void
  envelope: any
  dropdownsState: any
  visitSetupDefaultState: any
  resolveTrapLocationLabel: (id: number) => string
  resolveProgramLabel: (id: number) => string
  duplicateMatch: {
    id: number
    trapVisitUid: string | null
    trapVisitTimeStart: string | null
    catchRawCount: number
  } | null
  importStatus: 'idle' | 'submitting' | 'success' | 'error'
  importError?: string
  canImport: boolean
  onConfirmImport: () => void
}

const ImportPreviewModal = ({
  isOpen,
  onClose,
  envelope,
  dropdownsState,
  visitSetupDefaultState,
  resolveTrapLocationLabel,
  resolveProgramLabel,
  duplicateMatch,
  importStatus,
  importError,
  canImport,
  onConfirmImport,
}: Props) => {
  const trapVisit = envelope?.trapVisit ?? {}
  const catchRaw: any[] = envelope?.catchRaw ?? []

  const crewMembers: any[] = (visitSetupDefaultState?.crewMembers ?? []).flat()
  const crewNames = (trapVisit.crew ?? [])
    .map((c: any) => resolvePersonnelName(crewMembers, c.personnelId))
    .filter(Boolean)

  const otherTrapVisitFields = Object.entries(trapVisit).filter(
    ([key, value]) =>
      !TRAP_VISIT_HIDDEN_FIELDS.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== ''
  )
  const trapCoordinatesLabel = formatTrapCoordinates(trapVisit.trapCoordinates)
  const environmentalReadings: any[] = Array.isArray(
    trapVisit.trapVisitEnvironmental
  )
    ? trapVisit.trapVisitEnvironmental
    : []

  return (
    <CustomModal isOpen={isOpen} closeModal={onClose} height='100%'>
      <>
        <CustomModalHeader
          headerText='Preview Import'
          headerStyle={{ fontSize: 23, fontWeight: '300' }}
          showHeaderButton={false}
          closeModal={onClose}
        />
        <ScrollView px='5%' py='3%'>
          <Text color='gray.600' mb='4'>
            Review the values below before importing — this is exactly what
            will be sent to the server.
          </Text>

          <Box borderWidth={1} borderColor='coolGray.200' borderRadius={8} p={3}>
            <FieldRow
              label='Trap Location'
              value={resolveTrapLocationLabel(trapVisit.trapLocationId)}
            />
            <FieldRow
              label='Program'
              value={resolveProgramLabel(trapVisit.programId)}
            />
            <FieldRow
              label='Visit Start'
              value={
                trapVisit.trapVisitTimeStart
                  ? new Date(trapVisit.trapVisitTimeStart).toLocaleString()
                  : '—'
              }
            />
            <FieldRow
              label='Visit End'
              value={
                trapVisit.trapVisitTimeEnd
                  ? new Date(trapVisit.trapVisitTimeEnd).toLocaleString()
                  : '—'
              }
            />
            <FieldRow
              label='Crew'
              value={crewNames.length ? crewNames.join(', ') : '—'}
            />
            <FieldRow
              label='Created By'
              value={resolvePersonnelName(crewMembers, trapVisit.createdBy)}
            />
            {trapVisit.comments != null && (
              <FieldRow label='Comments' value={String(trapVisit.comments)} />
            )}
          </Box>

          {(otherTrapVisitFields.length > 0 || trapCoordinatesLabel) && (
            <VStack mt='4'>
              <Text fontSize='xs' fontWeight='medium' color='gray.500' mb='1'>
                Trap Visit Details
              </Text>
              <Box borderWidth={1} borderColor='coolGray.200' borderRadius={8} p={3}>
                {otherTrapVisitFields.map(([key, value]) => (
                  <FieldRow
                    key={key}
                    label={startCase(key)}
                    value={resolveLookupValue(dropdownsState, key, value)}
                  />
                ))}
                {trapCoordinatesLabel && (
                  <FieldRow label='Trap Coordinates' value={trapCoordinatesLabel} />
                )}
              </Box>
            </VStack>
          )}

          {environmentalReadings.length > 0 && (
            <VStack mt='4'>
              <Text fontSize='xs' fontWeight='medium' color='gray.500' mb='1'>
                Environmental Readings
              </Text>
              <Box borderWidth={1} borderColor='coolGray.200' borderRadius={8} p={3}>
                {environmentalReadings.map((reading: any, i: number) => (
                  <FieldRow
                    key={i}
                    label={startCase(reading.measureName)}
                    value={
                      reading.measureValueText ||
                      (reading.measureValueNumeric != null
                        ? String(reading.measureValueNumeric)
                        : '—')
                    }
                  />
                ))}
              </Box>
            </VStack>
          )}

          <VStack mt='4'>
            <Text fontSize='xs' fontWeight='medium' color='gray.500' mb='1'>
              Catch Records ({catchRaw.length})
            </Text>
            <Box borderWidth={1} borderColor='coolGray.200' borderRadius={8}>
              <FishInputSpeciesTable
                fishList={catchRaw.map(record =>
                  buildFishListEntry(record, dropdownsState)
                )}
              />
            </Box>
          </VStack>

          {duplicateMatch && (
            <Box mt='4' bg='amber.50' borderRadius={6} p={3}>
              <Text color='amber.800' bold fontSize='sm'>
                A matching trap visit already exists on the server (id{' '}
                {duplicateMatch.id}) with {duplicateMatch.catchRawCount} catch
                record{duplicateMatch.catchRawCount === 1 ? '' : 's'} already
                saved.
              </Text>
              <Text color='amber.800' fontSize='sm' mt='1'>
                Importing anyway will add this file's catch records alongside
                what's already there - there's no server-side protection
                against duplicating them. Only proceed if you're sure the
                existing visit is incomplete or wrong.
              </Text>
            </Box>
          )}

          {importError && (
            <Text mt='4' color='error.600' fontSize='sm'>
              {importError}
            </Text>
          )}

          <HStack mt='6' mb='10' space={3}>
            <Button flex={1} variant='outline' onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button
              flex={1}
              bg={duplicateMatch ? 'amber.600' : 'primary'}
              isDisabled={!canImport || importStatus === 'submitting'}
              onPress={onConfirmImport}
            >
              {importStatus === 'submitting' ? (
                <Spinner color='white' />
              ) : (
                <Text color='white'>
                  {duplicateMatch ? 'Import Anyway' : 'Import'}
                </Text>
              )}
            </Button>
          </HStack>
        </ScrollView>
      </>
    </CustomModal>
  )
}

export default ImportPreviewModal
