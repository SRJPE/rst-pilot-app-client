import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  Box,
  ScrollView,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { postQCSubmissions } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'

import { connect } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker'
import QCFishDataTable from './QCFishDataTable'

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
  const [selectedDate, setSelectedDate] = useState(new Date() as any)

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

    qcDataFiltered.sort(
      (a, b) => a.createdCatchRawResponse.id - b.createdCatchRawResponse.id
    )

    setTableData(qcDataFiltered)
  }, [selectedDate, qcCatchRawSubmissions])

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setSelectedDate(currentDate)
  }

  return (
    <ScrollView flex={1} bg='#fff'>
      <VStack alignItems={'center'} flex={1}>
        <Text fontSize={'2xl'} fontWeight={300} mb={15} textAlign='center'>
          Select a date to see total daily counts for the selected date.
        </Text>
        <Box alignSelf='center' alignItems={'center'}>
          <View marginBottom={5} alignItems={'center'}>
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
            <>
              <Box width='100%' marginBottom={5}>
                <QCFishDataTable
                  tableData={tableData}
                  taxonState={taxonState}
                  runState={runState}
                  lifeStageState={lifeStageState}
                  markTypeState={markTypeState}
                  markColorState={markColorState}
                  markPositionState={markPositionState}
                  navigation={navigation}
                  userCredentialsStore={userCredentialsStore}
                />
              </Box>
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
            </>
          ) : (
            <Text fontSize='xl'>No data available for this date</Text>
          ))}
      </VStack>
    </ScrollView>
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
