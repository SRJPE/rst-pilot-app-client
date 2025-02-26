import { Divider, Heading, HStack, View, VStack } from 'native-base'
import ReportCard from '../../components/generateReport/ReportCard'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import React from 'react'

const GenerateReportHome = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={6}>
          <Heading>Select a standard report to generate</Heading>

          <Divider bg='black' />
          <HStack my='5' space='10' alignSelf='left'>
            <ReportCard navigation={navigation} />
          </HStack>
        </VStack>
      </View>
      <GenerateReportNavButtons navigation={navigation} />
    </>
  )
}
export default GenerateReportHome
