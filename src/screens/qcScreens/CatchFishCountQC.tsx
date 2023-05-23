import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'

export default function CatchFishCountQC({ navigation }: { navigation: any }) {
  const data = [
    { label: 'Point 1', x: 1, y: 10, extraInfo: 'woop woop!' },
    { label: 'Point 2', x: 2, y: 20, extraInfo: 'woop woop!' },
    { label: 'Point 3', x: 3, y: 15, extraInfo: 'woop woop!' },
    { label: 'Point 4', x: 4, y: 25, extraInfo: 'woop woop!' },
    { label: 'Point 5', x: 5, y: 12, extraInfo: 'woop woop!' },
  ]

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
              chartType='line'
              data={data}
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
