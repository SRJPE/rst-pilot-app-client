import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { RootState } from '../../redux/store'

function CatchFishCountQC({
  navigation,
  route,
  qcCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
}) {
  const [graphData, setGraphData] = useState<any[]>([])

  useEffect(() => {
    const previousCatchRaw = route.params.previousCatchRaw
    const qcData = [...qcCatchRawSubmissions, ...previousCatchRaw]
    const totalCountByDay: any[] = []
    const datesFormatted: any = {}

    qcData.forEach((catchResponse) => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const numFishCaught = catchRaw?.numFishCaught
      const createdAtString = new Date(catchRaw?.createdAt).toDateString()

      if (Object.keys(datesFormatted).includes(createdAtString)) {
        datesFormatted[createdAtString] += numFishCaught
      } else {
        datesFormatted[createdAtString] = numFishCaught
      }
    })

    Object.keys(datesFormatted).forEach((dateString) => {
      totalCountByDay.push({
        x: dateString,
        y: datesFormatted[dateString]
      })
    })

    setGraphData(totalCountByDay)
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
              chartType='bar'
              data={graphData}
              barColor='grey'
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
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(CatchFishCountQC)
