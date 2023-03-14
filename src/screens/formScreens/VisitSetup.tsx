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
import { markStepCompleted } from '../../redux/reducers/formSlices/navigationSlice'
import { createTab, setTabName } from '../../redux/reducers/formSlices/tabSlice'
import { uniqBy } from 'lodash'

import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import CustomSelect from '../../components/Shared/CustomSelect'
import { uid } from 'uid'
import TrapNameDropDown from '../../components/form/TrapNameDropDown'

const mapStateToProps = (state: RootState) => {
  return {
    visitSetupState: state.visitSetup,
    visitSetupDefaultsState: state.visitSetupDefaults,
    activeTabId: state.tabSlice.activeTabId,
  }
}

const VisitSetup = ({
  navigation,
  visitSetupState,
  visitSetupDefaultsState,
  activeTabId,
}: {
  navigation: any
  visitSetupState: any
  visitSetupDefaultsState: any
  activeTabId: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isPaperEntry, setIsPaperEntry] = useState(false as boolean)
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null
  )
  const [selectedTrapLocationId, setSelectedTrapLocationId] = useState<
    number | null
  >(null)
  const [showTrapNameField, setShowTrapNameField] = useState(false as boolean)
  const [trapNameList, setTrapNameList] = useState<
    { label: string; value: string }[]
  >([])
  const [crewList, setCrewList] = useState<{ label: string; value: string }[]>(
    []
  )

  useEffect(() => {
    if (
      visitSetupState[activeTabId]?.values?.programId !=
      selectedProgramId
    ) {
      setSelectedProgramId(
        visitSetupState[activeTabId]?.values?.programId
      )
      generateCrewList(visitSetupState[activeTabId]?.values?.programId)
      shouldShowTrapNameField(
        visitSetupState[activeTabId]?.values?.trapSite
      )
    }
  }, [activeTabId])

  const handleSubmit = (values: any) => {
    // values.crew = ['temp1']
    const programId = selectedProgramId
    const trapLocationId = selectedTrapLocationId
    const payload = {
      ...values,
      programId,
      trapLocationId,
    }
    if (!activeTabId) {
      if (values.trapName) {
        values.trapName.forEach((trapName: string) => {
          const tabId = uid()
          dispatch(
            createTab({ tabId, tabName: trapName ?? values.trapSite })
          )
          dispatch(saveVisitSetup({ tabId, values: {...payload, trapName} }))
          dispatch(markVisitSetupCompleted({ tabId, completed: true }))
          dispatch(markTrapVisitPaperEntry({ tabId, isPaperEntry }))
        })
      } else {
        const tabId = uid()
        dispatch(
          createTab({ tabId, tabName: values.trapName[0] ?? values.trapSite })
        )
        dispatch(saveVisitSetup({ tabId, values: payload }))
        dispatch(markVisitSetupCompleted({ tabId, completed: true }))
        dispatch(markTrapVisitPaperEntry({ tabId, isPaperEntry }))
      }
    } else {
      dispatch(saveVisitSetup({ tabId: activeTabId, values: payload }))
      dispatch(setTabName(values.trapName ?? values.trapSite))
      dispatch(
        markVisitSetupCompleted({
          tabId: activeTabId,
          completed: true,
        })
      )
      dispatch(
        markTrapVisitPaperEntry({ tabId: activeTabId, isPaperEntry })
      )
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

  const updateSelectedTrapLocation = ({
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

    setSelectedTrapLocationId(trapLocationId)
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
        activeTabId
          ? visitSetupState[activeTabId]
            ? visitSetupState[activeTabId].values
            : visitSetupState['placeholderId'].values
          : visitSetupState['placeholderId'].values
      }
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      // maybe this is not needed for first step in form?
      // initialTouched={{ trapSite: crew }}
      // initialErrors={visitSetupState.completed ? undefined : { crew: '' }}
      onSubmit={(values) => {
        handleSubmit(values)
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
      }) => (
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
                      updateSelectedTrapLocation({ trapSite: 'Mill Creek RST' })
                    } else if (itemValue === 'Deer Creek') {
                      setFieldValue('trapSite', 'Deer Creek RST')
                      updateSelectedTrapLocation({ trapSite: 'Deer Creek RST' })
                    } else {
                      updateSelectedTrapLocation({})
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
                          updateSelectedTrapLocation({ trapSite: itemValue })
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
                        tabId={activeTabId}
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
                      tabId={activeTabId}
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
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(VisitSetup)
