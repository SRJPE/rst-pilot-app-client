import { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  markTrapVisitPaperEntry,
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../../redux/reducers/formSlices/visitSetupSlice'
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
} from '../../redux/reducers/formSlices/navigationSlice'
import {
  createTab,
  setTabName,
  TabStateI,
} from '../../redux/reducers/formSlices/tabSlice'
import { uniqBy } from 'lodash'

import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import CustomSelect from '../../components/Shared/CustomSelect'
import { uid } from 'uid'
import TrapNameDropDown from '../../components/form/TrapNameDropDown'

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
    }
  }, [tabSlice?.activeTabId])

  const onSubmit = (values: any, tabId: string | null) => {
    // values.crew = ['temp1']
    const programId = selectedProgramId
    const payload = {
      ...values,
      programId,
    }
    // if no current tabs, create all new tabs
    if (!tabId) {
      // if trapName, iterate through all trap names and create tabs
      if (values.trapName) {
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
              trapLocationId: getTrapLocationId({ trapSite: values.trapSite }),
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
      let currentTabsTrapNames = Object.keys(tabSlice.tabs).map((id) => {
        return tabSlice.tabs[id].name
      })
      // if trapNames, iterate through all trap names and create / overwrite tabs
      if (values.trapName) {
        values.trapName.forEach((trapName: string) => {
          if (currentTabsTrapNames.includes(trapName)) {
            const tabIds = Object.keys(tabSlice.tabs)
            const tabIdToUpdate = tabIds.filter((id) => {
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
            currentTabsTrapNames = currentTabsTrapNames.filter((name) => {
              return name != trapName
            })
          } else if (currentTabsTrapNames.includes('New Tab')) {
            const tabIds = Object.keys(tabSlice.tabs)
            const tabIdToUpdate = tabIds.filter((id) => {
              return tabSlice.tabs[id].name == 'New Tab'
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
              createTab({
                tabId: tabIdToUpdate,
                tabName: trapName ?? values.trapSite,
                trapSite: values.trapSite,
              })
            )
            currentTabsTrapNames = currentTabsTrapNames.filter((name) => {
              return name != 'New Tab'
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
    dispatch(markStepCompleted([true, 'visitSetup']))
    console.log('🚀 ~ handleSubmit ~ Visit', payload)
  }

  const updateSelectedProgram = (streamName: string) => {
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
    } else {
      setShowTrapNameField(false)
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
      if (crewList[0].programId === programId) {
        payload = crewList.map((crewMember: any) => ({
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
      onSubmit={(values) => {
        onSubmit(values, tabSlice?.activeTabId)
      }}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        touched,
        errors,
        values,
      }) => {
        useEffect(() => {
          if (
            tabSlice.previouslyActiveTabId &&
            navigationSlice.activeStep === 1
          ) {
            onSubmit(values, tabSlice.previouslyActiveTabId)
          }
        }, [tabSlice.previouslyActiveTabId])

        return (
          <>
            <View
              flex={1}
              bg='#fff'
              p='6%'
              borderColor='themeGrey'
              borderWidth='15'
            >
              <VStack space={5}>
                <FormControl>
                  <HStack space={6} alignItems='center'>
                    <FormControl.Label>
                      <Heading>Will you be importing a paper entry?</Heading>
                    </FormControl.Label>
                    <Switch
                      shadow='3'
                      offTrackColor='secondary'
                      onTrackColor='primary'
                      size='lg'
                      value={isPaperEntry}
                      accessibilityLabel='Is the entry a paper entry?'
                      onToggle={() => setIsPaperEntry(!isPaperEntry)}
                    />
                  </HStack>
                </FormControl>
                <Divider />
                <Heading>Which stream are you trapping on?</Heading>
                <FormControl>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Stream
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values.stream}
                    placeholder='Stream'
                    onValueChange={(itemValue: string) => {
                      setFieldValue('stream', itemValue)
                      if (itemValue === 'Mill Creek') {
                        setFieldValue('trapSite', 'Mill Creek RST')
                      }
                      if (itemValue === 'Deer Creek') {
                        setFieldValue('trapSite', 'Deer Creek RST')
                      }
                      updateSelectedProgram(itemValue)
                    }}
                    setFieldTouched={setFieldTouched}
                    selectOptions={visitSetupDefaultsState?.programs?.map(
                      (program: any) => ({
                        label: program?.streamName,
                        value: program?.streamName,
                      })
                    )}
                  />
                  {touched.stream &&
                    errors.stream &&
                    RenderErrorMessage(errors, 'stream')}
                </FormControl>
                {values.stream && (
                  <>
                    <Text fontSize='lg' fontWeight='500'>
                      Confirm the following values:
                    </Text>
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Trap Site
                        </Text>
                      </FormControl.Label>
                      <CustomSelect
                        selectedValue={values.trapSite}
                        placeholder='Trap Site'
                        onValueChange={(itemValue: string) => {
                          if (itemValue !== values.trapSite) {
                            shouldShowTrapNameField(itemValue)
                          }
                          setFieldValue('trapSite', itemValue)
                        }}
                        setFieldTouched={setFieldTouched}
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
                      {touched.trapSite &&
                        errors.trapSite &&
                        RenderErrorMessage(errors, 'trapSite')}
                    </FormControl>

                    {showTrapNameField && (
                      <FormControl>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Trap Name
                          </Text>
                        </FormControl.Label>
                        <TrapNameDropDown
                          list={trapNameList}
                          setList={setTrapNameList}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          visitSetupState={visitSetupState}
                          tabSlice={tabSlice}
                        />
                        {touched.trapName &&
                          errors.trapName &&
                          RenderErrorMessage(errors, 'trapName')}
                      </FormControl>
                    )}

                    <FormControl mt={showTrapNameField ? '12' : '0'}>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Crew
                        </Text>
                      </FormControl.Label>

                      <CrewDropDown
                        list={crewList}
                        setList={setCrewList}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        visitSetupState={visitSetupState}
                        tabId={tabSlice?.activeTabId}
                      />
                      {/* {touched.crew &&
                      errors.crew &&
                      RenderErrorMessage(errors, 'crew')} */}
                    </FormControl>
                  </>
                )}
              </VStack>
            </View>
            <NavButtons
              navigation={navigation}
              handleSubmit={handleSubmit}
              errors={errors}
              touched={touched}
              isPaperEntry={isPaperEntry}
            />
          </>
        )
      }}
    </Formik>
  )
}

export default connect(mapStateToProps)(VisitSetup)
