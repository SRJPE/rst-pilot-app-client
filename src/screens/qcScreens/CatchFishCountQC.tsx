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
} from 'native-base'
import { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { AppDispatch, RootState } from '../../redux/store'
import { normalizeDate } from '../../utils/utils'

function CatchFishCountQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
  previousCatchRawSubmissions: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [graphData, setGraphData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter(
      (catchRaw: any) => {
        return catchRaw.createdCatchRawResponse.programId === programId
      }
    )
    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]
    const totalCountByDay: any[] = []
    const datesFormatted: any = {}

    qcData.forEach(catchResponse => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const numFishCaught = catchRaw?.numFishCaught
      const createdAt = new Date(catchRaw.createdAt)
      const normalizedDate = normalizeDate(createdAt)

      if (Object.keys(datesFormatted).includes(String(normalizedDate))) {
        datesFormatted[normalizedDate] += numFishCaught
      } else {
        datesFormatted[normalizedDate] = numFishCaught
      }
    })

    Object.keys(datesFormatted).forEach(dateString => {
      totalCountByDay.push({
        x: Number(dateString),
        y: datesFormatted[dateString],
      })
    })

    setGraphData(totalCountByDay)
  }, [qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
    console.log('point clicked: ', datum)
    console.log('graphData', graphData)
    setPointClicked(datum)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPointClicked(null)
  }

  const handleModalSubmit = (submission: any) => {
    if (pointClicked) {
      // const ids = Object.keys(submission).map((key: string) => {
      //   if (submission[key]) {
      //     return submission[key]['id']
      //   }
      // })
      // const catchRawId = ids.find((val) => Boolean(Number(val)))
      // dispatch(catchRawQCSubmission({ catchRawId, submission }))
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
            Edit values by selecting a point on the plot below. Gray lineplots
            show total daily counts for the past 5 years.
          </Text>

          <ScrollView>
            <Graph
              xLabel={'Date'}
              yLabel={'Total Daily Catch'}
              chartType='bar'
              data={graphData}
              showDates={true}
              barColor='grey'
              onPointClick={datum => handlePointClick(datum)}
              selectedBarColor='green'
              height={400}
              width={600}
            />
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
            headerText={'Plus Count Editor'}
            modalData={{ 'Total Daily Count': graphData }}
            showHeaderButton={true}
          >
            <VStack
              paddingX={20}
              justifyContent='center'
              justifyItems={'center'}
            >
              <Text color='black' fontSize='2xl' mb={5} fontWeight={'light'}>
                You collected <Text fontWeight={'bold'}>100 measured</Text> fish
                and <Text fontWeight={'bold'}>30000 plus count</Text> fish.
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
                  // onChangeText={handleChange('comments')}
                  // onBlur={handleBlur('comments')}
                  value={'Flag Comment (optional)'}
                />
              </HStack>

              <View mt='50px'>
                <Text>Edit numeric Inout</Text>
                <Input
                  height='50px'
                  width='350px'
                  fontSize='16'
                  placeholder='Write a comment'
                  keyboardType='default'
                  // onChangeText={handleChange('comments')}
                  // onBlur={handleBlur('comments')}
                  value={'testing'}
                />
              </View>
            </VStack>
          </GraphModalContent>
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
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(CatchFishCountQC)
