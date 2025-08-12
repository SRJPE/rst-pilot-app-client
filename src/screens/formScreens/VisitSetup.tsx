import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  markTrapVisitPaperEntry,
  markVisitSetupCompleted,
  saveVisitSetup,
  resetVisitSetupSlice,
} from '../../redux/reducers/formSlices/visitSetupSlice'
import { resetFishProcessingSlice } from '@/src/redux/reducers/formSlices/fishProcessingSlice'
import { resetTrapPostProcessingSlice } from '@/src/redux/reducers/formSlices/trapPostProcessingSlice'
import { resetTrapOperationsSlice } from '@/src/redux/reducers/formSlices/trapOperationsSlice'
import {
  FormControl,
  Heading,
  VStack,
  Text,
  View,
  Switch,
  HStack,
  Divider,
} from 'native-base'
import CrewDropDown from '../../components/form/CrewDropDown'
import NavButtons from '../../components/formContainer/NavButtons'
import { trapVisitSchema } from '../../utils/helpers/yupValidations'
import {
  markStepCompleted,
  NavigationStateI,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import {
  createTab,
  deleteTab,
  setTabName,
  TabStateI,
  resetTabsSlice,
} from '../../redux/reducers/formSlices/tabSlice'
import { uniqBy, sortBy, find } from 'lodash'
import { DeviceEventEmitter, TouchableWithoutFeedback } from 'react-native'
import CustomSelect from '../../components/Shared/CustomSelect'
import { uid } from 'uid'
import TrapNameDropDown from '../../components/form/TrapNameDropDown'
import { navigateHelper } from '../../utils/utils'
import { StackActions } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'

const mapStateToProps = (state: RootState) => {
  return {
    visitSetupState: state.visitSetup,
    visitSetupDefaultsState: state.visitSetupDefaults,
    tabSlice: state.tabSlice,
    navigationSlice: state.navigation,
  }
}

const VisitSetup = ({
  navigation,
  visitSetupState,
  visitSetupDefaultsState,
  tabSlice,
  navigationSlice,
}: {
  navigation: any
  visitSetupState: any
  visitSetupDefaultsState: any
  tabSlice: TabStateI
  navigationSlice: NavigationStateI
}) => {
  // try {
  const dispatch = useDispatch<AppDispatch>()
  const [isPaperEntry, setIsPaperEntry] = useState(false as boolean)
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null
  )
  const [showTrapNameField, setShowTrapNameField] = useState(false as boolean)
  const [trapNameList, setTrapNameList] = useState<
    { label: string; value: string }[]
  >([])
  const [crewList, setCrewList] = useState<{ label: string; value: string }[]>(
    []
  )
  const [trapDropDownOpen, setTrapDropDownOpen] = useState(false as boolean)
  const [crewDropDownOpen, setCrewDropDownOpen] = useState(false as boolean)

  const onTrapOpen = useCallback(() => {
    setCrewDropDownOpen(false)
  }, [])
  const onCrewOpen = useCallback(() => {
    setTrapDropDownOpen(false)
  }, [])

  useEffect(() => {
    if (tabSlice.activeTabId != null) {
      if (
        visitSetupState[tabSlice?.activeTabId]?.values?.programId !=
        selectedProgramId
      ) {
        setSelectedProgramId(
          visitSetupState[tabSlice?.activeTabId]?.values?.programId
        )
        generateCrewList(
          visitSetupState[tabSlice?.activeTabId]?.values?.programId
        )
        shouldShowTrapNameField(
          visitSetupState[tabSlice?.activeTabId]?.values?.trapSite
        )
      }

      // set default values
      setIsPaperEntry(visitSetupState[tabSlice?.activeTabId]?.isPaperEntry)
    }
  }, [tabSlice?.activeTabId])

  const onSubmit = (values: any, tabId: string | null) => {
    const programId = selectedProgramId
    const payload = {
      ...values,
      programId,
    }
    // if no current tabs, create all new tabs
    if (!tabId) {
      // if trapName, iterate through all trap names and create tabs
      if (values.trapName && Array.isArray(values?.trapName)) {
        values.trapName.forEach((trapName: string) => {
          const newTabId = uid()
          dispatch(
            saveVisitSetup({
              tabId: newTabId,
              values: {
                ...payload,
                trapName,
                trapLocationId: getTrapLocationId({ trapName }),
              },
              isPaperEntry,
            })
          )
          dispatch(
            createTab({
              tabId: newTabId,
              tabName: trapName ?? values.trapSite,
              trapSite: values.trapSite,
            })
          )
          dispatch(
            markVisitSetupCompleted({ tabId: newTabId, completed: true })
          )
          dispatch(markTrapVisitPaperEntry({ tabId: newTabId, isPaperEntry }))
        })
      }
      // if not trapName, create single tab from trapSite
      else {
        const newTabId = uid()
        dispatch(
          saveVisitSetup({
            tabId: newTabId,
            isPaperEntry,
            values: {
              ...payload,
              trapLocationId: getTrapLocationId({
                trapSite: values.trapSite,
              }),
            },
          })
        )
        dispatch(
          createTab({
            tabId: newTabId,
            tabName: values.trapSite,
            trapSite: values.trapSite,
          })
        )
        dispatch(markVisitSetupCompleted({ tabId: newTabId, completed: true }))
        dispatch(markTrapVisitPaperEntry({ tabId: newTabId, isPaperEntry }))
      }
    }
    // if there are current tabs, create and overwrite tabs
    else {
      let currentTabsTrapNames = Object.keys(tabSlice.tabs).map(id => {
        return tabSlice.tabs[id].name
      })

      // if trapNames, iterate through all trap names and create / overwrite / delete tabs
      if (values.trapName && Array.isArray(values?.trapName)) {
        // remove any tabs that are not in values.trapName
        if (values.trapName.length < currentTabsTrapNames.length) {
          Object.keys(tabSlice.tabs).forEach(tabId => {
            const tabTrapName = tabSlice.tabs[tabId].name

            if (!values.trapName.includes(tabTrapName)) {
              dispatch(deleteTab(tabId))
            }
          })
        }

        values?.trapName?.forEach((trapName: string) => {
          if (currentTabsTrapNames.includes(trapName)) {
            const tabIds = Object.keys(tabSlice.tabs)
            const tabIdToUpdate = tabIds.filter(id => {
              return tabSlice.tabs[id].name == trapName
            })[0]
            dispatch(
              saveVisitSetup({
                tabId: tabIdToUpdate,
                values: {
                  ...payload,
                  trapLocationId: getTrapLocationId({ trapName }),
                },
                isPaperEntry,
              })
            )
            dispatch(
              setTabName({
                tabId: tabIdToUpdate,
                name: trapName ?? values.trapSite,
              })
            )
            currentTabsTrapNames = currentTabsTrapNames.filter(name => {
              return name != trapName
            })
          } else {
            let tabId = uid()
            dispatch(
              saveVisitSetup({
                tabId,
                values: {
                  ...payload,
                  trapLocationId: getTrapLocationId({ trapName }),
                },
                isPaperEntry,
              })
            )
            dispatch(
              createTab({
                tabId,
                tabName: trapName ?? values.trapSite,
                trapSite: values.trapSite,
              })
            )
          }

          dispatch(
            markVisitSetupCompleted({
              tabId,
              completed: true,
            })
          )
          dispatch(
            markTrapVisitPaperEntry({
              tabId,
              isPaperEntry,
            })
          )
        })
      }
      // if there are no additional trapNames overwrite current tab
      else {
        dispatch(
          saveVisitSetup({
            tabId,
            values: {
              ...payload,
              trapLocationId: getTrapLocationId(
                values.trapName
                  ? { trapName: values.trapName }
                  : { trapSite: values.trapSite }
              ),
            },
            isPaperEntry,
          })
        )
        dispatch(setTabName({ tabId, name: values.trapSite }))
        dispatch(
          markVisitSetupCompleted({
            tabId,
            completed: true,
          })
        )
        dispatch(
          markTrapVisitPaperEntry({
            tabId,
            isPaperEntry,
          })
        )
      }
    }
    dispatch(markStepCompleted({ propName: 'visitSetup' }))
  }

  const updateSelectedProgram = (streamName: string) => {
    dispatch(resetTabsSlice())
    dispatch(resetVisitSetupSlice())
    dispatch(resetFishProcessingSlice())
    dispatch(resetTrapPostProcessingSlice())
    dispatch(resetTrapOperationsSlice())
    let programId = null
    visitSetupDefaultsState?.programs.forEach((program: any) => {
      if (program.streamName === streamName) programId = program.id
    })
    setSelectedProgramId(programId)
    setShowTrapNameField(false)
    generateCrewList(programId)
  }

  const getTrapLocationId = ({
    trapSite,
    trapName,
  }: {
    trapSite?: string
    trapName?: string
  }) => {
    let trapLocationId = null

    if (trapSite) {
      const trapLocations = visitSetupDefaultsState?.trapLocations?.filter(
        (obj: any) => obj.siteName === trapSite
      )
      if (trapLocations.length === 1) {
        trapLocationId = trapLocations[0].id
      }
    }

    if (trapName) {
      const trapLocations = visitSetupDefaultsState?.trapLocations?.filter(
        (obj: any) => obj.trapName === trapName
      )
      if (trapLocations.length === 1) {
        trapLocationId = trapLocations[0].id
      } else if (!trapLocations.length) {
        const trapLocationsAlt = visitSetupDefaultsState?.trapLocations?.filter(
          (obj: any) => obj.siteName === trapName
        )
        if (trapLocationsAlt.length === 1) {
          trapLocationId = trapLocationsAlt[0].id
        }
      }
    }

    return trapLocationId
  }

  const shouldShowTrapNameField = (trapSite: string) => {
    let trapNameValues = visitSetupDefaultsState?.trapLocations?.filter(
      (obj: any) => obj.siteName === trapSite
    )
    if (trapNameValues.length > 1) {
      setShowTrapNameField(true)
      updateTrapNameValues(trapSite)
      return true
    } else {
      setShowTrapNameField(false)
      return false
    }
  }

  const generateCrewList = (programId: number | null) => {
    let payload = [
      {
        label: 'No crew members found',
        value: 'null',
      },
    ]
    const crewMemberDefaults = visitSetupDefaultsState?.crewMembers
    crewMemberDefaults.forEach((crewList: any[]) => {
      if (crewList.length && crewList[0].programId === programId) {
        payload = sortBy(crewList, ['lastName']).map((crewMember: any) => ({
          label: `${crewMember?.firstName} ${crewMember?.lastName}`,
          value: `${crewMember?.firstName} ${crewMember?.lastName}`,
        }))
      }
    })

    setCrewList(payload)
  }

  const updateTrapNameValues = (trapSite: string) => {
    setTrapNameList(
      visitSetupDefaultsState?.trapLocations
        ?.filter((obj: any) => obj.siteName === trapSite)

        ?.map((trapLocation: any) => ({
          label: trapLocation?.trapName,
          value: trapLocation?.trapName,
        }))
    )
  }

  return (
    <Formik
      validationSchema={trapVisitSchema}
      enableReinitialize={true}
      initialValues={
        tabSlice?.activeTabId
          ? visitSetupState[tabSlice?.activeTabId]
            ? visitSetupState[tabSlice?.activeTabId].values
            : visitSetupState['placeholderId'].values
          : visitSetupState['placeholderId'].values
      }
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      // maybe this is not needed for first step in form?
      // initialTouched={{ trapSite: crew }}
      // initialErrors={visitSetupState.completed ? undefined : { crew: '' }}
      onSubmit={values => {
        const callback = () => {
          navigateHelper(
            'Trap Operations',
            navigationSlice,
            navigation,
            dispatch,
            updateActiveStep
          )
        }
        navigation.dispatch(StackActions.replace('Loading...'))
        setTimeout(() => {
          DeviceEventEmitter.emit('event.load', {
            process: () => onSubmit(values, tabSlice?.activeTabId),
            callback,
          })
          showSlideAlert(dispatch)
        }, 1000)
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        touched,
        errors,
        values,
        resetForm,
      }) => {
        useEffect(() => {
          if (
            tabSlice.previouslyActiveTabId &&
            navigationSlice.activeStep === 1
          ) {
            onSubmit(values, tabSlice.previouslyActiveTabId)
          }

          if (
            tabSlice?.activeTabId &&
            !visitSetupState[tabSlice?.activeTabId]?.values?.programId
          ) {
            const programId = find(
              visitSetupDefaultsState?.trapLocations,
              (trapLocation: any) => trapLocation.id === values.trapLocationId
            )?.id
            setSelectedProgramId(programId)
            generateCrewList(programId)
            shouldShowTrapNameField(
              visitSetupState[tabSlice?.activeTabId]?.values?.trapSite
            )
            setFieldValue(
              'trapSite',
              visitSetupState[tabSlice?.activeTabId]?.values?.trapSite
            )
          }
        }, [tabSlice.previouslyActiveTabId])

        console.log('errors', errors)

        return (
          <TouchableWithoutFeedback
            onPress={() => {
              if (crewDropDownOpen) {
                setFieldTouched('crew', true)
                setCrewDropDownOpen(false)
              }

              if (trapDropDownOpen) {
                setFieldTouched('trapName', true)
                setTrapDropDownOpen(false)
              }
            }}
          >
            <View flex={1} bg='#fff'>
              <View
                flex={1}
                bg='#fff'
                px='5%'
                py='3%'
                borderColor='themeGrey'
                borderWidth='15'
              >
                <VStack space={4}>
                  <FormControl>
                    <HStack space={3} alignItems='center'>
                      <FormControl.Label>
                        <Heading size='md' fontSize={25}>
                          Is this a paper entry from a previous trap visit?
                        </Heading>
                      </FormControl.Label>
                      <Switch
                        shadow='3'
                        offTrackColor='secondary'
                        onTrackColor='primary'
                        size='md'
                        value={isPaperEntry}
                        accessibilityLabel='Is the entry a paper entry?'
                        onToggle={() => setIsPaperEntry(!isPaperEntry)}
                      />
                    </HStack>
                  </FormControl>
                  <Divider />
                  <Heading size='md' fontSize={25}>
                    Which stream are you trapping on?
                  </Heading>
                  <CustomSelect
                    label='Stream'
                    camelName='stream'
                    errors={errors}
                    touched={touched}
                    selectedValue={values.stream}
                    placeholder='Select Stream'
                    onValueChange={(itemValue: string) => {
                      setFieldValue('stream', itemValue).then(() => {
                        setFieldTouched('stream', true)
                      })
                      // setFieldValue('stream', itemValue)
                      // setFieldTouched('stream', true)
                      setFieldError('stream', undefined)

                      setFieldValue('trapSite', '')

                      updateSelectedProgram(itemValue)
                      setFieldValue('crew', []).then(() => {
                        setFieldTouched('crew', false)
                      })
                      // setFieldValue('crew', [])
                      // setFieldTouched('crew', false)
                    }}
                    setFieldTouched={() => setFieldTouched('stream')}
                    selectOptions={visitSetupDefaultsState?.programs?.map(
                      (program: any) => ({
                        label: program?.streamName,
                        value: program?.streamName,
                      })
                    )}
                  />
                  {values.stream && (
                    <>
                      <Text fontSize='lg' fontWeight='500' mt={5}>
                        Confirm the following values:
                      </Text>
                      <CustomSelect
                        label='Trap Site'
                        camelName='trapSite'
                        errors={errors}
                        touched={touched}
                        selectedValue={values.trapSite}
                        placeholder='Select Trap Site'
                        onValueChange={(itemValue: string) => {
                          dispatch(resetTabsSlice())
                          const showTrapName =
                            shouldShowTrapNameField(itemValue)
                          setFieldValue('trapSite', itemValue).then(() => {
                            setFieldTouched('trapSite', true)
                          })

                          if (showTrapName) {
                            setFieldValue('trapName', []).then(() => {
                              setFieldTouched('trapName', true)
                            })
                          } else {
                            setFieldValue('trapName', [itemValue]).then(() => {
                              setFieldTouched('trapName', true)
                            })
                          }
                        }}
                        setFieldTouched={() => setFieldTouched('trapSite')}
                        selectOptions={uniqBy(
                          visitSetupDefaultsState?.trapLocations
                            ?.filter(
                              (obj: any) => obj.programId === selectedProgramId
                            )
                            ?.map((trapLocation: any) => ({
                              label: trapLocation?.siteName,
                              value: trapLocation?.siteName,
                            })),
                          'label'
                        )}
                      />
                      {showTrapNameField && (
                        <TrapNameDropDown
                          open={trapDropDownOpen}
                          onOpen={onTrapOpen}
                          setOpen={setTrapDropDownOpen}
                          list={trapNameList}
                          setList={setTrapNameList}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          visitSetupState={visitSetupState}
                          tabSlice={tabSlice}
                        />
                      )}

                      <CrewDropDown
                        open={crewDropDownOpen}
                        onOpen={onCrewOpen}
                        setOpen={setCrewDropDownOpen}
                        list={crewList}
                        setList={setCrewList}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        visitSetupState={visitSetupState}
                        stream={values.stream}
                        tabId={tabSlice?.activeTabId}
                        values={values}
                      />
                    </>
                  )}
                </VStack>
              </View>
              <NavButtons
                resetForm={resetForm}
                navigation={navigation}
                handleSubmit={handleSubmit}
                errors={
                  values.crew.length
                    ? errors
                    : { ...errors, crew: Boolean(values.crew.length) }
                }
                touched={touched}
                isPaperEntry={isPaperEntry}
                shouldProceedToLoadingScreen={true}
              />
            </View>
          </TouchableWithoutFeedback>
        )
      }}
    </Formik>
  )
}

export default connect(mapStateToProps)(VisitSetup)
