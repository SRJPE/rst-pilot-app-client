import { Formik } from 'formik'
import {
  Box,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import MarkRecaptureNavButtons from '../../components/markRecapture/MarkRecaptureNavButtons'
import CustomSelect from '../../components/Shared/CustomSelect'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import { AppDispatch, RootState } from '../../redux/store'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { releaseTrialDataEntrySchema } from '../../utils/helpers/yupValidations'
import {
  markReleaseTrialDataEntryCompleted,
  saveReleaseTrialDataEntry,
} from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { markActiveMarkRecaptureStepCompleted } from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'
import CustomModal from '../../components/Shared/CustomModal'
import AddAnotherMarkModalContent from '../../components/Shared/AddAnotherMarkModalContent'
import MarkBadgeList from '../../components/markRecapture/MarkBadgeList'

const mapStateToProps = (state: RootState) => {
  return {
    releaseTrialDataEntryState: state.releaseTrialDataEntry,
    visitSetupDefaultsState: state.visitSetupDefaults,
  }
}

const ReleaseDataEntry = ({
  navigation,
  releaseTrialDataEntryState,
  visitSetupDefaultsState,
}: {
  navigation: any
  releaseTrialDataEntryState: any
  visitSetupDefaultsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const { trapLocations } = visitSetupDefaultsState
  const [releaseTime, setReleaseTime] = useState(new Date() as any)
  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)

  const onReleaseTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setReleaseTime(currentDate)
  }

  const handleSubmit = (values: any) => {
    dispatch(saveReleaseTrialDataEntry({ ...values, releaseTime: releaseTime }))
    dispatch(markReleaseTrialDataEntryCompleted(true))
    dispatch(markActiveMarkRecaptureStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ ReleaseTrialDataEntry', values)
  }

  return (
    <Formik
      validationSchema={releaseTrialDataEntrySchema}
      initialValues={releaseTrialDataEntryState.values}
      onSubmit={(values) => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        touched,
        errors,
        values,
      }) => (
        <>
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={6}>
              <Heading>Describe marks applied for efficiency trial:</Heading>

              <MarkBadgeList
                badgeListContent={
                  releaseTrialDataEntryState.values.appliedMarks
                }
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

              <Pressable onPress={() => setAddMarkModalOpen(true)}>
                <HStack alignItems='center'>
                  <Icon
                    as={Ionicons}
                    name={'add-circle'}
                    size='3xl'
                    color='primary'
                    marginRight='1'
                  />
                  <Text color='primary' fontSize='xl'>
                    Add Mark
                  </Text>
                </HStack>
              </Pressable>

              <Divider bg='black' />
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Confirm Release Location
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.releaseLocation}
                  placeholder='Location'
                  onValueChange={handleChange('releaseLocation')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={trapLocations?.map((trapLocation: any) => ({
                    label: trapLocation?.siteName,
                    value: trapLocation?.siteName,
                  }))}
                />
                {touched.releaseLocation &&
                  errors.releaseLocation &&
                  RenderErrorMessage(errors, 'releaseLocation')}
              </FormControl>
              <VStack space={2}>
                <Text color='black' fontSize='xl'>
                  Confirm Release Date and Time:
                </Text>
                <Box alignSelf='flex-start' minWidth='320' ml='-105'>
                  <DateTimePicker
                    value={releaseTime}
                    mode='datetime'
                    onChange={onReleaseTimeChange}
                    accentColor='#007C7C'
                  />
                </Box>
              </VStack>
            </VStack>
          </View>
          <MarkRecaptureNavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
          />
          {/* --------- Modals --------- */}
          <CustomModal
            isOpen={addMarkModalOpen}
            closeModal={() => setAddMarkModalOpen(false)}
            height='1/2'
          >
            <AddAnotherMarkModalContent
              //add new submission function
              // handleGeneticSampleFormSubmit={handleGeneticSampleFormSubmit}
              closeModal={() => setAddMarkModalOpen(false)}
            />
          </CustomModal>
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ReleaseDataEntry)
