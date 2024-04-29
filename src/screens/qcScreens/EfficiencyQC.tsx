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
  previousCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any[]
  previousCatchRawSubmissions: any[]
}) {
  const [graphData, setGraphData] = useState<any[]>([])

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter((catchRaw: any) => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })
    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]
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

      graphDataPayload.push({
        id: catchRawId,
        x: idx + 1,
        y: numberReleased !== 0 ? numberRecaptured / numberReleased : 0,
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
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(EfficiencyQC)
