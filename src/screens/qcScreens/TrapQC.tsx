import { useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Text, View, VStack } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { ScrollView } from 'react-native-gesture-handler'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { trapVisitQCSubmission } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import sampleWaterTurbidityData from './sample_trap_visit_env_data'

interface GraphDataI {
  Temperature: any[]
  Turbidity: any[]
  'RPM At Start': any[]
  'RPM At End': any[]
  Counter: any[]
  Debris: any[]
}

function TrapQC({
  navigation,
  cachedTrapVisits,
}: {
  navigation: any
  cachedTrapVisits: any[]
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

  useEffect(() => {
    let tempData: any[] = []
    let turbidityData: any[] = []
    let rpmAtStartData: any[] = []
    let rpmAtEndData: any[] = []
    let counterData: any[] = []
    let debrisData: any[] = []

    Object.values(cachedTrapVisits).forEach((response: any, idx: number) => {
      const trapVisitId = response.createdTrapCoordinatesResponse.trapVisitId

      let temp = response.createdTrapVisitEnvironmentalResponse.filter(
        (item: any) => {
          return item.measureName === 'water temperature'
        }
      )[0]
      tempData.push({
        trapVisitId,
        x: idx + 1,
        y: Number(temp.measureValueNumeric),
      })

      let turbidity = response.createdTrapVisitEnvironmentalResponse.filter(
        (item: any) => {
          return item.measureName === 'water turbidity'
        }
      )[0]
      turbidityData.push({
        trapVisitId,
        x: idx + 1,
        y: Number(turbidity.measureValueNumeric),
      })

      let rpmAtStart = {
        trapVisitId,
        x: idx + 1,
        y: Number(response.createdTrapVisitResponse.rpmAtStart),
      }
      rpmAtStartData.push(rpmAtStart)

      let rpmAtEnd = {
        trapVisitId,
        x: idx + 1,
        y: Number(response.createdTrapVisitResponse.rpmAtEnd),
      }
      rpmAtEndData.push(rpmAtEnd)

      let counter = {
        trapVisitId,
        x: idx + 1,
        y: response.createdTrapVisitResponse.totalRevolutions,
      }
      counterData.push(counter)

      let debris = {
        trapVisitId,
        x: idx + 1,
        y: response.createdTrapVisitResponse.debrisVolumeLiters,
      }
      debrisData.push(debris)
    })

    // sampleWaterTurbidityData.forEach((envItem, idx) => {
    //   turbidityData.push({
    //     trapVisitId: envItem.trapVisitId,
    //     x: idx + 1,
    //     y: Number(envItem.measureValueNumeric),
    //   })
    // })

    setGraphData({
      Temperature: tempData,
      Turbidity: turbidityData,
      'RPM At Start': rpmAtStartData,
      'RPM At End': rpmAtEndData,
      Counter: counterData,
      Debris: debrisData,
    })
  }, [cachedTrapVisits])

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
          let activeButtonsCopy = [...activeButtons]
          if (activeButtons.includes(buttonName)) {
            activeButtonsCopy.splice(activeButtonsCopy.indexOf(buttonName), 1)
            setActiveButtons(activeButtonsCopy)
          } else {
            activeButtonsCopy.unshift(buttonName)
            setActiveButtons(activeButtonsCopy)
          }
        }}
      >
        <Text
          fontSize='sm'
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
      const trapVisitId = submission['Temperature']['trapVisitId']
      dispatch(trapVisitQCSubmission({ trapVisitId, submission }))
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
            Edit values by selecting a point on a plot below.
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
            {activeButtons.map((buttonName) => {
              return (
                <Graph
                  key={buttonName}
                  chartType='bar'
                  data={graphData[buttonName]}
                  onPointClick={(datum) => handlePointClicked(datum)}
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
                console.log('approve')
              }}
            >
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Approve
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
  let cachedTrapVisits = [
    ...state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
    ...state.trapVisitFormPostBundler.qcTrapVisitSubmissions,
  ]

  return {
    cachedTrapVisits: cachedTrapVisits ?? [],
  }
}

export default connect(mapStateToProps)(TrapQC)
