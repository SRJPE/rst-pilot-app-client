import React, { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import JSZip from 'jszip'
import { find } from 'lodash'
import api from '../api/axiosConfig'
import {
  saveTrapVisitSubmission,
  saveCatchRawSubmissions,
  postTrapVisitFormSubmissions,
} from '../redux/reducers/postSlices/trapVisitFormPostBundler'
import {
  validateImportedSubmission,
  ImportValidationResult,
} from '../utils/helpers/validateImportedSubmission'
import ImportPreviewModal from '../components/ImportPreviewModal'
import CustomModal from '../components/Shared/CustomModal'
import ConfirmationModalContent from '../components/Shared/ConfirmationModalContent'
import {
  createTab,
  setActiveTab,
  deleteTab,
} from '../redux/reducers/formSlices/tabSlice'
import { restoreTabState as restoreVisitSetupTab } from '../redux/reducers/formSlices/visitSetupSlice'
import { restoreTabState as restoreTrapOperationsTab } from '../redux/reducers/formSlices/trapOperationsSlice'
import { restoreTabState as restoreFishProcessingTab } from '../redux/reducers/formSlices/fishProcessingSlice'
import { restoreTabState as restoreTrapPostProcessingTab } from '../redux/reducers/formSlices/trapPostProcessingSlice'
import { restoreTabState as restoreFishInputTab } from '../redux/reducers/formSlices/fishInputSlice'
import {
  checkIfFormIsComplete,
  markStepCompleted,
  updateActiveStep,
} from '../redux/reducers/formSlices/navigationSlice'

type DuplicateCheckState =
  | { status: 'pending' }
  | { status: 'none' }
  | {
      status: 'match'
      match: {
        id: number
        trapVisitUid: string | null
        trapVisitTimeStart: string | null
        catchRawCount: number
      }
    }
  | { status: 'error'; message: string }

type ParsedImport = {
  key: string
  fileName: string
  envelope: any
  validation: ImportValidationResult
  duplicateCheck: DuplicateCheckState
  importStatus: 'idle' | 'submitting' | 'success' | 'error'
  importError?: string
}

const mapStateToProps = (state: RootState) => {
  return {
    visitSetupDefaultState: state.visitSetupDefaults,
    connectivityState: state.connectivity,
    dropdownsState: state.dropdowns,
    tabState: state.tabSlice,
  }
}

const ImportTrapVisit = ({
  navigation,
  visitSetupDefaultState,
  connectivityState,
  dropdownsState,
  tabState,
}: {
  navigation: any
  visitSetupDefaultState: any
  connectivityState: any
  dropdownsState: any
  tabState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsedImports, setParsedImports] = useState<ParsedImport[]>([])
  const [previewKey, setPreviewKey] = useState<string | null>(null)
  const [pendingEdit, setPendingEdit] = useState<{
    key: string
    otherTabCount: number
  } | null>(null)

  const resolveTrapLocationLabel = (trapLocationId: number) => {
    const trapLocation = find(
      visitSetupDefaultState?.trapLocations,
      (loc: any) => loc.id === trapLocationId
    )
    return (
      trapLocation?.trapName ||
      trapLocation?.siteName ||
      `Trap #${trapLocationId}`
    )
  }

  const resolveProgramLabel = (programId: number) => {
    const program = find(
      visitSetupDefaultState?.programs,
      (p: any) => p.id === programId
    )
    return program?.programName || `Program #${programId}`
  }

  const runDuplicateCheck = async (key: string, trapVisit: any) => {
    try {
      const params = new URLSearchParams()
      params.set('programId', String(trapVisit.programId))
      params.set('trapLocationId', String(trapVisit.trapLocationId))
      if (trapVisit.trapVisitTimeStart) {
        params.set('trapVisitTimeStart', trapVisit.trapVisitTimeStart)
      }
      if (trapVisit.trapVisitUid) {
        params.set('trapVisitUid', trapVisit.trapVisitUid)
      }

      const response = await api.get(
        `trap-visit/check-duplicate?${params.toString()}`
      )

      const nextState: DuplicateCheckState = response?.data?.match
        ? { status: 'match', match: response.data.match }
        : { status: 'none' }

      setParsedImports(prev =>
        prev.map(item =>
          item.key === key ? { ...item, duplicateCheck: nextState } : item
        )
      )
    } catch (error: any) {
      setParsedImports(prev =>
        prev.map(item =>
          item.key === key
            ? {
                ...item,
                duplicateCheck: {
                  status: 'error',
                  message:
                    'Could not check for an existing visit on the server. Check your connection and try again before importing.',
                },
              }
            : item
        )
      )
    }
  }

  const handlePickFile = async () => {
    setParseError(null)

    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/zip',
        'application/x-zip-compressed',
        'application/json',
      ],
      copyToCacheDirectory: true,
    })

    if (result.canceled || !result.assets?.length) {
      return
    }

    setIsParsing(true)
    try {
      const fileUri = result.assets[0].uri
      const pickedName = result.assets[0].name || fileUri
      const isJson = /\.json$/i.test(pickedName)

      let nextParsedImports: ParsedImport[]

      if (isJson) {
        // The CSVs in the export zip aren't read for import anyway, so a
        // crew member can share/upload just the bare submission_*.json.
        const text = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        })
        try {
          const envelope = JSON.parse(text)
          const validation = validateImportedSubmission(envelope)
          nextParsedImports = [
            {
              key: envelope?.trapVisit?.trapVisitUid || pickedName,
              fileName: pickedName,
              envelope,
              validation,
              duplicateCheck: { status: 'pending' },
              importStatus: 'idle',
            },
          ]
        } catch (err) {
          nextParsedImports = [
            {
              key: pickedName,
              fileName: pickedName,
              envelope: null,
              validation: {
                valid: false,
                errors: [
                  'Could not parse this file as JSON - it may be corrupted.',
                ],
              },
              duplicateCheck: { status: 'pending' },
              importStatus: 'idle',
            },
          ]
        }
      } else {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        })
        const zip = await JSZip.loadAsync(base64, { base64: true })

        const submissionEntries = Object.keys(zip.files).filter(name =>
          /^submission_.*\.json$/.test(name)
        )

        if (!submissionEntries.length) {
          setParseError(
            'No submission_*.json file found in this zip. Only a zip exported from this app (via "Export as CSV ZIP" on Incomplete Sections) can be re-imported - older exports made before this feature was added won\'t have one.'
          )
          return
        }

        nextParsedImports = []
        for (const fileName of submissionEntries) {
          try {
            const text = await zip.files[fileName].async('string')
            const envelope = JSON.parse(text)
            const validation = validateImportedSubmission(envelope)
            nextParsedImports.push({
              key: envelope?.trapVisit?.trapVisitUid || fileName,
              fileName,
              envelope,
              validation,
              duplicateCheck: { status: 'pending' },
              importStatus: 'idle',
            })
          } catch (err) {
            nextParsedImports.push({
              key: fileName,
              fileName,
              envelope: null,
              validation: {
                valid: false,
                errors: [
                  'Could not parse this file as JSON - it may be corrupted.',
                ],
              },
              duplicateCheck: { status: 'pending' },
              importStatus: 'idle',
            })
          }
        }
      }

      // Merge into whatever's already here (keyed by trapVisitUid/fileName)
      // rather than replacing it - picking a zip covers every trap in one
      // go, but recovering several traps via their individual bare JSONs
      // means picking a file more than once, and each pick should add to
      // the list, not wipe out cards from an earlier pick. Re-picking the
      // same file refreshes that one card in place.
      setParsedImports(prev => {
        const byKey = new Map(prev.map(item => [item.key, item]))
        nextParsedImports.forEach(item => byKey.set(item.key, item))
        return Array.from(byKey.values())
      })

      // Kick off existence checks for everything that parsed/validated cleanly.
      nextParsedImports
        .filter(item => item.validation.valid)
        .forEach(item => runDuplicateCheck(item.key, item.envelope.trapVisit))
    } catch (err) {
      console.error('Error parsing import file:', err)
      setParseError(
        'Could not read this file. Make sure you picked the submission JSON or the export ZIP from this app.'
      )
    } finally {
      setIsParsing(false)
    }
  }

  const handleImport = async (key: string) => {
    const item = parsedImports.find(p => p.key === key)
    if (!item || !item.envelope) return

    setParsedImports(prev =>
      prev.map(p => (p.key === key ? { ...p, importStatus: 'submitting' } : p))
    )

    try {
      dispatch(saveTrapVisitSubmission(item.envelope.trapVisit))
      if (item.envelope.catchRaw?.length) {
        dispatch(saveCatchRawSubmissions(item.envelope.catchRaw))
      }

      if (
        connectivityState.isConnected &&
        connectivityState.isInternetReachable
      ) {
        await dispatch(postTrapVisitFormSubmissions())
      }

      setParsedImports(prev =>
        prev.map(p => (p.key === key ? { ...p, importStatus: 'success' } : p))
      )
      setPreviewKey(prev => (prev === key ? null : prev))
    } catch (error: any) {
      setParsedImports(prev =>
        prev.map(p =>
          p.key === key
            ? {
                ...p,
                importStatus: 'error',
                importError:
                  'Something went wrong queuing this import. Try again.',
              }
            : p
        )
      )
    }
  }

  // Entry point from the card's "Edit in Form" button. Tabs already open
  // (an in-progress live visit, or a leftover from a previous Edit in Form
  // that was never submitted/discarded) aren't touched automatically -
  // createTab/restoreTabState are purely additive, and Incomplete Sections
  // shows every open tab together, so silently piling another one on top
  // produces a confusing combined multi-tab form with no indication why.
  // Ask first whenever other tabs exist, rather than guessing.
  const handleEditInForm = (key: string) => {
    const item = parsedImports.find(p => p.key === key)
    const rawTabState = item?.envelope?.rawTabState
    if (!rawTabState?.visitSetupTab) return

    const tabId = rawTabState.tabId || key
    const otherTabIds = Object.keys(tabState?.tabs || {}).filter(
      id => id !== tabId
    )

    if (otherTabIds.length > 0) {
      setPendingEdit({ key, otherTabCount: otherTabIds.length })
      return
    }

    performEditInForm(key)
  }

  const performEditInForm = (key: string, discardOtherTabs = false) => {
    const item = parsedImports.find(p => p.key === key)
    const rawTabState = item?.envelope?.rawTabState
    if (!rawTabState?.visitSetupTab) return

    const tabId = rawTabState.tabId || key

    if (discardOtherTabs) {
      Object.keys(tabState?.tabs || {})
        .filter(id => id !== tabId)
        .forEach(id => dispatch(deleteTab(id)))
    }

    dispatch(
      createTab({
        tabId,
        tabName: rawTabState.tabName,
        trapSite: rawTabState.trapSite,
      })
    )
    dispatch(setActiveTab(tabId))

    dispatch(
      restoreVisitSetupTab({ tabId, tabState: rawTabState.visitSetupTab })
    )
    if (rawTabState.trapOperationsTab) {
      dispatch(
        restoreTrapOperationsTab({
          tabId,
          tabState: rawTabState.trapOperationsTab,
        })
      )
    }
    if (rawTabState.fishProcessingTab) {
      dispatch(
        restoreFishProcessingTab({
          tabId,
          tabState: rawTabState.fishProcessingTab,
        })
      )
    }
    if (rawTabState.trapPostProcessingTab) {
      dispatch(
        restoreTrapPostProcessingTab({
          tabId,
          tabState: rawTabState.trapPostProcessingTab,
        })
      )
    }
    if (rawTabState.fishInputTab) {
      dispatch(
        restoreFishInputTab({ tabId, tabState: rawTabState.fishInputTab })
      )
    }

    // The visit was already deemed submit-ready once (that's how it got
    // exported) - mark the wizard's first 5 steps complete and land on
    // Incomplete Sections, matching the review-screen state it was in right
    // before it was originally submitted.
    ;[
      'visitSetup',
      'trapOperations',
      'fishProcessing',
      'fishInput',
      'trapPostProcessing',
    ].forEach(propName => {
      dispatch(markStepCompleted({ propName }))
    })
    dispatch(checkIfFormIsComplete())
    dispatch(updateActiveStep(6))

    setPreviewKey(prev => (prev === key ? null : prev))
    setParsedImports(prev => prev.filter(p => p.key !== key))
    setPendingEdit(null)

    navigation.navigate('Trap Visit Form', { screen: 'Incomplete Sections' })
  }

  // Removes a card from this screen - doesn't touch anything already queued
  // or submitted, just stops showing it here (e.g. after a successful
  // import, or for a file the user doesn't want to deal with right now).
  const handleDismiss = (key: string) => {
    setPreviewKey(prev => (prev === key ? null : prev))
    setParsedImports(prev => prev.filter(p => p.key !== key))
  }

  return (
    <>
      <ScrollView bg='#fff' px='5%' py='3%'>
        <Heading mb='2'>Import Trap Visit</Heading>
      <Text mb='4' color='gray.600'>
        Re-import a trap visit + catch records from a previously exported CSV
        ZIP (Incomplete Sections → "Export as CSV ZIP") - for recovering a visit
        that silently failed to save. Pick either the submission_*.json file or
        the full export ZIP it came in. PDF exports can't be imported.
        {'\n\n'}
        Choose "Preview & Import" to review the values and submit as-is, or
        "Edit in Form" to reopen the trap visit in the normal wizard first -
        available for files exported from this app with a recent enough version
        to include the raw form state.
      </Text>

      <Button bg='primary' onPress={handlePickFile} isDisabled={isParsing}>
        {isParsing ? (
          <Spinner color='white' />
        ) : (
          <Text color='white'>Upload Submission File</Text>
        )}
      </Button>

      {parseError && (
        <Text mt='4' color='error.600'>
          {parseError}
        </Text>
      )}

      <VStack space={4} mt='6'>
        {parsedImports.map(item => {
          const trapVisit = item.envelope?.trapVisit
          const catchCount = item.envelope?.catchRaw?.length || 0
          const label = trapVisit
            ? `${resolveTrapLocationLabel(trapVisit.trapLocationId)} - ${resolveProgramLabel(trapVisit.programId)}`
            : item.fileName

          return (
            <Box
              key={item.key}
              borderWidth={1}
              borderColor='coolGray.200'
              borderRadius={8}
              p={4}
            >
              <HStack justifyContent='space-between' alignItems='flex-start'>
                <Text bold fontSize='lg' flexShrink={1}>
                  {label}
                </Text>
                <IconButton
                  size='sm'
                  variant='ghost'
                  onPress={() => handleDismiss(item.key)}
                  icon={
                    <Icon
                      as={Ionicons}
                      name='close'
                      size='md'
                      color='gray.500'
                    />
                  }
                />
              </HStack>
              {trapVisit && (
                <Text color='gray.600' fontSize='sm'>
                  {trapVisit.trapVisitTimeStart
                    ? new Date(trapVisit.trapVisitTimeStart).toLocaleString()
                    : 'No date recorded'}{' '}
                  · {catchCount} catch record{catchCount === 1 ? '' : 's'}
                </Text>
              )}

              {!item.validation.valid && (
                <VStack mt='2' space={1}>
                  {item.validation.errors.map((err, i) => (
                    <Text key={i} color='error.600' fontSize='sm'>
                      {err}
                    </Text>
                  ))}
                </VStack>
              )}

              {item.validation.valid &&
                item.duplicateCheck.status === 'pending' && (
                  <HStack mt='2' alignItems='center' space={2}>
                    <Spinner size='sm' />
                    <Text color='gray.500' fontSize='sm'>
                      Checking server for an existing match…
                    </Text>
                  </HStack>
                )}

              {item.validation.valid &&
                item.duplicateCheck.status === 'error' && (
                  <Text mt='2' color='error.600' fontSize='sm'>
                    {item.duplicateCheck.message}
                  </Text>
                )}

              {item.validation.valid &&
                item.duplicateCheck.status === 'match' && (
                  <Box mt='2' bg='amber.50' borderRadius={6} p={3}>
                    <Text color='amber.800' bold fontSize='sm'>
                      A matching trap visit already exists on the server (id{' '}
                      {item.duplicateCheck.match.id}) with{' '}
                      {item.duplicateCheck.match.catchRawCount} catch record
                      {item.duplicateCheck.match.catchRawCount === 1
                        ? ''
                        : 's'}{' '}
                      already saved.
                    </Text>
                    <Text color='amber.800' fontSize='sm' mt='1'>
                      Importing anyway will add this file's catch records
                      alongside what's already there - there's no server-side
                      protection against duplicating them. Only proceed if
                      you're sure the existing visit is incomplete or wrong.
                    </Text>
                  </Box>
                )}

              {item.importStatus === 'success' && (
                <Text mt='2' color='success.600' fontSize='sm'>
                  {connectivityState.isConnected &&
                  connectivityState.isInternetReachable
                    ? 'Imported and submitted.'
                    : 'Queued locally - will submit automatically once back online.'}
                </Text>
              )}
              {item.importStatus === 'error' && (
                <Text mt='2' color='error.600' fontSize='sm'>
                  {item.importError}
                </Text>
              )}

              {item.importStatus !== 'success' && (
                <HStack mt='3' space={3}>
                  {item.validation.valid && (
                    <Button
                      alignSelf='flex-start'
                      bg={
                        item.duplicateCheck.status === 'match'
                          ? 'amber.600'
                          : 'primary'
                      }
                      isDisabled={
                        item.duplicateCheck.status === 'pending' ||
                        item.importStatus === 'submitting'
                      }
                      onPress={() => setPreviewKey(item.key)}
                    >
                      {item.importStatus === 'submitting' ? (
                        <Spinner color='white' />
                      ) : (
                        <Text color='white'>Preview & Import</Text>
                      )}
                    </Button>
                  )}

                  {item.envelope?.rawTabState?.visitSetupTab && (
                    <Button
                      alignSelf='flex-start'
                      variant='outline'
                      onPress={() => handleEditInForm(item.key)}
                    >
                      <Text>Edit in Form</Text>
                    </Button>
                  )}
                </HStack>
              )}

              {item.envelope && previewKey === item.key && (
                <ImportPreviewModal
                  isOpen
                  onClose={() => setPreviewKey(null)}
                  envelope={item.envelope}
                  dropdownsState={dropdownsState}
                  visitSetupDefaultState={visitSetupDefaultState}
                  resolveTrapLocationLabel={resolveTrapLocationLabel}
                  resolveProgramLabel={resolveProgramLabel}
                  duplicateMatch={
                    item.duplicateCheck.status === 'match'
                      ? item.duplicateCheck.match
                      : null
                  }
                  importStatus={item.importStatus}
                  importError={item.importError}
                  canImport={item.duplicateCheck.status !== 'pending'}
                  onConfirmImport={() => handleImport(item.key)}
                />
              )}
            </Box>
          )
        })}
      </VStack>
      </ScrollView>

      <CustomModal
        isOpen={pendingEdit !== null}
        closeModal={() => setPendingEdit(null)}
        height={220}
        width='90%'
        style={{ borderRadius: 5 }}
      >
        <ConfirmationModalContent
          modalHeader='Other trap visit tabs are open'
          modalText={`There ${
            pendingEdit?.otherTabCount === 1 ? 'is' : 'are'
          } ${pendingEdit?.otherTabCount ?? 0} other trap visit tab${
            pendingEdit?.otherTabCount === 1 ? '' : 's'
          } already open. Keep them alongside this one, or discard them first so only this recovered visit is open?`}
          cancelButtonLabel='Discard Others'
          confirmButtonLabel='Keep Both'
          handlePressCancel={() => {
            if (pendingEdit) performEditInForm(pendingEdit.key, true)
            setPendingEdit(null)
          }}
          handlePressConfirm={() => {
            if (pendingEdit) performEditInForm(pendingEdit.key, false)
            setPendingEdit(null)
          }}
        />
      </CustomModal>
    </>
  )
}

export default connect(mapStateToProps)(ImportTrapVisit)
