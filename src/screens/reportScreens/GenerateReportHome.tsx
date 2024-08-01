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
import { generateWordDocument } from '../../components/generateReport/ReportGenerator'

const GenerateReportHome = ({ navigation }: { navigation: any }) => {
  const tempData = {
    systemDate: new Date().toLocaleString(),
    programLead: 'FLOWWEST TEST',
    programLeadAgency: 'TEST AGENCY',
    streamName: 'TEST STREAM',
    programRunDesignationMethod: 'TEST RUN METHOD',
    programLeadPhoneNumber: '(123) 456-7890',
    programLeadEmail: 'TEST@EMAIL.COM',
    systemWeek: 'TEST WEEK',
  }

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
          <Button bg='primary' onPress={() => generateWordDocument(tempData)}>
            Generate PDF
          </Button>
        </VStack>
      </View>
      <GenerateReportNavButtons navigation={navigation} />
    </>
  )
}
export default GenerateReportHome
