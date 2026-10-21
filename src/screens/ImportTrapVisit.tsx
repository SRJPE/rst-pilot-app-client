import React, { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base'
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
  }
}

const ImportTrapVisit = ({
  visitSetupDefaultState,
  connectivityState,
}: {
  visitSetupDefaultState: any
  connectivityState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsedImports, setParsedImports] = useState<ParsedImport[]>([])

  const resolveTrapLocationLabel = (trapLocationId: number) => {
    const trapLocation = find(
      visitSetupDefaultState?.trapLocations,
      (loc: any) => loc.id === trapLocationId
    )
    return trapLocation?.trapName || trapLocation?.siteName || `Trap #${trapLocationId}`
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
    setParsedImports([])

    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/zip', 'application/x-zip-compressed'],
      copyToCacheDirectory: true,
    })

    if (result.canceled || !result.assets?.length) {
      return
    }

    setIsParsing(true)
    try {
      const fileUri = result.assets[0].uri
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const zip = await JSZip.loadAsync(base64, { base64: true })

      const submissionEntries = Object.keys(zip.files).filter(name =>
        /^submission_.*\.json$/.test(name)
      )

      if (!submissionEntries.length) {
        setParseError(
          'No submission_*.json file found in this zip. Only a zip exported from this app (via "Export as CSV ZIP" on Incomplete Sections) can be re-imported — older exports made before this feature was added won\'t have one.'
        )
        return
      }

      const nextParsedImports: ParsedImport[] = []
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
              errors: ['Could not parse this file as JSON — it may be corrupted.'],
            },
            duplicateCheck: { status: 'pending' },
            importStatus: 'idle',
          })
        }
      }

      setParsedImports(nextParsedImports)

      // Kick off existence checks for everything that parsed/validated cleanly.
      nextParsedImports
        .filter(item => item.validation.valid)
        .forEach(item => runDuplicateCheck(item.key, item.envelope.trapVisit))
    } catch (err) {
      console.error('Error parsing import zip:', err)
      setParseError(
        'Could not read this file as a zip. Make sure you picked the file exported from this app.'
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

      if (connectivityState.isConnected && connectivityState.isInternetReachable) {
        await dispatch(postTrapVisitFormSubmissions())
      }

      setParsedImports(prev =>
        prev.map(p => (p.key === key ? { ...p, importStatus: 'success' } : p))
      )
    } catch (error: any) {
      setParsedImports(prev =>
        prev.map(p =>
          p.key === key
            ? {
                ...p,
                importStatus: 'error',
                importError: 'Something went wrong queuing this import. Try again.',
              }
            : p
        )
      )
    }
  }

  return (
    <ScrollView bg='#fff' px='5%' py='3%'>
      <Heading mb='2'>Import Trap Visit</Heading>
      <Text mb='4' color='gray.600'>
        Re-import a trap visit + catch records from a previously exported CSV
        ZIP (Incomplete Sections → "Export as CSV ZIP") — for recovering a
        visit that silently failed to save. PDF exports can't be imported.
      </Text>

      <Button bg='primary' onPress={handlePickFile} isDisabled={isParsing}>
        {isParsing ? (
          <Spinner color='white' />
        ) : (
          <Text color='white'>Pick Export ZIP</Text>
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
            ? `${resolveTrapLocationLabel(trapVisit.trapLocationId)} — ${resolveProgramLabel(trapVisit.programId)}`
            : item.fileName

          return (
            <Box
              key={item.key}
              borderWidth={1}
              borderColor='coolGray.200'
              borderRadius={8}
              p={4}
            >
              <Text bold fontSize='lg'>
                {label}
              </Text>
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

              {item.validation.valid && item.duplicateCheck.status === 'pending' && (
                <HStack mt='2' alignItems='center' space={2}>
                  <Spinner size='sm' />
                  <Text color='gray.500' fontSize='sm'>
                    Checking server for an existing match…
                  </Text>
                </HStack>
              )}

              {item.validation.valid && item.duplicateCheck.status === 'error' && (
                <Text mt='2' color='error.600' fontSize='sm'>
                  {item.duplicateCheck.message}
                </Text>
              )}

              {item.validation.valid && item.duplicateCheck.status === 'match' && (
                <Box mt='2' bg='amber.50' borderRadius={6} p={3}>
                  <Text color='amber.800' bold fontSize='sm'>
                    A matching trap visit already exists on the server (id{' '}
                    {item.duplicateCheck.match.id}) with{' '}
                    {item.duplicateCheck.match.catchRawCount} catch record
                    {item.duplicateCheck.match.catchRawCount === 1 ? '' : 's'}{' '}
                    already saved.
                  </Text>
                  <Text color='amber.800' fontSize='sm' mt='1'>
                    Importing anyway will add this file's catch records
                    alongside what's already there — there's no server-side
                    protection against duplicating them. Only proceed if
                    you're sure the existing visit is incomplete or wrong.
                  </Text>
                </Box>
              )}

              {item.importStatus === 'success' && (
                <Text mt='2' color='success.600' fontSize='sm'>
                  {connectivityState.isConnected && connectivityState.isInternetReachable
                    ? 'Imported and submitted.'
                    : 'Queued locally — will submit automatically once back online.'}
                </Text>
              )}
              {item.importStatus === 'error' && (
                <Text mt='2' color='error.600' fontSize='sm'>
                  {item.importError}
                </Text>
              )}

              {item.validation.valid && item.importStatus !== 'success' && (
                <Button
                  mt='3'
                  alignSelf='flex-start'
                  bg={item.duplicateCheck.status === 'match' ? 'amber.600' : 'primary'}
                  isDisabled={
                    item.duplicateCheck.status === 'pending' ||
                    item.importStatus === 'submitting'
                  }
                  onPress={() => handleImport(item.key)}
                >
                  {item.importStatus === 'submitting' ? (
                    <Spinner color='white' />
                  ) : (
                    <Text color='white'>
                      {item.duplicateCheck.status === 'match'
                        ? 'Import Anyway'
                        : 'Import'}
                    </Text>
                  )}
                </Button>
              )}
            </Box>
          )
        })}
      </VStack>
    </ScrollView>
  )
}

export default connect(mapStateToProps)(ImportTrapVisit)
