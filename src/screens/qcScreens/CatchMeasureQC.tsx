import { useEffect, useState } from 'react'
import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { catchRawQCSubmission } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { GaussKDE } from '../../utils/utils'

interface GraphDataI {
  'Fork Length': any[]
  Weight: any[]
}

function CatchMeasureQC({
  navigation,
  route,
  qcCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [activeButtons, setActiveButtons] = useState<
    ('Fork Length' | 'Weight')[]
  >(['Fork Length'])
  const [graphData, setGraphData] = useState<GraphDataI>({
    'Fork Length': [],
    Weight: [],
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)

  useEffect(() => {
    const previousCatchRaw = route.params.previousCatchRaw
    const qcData = [...qcCatchRawSubmissions, ...previousCatchRaw]

    let N = qcData.length
    let range: number | null = null
    let startPoint: number | null = null
    
    // Fork Length Calculations
    let xiDataOne: any[] = []
    const forkLengthArray: any[] = qcData.map((catchRawResponse) => {
      return Number(catchRawResponse.createdCatchRawResponse.forkLength)
    })
    startPoint = Math.min(...forkLengthArray)
    range = Math.max(...forkLengthArray) - startPoint
    for (let i = 0; i < range; i++) {
      xiDataOne[i] = startPoint + i
    }
    const forkLengthPayload: any[] = []
    for (let i = 0; i < xiDataOne.length; i++) {
      let forkLength = 0
      qcData.forEach((catchRawResponse) => {
        forkLength =
          forkLength +
          GaussKDE(
            xiDataOne[i],
            catchRawResponse.createdCatchRawResponse.forkLength
          )
        forkLengthPayload.push([xiDataOne[i], (1 / N) * forkLength])
      })
    }
    let forkLengthGraphData = forkLengthPayload.map((arr) => {
      let x = arr[0]
      let y = arr[1]
      return {
        x,
        y,
      }
    })

    // Weight Calculations
    let xiDataTwo: any[] = []
    const weightArray: any[] = qcData.map((catchRawResponse) => {
      return Number(catchRawResponse.createdCatchRawResponse.weight)
    })
    startPoint = Math.min(...weightArray)
    range = Math.max(...weightArray) - startPoint
    for (let i = 0; i < range; i++) {
      xiDataTwo[i] = startPoint + i
    }
    const weightPayload: any[] = []
    for (let i = 0; i < xiDataTwo.length; i++) {
      let weight = 0
      qcData.forEach((catchRawResponse) => {
        weight =
          weight +
          GaussKDE(
            xiDataTwo[i],
            catchRawResponse.createdCatchRawResponse.weight
          )
        weightPayload.push([xiDataTwo[i], (1 / N) * weight])
      })
    }
    let weightGraphData = weightPayload.map((arr) => {
      let x = arr[0]
      let y = arr[1]
      return {
        x,
        y,
      }
    })

    setGraphData({
      'Fork Length': forkLengthGraphData,
      Weight: weightGraphData,
    })
  }, [qcCatchRawSubmissions])

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName: 'Fork Length' | 'Weight'
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
    console.log('point clicked: ', datum)
    setPointClicked(datum)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (submission: any) => {
    if (pointClicked) {
      const catchRawId = submission['Weight']['id']
      dispatch(catchRawQCSubmission({ catchRawId, submission }))
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
            headerText={'Fork Length, Weight, Lifestage, Run'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on the plot below. Grey density
            lines show historic fork length distribution
          </Text>

          <HStack mb={'10'}>
            <GraphMenuButton buttonName={'Fork Length'} />
            <GraphMenuButton buttonName={'Weight'} />
            <View flex={3}></View>
          </HStack>

          <ScrollView>
            {activeButtons.map((buttonName) => {
              return (
                <Graph
                  key={buttonName}
                  zoomDomain={{ x: [0, 60], y: [0, 0.3] }}
                  chartType='line'
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
  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(CatchMeasureQC)
