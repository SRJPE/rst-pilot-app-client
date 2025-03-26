import { Divider, Heading, HStack, View, VStack, Spacer } from 'native-base'
import ReportCard from '../../components/generateReport/ReportCard'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import React from 'react'

const GenerateReportHome = ({ navigation }: { navigation: any }) => {
  const navigateTo = (screen: string) => navigation.navigate(screen)

  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={6}>
          <Heading>Select a standard report to generate</Heading>

          <Divider bg='black' />
          <HStack
            my='5'
            justifyContent='space-between'
            flexWrap='wrap'
            space={4}
          >
            <ReportCard
              title='Bi-Weekly Passage Summary'
              description='Preliminary daily estimates of passage, 90% confidence intervals, and fork length ranges of unmarked juvenile salmonids sampled at specified program site.'
              onPress={() => navigateTo('Share Report')}
            />
          </HStack>
        </VStack>
      </View>
      <GenerateReportNavButtons navigation={navigation} />
    </>
  )
}
export default GenerateReportHome
