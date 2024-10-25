import { useEffect, useState } from 'react'
import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import {
  kernelDensityEstimation,
  handleQCChartButtonClick,
  legendColorList,
} from '../../utils/utils'
import DateTimePicker from '@react-native-community/datetimepicker'

interface GraphDataI {
  'Fork Length': any[]
  Weight: any[]
}

interface DateRangeI {
  startDate: Date
  endDate: Date
}

const allButtons = ['Fork Length', 'Weight']

function CatchMeasureQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
  lifeStageState,
  userCredentialsStore,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any[]
  previousCatchRawSubmissions: any[]
  lifeStageState: any[]
  userCredentialsStore: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [activeButtons, setActiveButtons] = useState<
    ('Fork Length' | 'Weight')[]
  >(['Fork Length'])
  const [graphData, setGraphData] = useState<GraphDataI>({
    'Fork Length': [],
    Weight: [],
  })
  const [graphSubData, setGraphSubData] = useState<GraphDataI>({
    'Fork Length': [],
    Weight: [],
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeI>({
    startDate: new Date('2023-01-01'),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  })
  const [legendData, setLegendData] = useState<any>({})
  const [programName, setProgramName] = useState('' as string)

  const axisLabelDictionary = {
    'Fork Length': { xLabel: 'Fork Length (mm)', yLabel: 'Density' },
    Weight: { xLabel: 'Weight (g)', yLabel: 'Density' },
  }

  useEffect(() => {
    const programId = route.params.programId
    const currentProgram = userCredentialsStore.userPrograms.find(
      (program: any) => {
        return program.programId === programId
      }
    )
    setProgramName(currentProgram.programName)

    const programCatchRaw = previousCatchRawSubmissions.filter(catchRaw => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })
    let qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

    qcData = qcData.filter(data => {
      let createdAt = new Date(data.createdCatchRawResponse.createdAt)
      return (
        createdAt >= selectedDateRange.startDate &&
        createdAt <= selectedDateRange.endDate
      )
    })

    // Fork Length Density Calculations -----------------------------

    let forkRange: number | null = null
    let forkStartPoint: number | null = null
    let forkGraphSubData: any[] = []
    const lifeStageMap: any = {}

    // array of all fork lengths within the qc dataset
    const forkLengthArray: any[] = qcData
      .map(catchRawResponse => {
        const forkValue = Number(
          catchRawResponse.createdCatchRawResponse?.forkLength
        )
        const lifeStageId = catchRawResponse.createdCatchRawResponse?.lifeStage
        let lifeStageDefinition = null
        if (lifeStageId) {
          lifeStageDefinition = lifeStageState.find(
            (stage: any) => stage.id === lifeStageId
          ).definition

          if (lifeStageDefinition && !lifeStageMap[lifeStageDefinition]) {
            let colorOptions = legendColorList.filter(color => {
              return !Object.values(lifeStageMap).includes(color)
            })

            lifeStageMap[lifeStageDefinition] = colorOptions[0]
          }
        }

        if (!catchRawResponse.createdCatchRawResponse.qcCompleted) {
          forkGraphSubData.push({
            fieldClicked: 'Fork Length',
            id: catchRawResponse.createdCatchRawResponse.id,
            x: forkValue,
            y: 0,
            createdAt: catchRawResponse.createdCatchRawResponse?.createdAt,
            colorScale: lifeStageDefinition
              ? lifeStageMap[lifeStageDefinition]
              : 'grey',
          })
        }
        return forkValue
      })
      .filter(num => {
        return num != 0
      })

    let kdeForkValues: any[] = []
    if (forkLengthArray.length !== 0) {
      // start point is the lowest value fork length
      forkStartPoint = Math.min(...forkLengthArray)

      // range is the range of largest fork length to smallest fork length
      forkRange = Math.max(...forkLengthArray) - forkStartPoint

      // Calculate KDE values
      const forkBinWidth = 10 // forkBinWidth for KDE
      const minForkLength = Math.min(...forkLengthArray)
      const maxForkLength = Math.max(...forkLengthArray)
      const forkGrid = Array.from(
        { length: 100 },
        (_, i) => minForkLength + (i * (maxForkLength - minForkLength)) / 99
      ) // Points to evaluate KDE

      kdeForkValues = kernelDensityEstimation(
        forkLengthArray,
        forkBinWidth,
        forkGrid
      )
    }

    // Weight Density Calculations -----------------------------

    let weightRange: number | null = null
    let weightStartPoint: number | null = null
    let weightGraphSubData: any[] = []

    const weightArray: any[] = qcData
      .map(catchRawResponse => {
        const weightValue = Number(
          catchRawResponse.createdCatchRawResponse.weight
        )
        const lifeStageId = catchRawResponse.createdCatchRawResponse?.lifeStage
        let lifeStageDefinition = null
        if (lifeStageId) {
          lifeStageDefinition = lifeStageState.find(
            (stage: any) => stage.id === lifeStageId
          ).definition

          if (lifeStageDefinition && !lifeStageMap[lifeStageDefinition]) {
            let colorOptions = legendColorList.filter(color => {
              return !Object.values(lifeStageMap).includes(color)
            })

            lifeStageMap[lifeStageDefinition] = colorOptions[0]
          }
        }

        if (!catchRawResponse.createdCatchRawResponse.qcCompleted) {
          weightGraphSubData.push({
            fieldClicked: 'Weight',
            id: catchRawResponse.createdCatchRawResponse.id,
            x: weightValue,
            y: 0,
            createdAt: catchRawResponse.createdCatchRawResponse?.createdAt,
            colorScale: lifeStageDefinition
              ? lifeStageMap[lifeStageDefinition]
              : 'grey',
          })
        }
        return weightValue
      })
      .filter(num => {
        return num != 0
      })

    let kdeWeightValues: any[] = []
    if (weightArray.length !== 0) {
      weightStartPoint = Math.min(...weightArray)

      weightRange = Math.max(...weightArray) - weightStartPoint

      // Calculate KDE values
      const weightBinWidth = 10 // forkBinWidth for KDE
      const minWeightLength = Math.min(...forkLengthArray)
      const maxWeightLength = Math.max(...forkLengthArray)
      const weightGrid = Array.from(
        { length: 100 },
        (_, i) =>
          minWeightLength + (i * (maxWeightLength - minWeightLength)) / 99
      ) // Points to evaluate KDE

      kdeWeightValues = kernelDensityEstimation(
        weightArray,
        weightBinWidth,
        weightGrid
      )
    }

    let legendData: any[] = []

    Object.keys(lifeStageMap).forEach(
      (key: any) =>
        (legendData = [
          ...legendData,
          { name: key, symbol: { fill: lifeStageMap[key] } },
        ])
    )

    setLegendData(legendData)

    setGraphData({
      'Fork Length': kdeForkValues,
      Weight: kdeWeightValues,
    })

    setGraphSubData({
      'Fork Length': forkGraphSubData,
      Weight: weightGraphSubData,
    })
  }, [qcCatchRawSubmissions, selectedDateRange])

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName: 'Fork Length' | 'Weight'
  }) => {
    return (
      <Button
        bg={activeButtons.includes(buttonName) ? 'primary' : 'secondary'}
        marginX={0.5}
        flex={8}
        onPress={() => {
          const newActiveButtons = handleQCChartButtonClick(
            allButtons,
            activeButtons,
            buttonName
          ) as any
          setActiveButtons(newActiveButtons)
        }}
      >
        <Text
          fontSize='lg'
          color={activeButtons.includes(buttonName) ? 'secondary' : 'primary'}
          fontWeight={'bold'}
        >
          {buttonName}
        </Text>
      </Button>
    )
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPointClicked(null)
  }

  const handlePointClicked = (datum: any) => {
    setPointClicked(datum)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (submission: any) => {
    if (pointClicked) {
      const catchRawId = pointClicked.id
      let submissions = []

      for (const fieldName in submission) {
        submissions.push({
          fieldName,
          value: submission[fieldName].x,
        })
      }

      if (submissions.length)
        dispatch(
          catchRawQCSubmission({
            catchRawId,
            userId: userCredentialsStore.id,
            submissions,
          })
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
            headerText={'Fork Length and Weight'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on the plot below. Grey density
            lines show historic distribution
          </Text>

          <HStack mb={'10'}>
            <GraphMenuButton buttonName={'Fork Length'} />
            <GraphMenuButton buttonName={'Weight'} />
            <View flex={2}></View>

            <View>
              <Text fontSize='xl' color='black' textAlign={'center'}>
                Start Date
              </Text>
              <DateTimePicker
                value={selectedDateRange.startDate}
                mode='date'
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setSelectedDateRange({
                      ...selectedDateRange,
                      startDate: selectedDate,
                    })
                  }
                }}
                accentColor='#007C7C'
              />
            </View>
            <View>
              <Text fontSize='xl' color='black' textAlign={'center'}>
                End Date
              </Text>
              <DateTimePicker
                value={selectedDateRange.endDate}
                mode='date'
                onChange={(event, selectedDate) => {
                  if (selectedDate)
                    setSelectedDateRange({
                      ...selectedDateRange,
                      endDate: selectedDate,
                    })
                }}
                accentColor='#007C7C'
              />
            </View>
          </HStack>

          <ScrollView>
            {activeButtons.map(buttonName => {
              return (
                <Graph
                  xLabel={axisLabelDictionary[buttonName]['xLabel']}
                  yLabel={axisLabelDictionary[buttonName]['yLabel']}
                  key={buttonName}
                  chartType='linewithplot'
                  data={graphData[buttonName]}
                  subData={graphSubData[buttonName]}
                  onPointClick={datum => handlePointClicked(datum)}
                  title={buttonName}
                  barColor='grey'
                  selectedBarColor='green'
                  height={400}
                  width={600}
                  legendData={legendData.length ? legendData : undefined}
                />
              )
            })}
          </ScrollView>

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
      {pointClicked ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='1/2'
        >
          <GraphModalContent
            closeModal={() => handleCloseModal()}
            pointClicked={pointClicked}
            onSubmit={(submission: any) => handleModalSubmit(submission)}
            headerText={'Table of Selected Points'}
            modalData={graphSubData}
            usesDensity={true}
            programName={programName}
          />
        </CustomModal>
      ) : (
        <></>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  const lifeStage = state.dropdowns?.values?.lifeStage

  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
    lifeStageState: lifeStage ?? [],
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(CatchMeasureQC)
