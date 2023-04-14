import { Formik } from 'formik'
import {
  Box,
  Button,
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
import {
  postMarkRecaptureSubmissions,
  saveMarkRecaptureSubmission,
} from '../../redux/reducers/postSlices/markRecapturePostBundler'
import { flatten, uniq } from 'lodash'
import { resetReleaseTrialDataEntrySlice } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { resetReleaseTrialSlice } from '../../redux/reducers/markRecaptureSlices/releaseTrialSlice'

const mapStateToProps = (state: RootState) => {
  return {
    releaseTrialState: state.releaseTrial,
    releaseTrialDataEntryState: state.releaseTrialDataEntry,
    visitSetupState: state.visitSetup,
    visitSetupDefaultsState: state.visitSetupDefaults,
    connectivityState: state.connectivity,
    tabState: state.tabSlice,
    dropdownsState: state.dropdowns,
  }
}

const ReleaseDataEntry = ({
  navigation,
  releaseTrialState,
  releaseTrialDataEntryState,
  visitSetupDefaultsState,
  connectivityState,
  dropdownsState,
}: {
  navigation: any
  releaseTrialState: any
  releaseTrialDataEntryState: any
  visitSetupDefaultsState: any
  connectivityState: any
  dropdownsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [markedTime, setMarkedTime] = useState(new Date() as any)
  const [releaseTime, setReleaseTime] = useState(new Date() as any)
  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)
  const filteredReleaseSites = visitSetupDefaultsState.releaseSites.filter(
    (releaseSite: any) =>
      releaseTrialDataEntryState.values.trapLocationIds.indexOf(
        releaseSite.trapLocationsId
      ) !== -1
  )

  const onReleaseTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setReleaseTime(currentDate)
  }
  const onMarkedTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setMarkedTime(currentDate)
  }

  const returnNullableTableId = (value: any) => (value == -1 ? null : value + 1)

  const returnDefinitionArray = (dropdownsArray: any[]) => {
    return dropdownsArray.map((dropdownObj: any) => {
      return dropdownObj.definition
    })
  }

  const saveMarkRecaptureSubmissions = (formValues: any) => {
    const runValues = returnDefinitionArray(dropdownsState.values.run)
    const markTypeValues = returnDefinitionArray(dropdownsState.values.markType)
    const markColorValues = returnDefinitionArray(
      dropdownsState.values.markColor
    )
    const bodyPartValues = returnDefinitionArray(dropdownsState.values.bodyPart)
    const releaseSiteValues = visitSetupDefaultsState.releaseSites.map(
      (releaseSiteObj: any) => {
        return releaseSiteObj.releaseSiteName
      }
    )
    //crew data lookup (string => ID)
    const selectedCrewNamesMap: Record<string, boolean> =
      releaseTrialDataEntryState.values.crew.reduce(
        (acc: Record<string, boolean>, name: string) => ({
          ...acc,
          [name]: true,
        }),
        {}
      )

    const allCrewObjects = flatten(visitSetupDefaultsState.crewMembers)
    const selectedCrewIds = uniq(
      allCrewObjects
        .filter(
          (obj: any) => selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
        )
        .map((obj: any) => obj.personnelId)
    )

    const markRecaptureSubmission = {
      programId: releaseTrialDataEntryState.values.programId,
      // releasePurposeId: null, //left as null
      releaseSiteId: returnNullableTableId(
        releaseSiteValues.indexOf(formValues.releaseLocation)
      ),
      releasedAt: releaseTime,
      markedAt: markedTime,
      marksArray: releaseTrialDataEntryState.values.appliedMarks.map(
        (markObj: any) => {
          return {
            markType: returnNullableTableId(
              markTypeValues.indexOf(markObj.markType)
            ),
            markColor: returnNullableTableId(
              markColorValues.indexOf(markObj.markColor)
            ),
            bodyPart: returnNullableTableId(
              bodyPartValues.indexOf(markObj.markPosition)
            ),
          }
        }
      ),
      runHatcheryFish: returnNullableTableId(
        runValues.indexOf(releaseTrialState.values.runIDHatchery)
      ),
      hatcheryFishWeight: Number(releaseTrialState.values.runWeightHatchery),
      totalWildFishReleased: Number(releaseTrialState.values.wildCount),
      totalHatcheryFishReleased: Number(releaseTrialState.values.hatcheryCount),
      totalWildFishDead: Number(releaseTrialState.values.deadWildCount),
      totalHatcheryFishDead: Number(releaseTrialState.values.deadHatcheryCount),
      releaseCrew: selectedCrewIds,
    }

    dispatch(saveMarkRecaptureSubmission(markRecaptureSubmission))
    if (connectivityState.isConnected) {
      console.log('CONNECTED')
      dispatch(postMarkRecaptureSubmissions())
    }
  }

  const handleSubmit = (values: any) => {
    try {
      dispatch(
        saveReleaseTrialDataEntry({
          ...values,
          releaseTime: releaseTime,
          markedTime: markedTime,
        })
      )

      dispatch(markReleaseTrialDataEntryCompleted(true))

      saveMarkRecaptureSubmissions(values)
      // resetAllFormSlices()
    } catch (error) {
      console.error(error)
    }
  }

  // const resetAllFormSlices = () => {
  //   dispatch(resetReleaseTrialSlice())
  //   dispatch(resetReleaseTrialDataEntrySlice())
  // }

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
                  selectOptions={filteredReleaseSites?.map(
                    (releaseSite: any) => ({
                      label: releaseSite?.releaseSiteName,
                      value: releaseSite?.releaseSiteName,
                    })
                  )}
                />
                {touched.releaseLocation &&
                  errors.releaseLocation &&
                  RenderErrorMessage(errors, 'releaseLocation')}
              </FormControl>
              <VStack space={2}>
                <Text color='black' fontSize='xl'>
                  Confirm Marked Date and Time:
                </Text>
                <Box alignSelf='flex-start' minWidth='320' ml='-105'>
                  <DateTimePicker
                    value={markedTime}
                    mode='datetime'
                    onChange={onMarkedTimeChange}
                    accentColor='#007C7C'
                  />
                </Box>
              </VStack>
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
              <Button
                bg='grey'
                onPress={() => saveMarkRecaptureSubmissions(values)}
              >
                Test save to store
              </Button>
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
              closeModal={() => setAddMarkModalOpen(false)}
            />
          </CustomModal>
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ReleaseDataEntry)
