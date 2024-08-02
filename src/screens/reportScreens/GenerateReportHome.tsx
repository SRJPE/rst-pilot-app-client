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
import { getBiWeeklyPassageSummary } from '../../redux/reducers/generateReportSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useEffect } from 'react'
import CustomSelect from '../../components/Shared/CustomSelect'
import { Formik } from 'formik'

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
      // generateWordDocument(biWeeklyPassageSummaryStore)
    }
  }, [biWeeklyPassageSummaryStore])

  const handleGenerateReport = () => {
    dispatch(getBiWeeklyPassageSummary(1)) //change to selected program ID
  }

  return (
    <Formik
      // validationSchema={setUpNewProgramSchema}
      initialValues={{
        programName: 'Mill Creek RST Monitoring',
      }}
      onSubmit={(values) => {
        // SubmitNewMonitoringProgramValues(values)
      }}
    >
      {({ handleChange, setFieldTouched, values }) => (
        <>
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={6}>
              <Heading>Select a standard report to share</Heading>

              <Divider bg='black' />
              <HStack my='5' space='10' alignSelf='center'>
                {[1].map((i) => (
                  <ReportCard key={i} navigation={navigation} />
                ))}
              </HStack>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    What monitoring program are you generating a report for?
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.programName}
                  placeholder='Program name'
                  onValueChange={handleChange('frequency')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={[
                    { id: 1, definition: 'Mill Creek RST Monitoring' },
                    { id: 2, definition: 'Deer Creek RST Monitoring' },
                  ]}
                />
              </FormControl>
              <Button bg='primary' onPress={handleGenerateReport}>
                Generate PDF
              </Button>
            </VStack>
          </View>
          <GenerateReportNavButtons navigation={navigation} />
        </>
      )}
    </Formik>
  )
}
export default GenerateReportHome
