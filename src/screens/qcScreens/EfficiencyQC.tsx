import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { RootState } from '../../redux/store'

function EfficiencyQC({
  navigation,
  route,
  qcCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
}) {
  const [graphData, setGraphData] = useState<any[]>([])

  const data = [
    { label: 'Point 1', x: 1, y: 10, extraInfo: 'woop woop!' },
    { label: 'Point 2', x: 2, y: 20, extraInfo: 'woop woop!' },
    { label: 'Point 3', x: 3, y: 15, extraInfo: 'woop woop!' },
    { label: 'Point 4', x: 4, y: 25, extraInfo: 'woop woop!' },
    { label: 'Point 5', x: 5, y: 12, extraInfo: 'woop woop!' },
  ]

  useEffect(() => {
    const previousCatchRaw = route.params.previousCatchRaw
    const qcData = [...qcCatchRawSubmissions, ...previousCatchRaw]
    const graphDataPayload: any[] = []

    qcData.forEach((catchRawResponse: any, idx: number) => {
      const catchRaw = catchRawResponse.createdCatchRawResponse
      const release = catchRawResponse.releaseResponse

      const numFishCaught: number = catchRaw.numFishCaught
      const releaseId: number | null = catchRaw.releaseId
      const catchRawId = catchRaw.id

      let numberReleased = 0
      let numberRecaptured = 0

      if (releaseId) {
        if (Object.keys(release)) {
          numberReleased =
            Number(release.totalWildFishReleased) +
            Number(release.totalHatcheryFishReleased)
        }
      } else {
        numberRecaptured = numFishCaught
      }

      console.log('numberRecaptured: ', numberRecaptured)
      console.log('numberReleased: ', numberReleased)
      // RIGHT
      console.log(
        'numberRecaptured over numberReleased: ',
        numberRecaptured / numberReleased
      )
      // WRONG 
      console.log(
        'numberReleased over numberRecaptured: ',
        numberReleased / numberRecaptured
      )

      graphDataPayload.push({
        id: catchRawId,
        x: idx + 1,
        y: numberReleased / numberRecaptured,
      })
    })

    setGraphData(graphDataPayload)
  }, [qcCatchRawSubmissions])

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

          <ScrollView>
            <Graph
              chartType='line'
              data={graphData}
              barColor='grey'
              selectedBarColor='green'
              height={400}
              width={600}
              zoomDomain={{ y: [0, 1] }}
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
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(EfficiencyQC)
