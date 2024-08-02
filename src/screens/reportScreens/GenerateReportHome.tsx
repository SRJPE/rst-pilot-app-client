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
import { getBiWeeklyPassageSummary } from '../../redux/reducers/generateReportSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useEffect } from 'react'

const GenerateReportHome = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const biWeeklyPassageSummaryStore = useSelector(
    (state: RootState) => state.generateReports
  )

  useEffect(() => {
    if (biWeeklyPassageSummaryStore.status === 'fulfilled') {
      console.log(
        '🚀 ~ GenerateReportHome ~ BiWeeklyPassageSummaryStore:',
        biWeeklyPassageSummaryStore
      )
      generateWordDocument(biWeeklyPassageSummaryStore)
    }
  }, [biWeeklyPassageSummaryStore])

  const handleGenerateReport = () => {
    dispatch(getBiWeeklyPassageSummary(1)) //change to selected program ID
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
          <Button
            bg='primary'
            onPress={
              // () => generateWordDocument(tempData)
              handleGenerateReport
            }
          >
            Generate PDF
          </Button>
        </VStack>
      </View>
      <GenerateReportNavButtons navigation={navigation} />
    </>
  )
}
export default GenerateReportHome
