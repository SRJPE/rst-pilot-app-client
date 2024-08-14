import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  ScrollView,
  Heading,
  Icon,
  Input,
  Box,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { AppDispatch, RootState } from '../../redux/store'
import {
  capitalizeFirstLetterOfEachWord,
  kernelDensityEstimation,
  truncateAndTrimString,
} from '../../utils/utils'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { DataTable } from 'react-native-paper'
import { get } from 'lodash'
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'

interface NestedModalDataI {
  catchRawId: number
  header: string
  value: string
}

function EfficiencyQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any[]
  previousCatchRawSubmissions: any[]
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [graphData, setGraphData] = useState<any[]>([])
  const [graphSubData, setGraphSubData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any[] | null>(null)
  const [nestedModalData, setNestedModalData] =
    useState<NestedModalDataI | null>(null)
  const [nestedModalInputValue, setNestedModalInputValue] = useState<string>('')
  const [nestedModalComment, setNestedModalComment] = useState<string>('')

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter(
      (catchRaw: any) => {
        return catchRaw.createdCatchRawResponse.programId === programId
      }
    )
    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]
    const efficienciesArray: any[] = []
    const graphSubDataByValue: any = {}
    const graphSubDataPayload: any[] = []

    qcData.forEach((catchRawResponse: any, idx: number) => {
      const catchRaw = catchRawResponse.createdCatchRawResponse
      const release = catchRawResponse.releaseResponse
      const qcCompleted = catchRaw.qcCompleted
      const qcNotStarted = qcCompleted ? false : true

      const numFishCaught: number = catchRaw.numFishCaught
      const catchRawId = catchRaw.id

      let numberReleased = 0
      let numberRecaptured = numFishCaught

      if (release) {
        if (Object.keys(release)) {
          numberReleased =
            Number(release.totalWildFishReleased) +
            Number(release.totalHatcheryFishReleased)
        }
      }

      const efficiencyDecimal =
        numberReleased !== 0 ? numberRecaptured / numberReleased : 0

      const efficiency = efficiencyDecimal * 100

      if (qcCompleted && typeof efficiency === 'number') {
        efficienciesArray.push(efficiency)
      }

      if (typeof efficiency === 'number') {
        if (Object.keys(graphSubDataByValue).includes(efficiency.toString())) {
          graphSubDataByValue[efficiency].push(catchRawId)
        } else {
          graphSubDataByValue[efficiency] = [catchRawId]
        }
      }
    })

    Object.keys(graphSubDataByValue).forEach((efficiency) => {
      graphSubDataPayload.push({
        x: Number(efficiency),
        y: 0,
        ids: graphSubDataByValue[efficiency],
      })
    })

    // Efficiency Density Calculations -----------------------------

    if (efficienciesArray.length === 0) {
      return
    }

    let range: number | null = null
    let startPoint: number | null = null

    // array of all efficiencies within the qc dataset
    // -> efficienciesArray

    // start point is the lowest value fork length
    startPoint = Math.min(...efficienciesArray)

    // range is the range of largest fork length to smallest fork length
    range = Math.max(...efficienciesArray) - startPoint

    // Calculate KDE values
    const binWidth = 10 // binWidth for KDE
    const minEfficiencyValue = Math.min(...efficienciesArray)
    const maxEfficiencyValue = Math.max(...efficienciesArray)
    const grid = Array.from(
      { length: 100 },
      (_, i) =>
        minEfficiencyValue +
        (i * (maxEfficiencyValue - minEfficiencyValue)) / 99
    ) // Points to evaluate KDE

    const kdeEfficiencyValues = kernelDensityEstimation(
      efficienciesArray,
      binWidth,
      grid
    )

    setGraphData(kdeEfficiencyValues)
    setGraphSubData(graphSubDataPayload)
  }, [qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
    const pointIds = datum.ids
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter((catchRaw) => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })

    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

    const selectedData = qcData.filter((response) => {
      const id = response.createdCatchRawResponse?.id
      return pointIds.includes(id)
    })

    console.log('selectedData', selectedData)

    setModalData(selectedData)

    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleModalCellPressed = (header: string, data: any) => {
    let catchRawId = data?.createdCatchRawResponse?.id
    let release = data?.releaseResponse
    let parsedData = null

    switch (header) {
      case 'Release Date':
        console.log('release date')
        let releaseDate = get(data, 'releaseResponse.releasedAt')
        if (releaseDate) parsedData = releaseDate
        break
      case 'Wild Fish Released':
        console.log('wild fish released')
        parsedData = Number(release?.totalWildFishReleased)
        break
      case 'Hatchery Fish Released':
        console.log('hatchery fish released')
        parsedData = Number(release?.totalHatcheryFishReleased)
        break
      case 'Number Recaptured':
        console.log('number recaptured')
        parsedData = data?.createdCatchRawResponse?.numFishCaught
        break
      case 'Fork Length':
        console.log('fork length')
        parsedData = data?.createdCatchRawResponse?.forkLength
        break
      default:
        break
    }

    setNestedModalData({
      catchRawId,
      header,
      value: parsedData ? parsedData : 'NA',
    })
  }

  const handleCloseNestedModal = () => {
    setNestedModalData(null)
    setNestedModalInputValue('')
    setNestedModalComment('')
  }

  const handleSaveNestedModal = () => {
    const catchRawId = nestedModalData?.catchRawId
    const header = nestedModalData?.header

    let submissions = []

    // headers: 'Release Date', 'Wild Fish Released', 'Hatchery Fish Released', 'Number Recaptured', 'Fork Length'

    if (catchRawId && nestedModalInputValue) {
      let submissionOne = {
        fieldName: header,
        value: nestedModalInputValue,
      }
      submissions.push(submissionOne)

      if (nestedModalComment) {
        let submissionTwo = {
          fieldName: 'Comments',
          value: nestedModalComment,
        }
        submissions.push(submissionTwo)
      }

      dispatch(catchRawQCSubmission({ catchRawId, submissions }))
    }
  }

  const xIsNotZero = (currentObj: any) => currentObj.x !== 0

  const CustomNestedModalInput = ({
    header,
    data,
  }: {
    header: string
    data: any
  }) => {
    switch (header) {
      case 'Release Date':
        return (
          <VStack>
            <Text>Edit Date</Text>
            <Box alignSelf='flex-start' mt={5}>
              <DateTimePicker
                value={
                  nestedModalInputValue
                    ? new Date(nestedModalInputValue)
                    : new Date()
                }
                mode={'date'}
                display='default'
                onChange={(event, selectedDate) => {
                  console.log('date selected: ', selectedDate)
                  if (selectedDate)
                    setNestedModalInputValue(selectedDate?.toISOString())
                }}
              />
            </Box>
          </VStack>
        )
      case 'Wild Fish Released':
        return (
          <Input
            height='50px'
            width='350px'
            fontSize='16'
            placeholder='Enter Number'
            keyboardType='numeric'
            onChangeText={(value) => {
              setNestedModalInputValue(value)
            }}
            value={nestedModalInputValue}
          />
        )
      case 'Hatchery Fish Released':
        return (
          <Input
            height='50px'
            width='350px'
            fontSize='16'
            placeholder='Enter Number'
            keyboardType='numeric'
            onChangeText={(value) => {
              setNestedModalInputValue(value)
            }}
            value={nestedModalInputValue}
          />
        )
      case 'Number Recaptured':
        return (
          <Input
            height='50px'
            width='350px'
            fontSize='16'
            placeholder='Enter Number'
            keyboardType='numeric'
            onChangeText={(value) => {
              setNestedModalInputValue(value)
            }}
            value={nestedModalInputValue}
          />
        )
      case 'Fork Length':
        return (
          <Input
            height='50px'
            width='350px'
            fontSize='16'
            placeholder='Enter Fork Length'
            keyboardType='numeric'
            onChangeText={(value) => {
              console.log('fork length: ', value)
              setNestedModalInputValue(value)
            }}
            value={nestedModalInputValue}
          />
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
            headerText={'QC Efficiency Data'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on the plot below. Grey density
            lines show historic efficiency distributions
          </Text>

          {/* {graphSubData.length > 0 ? ( */}
          {graphSubData.length > 0 && graphSubData.every(xIsNotZero) ? (
            <ScrollView>
              <Graph
                xLabel={'Efficiency % (Recaptured/Released)'}
                yLabel={'Density'}
                chartType='linewithplot'
                data={graphData}
                subData={graphSubData}
                barColor='grey'
                selectedBarColor='green'
                height={400}
                width={600}
                onPointClick={(datum) => handlePointClick(datum)}
              />
            </ScrollView>
          ) : (
            <Text fontSize='xl'>
              No data currently available for this program
            </Text>
          )}

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

            <VStack alignItems={'center'}>
              <Heading fontSize={23} mb={5}>
                Efficiency Table
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
                    {/* release date */}
                    {/* release id (not present) */}
                    {/* number released */}
                    {/* number recaptured */}
                    {/* mean fork length released */}
                    {/* mean fork length recaptured */}
                    {/* mark shortcut */}

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
                        <Text>Release Date</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const release = data.releaseResponse
                        const releaseDate = release?.releasedAt

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
                              handleModalCellPressed('Release Date', data)
                            }
                          >
                            <Text>
                              {releaseDate
                                ? `${truncateAndTrimString(releaseDate, 12)}...`
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
                        <Text>Wild Fish Released</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const release = data.releaseResponse
                        let wildFishReleased = 0
                        if (release) {
                          wildFishReleased = Number(
                            release?.totalWildFishReleased
                          )
                        }

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
                              handleModalCellPressed('Wild Fish Released', data)
                            }
                          >
                            <Text>{wildFishReleased}</Text>
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
                        <Text>Hatchery Fish Released</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const release = data.releaseResponse
                        let hatcheryFishReleased = 0
                        if (release) {
                          hatcheryFishReleased = Number(
                            release?.totalHatcheryFishReleased
                          )
                        }

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
                              handleModalCellPressed(
                                'Hatchery Fish Released',
                                data
                              )
                            }
                          >
                            <Text>{hatcheryFishReleased}</Text>
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
                        <Text>Number Recaptured</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const catchRaw = data.createdCatchRawResponse
                        const numFishCaught = catchRaw.numFishCaught

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
                              handleModalCellPressed('Number Recaptured', data)
                            }
                          >
                            <Text>{numFishCaught ? numFishCaught : 'NA'}</Text>
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
                        <Text>Fork Length</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let forkLength =
                          data?.createdCatchRawResponse.forkLength

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`forklength-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('Fork Length', data)
                            }
                          >
                            <Text>{forkLength ?? 'NA'}</Text>
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
              headerText={nestedModalData.header}
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
                    handleSaveNestedModal()
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
                You have the {nestedModalData.header} marked as{' '}
                {`${nestedModalData.value}`}
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
                  header: nestedModalData.header,
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
  let markColor = state.dropdowns.values.markColor
  let markType = state.dropdowns.values.markType
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

export default connect(mapStateToProps)(EfficiencyQC)
