import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Center,
  HStack,
  Modal,
  Text,
  View,
  VStack,
} from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { ScrollView } from 'react-native-gesture-handler'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  postQCSubmissions,
  trapVisitQCSubmission,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { handleQCChartButtonClick, normalizeDate } from '../../utils/utils'

interface GraphDataI {
  Temperature: any[]
  Turbidity: any[]
  'RPM At Start': any[]
  'RPM At End': any[]
  Counter: any[]
  Debris: any[]
}

const allButtons = [
  'Temperature',
  'Turbidity',
  'RPM At Start',
  'RPM At End',
  'Counter',
  'Debris',
]

function TrapQC({
  navigation,
  route,
  qcTrapVisitSubmissions,
  previousTrapVisits,
  userCredentialsStore,
}: {
  navigation: any
  route: any
  qcTrapVisitSubmissions: any[]
  previousTrapVisits: any[]
  userCredentialsStore: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [activeButtons, setActiveButtons] = useState<
    (
      | 'Temperature'
      | 'Turbidity'
      | 'RPM At Start'
      | 'RPM At End'
      | 'Counter'
      | 'Debris'
    )[]
  >(['Temperature'])
  const [graphData, setGraphData] = useState<GraphDataI>({
    Temperature: [],
    Turbidity: [],
    'RPM At Start': [],
    'RPM At End': [],
    Counter: [],
    Debris: [],
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)

  const axisLabelDictionary = {
    Temperature: { xLabel: 'Date', yLabel: 'Temperature (C)' },
    Turbidity: { xLabel: 'Date', yLabel: 'Turbidity (ntu)' },
    'RPM At Start': { xLabel: 'Date', yLabel: 'RPM' },
    'RPM At End': { xLabel: 'Date', yLabel: 'RPM' },
    Counter: { xLabel: 'Date', yLabel: 'Total Revolutions' },
    Debris: { xLabel: 'Date', yLabel: 'Debris (gal)' },
  }

  useEffect(() => {
    const programId = route.params.programId
    const programTrapVisits = previousTrapVisits.filter(trapVisit => {
      return trapVisit.createdTrapVisitResponse.programId === programId
    })

    let tempData: any[] = []
    let turbidityData: any[] = []
    let rpmAtStartData: any[] = []
    let rpmAtEndData: any[] = []
    let counterData: any[] = []
    let debrisData: any[] = []

    Object.values([...qcTrapVisitSubmissions, ...programTrapVisits]).forEach(
      (response: any, idx: number) => {
        const {
          createdTrapCoordinatesResponse,
          createdTrapVisitCrewResponse,
          createdTrapVisitEnvironmentalResponse,
          createdTrapVisitResponse,
          stagedForSubmission,
        } = response || {}

        if (!createdTrapVisitResponse) {
          return
        }

        const trapVisitId = createdTrapVisitResponse.id
        const qcCompleted = createdTrapVisitResponse.qcCompleted
        const createdAt = new Date(createdTrapVisitResponse.createdAt)
        const normalizedDate = normalizeDate(createdAt)

        if (trapVisitId) {
          let temp = createdTrapVisitEnvironmentalResponse
            ? createdTrapVisitEnvironmentalResponse.filter((item: any) => {
                return item.measureName === 'water temperature'
              })[0]
            : null

          if (temp) {
            tempData.push({
              id: trapVisitId,
              x: normalizedDate,
              y: Number(temp.measureValueNumeric),
              colorScale: stagedForSubmission
                ? '#FBA72A'
                : !qcCompleted
                ? 'rgb(255, 100, 84)'
                : undefined,
            })
          }

          let turbidity = createdTrapVisitEnvironmentalResponse
            ? createdTrapVisitEnvironmentalResponse.filter((item: any) => {
                return item.measureName === 'water turbidity'
              })[0]
            : null

          if (turbidity) {
            turbidityData.push({
              id: trapVisitId,
              x: normalizedDate,
              y: Number(turbidity.measureValueNumeric),
              colorScale: stagedForSubmission
                ? '#FBA72A'
                : !qcCompleted
                ? 'rgb(255, 100, 84)'
                : undefined,
            })
          }

          if (createdTrapVisitResponse.rpmAtStart) {
            let rpmAtStart = {
              id: trapVisitId,
              x: normalizedDate,
              y: Number(response.createdTrapVisitResponse.rpmAtStart),
              colorScale: stagedForSubmission
                ? '#FBA72A'
                : !qcCompleted
                ? 'rgb(255, 100, 84)'
                : undefined,
            }

            rpmAtStartData.push(rpmAtStart)
          }

          if (createdTrapVisitResponse.rpmAtEnd) {
            let rpmAtEnd = {
              id: trapVisitId,
              x: normalizedDate,
              y: Number(createdTrapVisitResponse.rpmAtEnd),
              colorScale: stagedForSubmission
                ? '#FBA72A'
                : !qcCompleted
                ? 'rgb(255, 100, 84)'
                : undefined,
            }
            rpmAtEndData.push(rpmAtEnd)
          }

          if (createdTrapVisitResponse.totalRevolutions) {
            let counter = {
              id: trapVisitId,
              x: normalizedDate,
              y: createdTrapVisitResponse.totalRevolutions,
              colorScale: stagedForSubmission
                ? '#FBA72A'
                : !qcCompleted
                ? 'rgb(255, 100, 84)'
                : undefined,
            }
            counterData.push(counter)
          }

          if (createdTrapVisitResponse.debrisVolumeGal) {
            let debris = {
              id: trapVisitId,
              x: normalizedDate,
              y: createdTrapVisitResponse.debrisVolumeGal,
              colorScale: stagedForSubmission
                ? '#FBA72A'
                : !qcCompleted
                ? 'rgb(255, 100, 84)'
                : undefined,
            }
            debrisData.push(debris)
          }
        }
      }
    )

    setGraphData({
      Temperature: tempData,
      Turbidity: turbidityData,
      'RPM At Start': rpmAtStartData,
      'RPM At End': rpmAtEndData,
      Counter: counterData,
      Debris: debrisData,
    })
  }, [qcTrapVisitSubmissions])

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName:
      | 'Temperature'
      | 'Turbidity'
      | 'RPM At Start'
      | 'RPM At End'
      | 'Counter'
      | 'Debris'
  }) => {
    return (
      <Button
        bg={activeButtons.includes(buttonName) ? 'primary' : 'secondary'}
        marginX={0.5}
        flex={1}
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
          fontSize={13}
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
    console.log('point clicked: ', datum)
    setPointClicked(datum)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (submission: any) => {
    if (pointClicked) {
      const trapVisitId = submission['Temperature']['id']
      dispatch(
        trapVisitQCSubmission({
          trapVisitId,
          userId: userCredentialsStore.id,
          submission,
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
            headerText={'QC Environmental & Trap Operations'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on a plot below. Red points
            indicate records that have not been QC'd, while the gray points
            indicate records that have been QC'd and approved.
          </Text>

          <HStack w={'full'} justifyContent='space-evenly' mb={'10'}>
            <GraphMenuButton buttonName={'Temperature'} />
            <GraphMenuButton buttonName={'Turbidity'} />
            <GraphMenuButton buttonName={'RPM At Start'} />
            <GraphMenuButton buttonName={'RPM At End'} />
            <GraphMenuButton buttonName={'Counter'} />
            <GraphMenuButton buttonName={'Debris'} />
          </HStack>

          <ScrollView>
            {activeButtons.map(buttonName => {
              return (
                <Graph
                  xLabel={axisLabelDictionary[buttonName]['xLabel']}
                  yLabel={axisLabelDictionary[buttonName]['yLabel']}
                  key={buttonName}
                  chartType='bar'
                  data={graphData[buttonName]}
                  showDates={true}
                  onPointClick={datum => handlePointClicked(datum)}
                  title={buttonName}
                  barColor='grey'
                  selectedBarColor='green'
                  height={400}
                  width={600}
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
            modalData={graphData}
          />
        </CustomModal>
      ) : (
        <></>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    qcTrapVisitSubmissions:
      state.trapVisitFormPostBundler.qcTrapVisitSubmissions,
    previousTrapVisits:
      state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(TrapQC)
