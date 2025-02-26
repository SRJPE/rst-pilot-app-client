import {
  Button,
  Divider,
  FormControl,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from 'native-base'
import ReportCard from '../../components/generateReport/ReportCard'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import { generateWordDocument } from '../../components/generateReport/ReportGenerator'
import {
  getBiWeeklyPassageSummary,
  updateMostRecentReportFilePath,
} from '../../redux/reducers/generateReportSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import React, { useEffect, useState } from 'react'
import DocumentViewer from '../../components/Shared/DocumentViewer'

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
