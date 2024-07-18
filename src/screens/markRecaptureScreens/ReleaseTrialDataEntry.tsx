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
import { useState, useEffect } from 'react'
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
import { flatten, uniq, findIndex } from 'lodash'
import { ReleaseMarkI } from '../../redux/reducers/addAnotherMarkSlice'
import { returnDefinitionArray } from '../../utils/utils'

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

export interface MarkRecaptureSubmissionI {
  programId: number
  releasePurposeId?: null | null
  releaseSiteId: number
  releasedAt: Date
  markedAt: Date
  marksArray: Array<ReleaseMarkI>
  runHatcheryFish: number
  hatcheryFishWeight: number
  hatcheryFishForkLength: number
  totalWildFishReleased: number
  totalHatcheryFishReleased: number
  totalWildFishDead: number
  totalHatcheryFishDead: number
  releaseCrew: Array<string>
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
  const [recentReleaseMarks, setRecentReleaseMarks] = useState<any[]>([])
  const [preparedReleaseSites, setPreparedReleaseSites] = useState<any[]>([])
  const [filteredReleaseSites, setFilteredReleaseSites] = useState<any[]>([])
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const removeDuplicates = (obj: any[]) => {
    const uniqueObj: any[] = []
    const seenSet = new Set()
    for (const item of obj) {
      const releaseSiteName = item.releaseSiteName
      if (!seenSet.has(releaseSiteName)) {
        seenSet.add(releaseSiteName)
        uniqueObj.push(item)
      }
    }
    return uniqueObj
  }

  useEffect(() => {
    const preparedReleaseSites = removeDuplicates(
      visitSetupDefaultsState.releaseSites
    )
    const filteredReleaseSites = preparedReleaseSites.filter(
      (releaseSite: any) =>
        releaseTrialDataEntryState.trapLocationIds.indexOf(
          releaseSite.trapLocationsId
        ) !== -1
    )
    setPreparedReleaseSites(preparedReleaseSites)
    setFilteredReleaseSites(filteredReleaseSites)
  }, [
    visitSetupDefaultsState.releaseSites,
    releaseTrialDataEntryState.trapLocationsIds,
  ])

  const onReleaseTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setReleaseTime(currentDate)
  }
  const onMarkedTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setMarkedTime(currentDate)
  }

  const returnNullableTableId = (value: any) => (value == -1 ? null : value + 1)

  const runValues = returnDefinitionArray(dropdownValues.run)
  const markTypeValues = returnDefinitionArray(dropdownValues.markType)
  const markColorValues = returnDefinitionArray(dropdownValues.markColor)
  const bodyPartValues = returnDefinitionArray(dropdownValues.bodyPart)
  const releaseSiteValues = visitSetupDefaultsState.releaseSites.map(
    (releaseSiteObj: any) => {
      return releaseSiteObj.releaseSiteName
    }
  )
  const handlePressRecentReleaseMarkButton = (
    selectedRecentReleaseMark: any
  ) => {
    let updatedMarks = [...recentReleaseMarks]
    const indexOfSelectedMark = findIndex(
      updatedMarks,
      selectedRecentReleaseMark
    )

    // present, remove
    if (indexOfSelectedMark !== -1) {
      updatedMarks.splice(indexOfSelectedMark, 1)
    } else {
      updatedMarks.push(selectedRecentReleaseMark)
    }
    setRecentReleaseMarks(updatedMarks)
  }

  const decodedRecentReleaseMarks = (twoMostRecentReleaseMarks: any) => {
    return twoMostRecentReleaseMarks.map((mark: any) => {
      return {
        ...mark,
        markType: markTypeValues[mark.markType - 1],
        markColor: markColorValues[mark.markColor - 1],
        markPosition: bodyPartValues[mark?.markPosition - 1],
      }
    })
  }
  const saveMarkRecaptureSubmissions = (formValues: any) => {
    try {
      //crew data lookup (string => ID)
      const selectedCrewNamesMap: Record<string, boolean> =
        releaseTrialDataEntryState.crew.reduce(
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
            (obj: any) =>
              selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
          )
          .map((obj: any) => obj.personnelId)
      )

      const programIdOfReleaseLocation = preparedReleaseSites.find(
        (releaseSite: any) =>
          releaseSite.releaseSiteName === formValues.releaseLocation
      )?.programId

      const markRecaptureSubmission: MarkRecaptureSubmissionI = {
        programId:
          releaseTrialDataEntryState.programId || programIdOfReleaseLocation,
        // releasePurposeId: null, //left as null
        releaseSiteId: returnNullableTableId(
          releaseSiteValues.indexOf(formValues.releaseLocation)
        ),
        releasedAt: releaseTime,
        markedAt: markedTime,
        marksArray: [
          ...releaseTrialDataEntryState.values.appliedMarks,
          ...recentReleaseMarks,
        ].map((markObj: any) => {
          return {
            markType: returnNullableTableId(
              markTypeValues.indexOf(markObj.markType)
            ),
            markColor: returnNullableTableId(
              markColorValues.indexOf(markObj.markColor)
            ),
            markPosition: returnNullableTableId(
              bodyPartValues.indexOf(markObj.markPosition)
            ),
          }
        }),
        runHatcheryFish: returnNullableTableId(
          runValues.indexOf(releaseTrialState.values.runIDHatchery)
        ),
        hatcheryFishWeight: Number(releaseTrialState.values.runWeightHatchery),
        hatcheryFishForkLength: Number(
          releaseTrialState.values.runForkLengthHatchery
        ),
        totalWildFishReleased: Number(releaseTrialState.values.wildCount),
        totalHatcheryFishReleased: Number(
          releaseTrialState.values.hatcheryCount
        ),
        totalWildFishDead: Number(releaseTrialState.values.deadWildCount),
        totalHatcheryFishDead: Number(
          releaseTrialState.values.deadHatcheryCount
        ),
        releaseCrew: selectedCrewIds,
      }

      dispatch(saveMarkRecaptureSubmission(markRecaptureSubmission))
      if (connectivityState.isConnected) {
        console.log('CONNECTED')
        dispatch(postMarkRecaptureSubmissions())
      }
    } catch (error) {}
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
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Formik
      validationSchema={releaseTrialDataEntrySchema}
      initialValues={{
        ...releaseTrialDataEntryState.values,
        releaseLocation: filteredReleaseSites[0],
      }}
      onSubmit={values => {
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
        validateField,
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
              <VStack space={5}>
                {dropdownValues.twoMostRecentReleaseMarks.length > 0 &&
                  decodedRecentReleaseMarks(
                    dropdownValues.twoMostRecentReleaseMarks
                  ).map((recentReleaseMark: any, index: number) => {
                    const { id, markType, markColor, markPosition } =
                      recentReleaseMark
                    return (
                      <Button
                        key={index}
                        bg={
                          recentReleaseMarks.some((mark: any) => mark.id === id)
                            ? 'primary'
                            : 'secondary'
                        }
                        shadow='3'
                        borderRadius='5'
                        w='90%'
                        onPress={() => {
                          handlePressRecentReleaseMarkButton(recentReleaseMark)
                          validateField('appliedMarks')
                        }}
                      >
                        <Text
                          color={
                            recentReleaseMarks.some(
                              (mark: any) => mark.id === id
                            )
                              ? 'white'
                              : 'primary'
                          }
                          fontWeight='500'
                          fontSize='md'
                        >
                          {`${markType} - ${markColor} - ${markPosition}`}
                        </Text>
                      </Button>
                    )
                  })}
              </VStack>
              <MarkBadgeList
                badgeListContent={
                  releaseTrialDataEntryState.values.appliedMarks
                }
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                field='appliedMarks'
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
                  selectedValue={
                    values.releaseLocation?.releaseSiteName ||
                    values.releaseLocation
                  }
                  placeholder='Location'
                  onValueChange={handleChange('releaseLocation')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={preparedReleaseSites?.map(
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
              screenName={'markRecaptureRelease'}
            />
          </CustomModal>
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ReleaseDataEntry)
