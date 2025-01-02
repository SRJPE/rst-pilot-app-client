import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  ScrollView,
  Box,
  Row,
  Icon,
  IconButton,
} from 'native-base'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import { AppDispatch, RootState } from '../../redux/store'

import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'

import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker'
import QCFishDataTable from './QCFishDataTable'

const headers = [
  'Species',
  'Count',
  'Fork Len.',
  'Run',
  'Weight',
  'Life Stage',
  'Clipped',
  'Marks',
  'Dead',
  'Recapture',
  '',
]

const sortedDataByHeaders = [
  'species',
  'numFishCaught',
  'forkLength',
  'run',
  'weight',
  'lifeStage',
  'adiposeClipped',
  'existingMarks',
  'dead',
  'willBeUsedInRecapture',
]

interface NestedModalDataI {
  catchRawId: number
  fieldClicked: string
  value: string
}
interface NestedModalInputValueI {
  fieldClicked: string
  value: string | number | boolean
}

function CatchFishCountByDateQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
  taxonState,
  runState,
  lifeStageState,
  markTypeState,
  markColorState,
  markPositionState,
  userCredentialsStore,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
  previousCatchRawSubmissions: any
  taxonState: any[]
  runState: any[]
  lifeStageState: any[]
  markTypeState: any[]
  markColorState: any[]
  markPositionState: any[]
  userCredentialsStore: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [tableData, setTableData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)
  const [modalData, setModalData] = useState<any[] | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date() as any)
  const [nestedModalData, setNestedModalData] =
    useState<NestedModalDataI | null>(null)
  const [nestedModalInputValue, setNestedModalInputValue] =
    useState<NestedModalInputValueI>({
      fieldClicked: '',
      value: '',
    })
  const [nestedModalComment, setNestedModalComment] = useState<string>('')
  const [programName, setProgramName] = useState('' as string)

  const identifierToName = {
    taxonCode: 'Species',
    captureRunClass: 'Run',
    lifeStage: 'Life Stage',
    forkLength: 'Fork Length',
    markType: 'Mark Type',
    markColor: 'Mark Color',
    markPos: 'Mark Position',
    dead: 'Mortality',
    adiposeClipped: 'Adipose Clipped',
    weight: 'Weight',
    numFishCaught: 'Plus Count',
    qcComments: 'Comments',
  }

  const identifierToDataValueFromRecord = {
    taxonCode: 'createdCatchRawResponse.taxonCode',
    captureRunClass: 'createdCatchRawResponse.captureRunClass',
    lifeStage: 'createdCatchRawResponse.lifeStage',
    forkLength: 'createdCatchRawResponse.forkLength',
    markType: 'createdExistingMarksResponse[0].markTypeId',
    markColor: 'createdExistingMarksResponse[0].markColorId',
    markPos: 'createdExistingMarksResponse[0].markPositionId',
    dead: 'createdCatchRawResponse.dead',
    adiposeClipped: 'createdCatchRawResponse.adiposeClipped',
    numFishCaught: 'createdCatchRawResponse.numFishCaught',
    weight: 'createdCatchRawResponse.weight',
  }

  useEffect(() => {
    const programId = route.params.programId
    const currentProgram = userCredentialsStore.userPrograms.find(
      (program: any) => {
        return program.programId === programId
      }
    )
    setProgramName(currentProgram.programName)
    const programCatchRaw = previousCatchRawSubmissions.filter(
      (catchRaw: any) => {
        return catchRaw.createdCatchRawResponse.programId === programId
      }
    )

    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

    const selectedDateDateString = selectedDate.toDateString()

    const qcDataFiltered = qcData.filter((catchRawResponse: any) => {
      return (
        new Date(
          catchRawResponse?.createdCatchRawResponse?.trapVisitTimeEnd
        ).toDateString() === selectedDateDateString
      )
    })

    setTableData(qcDataFiltered)
  }, [selectedDate, qcCatchRawSubmissions])

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setSelectedDate(currentDate)
  }

  const renderCell = (obj: any, key: any) => {
    if (`${obj[key]}` === 'null') {
      return '---'
    }
    if (`${obj[key]}` === 'not recorded') {
      return 'NR'
    }
    if (`${obj[key]}`) {
      if (typeof obj[key] === 'string' || typeof obj[key] === 'boolean') {
        return `${`${obj[key]}`.charAt(0).toUpperCase()}${`${obj[key]}`.slice(
          1
        )}`
      }
      return `${obj[key]}`
    } else {
      return '---'
    }
  }

  const handleSubmit = () => {
    if (nestedModalData && nestedModalInputValue) {
      if (`${nestedModalData.value}` !== `${nestedModalInputValue.value}`) {
        let submissions: any[] = []
        let identifier = nestedModalData.fieldClicked

        let submissionOne = {
          fieldName:
            identifierToName[identifier as keyof typeof identifierToName],
          value: nestedModalInputValue.value,
        }
        submissions.push(submissionOne)

        if (nestedModalComment) {
          let submissionTwo = {
            fieldName: 'Comments',
            value: nestedModalComment,
          }
          submissions.push(submissionTwo)
        }

        dispatch(
          catchRawQCSubmission({
            catchRawId: nestedModalData.catchRawId,
            userId: userCredentialsStore.id,
            submissions,
          })
        )
      }
    }
  }

  return (
    <>
      <View flex={1} bg='#fff'>
        <VStack alignItems={'center'} flex={1}>
          <Text fontSize={'2xl'} fontWeight={300} mb={15} textAlign='center'>
            Select a date to see total daily counts for the selected date.
          </Text>
          <Box alignSelf='center'>
            <View marginBottom={5}>
              <Text fontSize='xl' color='black' textAlign={'center'}>
                Selected Date
              </Text>
              <DateTimePicker
                value={selectedDate}
                mode='date'
                onChange={onDateChange}
                accentColor='#007C7C'
                key={selectedDate.toISOString()}
              />
            </View>
          </Box>

          {selectedDate &&
            (tableData.length > 0 ? (
              <Box width='100%' marginBottom={5}>
                <QCFishDataTable
                  tableData={tableData}
                  taxonState={taxonState}
                  runState={runState}
                  lifeStageState={lifeStageState}
                  markTypeState={markTypeState}
                  markColorState={markColorState}
                  markPositionState={markPositionState}
                />
              </Box>
            ) : (
              <Text fontSize='xl'>No data available for this date</Text>
            ))}

          <View flex={1}></View>

          <HStack width={'full'} justifyContent={'space-between'}>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='secondary'
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text fontSize='xl' color='primary' fontWeight={'bold'}>
                Back
              </Text>
            </Button>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='primary'
              onPress={() => {
                dispatch(postQCSubmissions())
              }}
            >
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Save
              </Text>
            </Button>
          </HStack>
        </VStack>
      </View>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  let taxon = state.dropdowns.values.taxon
  let run = state.dropdowns.values.run
  let lifeStage = state.dropdowns.values.lifeStage
  let markType = state.dropdowns.values.markType
  let markColor = state.dropdowns.values.markColor
  let markPosition = state.dropdowns.values.bodyPart

  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
    taxonState: taxon ?? [],
    runState: run ?? [],
    lifeStageState: lifeStage ?? [],
    markTypeState: markType ?? [],
    markColorState: markColor ?? [],
    markPositionState: markPosition ?? [],
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(CatchFishCountByDateQC)
