import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  ScrollView,
  Icon,
  Input,
  Box,
  Heading,
  Radio,
} from 'native-base'
import { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { AppDispatch, RootState } from '../../redux/store'
import {
  capitalizeFirstLetterOfEachWord,
  normalizeDate,
  reorderTaxon,
  truncateAndTrimString,
} from '../../utils/utils'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import moment from 'moment'
import { DataTable } from 'react-native-paper'
import { get, startCase } from 'lodash'

interface NestedModalDataI {
  catchRawId: number
  fieldClicked: string
  value: string
}
interface NestedModalInputValueI {
  fieldClicked: string
  value: string | number | boolean
}

function CatchFishCountQC({
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
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [graphData, setGraphData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)
  const [selectedSpecies, setSelectedSpecies] = useState<string>('')
  const [modalData, setModalData] = useState<any[] | null>(null)
  const [nestedModalData, setNestedModalData] =
    useState<NestedModalDataI | null>(null)
  const [nestedModalInputValue, setNestedModalInputValue] =
    useState<NestedModalInputValueI>({
      fieldClicked: '',
      value: '',
    })
  const [nestedModalComment, setNestedModalComment] = useState<string>('')
  const reorderedTaxon = reorderTaxon(taxonState)

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
  }

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter(
      (catchRaw: any) => {
        return catchRaw.createdCatchRawResponse.programId === programId
      }
    )
    const selectedSpeciesTaxon = reorderedTaxon.find(
      (taxon) => taxon.commonname == selectedSpecies
    )?.code

    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

    const qcDataFiltered = qcData.filter((catchRawResponse: any) => {
      return (
        catchRawResponse.createdCatchRawResponse.taxonCode ===
        selectedSpeciesTaxon
      )
    })

    const totalCountByDay: any[] = []
    const datesFormatted: any = {}

    // Structure: datesFormatted = { date: {count, catchRawIds: [...]}, ...}

    qcDataFiltered.forEach((catchResponse) => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const numFishCaught: number = catchRaw?.numFishCaught
      const plusCount: boolean = catchRaw?.plusCount
      const createdAt = new Date(catchRaw.createdAt)
      const normalizedDate = normalizeDate(createdAt)
      const qcCompleted = catchResponse.createdCatchRawResponse.qcCompleted

      if (Object.keys(datesFormatted).includes(String(normalizedDate))) {
        datesFormatted[normalizedDate].count += numFishCaught
        if (!qcCompleted) datesFormatted[normalizedDate].qcCompleted = false

        // add catchRawId to array if not already included
        if (
          !datesFormatted[normalizedDate].catchRawIds.includes(catchRaw.id) &&
          plusCount
        ) {
          datesFormatted[normalizedDate].catchRawIds.push(catchRaw.id)
        }

        if (plusCount) {
          datesFormatted[normalizedDate].plusCountValue += numFishCaught
          datesFormatted[normalizedDate].firstPlusCountRecordId = catchRaw.id
        }
      } else {
        datesFormatted[normalizedDate] = {
          count: numFishCaught,
          catchRawIds: [catchRaw.id],
          firstPlusCountRecordId: plusCount ? catchRaw.id : null,
          plusCountValue: plusCount ? numFishCaught : 0,
          qcCompleted,
        }
      }
    })

    Object.keys(datesFormatted).forEach((dateString) => {
      totalCountByDay.push({
        x: Number(dateString),
        y: datesFormatted[dateString].count,
        catchRawIds: datesFormatted[dateString].catchRawIds,
        plusCountValue: datesFormatted[dateString].plusCountValue,
        firstPlusCountRecordId:
          datesFormatted[dateString].firstPlusCountRecordId,
        colorScale: !datesFormatted[dateString].qcCompleted
          ? 'rgb(255, 100, 84)'
          : undefined,
      })
    })

    setGraphData(totalCountByDay)
  }, [selectedSpecies, qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
    try {
      const programId = route.params.programId
      const programCatchRaw = previousCatchRawSubmissions.filter(
        (catchRaw: any) => {
          return catchRaw.createdCatchRawResponse.programId === programId
        }
      )
      const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

      const selectedData = qcData.filter((response) => {
        const id = response.createdCatchRawResponse?.id
        return datum.catchRawIds.includes(id)
      })

      setModalData(selectedData)

      setPointClicked(datum)
      setIsModalOpen(true)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleModalCellPressed = (fieldClicked: string, data: any) => {
    let catchRawId = get(data, 'createdCatchRawResponse.id')
    let rawData = get(
      data,
      identifierToDataValueFromRecord[
        fieldClicked as keyof typeof identifierToDataValueFromRecord
      ]
    )
    let parsedData = null

    switch (fieldClicked) {
      case 'taxonCode':
        parsedData = taxonState.filter((obj: any) => {
          return obj.code === rawData
        })[0]?.commonname
        break
      case 'captureRunClass':
        parsedData = runState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'lifeStage':
        parsedData = lifeStageState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'markType':
        parsedData = markTypeState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'markPos':
        parsedData = markPositionState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'markColor':
        parsedData = markColorState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break

      default:
        break
    }

    if (rawData === undefined) {
      setNestedModalData({ catchRawId, fieldClicked, value: 'NA' })
    } else {
      if (typeof rawData === 'boolean') {
        rawData = rawData ? 'true' : 'false'
      }
      if (rawData === null) {
        rawData = 'NA'
      }
      setNestedModalData({
        catchRawId,
        fieldClicked,
        value: parsedData ? parsedData : rawData,
      })

      setNestedModalInputValue({
        fieldClicked,
        value: parsedData ? parsedData : rawData,
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPointClicked(null)
    setModalData(null)
  }

  const handleCloseNestedModal = () => {
    setNestedModalData(null)
    setNestedModalInputValue({ fieldClicked: '', value: '' })
    setNestedModalComment('')
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
            submissions,
          })
        )
      }
    }
  }

  const CustomNestedModalInput = ({
    fieldClicked,
    data,
  }: {
    fieldClicked: string
    data: any
  }) => {
    const reorderedTaxon = reorderTaxon(taxonState)

    switch (fieldClicked) {
      case 'taxonCode':
        return (
          <VStack>
            <Text>Edit Species</Text>
            <CustomSelect
              // set selectedValue to using nestedModalInputValue.value as taxonCode to find commonname
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Species'}
              onValueChange={(value: string) => {
                const filteredTaxon = reorderedTaxon.filter(
                  (taxon: any) => taxon.code === value
                )
                const taxonCode = filteredTaxon[0]?.code

                setNestedModalInputValue({
                  fieldClicked: 'taxonCode',
                  value: taxonCode,
                })
              }}
              selectOptions={reorderedTaxon.map((taxon: any) => ({
                label: taxon?.commonname,
                value: taxon?.code,
              }))}
            />
          </VStack>
        )
      case 'captureRunClass':
        return (
          <VStack>
            <Text>Edit Run</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Run'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({
                  fieldClicked: 'captureRunClass',
                  value,
                })
              }
              selectOptions={runState.map((run: any) => ({
                label: run?.definition,
                value: run?.id,
              }))}
            />
          </VStack>
        )
      case 'numFishCaught':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Plus Count</Text>
            <Input
              height='50px'
              width='350px'
              fontSize='16'
              placeholder='plus count...'
              keyboardType='numeric'
              onChangeText={(value) => {
                setNestedModalInputValue({
                  fieldClicked: 'numFishCaught',
                  value,
                })
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue.value as string}
            />
          </VStack>
        )
      case 'lifeStage':
        return (
          <VStack>
            <Text>Edit Life Stage</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Life Stage'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'lifeStage', value })
              }
              selectOptions={lifeStageState.map((lifeStage: any) => ({
                label: lifeStage?.definition,
                value: lifeStage?.id,
              }))}
            />
          </VStack>
        )
      case 'forkLength':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Fork Length</Text>
            <Input
              height='50px'
              width='350px'
              fontSize='16'
              placeholder='fork length...'
              keyboardType='numeric'
              onChangeText={(value) => {
                setNestedModalInputValue({ fieldClicked: 'forkLength', value })
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue.value as string}
            />
          </VStack>
        )
      case 'markType':
        return (
          <VStack>
            <Text>Edit Mark Type</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'markType', value })
              }
              selectOptions={markTypeState.map((markType: any) => ({
                label: markType?.definition,
                value: markType?.id,
              }))}
            />
          </VStack>
        )
      case 'markColor':
        return (
          <VStack>
            <Text>Edit Mark Color</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'markColor', value })
              }
              selectOptions={markColorState.map((markColor: any) => ({
                label: markColor?.definition,
                value: markColor?.id,
              }))}
            />
          </VStack>
        )
      case 'markPos':
        return (
          <VStack>
            <Text>Edit Mark Position</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'markPos', value })
              }
              selectOptions={markPositionState.map((markPosition: any) => ({
                label: markPosition?.definition,
                value: markPosition?.id,
              }))}
            />
          </VStack>
        )
      case 'dead':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Mortality</Text>
            <Radio.Group
              name='mortality'
              accessibilityLabel='mortality'
              value={nestedModalInputValue.value as string}
              onChange={(value: any) => {
                setNestedModalInputValue({
                  fieldClicked: 'dead',
                  value,
                })
              }}
            >
              <Radio
                colorScheme='primary'
                value='true'
                my={1}
                _icon={{ color: 'primary' }}
              >
                True
              </Radio>
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                False
              </Radio>
            </Radio.Group>
          </VStack>
        )
      case 'adiposeClipped':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Adipose Clipped</Text>
            <Radio.Group
              name='adiposeClipped'
              accessibilityLabel='adiposeClipped'
              value={nestedModalInputValue.value as string}
              onChange={(value: any) => {
                setNestedModalInputValue({
                  fieldClicked: 'adiposeClipped',
                  value,
                })
              }}
            >
              <Radio
                colorScheme='primary'
                value={'true'}
                my={1}
                _icon={{ color: 'primary' }}
              >
                True
              </Radio>
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                False
              </Radio>
            </Radio.Group>
          </VStack>
        )
    }
  }

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        px='5%'
        py='3%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack alignItems={'center'} flex={1}>
          <CustomModalHeader
            headerText={'QC Total Daily Count'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Select a species to see total daily counts for the selected species.
            Points represent total daily counts of measured and plus count fish.
            Edit the plus count by selecting a point on the plot below.
          </Text>

          <Box width='70%' marginBottom={5}>
            <CustomSelect
              selectedValue={selectedSpecies}
              placeholder={'Species'}
              style={{ width: '100%' }}
              onValueChange={(value: string) => {
                setSelectedSpecies(value)
              }}
              selectOptions={reorderedTaxon.map((taxon: any) => ({
                label: taxon?.commonname,
                value: taxon?.commonname,
              }))}
            />
          </Box>

          {selectedSpecies &&
            (graphData.length > 0 ? (
              <ScrollView>
                <Graph
                  xLabel={'Date'}
                  yLabel={'Total Daily Catch'}
                  chartType='bar'
                  data={selectedSpecies != '' ? graphData : []}
                  showDates={true}
                  barColor='grey'
                  onPointClick={(datum) => handlePointClick(datum)}
                  selectedBarColor='green'
                  height={400}
                  width={600}
                />
              </ScrollView>
            ) : (
              <Text fontSize='xl'>No data available for this species</Text>
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

      {modalData ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='5/6'
        >
          <>
            <CustomModalHeader
              headerText={
                'Click on a cell to flag data as low confidence or edit value'
              }
              headerStyle={{ fontSize: 23, fontWeight: '300' }}
              showHeaderButton={false}
              closeModal={() => setModalData(null)}
            />

            <Text
              color='black'
              fontSize='2xl'
              marginLeft={8}
              marginBottom={4}
              fontWeight={'light'}
            >
              {`Selected Point${modalData.length > 1 ? `s` : ''} Date: `}
              {moment(
                modalData?.[0]?.createdCatchRawResponse?.createdAt
              ).format('MMMM Do, YYYY')}
            </Text>
            <Text
              color='black'
              fontSize='2xl'
              marginLeft={8}
              marginBottom={8}
              fontWeight={'light'}
            >
              You collected{' '}
              <Text fontWeight={'bold'}>
                {pointClicked.y - pointClicked.plusCountValue} measured
              </Text>{' '}
              fish and{' '}
              <Text fontWeight={'bold'}>
                {pointClicked.plusCountValue} plus count
              </Text>{' '}
              fish.
            </Text>
            <VStack alignItems={'center'}>
              <Heading fontSize={23} mb={5}>
                Table of Selected Points
              </Heading>
              <ScrollView
                horizontal
                size={'80%'}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                }}
              >
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title
                      style={{ justifyContent: 'center', minWidth: 90 }}
                    >
                      Variable
                    </DataTable.Title>
                    {modalData.map((data, idx) => (
                      <DataTable.Title
                        key={idx}
                        style={{ justifyContent: 'center', minWidth: 90 }}
                      >{`Fish ${idx + 1}`}</DataTable.Title>
                    ))}
                  </DataTable.Header>

                  <ScrollView size={'full'}>
                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Species</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const taxonCode = data.createdCatchRawResponse.taxonCode
                        let species = taxonState.filter((obj: any) => {
                          return obj.code === taxonCode
                        })
                        let commonname = species[0]?.commonname

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`species-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('taxonCode', data)
                            }
                          >
                            <Text>
                              {species.length
                                ? `${truncateAndTrimString(
                                    capitalizeFirstLetterOfEachWord(commonname),
                                    12
                                  )}...`
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Run</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let run = data.createdCatchRawResponse.captureRunClass
                        let runObjFiltered = runState.filter((obj: any) => {
                          return obj.id === run
                        })
                        let runDefinition = runObjFiltered.length
                          ? runObjFiltered[0]?.definition
                          : 'NA'

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`run-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('captureRunClass', data)
                            }
                          >
                            <Text>
                              {capitalizeFirstLetterOfEachWord(runDefinition) ??
                                'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Life Stage</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let lifeStageId = data.createdCatchRawResponse.lifeStage
                        let lifeStageObjFiltered = lifeStageState.filter(
                          (obj: any) => {
                            return obj.id === lifeStageId
                          }
                        )
                        let lifeStage = lifeStageObjFiltered.length
                          ? lifeStageObjFiltered[0]?.definition
                          : 'NA'

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`lifestage-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('lifeStage', data)
                            }
                          >
                            <Text>
                              {capitalizeFirstLetterOfEachWord(lifeStage) ??
                                'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Plus Count</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let numFishCaught =
                          data.createdCatchRawResponse.numFishCaught

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`lifestage-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('numFishCaught', data)
                            }
                          >
                            <Text>{numFishCaught ?? 'NA'}</Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Adipose Clip</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let adiposeClipped: boolean =
                          data.createdCatchRawResponse.adiposeClipped

                        let adValue = adiposeClipped
                        if (typeof adiposeClipped === 'string') {
                          adValue = adiposeClipped === 'true' ? true : false
                        }

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`adipose-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('adiposeClipped', data)
                            }
                          >
                            <Text>
                              {adValue != null
                                ? adValue
                                  ? 'True'
                                  : 'False'
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Mort</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let deadValue = data.createdCatchRawResponse.dead
                        if (typeof deadValue === 'string') {
                          deadValue = deadValue === 'true' ? true : false
                        }

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`mortality-${idx}`}
                            onPress={() => handleModalCellPressed('dead', data)}
                          >
                            <Text>
                              {deadValue != null
                                ? deadValue
                                  ? 'True'
                                  : 'False'
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>
                  </ScrollView>
                </DataTable>
              </ScrollView>
            </VStack>
          </>
        </CustomModal>
      ) : (
        <></>
      )}

      {nestedModalData ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='3/4'
        >
          <>
            <CustomModalHeader
              headerText={
                identifierToName[
                  nestedModalData.fieldClicked as keyof typeof identifierToName
                ]
              }
              headerFontSize={23}
              showHeaderButton={true}
              closeModal={() => handleCloseNestedModal()}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  onPress={() => {
                    handleSubmit()
                    handleCloseNestedModal()
                    handleCloseModal()
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Save
                  </Text>
                </Button>
              }
            />
            <VStack
              paddingX={20}
              justifyContent='center'
              justifyItems={'center'}
            >
              <Text color='black' fontSize='2xl' mb={5} fontWeight={'light'}>
                You have the{' '}
                {
                  identifierToName[
                    nestedModalData.fieldClicked as keyof typeof identifierToName
                  ]
                }{' '}
                marked as {`${startCase(nestedModalData.value)}`}
              </Text>
              <Text color='black' fontSize='2xl' fontWeight={'light'}>
                Click button below to flag data as low confidence or edit value
                if you know the correct value.
              </Text>
              <HStack
                justifyContent={'space-between'}
                style={{ marginRight: 100 }}
                w='full'
              >
                <Button
                  style={{ backgroundColor: '#D1E8F0' }}
                  paddingX={10}
                  width={'3xs'}
                >
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    w='20'
                  >
                    <Text color={'#007C7C'}>Flag</Text>
                    <Icon
                      as={MaterialIcons}
                      name={'flag'}
                      size='10'
                      color='#FF4242'
                    />
                  </HStack>
                </Button>
                <Input
                  height='50px'
                  width='350px'
                  fontSize='16'
                  placeholder='Write a comment'
                  keyboardType='default'
                  onChangeText={(value) => {
                    setNestedModalComment(value)
                  }}
                  value={nestedModalComment}
                />
              </HStack>

              <View mt='50px'>
                {CustomNestedModalInput({
                  fieldClicked: nestedModalData.fieldClicked,
                  data: nestedModalData.value,
                })}
              </View>
            </VStack>
          </>
        </CustomModal>
      ) : (
        <></>
      )}
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
  }
}

export default connect(mapStateToProps)(CatchFishCountQC)
