import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, Heading, ScrollView, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import navigationSlice, {
  checkIfFormIsComplete,
  markStepCompleted,
  numOfFormSteps,
  resetNavigationSlice,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import NavButtons from '../../components/formContainer/NavButtons'
import IncompleteSectionButton from '../../components/form/IncompleteSectionButton'
import {
  postTrapVisitFormSubmissions,
  saveCatchRawSubmissions,
  saveTrapVisitSubmission,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { resetGeneticSamplesSlice } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { resetMarksOrTagsSlice } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { resetFishInputSlice } from '../../redux/reducers/formSlices/fishInputSlice'
import { resetFishProcessingSlice } from '../../redux/reducers/formSlices/fishProcessingSlice'
import { resetTrapPostProcessingSlice } from '../../redux/reducers/formSlices/trapPostProcessingSlice'
import { resetTrapOperationsSlice } from '../../redux/reducers/formSlices/trapOperationsSlice'
import { resetVisitSetupSlice } from '../../redux/reducers/formSlices/visitSetupSlice'
import { resetPaperEntrySlice } from '../../redux/reducers/formSlices/paperEntrySlice'
import { resetTabsSlice } from '../../redux/reducers/formSlices/tabSlice'
import { resetBatchCountSlice } from '../../redux/reducers/formSlices/batchCountSlice'
import { cloneDeep, find, keyBy } from 'lodash'
import {
  setIncompleteSectionTouched,
  TabStateI,
} from '../../redux/reducers/formSlices/tabSlice'
import { saveTrapVisitInformation } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { DeviceEventEmitter } from 'react-native'
import {
  navigateHelper,
  showFishInputButton,
  findTrapLocationIds,
} from '../../utils/utils'
import { StackActions } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import ReviewValuesModal from '../../components/form/ReviewValuesModal'
import ReviewValuesButton from '../../components/form/ReviewValuesButton'
import CustomSelect from '@/src/components/Shared/CustomSelect'
import { saveDraftForTab } from '../../redux/reducers/formSlices/pendingVisitDraftsSlice'
import {
  buildTrapVisitSubmission,
  buildAllCatchRawSubmissions,
} from '../../utils/helpers/buildSubmissionPayloads'

const mapStateToProps = (state: RootState) => {
  return {
    navigationState: state.navigation,
    visitSetupState: state.visitSetup,
    visitSetupDefaultState: state.visitSetupDefaults,
    fishProcessingState: state.fishProcessing,
    trapPostProcessingState: state.trapPostProcessing,
    trapOperationsState: state.trapOperations,
    dropdownsState: state.dropdowns,
    connectivityState: state.connectivity,
    fishInputState: state.fishInput,
    tabState: state.tabSlice,
    addGeneticSamplesState: state.addGeneticSamples,
    appliedMarksState: state.addMarksOrTags,
    userCredentialsStore: state.userCredentials,
  }
}

const IncompleteSections = ({
  navigation,
  navigationState,
  visitSetupState,
  visitSetupDefaultState,
  fishProcessingState,
  trapPostProcessingState,
  trapOperationsState,
  dropdownsState,
  connectivityState,
  fishInputState,
  tabState,
  addGeneticSamplesState,
  appliedMarksState,
  userCredentialsStore,
}: {
  navigation: any
  navigationState: any
  visitSetupState: any
  visitSetupDefaultState: any
  fishProcessingState: any
  trapPostProcessingState: any
  trapOperationsState: any
  dropdownsState: any
  connectivityState: any
  fishInputState: any
  tabState: TabStateI
  addGeneticSamplesState: any
  appliedMarksState: any
  userCredentialsStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const stepsArray = Object.values(navigationState.steps).slice(
    0,
    numOfFormSteps - 1
  ) as Array<any>
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewValuesModalIsOpen, setReviewValuesModalIsOpen] = useState(
    false as boolean
  )
  const hasSubmittedRef = useRef(false)
  const [
    conditionalIncompleteSectionFields,
    setConditionalIncompleteSectionFields,
  ] = useState({} as any)
  const [
    conditionalIncompleteSectionValues,
    setConditionalIncompleteSectionValues,
  ] = useState({} as any)
  const [isValid, setIsValid] = useState(false)
  const tabIds = Object.keys(tabState?.tabs)

  useEffect(() => {
    dispatch(setIncompleteSectionTouched(true))

    // Sync navigation step completion from per-tab slice completed flags.
    // This handles the case where a user jumps directly to this screen without
    // visiting each section individually (nav slice never got markStepCompleted).
    const allTabIds = Object.keys(tabState.tabs)
    if (allTabIds.length > 0) {
      const allComplete = (sliceState: any) =>
        allTabIds.every(id => sliceState[id]?.completed)

      if (allComplete(visitSetupState))
        dispatch(markStepCompleted({ propName: 'visitSetup' }))
      if (allComplete(trapOperationsState))
        dispatch(markStepCompleted({ propName: 'trapOperations' }))
      if (allComplete(fishProcessingState))
        dispatch(markStepCompleted({ propName: 'fishProcessing' }))
      if (allComplete(fishInputState))
        dispatch(markStepCompleted({ propName: 'fishInput' }))
      if (allComplete(trapPostProcessingState))
        dispatch(markStepCompleted({ propName: 'trapPostProcessing' }))
    }

    dispatch(checkIfFormIsComplete())
  }, [])

  useEffect(() => {
    // if no conditional fields, then section is valid
    if (!Object.keys(conditionalIncompleteSectionValues).length) {
      setIsValid(true)
    } else if (Object.keys(conditionalIncompleteSectionValues).length > 0) {
      const isValid = Object.values(conditionalIncompleteSectionValues).every(
        value => value !== undefined && value !== null && value !== ''
      )
      setIsValid(isValid)
    }
  }, [conditionalIncompleteSectionFields, conditionalIncompleteSectionValues])

  const emitSubmission = () => {
    if (isSubmitting) return // If already submitting, return early

    setIsSubmitting(true) // Set submitting state to true
    const callback = () => {
      navigateHelper(
        'Start Mark Recapture',
        navigationState,
        navigation,
        dispatch,
        updateActiveStep
      )
      setIsSubmitting(false) // Reset submitting state after navigation
    }

    navigation.dispatch(StackActions.replace('Loading...'))

    setTimeout(() => {
      DeviceEventEmitter.emit('event.load', {
        process: () => handleSubmit(),
        callback,
      })
    }, 1000)
  }

  // Snapshot the untouched, per-screen wizard state for every open tab so it
  // can be reopened/edited later if this submission doesn't sync (offline or
  // a failed POST). Wrapped by the caller in try/catch so any failure here
  // can never block the real submission below.
  const snapshotPendingDrafts = () => {
    const allTabIds = Object.keys(tabState?.tabs || {})
    allTabIds.forEach(tabId => {
      const tabInfo = tabState.tabs[tabId]
      dispatch(
        saveDraftForTab({
          tabId,
          tabName: tabInfo?.name,
          trapSite: tabInfo?.trapSite,
          groupId: tabInfo?.groupId,
          timestamp: new Date().toISOString(),
          visitSetupTab: visitSetupState[tabId],
          trapOperationsTab: trapOperationsState[tabId],
          fishProcessingTab: fishProcessingState[tabId],
          trapPostProcessingTab: trapPostProcessingState[tabId],
          fishInputTab: fishInputState[tabId],
        })
      )
    })
  }

  const handleSubmit = () => {
    if (hasSubmittedRef.current) return // If already submitted, return early
    try {
      saveTrapVisits()
      saveCatchRawSubmission()
      try {
        snapshotPendingDrafts()
      } catch (draftError) {
        console.log('snapshotPendingDrafts error (non-fatal): ', draftError)
      }
      resetAllFormSlices()

      hasSubmittedRef.current = true // Set submitted state to true

      if (
        connectivityState.isConnected &&
        connectivityState.isInternetReachable
      ) {
        dispatch(postTrapVisitFormSubmissions())
      } else {
        console.log('Connection issue during submission')
        showSlideAlert(
          dispatch,
          'Connection issue during trap visit submission. Application will save data locally and attempt to submit later when connected.',
          'error',
          5000
        )
      }
    } catch (error) {
      console.log('submit error: ', error)
    } finally {
      setIsSubmitting(false) // Reset submitting state after handling submission
    }
  }

  const resetAllFormSlices = () => {
    dispatch(resetNavigationSlice())
    dispatch(resetGeneticSamplesSlice())
    dispatch(resetMarksOrTagsSlice())
    dispatch(resetFishInputSlice())
    dispatch(resetBatchCountSlice())
    dispatch(resetFishProcessingSlice())
    dispatch(resetTrapPostProcessingSlice())
    dispatch(resetTrapOperationsSlice())
    dispatch(resetVisitSetupSlice())
    dispatch(resetPaperEntrySlice())
    dispatch(resetTabsSlice())
  }

  useEffect(() => {
    const selectedProgramId = tabState?.activeTabId
      ? visitSetupState?.[tabState.activeTabId]?.values?.programId
      : null

    if (selectedProgramId) {
      const currentProgramInfo = find(
        visitSetupDefaultState.programs,
        (program: any) => program.id === selectedProgramId
      )

      if (currentProgramInfo?.programFormFields?.length) {
        const incompleteSectionFields =
          currentProgramInfo?.programFormFields.filter((formField: any) => {
            return formField?.formSection === 'Incomplete Sections'
          })

        const sectionFieldsObj = keyBy(incompleteSectionFields, 'fieldName')

        setConditionalIncompleteSectionFields(sectionFieldsObj)

        setConditionalIncompleteSectionValues(
          Object.keys(sectionFieldsObj).reduce<{ [key: string]: any }>(
            (obj, key) => {
              obj[key] = undefined
              return obj
            },
            {}
          )
        )
      } else {
        setConditionalIncompleteSectionFields({})
        setConditionalIncompleteSectionValues({})
      }
    }
  }, [visitSetupDefaultState.programs, tabState.activeTabId])

  // const getDBValue = (value: any, dropdownName: string) => {
  //   const dropdownValues = dropdownsState.values[dropdownName]

  //   const id = find(dropdownValues, { code: value })?.id || null
  //   return id
  // }


  const saveTrapVisits = () => {
    const tabIds = Object.keys(tabState.tabs)
    tabIds.forEach(id => {
      const trapVisitSubmission = buildTrapVisitSubmission({
        tabId: id,
        visitSetupState,
        visitSetupDefaultState,
        trapOperationsState,
        trapPostProcessingState,
        fishProcessingState,
        dropdownsState,
        userCredentialsStore,
        fieldCheckValue: conditionalIncompleteSectionValues['fieldCheck'],
      })

      dispatch(saveTrapVisitSubmission(trapVisitSubmission))

      dispatch(
        saveTrapVisitInformation({
          crew: visitSetupState[tabIds[0]].values.crew,
          programId: visitSetupState[tabIds[0]].values.programId,
          trapLocationIds: findTrapLocationIds(visitSetupState),
        })
      )
    })
  }

  const saveCatchRawSubmission = () => {
    const catchRawSubmissions = buildAllCatchRawSubmissions({
      fishInputState,
      visitSetupState,
      visitSetupDefaultState,
      dropdownsState,
      userCredentialsStore,
    })

    if (catchRawSubmissions.length) {
      dispatch(saveCatchRawSubmissions(catchRawSubmissions))
    }
  }

  const handleOpenReviewValuesModal = () => {
    setReviewValuesModalIsOpen(true)
  }

  const handleCloseReviewValuesModal = () => {
    setReviewValuesModalIsOpen(false)
  }

  // console.log('visitSetupState', visitSetupState)
  // console.log('tabState', tabState)
  const renderFishInputButton = showFishInputButton({
    fishProcessing: fishProcessingState,
    tabIds,
  })

  return (
    <>
      <ScrollView
        height={'800px'}
        flex={1}
        bg='#fff'
        // justifyContent='center'
        // alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={8} p='15%' height={'100%'} flex={1}>
          <Heading textAlign='center' padding={0}>
            {'Please fill out any incomplete sections  \n before moving on:'}
          </Heading>
          {stepsArray.map((step: any, idx: number) => {
            if (
              (step.name === 'Fish Input' && renderFishInputButton) ||
              step.name !== 'Fish Input'
            )
              return (
                <IncompleteSectionButton
                  name={step.name}
                  completed={step.completed}
                  navigation={navigation}
                  key={idx}
                  step={idx + 1}
                  tabState={tabState}
                />
              )
          })}
          <Divider />
          <ReviewValuesButton
            handleOpenReviewValuesModal={handleOpenReviewValuesModal}
          />
          {conditionalIncompleteSectionFields['fieldCheck'] && (
            <Box
              key={'index'} // Always add a key when mapping
              // flexBasis='100%' // Ensures 3 items per row (adjust for spacing)
              // minWidth='100%' // Prevents shrinking too much
              // maxWidth='100%' // Prevents growing beyond this size>
              // flexGrow={1}
              // mr={8} // Removes right margin from every 3rd item
              mb={100} // Adds bottom margin to each item
            >
              <CustomSelect
                camelName={'fieldCheck'}
                label={
                  conditionalIncompleteSectionFields['fieldCheck'].displayName
                }
                selectedValue={conditionalIncompleteSectionValues['fieldCheck']}
                placeholder='Select Field Check'
                onValueChange={(itemValue: string) => {
                  setConditionalIncompleteSectionValues((prevFields: any) => {
                    const updatedFields = cloneDeep(prevFields)
                    updatedFields['fieldCheck'] = itemValue
                    return updatedFields
                  }) // Update the state with the selected value
                }}
                selectOptions={
                  tabState?.activeTabId
                    ? visitSetupState?.[
                        tabState.activeTabId
                      ]?.values?.crew?.map((crewMember: any) => ({
                        label: crewMember,
                        value: crewMember,
                      }))
                    : []
                }
                // validationSchema={validationSchema}
                // onOpenCallback={onOpenCallback}
              />
            </Box>
          )}
        </VStack>
      </ScrollView>
      {reviewValuesModalIsOpen && (
        <ReviewValuesModal
          handleCloseReviewValuesModal={handleCloseReviewValuesModal}
          isOpen={reviewValuesModalIsOpen}
          formValues={{
            visitSetupState,
            trapOperationsState,
            fishProcessingState,
            fishInputState,
            trapPostProcessingState,
          }}
          tabState={tabState}
          visitSetupDefaultState={visitSetupDefaultState}
          fieldCheck={conditionalIncompleteSectionValues['fieldCheck']}
          dropdownsState={dropdownsState}
          userCredentialsStore={userCredentialsStore}
        />
      )}
      <NavButtons
        navigation={navigation}
        handleSubmit={emitSubmission}
        shouldProceedToLoadingScreen={true}
        isValid={isValid}
      />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)
