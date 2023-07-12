import { useEffect, useState } from 'react'
import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { catchRawQCSubmission } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'

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
    let forkLengthData: any[] = []
    let weightData: any[] = []
    

    qcData.forEach((catchResponse: any, idx: number) => {
      const catchRawId: number = catchResponse.createdCatchRawResponse.id
      const qcCompleted: any = catchResponse.createdCatchRawResponse.qcCompleted
      const qcNotStarted: boolean = qcCompleted ? false : true

      let forkLength = catchResponse.createdCatchRawResponse.forkLength
      let weight = catchResponse.createdCatchRawResponse.weight

      if (forkLength && catchRawId) {
        forkLengthData.push({
          id: catchRawId,
          x: idx + 1,
          y: Number(forkLength),
          colorScale: qcNotStarted ? 'red' : undefined,
        })
      }

      if (weight && catchRawId) {
        weightData.push({
          id: catchRawId,
          x: idx + 1,
          y: Number(weight),
          colorScale: qcNotStarted ? 'red' : undefined,
        })
      }
    })

    setGraphData({
      'Fork Length': forkLengthData,
      Weight: weightData,
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
  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(CatchMeasureQC)
