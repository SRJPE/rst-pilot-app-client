import { Entypo } from '@expo/vector-icons'
import {
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from 'native-base'

import ReportCard from '../../components/generateReport/ReportCard'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'

const GenerateReportHome = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={6}>
          <Heading>Select a standard report to share</Heading>

          <Divider bg='black' />
          <HStack my='5' space='10' alignSelf='center'>
            {[1, 2, 3].map((i) => (
              <ReportCard key={i} navigation={navigation} />
            ))}
          </HStack>
        </VStack>
      </View>
      <GenerateReportNavButtons navigation={navigation} />
    </>
  )
}
export default GenerateReportHome
