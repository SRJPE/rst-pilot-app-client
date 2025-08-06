import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  Radio,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base'
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { Keyboard, TouchableNativeFeedback } from 'react-native'
import { connect, useDispatch, useSelector } from 'react-redux'
import { uid } from 'uid'
import AddAnotherMarkModalContent from '../../components/Shared/AddAnotherMarkModalContent'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../../components/Shared/CustomModalHeader'
import CustomSelect from '../../components/Shared/CustomSelect'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import AddExistingMark from '../../components/form/AddExistingMark'
import AddGeneticsModalContent from '../../components/form/AddGeneticsModalContent'
import FishConditionsDropDown from '../../components/form/FishConditionsDropDown'
import GeneticSampleBadgeList from '../../components/form/GeneticSampleBadgeList'
import SpeciesDropDown from '../../components/form/SpeciesDropDown'
import TagBadgeList from '../../components/form/TagBadgeList'
import TagFishModalContent from '../../components/form/TagFishModalContent'
import MarkBadgeList from '../../components/markRecapture/MarkBadgeList'
import {
  deleteFishEntry,
  FishStoreI,
  saveIndividualFish,
  updateFishEntry,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { FormValueI, ReleaseMarkI, Taxon } from '../../utils/interfaces'
import {
  addFishErrorMessages,
  alphabeticalSort,
  checkFishMeasureProtocol,
  createFormValueDefault,
  getAddFishStateDefaults,
  handleSpeciesSearchTextChange,
  QARanges,
  reorderTaxon,
  findTaxonCode,
  calculateLifeStage,
} from '../../utils/utils'
import { startCase, find, keyBy, partition } from 'lodash'
import MeasureMetPlusCount from '../../components/form/MeasureMetPlusCount'
import FishEntriesSummary from '../../components/form/FishEntriesSummary'
import {
  findLengthAtDateRun,
  findRunDefinition,
} from '../../utils/helpers/helperFunctions'

const AddFishContent = ({
  route,
  saveIndividualFish,
  updateFishEntry,
  deleteFishEntry,
  closeModal,
  fishStore,
  tabSlice,
  visitSetupState,
  visitSetupDefaults,
  fishInputSlice,
  dropdownsStore,
  trapOperationsStore,
}: {
  route?: any
  saveIndividualFish: any
  saveMarkOrTagData: any
  updateFishEntry: any
  deleteFishEntry: any
  closeModal: any
  fishStore: FishStoreI
  tabSlice: TabStateI
  visitSetupState: any
  visitSetupDefaults: any
  fishInputSlice: any
  dropdownsStore: any
  trapOperationsStore: any
}) => {
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const tabId = tabSlice?.activeTabId || 'placeholderId'

  const activeProgramId = visitSetupState?.[tabId]?.values?.programId

  const currentProgramTaxon = dropdownValues?.programTaxonAbbreviation?.[
    activeProgramId
  ] as Taxon[]

  const defaultTaxonList = dropdownValues?.taxon
  const reorderedTaxon = useMemo(
    () => reorderTaxon(currentProgramTaxon || defaultTaxonList),
    [currentProgramTaxon, activeProgramId]
  )

  const lastFishEntry = Object.values(fishStore).findLast(
    fishEntry => !fishEntry.plusCount
  )
  const navigation = useNavigation()
  const dispatch = useDispatch<AppDispatch>()
  // @ts-ignore
  const [fishUID, setFishUID] = useState(uid() as string)
  const [conditionalFishInputFields, setConditionalFishInputFields] = useState(
    {} as any
  )
  const [lengthAtDateModel, setLengthAtDateModel] = useState([] as any[])
  const [programLADModelName, setProgramLADModelName] = useState<string | null>(
    null
  )

  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) {
      console.log('🧹 Screen blurred — clearing form')
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      resetFormState('other')
    }
  }, [isFocused])

  useEffect(() => {
    const programLadModelName = route?.params?.selectedProgramObj?.ladModel
      ? route?.params?.selectedProgramObj.ladModel.toLowerCase()
      : null
    setProgramLADModelName(programLadModelName)
    if (programLadModelName === 'river') {
      setLengthAtDateModel(dropdownsStore.values.lengthAtDateRiver)
    } else if (programLadModelName === 'delta') {
      setLengthAtDateModel(dropdownsStore.values.lengthAtDateDelta)
    }
  }, [dropdownsStore.values])

  const [tagFishModalOpen, setTagFishModalOpen] = useState(false as boolean)
  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)
  const [addGeneticModalOpen, setAddGeneticModalOpen] = useState(
    false as boolean
  )
  const [createdMarks, setCreatedMarks] = useState<any[]>([] as any)
  const [totalCatchCount, setTotalCatchCount] = useState(0 as number)
  const [fishMeasureMetModalOpen, setFishMeasureMetModalOpen] = useState(
    false as boolean
  )
  const [protocolKeyMet, setProtocolKeyMet] = useState(null as string | null)

  const [speciesList, setSpeciesList] =
    useState<{ label: string; value: string }[]>(reorderedTaxon)

  const alphabeticalLifeStage = alphabeticalSort(
    dropdownValues.lifeStage,
    'definition'
  )

  const renderForkLengthWarning = (
    forkLengthValue: number,
    lifeStage: string
  ) => {
    //for juvenile max is 100 for all else use 1000
    if (lifeStage === 'juvenile') {
      return (
        forkLengthValue > QARanges.forkLength.maxJuvenile && (
          <RenderWarningMessage />
        )
      )
    } else {
      return (
        forkLengthValue > QARanges.forkLength.maxAdult && (
          <RenderWarningMessage />
        )
      )
    }
  }
  const renderWeightWarning = (weightValue: number, lifeStage: string) => {
    //for juvenile max is 50 for all else use 400
    if (lifeStage === 'juvenile') {
      return (
        weightValue > QARanges.weight.maxJuvenile && <RenderWarningMessage />
      )
    } else {
      return weightValue > QARanges.weight.maxAdult && <RenderWarningMessage />
    }
  }

  const buttonNav = () => {
    // @ts-ignore
    navigation?.navigate('Trap Visit Form', {
      screen: 'Batch Count',
      params: {
        fishMeasureProtocol: route.params?.fishMeasureProtocol,
        selectedProgramObj: route.params?.selectedProgramObj,
      },
    })

    closeFishMeasureMetModal()
    resetFormState('other')
    resetSpecies()
  }

  // ------------------------------------------------------------------------------------------------------------------------

  const stateDefaults = getAddFishStateDefaults()

  const [formHasError, setFormHasError] = useState<boolean>(true)

  const [species, setSpecies] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.species
      : createFormValueDefault({
          value: route.params?.editModeData.species,
          touched: true,
          required: false,
        })
  )

  const [count, setCount] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.count
      : createFormValueDefault({
          value: route.params?.editModeData.numFishCaught,
          touched: true,
          required: false,
        })
  )
  const [forkLength, setForkLength] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.forkLength
      : createFormValueDefault({
          value: route.params?.editModeData.forkLength?.toString(),
          touched: true,
          required: false,
        })
  )
  const [run, setRun] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.run
      : createFormValueDefault({
          value: route.params?.editModeData.run,
          touched: true,
          required: false,
        })
  )
  const [fishConditions, setFishConditions] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.fishConditions
      : createFormValueDefault({
          value: route.params?.editModeData.fishConditions,
          touched: true,
          required: false,
        })
  )
  const [weight, setWeight] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.weight
      : createFormValueDefault({
          value: route.params?.editModeData.weight,
          touched: true,
          required: false,
        })
  )
  const [lifeStage, setLifeStage] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.lifeStage
      : createFormValueDefault({
          value: route.params?.editModeData.lifeStage,
          touched: true,
          required: false,
        })
  )
  const [adiposeClipped, setAdiposeClipped] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.adiposeClipped
      : createFormValueDefault({
          value: route.params?.editModeData.adiposeClipped,
          touched: true,
          required: false,
        })
  )
  const [existingMarks, setExistingMarks] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.existingMarks
      : createFormValueDefault({
          value: route.params?.editModeData.existingMarks,
          touched: true,
          required: false,
        })
  )
  const [appliedMarks, setAppliedMarks] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.appliedMarks
      : createFormValueDefault({
          value: route.params?.editModeData.appliedMarks,
          touched: true,
          required: false,
        })
  )
  const [geneticSamples, setGeneticSamples] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.geneticSamples
      : createFormValueDefault({
          value: route.params?.editModeData.geneticSamples,
          touched: true,
          required: false,
        })
  )
  const [dead, setDead] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.dead
      : createFormValueDefault({
          value: route.params?.editModeData.dead,
          touched: true,
          required: false,
        })
  )

  const [milting, setMilting] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.milting
      : createFormValueDefault({
          value: route.params?.editModeData.milting,
          touched: true,
          required: false,
        })
  )

  const [eggs, setEggs] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.eggs
      : createFormValueDefault({
          value: route.params?.editModeData.eggs,
          touched: true,
          required: false,
        })
  )

  const [plusCountMethod, setPlusCountMethod] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.plusCountMethod
      : createFormValueDefault({
          value: route.params?.editModeData.plusCountMethod,
          touched: true,
          required: false,
        })
  )
  const [comments, setComments] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.comments
      : createFormValueDefault({
          value: route.params?.editModeData.comments?.toString(),
          touched: true,
          required: false,
        })
  )

  useEffect(() => {
    if (forkLength.value) checkForFormError()
  }, [
    species,
    count,
    forkLength,
    run,
    fishConditions,
    weight,
    lifeStage,
    adiposeClipped,
    existingMarks,
    dead,
    milting,
    eggs,
    plusCountMethod,
  ])

  const closeFishMeasureMetModal = () => {
    setFishMeasureMetModalOpen(false)
    setProtocolKeyMet(null)
  }

  const resetSpecies = () => {
    setSpecies(stateDefaults.whenSpeciesOther.species)
    resetFormState('other')
    setFishMeasureMetModalOpen(false)
    setProtocolKeyMet(null)
  }

  const [justClosed, setJustClosed] = useState(false)

  useEffect(() => {
    if (justClosed) {
      const timeout = setTimeout(() => setJustClosed(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [justClosed])

  const checkForFormError = () => {
    const formValues = [
      species,
      count,
      forkLength,
      run,
      fishConditions,
      weight,
      lifeStage,
      adiposeClipped,
      existingMarks,
      dead,
      milting,
      eggs,
      plusCountMethod,
    ]
    let hasError = false
    formValues.every(field => {
      if (hasError) return false
      if (
        field.required &&
        !field.touched &&
        (field.value === '' || field.value === null)
      ) {
        hasError = true
      } else if (field.error) {
        hasError = true
      }
      if (!hasError) return true
    })
    if (hasError !== formHasError) setFormHasError(hasError)
  }

  useEffect(() => {
    const selectedProgramId = tabSlice?.activeTabId
      ? visitSetupState?.[tabSlice.activeTabId]?.values?.programId
      : null

    if (selectedProgramId) {
      const currentProgramInfo = find(
        visitSetupDefaults.programs,
        (program: any) => program.id === selectedProgramId
      )

      if (currentProgramInfo?.programFormFields?.length) {
        const fishInputFields = currentProgramInfo?.programFormFields.filter(
          (formField: any) => {
            return formField?.formSection === 'Fish Input'
          }
        )
        setConditionalFishInputFields(keyBy(fishInputFields, 'fieldName'))
      } else {
        setConditionalFishInputFields({})
      }
    }
  }, [visitSetupDefaults.programs])

  const resetFormState = (resetType: 'chinook' | 'steelhead' | 'other') => {
    let identifier:
      | 'whenSpeciesChinook'
      | 'whenSpeciesSteelhead'
      | 'whenSpeciesOther' = 'whenSpeciesChinook'
    if (resetType === 'chinook') {
      identifier = 'whenSpeciesChinook'
    } else if (resetType === 'steelhead') {
      identifier = 'whenSpeciesSteelhead'
    } else if (resetType === 'other') {
      identifier = 'whenSpeciesOther'
    }
    // setSpecies(stateDefaults[identifier].species)
    setForkLength(stateDefaults[identifier].forkLength)
    setRun(stateDefaults[identifier].run)
    setWeight(stateDefaults[identifier].weight)
    setFishConditions(stateDefaults[identifier].fishConditions)
    setLifeStage(stateDefaults[identifier].lifeStage)
    setAdiposeClipped(stateDefaults[identifier].adiposeClipped)
    setExistingMarks(stateDefaults[identifier].existingMarks)
    setDead(stateDefaults[identifier].dead)
    setMilting(stateDefaults[identifier].milting)
    setEggs(stateDefaults[identifier].eggs)
    setPlusCountMethod(stateDefaults[identifier].plusCountMethod)
    setFormHasError(true)
    setFishUID(uid())
    setRecentExistingMarks([])
    setComments(stateDefaults[identifier].comments)
    setAppliedMarks(stateDefaults[identifier].appliedMarks)
    setGeneticSamples(stateDefaults[identifier].geneticSamples)
  }

  const handleMarkFishFormSubmit = (values: any) => {
    setAppliedMarks({
      ...appliedMarks,
      value: Array.isArray(appliedMarks.value)
        ? [...appliedMarks.value, values]
        : [values],
    })
  }

  const handleGeneticSamplesFormSubmit = (values: any) => {
    setGeneticSamples({
      ...geneticSamples,
      value: Array.isArray(geneticSamples.value)
        ? [...geneticSamples.value, values]
        : [values],
    })
  }

  //RECENT MARKS ADDITIONS
  const [recentExistingMarks, setRecentExistingMarks] = useState<any[]>([])

  const handlePressRecentExistingMarkButton = (
    selectedRecentReleaseMark: ReleaseMarkI
  ) => {
    if (
      recentExistingMarks.some(mark => mark.id === selectedRecentReleaseMark.id)
    ) {
      setRecentExistingMarks(
        recentExistingMarks.filter(
          mark => mark.id !== selectedRecentReleaseMark.id
        )
      )
    } else {
      setRecentExistingMarks([
        ...recentExistingMarks,
        selectedRecentReleaseMark,
      ])
    }
  }
  const determineValueNotRecordedOrNull = (
    species: any,
    fieldName: string,
    fieldValue: any
  ) => {
    if (
      species === 'Chinook salmon' ||
      (species === 'Steelhead / rainbow trout' && fieldName === 'lifeStage')
    ) {
      return fieldValue?.toLowerCase() || 'not recorded'
    } else {
      return fieldValue?.toLowerCase() || null
    }
  }
  const selectedTaxonCode = useMemo(
    () => findTaxonCode(species.value as string, reorderedTaxon),
    [species.value, reorderedTaxon]
  )

  const returnFormValues = () => {
    let values = {
      species: species.value,
      taxonCode: selectedTaxonCode || null,
      forkLength: forkLength.value,
      run: determineValueNotRecordedOrNull(species.value, 'run', run.value),
      fishConditions: Array.isArray(fishConditions.value)
        ? [...new Set(fishConditions.value)]
        : fishConditions.value,
      weight: weight.value,
      lifeStage: determineValueNotRecordedOrNull(
        species.value,
        'lifeStage',
        lifeStage.value
      ),
      adiposeClipped: adiposeClipped.value,
      // @ts-ignore
      existingMarks: [
        ...new Set([
          ...(Array.isArray(existingMarks.value) ? existingMarks.value : []),
          ...recentExistingMarks,
        ]),
      ],
      dead: dead.value,
      milting: conditionalFishInputFields?.['milting'] ? milting.value : null,
      eggs: conditionalFishInputFields?.['eggs'] ? eggs.value : null,
      plusCountMethod: plusCountMethod.value,
      comments: comments.value,
      appliedMarks: Array.isArray(appliedMarks?.value)
        ? [...new Set(appliedMarks.value)]
        : [],
      geneticSamples: Array.isArray(geneticSamples?.value)
        ? [...new Set(geneticSamples.value)]
        : [],
    }

    return values
  }

  /* Additions for species and fish condition dropdowns */
  const [speciesDropDownOpen, setSpeciesDropDownOpen] = useState(
    false as boolean
  )
  const [fishConditionsDropdownOpen, setFishConditionsDropdownOpen] = useState(
    false as boolean
  )
  const [fishConditionsList, setFishConditionsList] = useState<
    { label: string; value: string }[]
  >(
    dropdownValues.fishCondition.map((condition: any) => ({
      label: startCase(condition?.definition),
      value: condition?.definition,
    }))
  )
  const onSpeciesOpen = useCallback(() => {
    setFishConditionsDropdownOpen(false)
  }, [])
  const onFishConditionsOpen = useCallback(() => {
    setSpeciesDropDownOpen(false)
  }, [])

  useEffect(() => {
    if (existingMarks?.value && Array.isArray(existingMarks.value)) {
      const [existingReleaseMarks, nonExistingReleaseMarks] = partition(
        existingMarks.value,
        (mark: any) => {
          return mark?.releaseId !== undefined
        }
      )
      setRecentExistingMarks(existingReleaseMarks)
      setCreatedMarks(nonExistingReleaseMarks)
    }
  }, [existingMarks])

  const navState = navigation?.getState()
  const currentRoute = navState?.routes[navState?.index]

  useEffect(() => {
    // if (justClosed) {
    //   setFishMeasureMetModalOpen(false)
    //   setProtocolKeyMet(null)
    //   return
    // }
    if (!tabSlice?.activeTabId || !fishInputSlice) {
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      return
    }
    if (currentRoute?.name !== 'Add Fish') {
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      return
    }

    const fishMeasureCounts = fishInputSlice?.[tabSlice.activeTabId]
      ?.fishMeasureCounts as Record<
      string,
      { individualCount: number; plusCount: number }
    >

    const fishStore = fishInputSlice?.[tabSlice.activeTabId]
      ?.fishStore as Record<string, { numFishCaught: number }>

    if (!fishMeasureCounts || !fishStore) return

    const total = Object.values(fishStore).reduce(
      (sum, fishObj) =>
        sum + (fishObj.numFishCaught ? Number(fishObj.numFishCaught) : 0),
      0
    )
    setTotalCatchCount(total)

    if (species.value === '' || species.value === null) {
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      return
    }

    if (!speciesDropDownOpen) {
      const protocolResult = checkFishMeasureProtocol({
        fishMeasureCounts,
        fishMeasureProtocol: route.params?.fishMeasureProtocol,
        speciesValue: species.value as string,
        runValue: run.value as string,
        lifeStageValue: lifeStage.value as string,
      })

      if (
        protocolResult &&
        protocolResult.protocolMet &&
        protocolResult.protocolKeyMet
      ) {
        setFishMeasureMetModalOpen(true)
        setProtocolKeyMet(protocolResult.protocolKeyMet)
      } else {
        setFishMeasureMetModalOpen(false)
        setProtocolKeyMet(null)
      }
    } else {
      setProtocolKeyMet(null)
    }
  }, [
    tabSlice.activeTabId,
    fishInputSlice,
    species.value,
    justClosed,
    lifeStage.value,
    run.value,
  ])

  const forkLengthRef = useRef(forkLength)

  useEffect(() => {
    forkLengthRef.current = forkLength
  }, [forkLength.value])

  const handleForkLengthBlur = () => {
    setTimeout(() => {
      if (species.value === 'Chinook salmon' && tabSlice.activeTabId) {
        if (!forkLengthRef.current.value) {
          setRun(stateDefaults.whenSpeciesChinook.run)
          return
        }
        let dateTimeValue = new Date()

        const activeTabId = tabSlice.activeTabId

        if (
          activeTabId &&
          trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
        ) {
          dateTimeValue =
            trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
        } else if (
          activeTabId &&
          trapOperationsStore?.[activeTabId]?.values?.trapVisitStartTime
        ) {
          dateTimeValue =
            trapOperationsStore?.[activeTabId]?.values?.trapVisitStartTime
        }

        const ladObj = findLengthAtDateRun(lengthAtDateModel, dateTimeValue)

        const runDefinition = findRunDefinition(
          ladObj,
          Number(forkLengthRef.current.value)
        )

        if (runDefinition) {
          setRun({
            ...run,
            value: runDefinition,
            touched: true,
          })
        } else {
          setRun(stateDefaults.whenSpeciesChinook.run)
        }
      }
    }, 1000)
  }

  return (
    <TouchableNativeFeedback
      onPress={() => {
        if (speciesDropDownOpen) {
          setSpeciesDropDownOpen(false)
          setSpeciesList(reorderedTaxon)
          setSpecies(prevState => ({
            ...prevState,
            touched: true,
          }))
        }
      }}
    >
      <View flex={1}>
        <ScrollView
          scrollEnabled
          flex={1}
          bg='#fff'
          borderWidth='10'
          borderBottomWidth='0'
          borderColor='themeGrey'
        >
          <Pressable onPress={Keyboard.dismiss}>
            <HStack space={10}>
              <CustomModalHeader
                headerText={
                  route.params?.editModeData
                    ? tabSlice.activeTabId
                      ? `Edit Fish - ${
                          tabSlice.tabs[tabSlice.activeTabId].name
                        }`
                      : 'Edit Fish'
                    : tabSlice.activeTabId
                    ? `Add Fish - ${tabSlice.tabs[tabSlice.activeTabId].name}`
                    : 'Add Fish'
                }
                showHeaderButton={true}
                closeModal={closeModal}
                navigateBack={true}
                headerButton={
                  route.params?.editModeData
                    ? null
                    : AddFishModalHeaderButton({
                        activeTab: 'Individual',
                        buttonNav,
                      })
                }
              />
            </HStack>
            <Divider mb='1' />
            <VStack paddingX='10' paddingBottom='3' space={3}>
              {!route.params?.editModeData &&
                lastFishEntry &&
                tabSlice.activeTabId && (
                  <FishEntriesSummary
                    lastFishEntry={lastFishEntry}
                    totalCatchCount={totalCatchCount}
                    fishMeasureProtocol={
                      route.params?.fishMeasureProtocol || {}
                    }
                    fishMeasureCounts={
                      fishInputSlice?.[tabSlice.activeTabId]?.fishMeasureCounts
                    }
                  />
                )}
              <HStack alignItems='center'>
                <FormControl pr='5' mb={speciesDropDownOpen ? 180 : 0}>
                  {/* //TODO: Form is being managed manually, refactor logic and form to properly show error messages */}

                  <SpeciesDropDown
                    editModeValue={route.params?.editModeData?.species}
                    open={speciesDropDownOpen}
                    onOpen={onSpeciesOpen}
                    setOpen={setSpeciesDropDownOpen}
                    list={speciesList}
                    setList={setSpeciesList}
                    speciesValue={species.value as string}
                    onClose={() => {
                      setSpeciesList(reorderedTaxon)
                    }}
                    onChangeSearchText={searchValue =>
                      handleSpeciesSearchTextChange({
                        reorderedTaxon,
                        searchValue,
                        setSpeciesList,
                      })
                    }
                    onChangeValue={(value: string) => {
                      let payload = { ...species, value, touched: true }
                      //if in edit mode, do not reset form state based on species
                      if (route.params?.editModeData !== undefined) return
                      //if not in edit mode, reset form state based on species
                      if (value.toLowerCase().includes('chinook')) {
                        resetFormState('chinook')
                      } else if (value.toLowerCase().includes('steelhead')) {
                        resetFormState('steelhead')
                      } else {
                        resetFormState('other')
                      }
                      setSpecies(payload)
                    }}
                    // setFieldTouched={() =>
                    //   setSpecies({ ...species, touched: true })
                    // }
                  />
                </FormControl>
              </HStack>
              <Divider mt={1} />
              {(species.value as string) !== '' && species.value !== null && (
                <>
                  <VStack space={4}>
                    <Text color='black' fontSize='lg'>
                      * : Required
                    </Text>
                    <HStack space={4}>
                      <FormControl
                        flex={1}
                        // w={route.params?.editModeData ? '1/3' : '1/2'}
                        // pr='5'
                      >
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='md'>
                              Fork Length *
                            </Text>
                          </FormControl.Label>
                          {renderForkLengthWarning(
                            Number(forkLength.value),
                            lifeStage.value as string
                          )}
                          {forkLength.touched && forkLength.error && (
                            <RenderErrorMessage
                              errors={{ forkLength: forkLength.error }}
                              inputName={'forkLength'}
                            />
                          )}
                        </HStack>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType={'number-pad'}
                          onChangeText={value => {
                            let payload: FormValueI = {
                              ...forkLength,
                              value,
                              touched: true,
                              error: '',
                            }
                            if (value === '') {
                              payload.error =
                                addFishErrorMessages.forkLength.emptyError
                            } else if (!Number(value)) {
                              payload.error =
                                addFishErrorMessages.forkLength.typeError
                            }
                            setForkLength(payload)
                          }}
                          onBlur={handleForkLengthBlur}
                          value={forkLength.value as string}
                        />
                        <Text
                          color='#A1A1A1'
                          position='absolute'
                          top={50}
                          right={8}
                          fontSize={16}
                        >
                          {'mm'}
                        </Text>
                      </FormControl>
                      <FormControl
                        flex={1}
                        // w={route.params?.editModeData ? '1/3' : '1/2'}
                        // paddingRight='9'
                      >
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='md'>
                              Weight (optional)
                            </Text>
                          </FormControl.Label>
                          {renderWeightWarning(
                            Number(weight.value),
                            weight.value as string
                          )}
                          {weight.touched && weight.error && (
                            <RenderErrorMessage
                              errors={{ weight: weight.error }}
                              inputName={'weight'}
                            />
                          )}
                        </HStack>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType={'number-pad'}
                          onChangeText={value => {
                            let payload: FormValueI = {
                              ...weight,
                              value,
                              touched: true,
                              error: '',
                            }
                            if (value === '') {
                              payload.error = ''
                            } else if (!Number(value)) {
                              payload.error =
                                addFishErrorMessages.weight.typeError
                            }
                            setWeight(payload)
                          }}
                          // TODO - onBlur logic?
                          // onBlur={handleBlur('weight')}
                          value={weight.value as string}
                        />
                        <Text
                          color='#A1A1A1'
                          position='absolute'
                          top={50}
                          right={12}
                          fontSize={16}
                        >
                          {'g'}
                        </Text>
                      </FormControl>
                      {route.params?.editModeData ? (
                        <FormControl flex={1}>
                          <FormControl.Label>
                            <Text color='black' fontSize='md'>
                              Count
                            </Text>
                          </FormControl.Label>
                          <Input
                            height='50px'
                            fontSize='16'
                            placeholder='Numeric Value'
                            keyboardType={'number-pad'}
                            onChangeText={value =>
                              setCount({ ...count, value })
                            }
                            // TODO - onBlur logic?
                            // onBlur={handleBlur('numFishCaught')}
                            value={`${count.value}`}
                          />
                        </FormControl>
                      ) : (
                        <></>
                      )}
                    </HStack>
                    {/*workaround for customselect first component causing gray box issue*/}
                    <FormControl w='1/2' paddingRight='9' display='none'>
                      <CustomSelect
                        selectedValue={''}
                        placeholder={''}
                        onValueChange={null}
                        selectOptions={[]}
                      />
                    </FormControl>
                    <HStack space={4} alignItems='center'>
                      {(species.value === 'Chinook salmon' ||
                        species.value === 'Steelhead / rainbow trout') && (
                        <Box flex={1}>
                          <CustomSelect
                            label='Life Stage'
                            selectedValue={lifeStage.value as string}
                            placeholder={'Life Stage'}
                            onValueChange={(value: string) => {
                              let payload: FormValueI = {
                                ...lifeStage,
                                value,
                                error: '',
                                touched: true,
                              }
                              setLifeStage(payload)
                            }}
                            // setFieldTouched={() => {
                            //   let payload = { ...lifeStage, touched: true }
                            //   if (!lifeStage.value)
                            //     payload.error =
                            //       addFishErrorMessages.lifeStage.emptyError
                            //   setLifeStage(payload)
                            // }}
                            selectOptions={alphabeticalLifeStage
                              .filter((item: any) => item)
                              .map((item: any) => ({
                                label: item?.definition,
                                value: item?.definition,
                              }))}
                            tooltip={
                              <ScrollView>
                                <Image
                                  source={require('../../../assets/life_stage_image.png')}
                                  alt='Life Stage Image'
                                  width='720'
                                />
                                <Image
                                  source={require('../../../assets/life_stage_table.png')}
                                  alt='Life Stage Image'
                                />
                              </ScrollView>
                            }
                          />
                        </Box>
                      )}
                      {species.value == 'Chinook salmon' && (
                        <Box flex={1}>
                          <CustomSelect
                            label='Run (optional)'
                            selectedValue={run.value as string}
                            placeholder={'Run'}
                            onValueChange={(value: string) =>
                              setRun({ ...run, value, touched: true })
                            }
                            // setFieldTouched={() =>
                            //   setRun({ ...run, touched: true })
                            // }
                            selectOptions={dropdownValues?.run}
                            tooltip={
                              programLADModelName ? (
                                <Text
                                  fontSize='md'
                                  padding={5}
                                  marginRight={10}
                                >
                                  Run being set using{' '}
                                  {startCase(programLADModelName)} Length At
                                  Date (LAD)
                                </Text>
                              ) : null
                            }
                          />
                        </Box>
                      )}
                    </HStack>
                    <FormControl
                      w='100%'
                      paddingRight='9'
                      mb={fishConditionsDropdownOpen ? 160 : 0}
                    >
                      <FormControl.Label>
                        <Text color='black' fontSize='md'>
                          Fish Conditions
                        </Text>
                      </FormControl.Label>
                      <FishConditionsDropDown
                        editModeValue={
                          route.params?.editModeData
                            ? route.params?.editModeData?.fishConditions
                            : undefined
                        }
                        open={fishConditionsDropdownOpen}
                        onOpen={onFishConditionsOpen}
                        setOpen={setFishConditionsDropdownOpen}
                        list={fishConditionsList}
                        setList={setFishConditionsList}
                        onChangeValue={(value: string) => {
                          setFishConditions({ ...fishConditions, value })
                        }}
                        setFieldTouched={() =>
                          setFishConditions({
                            ...fishConditions,
                            touched: true,
                          })
                        }
                        fishConditionsValues={fishConditions.value as string[]}
                      />
                    </FormControl>
                    <HStack>
                      <FormControl w='1/3'>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Dead
                            </Text>
                          </FormControl.Label>
                          <Radio.Group
                            name='dead'
                            accessibilityLabel='dead'
                            value={`${dead.value}`}
                            onChange={(value: any) => {
                              if (value === 'true') {
                                setDead({ ...dead, value: true })
                              } else {
                                setDead({ ...dead, value: false })
                              }
                            }}
                          >
                            <HStack space={4}>
                              <Radio
                                colorScheme='primary'
                                value='true'
                                my={1}
                                _icon={{ color: 'primary' }}
                              >
                                Yes
                              </Radio>
                              <Radio
                                colorScheme='primary'
                                value='false'
                                my={1}
                                _icon={{ color: 'primary' }}
                              >
                                No
                              </Radio>
                            </HStack>
                          </Radio.Group>
                        </HStack>
                      </FormControl>
                      {species.value === 'Chinook salmon' && (
                        <FormControl w='1/3'>
                          <HStack space={4} alignItems='center'>
                            <FormControl.Label>
                              <Text color='black' fontSize='xl'>
                                Adipose Clipped
                              </Text>
                            </FormControl.Label>
                            <Radio.Group
                              name='adiposeClipped'
                              accessibilityLabel='adipose clipped'
                              value={`${adiposeClipped.value}`}
                              onChange={(value: any) => {
                                if (value === 'true') {
                                  setAdiposeClipped({
                                    ...adiposeClipped,
                                    value: true,
                                  })
                                } else {
                                  setAdiposeClipped({
                                    ...adiposeClipped,
                                    value: false,
                                  })
                                }
                              }}
                            >
                              <HStack space={4}>
                                <Radio
                                  colorScheme='primary'
                                  value='true'
                                  my={1}
                                  _icon={{ color: 'primary' }}
                                >
                                  True
                                </Radio>
                                <Radio
                                  colorScheme='primary'
                                  value='false'
                                  my={1}
                                  _icon={{ color: 'primary' }}
                                >
                                  False
                                </Radio>
                              </HStack>
                            </Radio.Group>
                          </HStack>
                        </FormControl>
                      )}
                    </HStack>
                    <HStack>
                      {conditionalFishInputFields?.['milting'] && (
                        <FormControl w='1/3'>
                          <HStack space={4} alignItems='center'>
                            <FormControl.Label>
                              <Text color='black' fontSize='xl'>
                                Milting
                              </Text>
                            </FormControl.Label>

                            <Radio.Group
                              name='milting'
                              accessibilityLabel='milting'
                              value={`${milting.value}`}
                              onChange={(value: any) => {
                                if (value === 'true') {
                                  setMilting({ ...milting, value: true })
                                } else {
                                  setMilting({ ...milting, value: false })
                                }
                              }}
                            >
                              <HStack space={4}>
                                <Radio
                                  colorScheme='primary'
                                  value='true'
                                  my={1}
                                  _icon={{ color: 'primary' }}
                                >
                                  Yes
                                </Radio>
                                <Radio
                                  colorScheme='primary'
                                  value='false'
                                  my={1}
                                  _icon={{ color: 'primary' }}
                                >
                                  No
                                </Radio>
                              </HStack>
                            </Radio.Group>
                          </HStack>
                        </FormControl>
                      )}
                    </HStack>
                    <HStack>
                      {conditionalFishInputFields?.['eggs'] && (
                        <FormControl w='1/3'>
                          <HStack space={4} alignItems='center'>
                            <FormControl.Label>
                              <Text color='black' fontSize='xl'>
                                Eggs
                              </Text>
                            </FormControl.Label>

                            <Radio.Group
                              name='eggs'
                              accessibilityLabel='eggs'
                              value={`${eggs.value}`}
                              onChange={(value: any) => {
                                if (value === 'true') {
                                  setEggs({ ...eggs, value: true })
                                } else {
                                  setEggs({ ...eggs, value: false })
                                }
                              }}
                            >
                              <HStack space={4}>
                                <Radio
                                  colorScheme='primary'
                                  value='true'
                                  my={1}
                                  _icon={{ color: 'primary' }}
                                >
                                  Yes
                                </Radio>
                                <Radio
                                  colorScheme='primary'
                                  value='false'
                                  my={1}
                                  _icon={{ color: 'primary' }}
                                >
                                  No
                                </Radio>
                              </HStack>
                            </Radio.Group>
                          </HStack>
                        </FormControl>
                      )}
                    </HStack>
                    <HStack space={4} w='80%'>
                      {(species.value == 'Chinook salmon' ||
                        species.value == 'Steelhead / rainbow trout') && (
                        <FormControl w='full'>
                          <VStack space={4}>
                            <AddExistingMark
                              dropdownValues={dropdownValues}
                              activeTabId={tabSlice.activeTabId}
                              recentExistingMarks={recentExistingMarks}
                              handlePressRecentExistingMarkButton={
                                handlePressRecentExistingMarkButton
                              }
                              visitSetupState={visitSetupState}
                            />
                            <MarkBadgeList
                              badgeListContent={createdMarks}
                              field='existingMarks'
                              setExistingMarks={setExistingMarks}
                            />
                            {!fishConditionsDropdownOpen &&
                              !speciesDropDownOpen && (
                                <Pressable
                                  onPress={() => setAddMarkModalOpen(true)}
                                >
                                  <HStack alignItems='center'>
                                    <Icon
                                      as={Ionicons}
                                      name={'add-circle'}
                                      size='3xl'
                                      color='primary'
                                      marginRight='1'
                                    />
                                    <Text color='primary' fontSize='lg'>
                                      Add Another Mark
                                    </Text>
                                  </HStack>
                                </Pressable>
                              )}
                          </VStack>
                        </FormControl>
                      )}
                    </HStack>
                    {species.value === 'other' && (
                      <FormControl w='full'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Life Stage
                          </Text>
                        </FormControl.Label>
                        <Radio.Group
                          name='lifeStage'
                          accessibilityLabel='lifeStage'
                          value={
                            lifeStage.value !== ''
                              ? (lifeStage.value as string)
                              : 'adult'
                          }
                          onChange={(value: any) => {
                            if (value === 'adult') {
                              setLifeStage({ ...lifeStage, value })
                            } else {
                              setLifeStage({ ...lifeStage, value: 'juvenile' })
                            }
                          }}
                        >
                          <Radio
                            colorScheme='primary'
                            value='adult'
                            my={1}
                            _icon={{ color: 'primary' }}
                          >
                            Adult
                          </Radio>
                          <Radio
                            colorScheme='primary'
                            value='juvenile'
                            my={1}
                            _icon={{ color: 'primary' }}
                          >
                            Juvenile
                          </Radio>
                        </Radio.Group>
                      </FormControl>
                    )}
                    {!fishConditionsDropdownOpen && !speciesDropDownOpen && (
                      <HStack mb={'4'}>
                        {(species.value === 'Chinook salmon' ||
                          species.value === 'Steelhead / rainbow trout') && (
                          <Button
                            height='40px'
                            fontSize='16'
                            bg='secondary'
                            color='#007C7C'
                            py='1'
                            px='20'
                            shadow='3'
                            borderRadius='5'
                            maxWidth='40%'
                            marginRight='10'
                            onPress={() => setTagFishModalOpen(true)}
                          >
                            <Text color='primary'>Tag Fish</Text>
                          </Button>
                        )}
                        <Button
                          bg='secondary'
                          color='#007C7C'
                          py='1'
                          px='12'
                          shadow='3'
                          borderRadius='5'
                          maxWidth='40%'
                          onPress={() => setAddGeneticModalOpen(true)}
                        >
                          <Text color='primary'>Take Genetic Sample</Text>
                        </Button>
                      </HStack>
                    )}
                    {Array.isArray(appliedMarks?.value) &&
                      appliedMarks.value.length > 0 && (
                        <>
                          <Text color='black' fontSize='xl'>
                            Tags
                          </Text>
                          <TagBadgeList
                            badgeListContent={appliedMarks.value}
                            setAppliedMarks={setAppliedMarks}
                            appliedMarks={appliedMarks}
                          />
                        </>
                      )}
                    {Array.isArray(geneticSamples?.value) &&
                      geneticSamples.value.length > 0 && (
                        <>
                          <Text color='black' fontSize='xl'>
                            Genetic Samples
                          </Text>
                          <GeneticSampleBadgeList
                            badgeListContent={geneticSamples.value}
                            setGeneticSamples={setGeneticSamples}
                            geneticSamples={geneticSamples}
                          />
                        </>
                      )}
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Comments
                        </Text>
                      </FormControl.Label>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Write a comment'
                        keyboardType='default'
                        onChangeText={value => {
                          let payload: FormValueI = {
                            ...comments,
                            value,
                            touched: true,
                            error: '',
                          }
                          setComments(payload)
                        }}
                        value={comments.value as string}
                      />
                    </FormControl>
                  </VStack>
                </>
              )}
            </VStack>
          </Pressable>
        </ScrollView>
        <Box bg='themeGrey' pb='12' py='6' px='3'>
          <HStack justifyContent='space-evenly'>
            <Button
              flex='1'
              py='5'
              mx='2'
              bg='themeOrange'
              shadow='5'
              isDisabled={route.params?.editModeData ? false : formHasError}
              onPress={() => {
                if (route.params?.editModeData) {
                  navigation.goBack()
                  showSlideAlert(dispatch, 'Fish Input Saved')
                } else {
                  const activeTabId = tabSlice.activeTabId
                  if (activeTabId) {
                    let payload = returnFormValues()

                    saveIndividualFish({
                      tabId: activeTabId,
                      formValues: { ...payload, taxonCode: selectedTaxonCode },
                      UID: fishUID,
                    })
                    navigation.goBack()
                    showSlideAlert(dispatch, 'Fish Input Saved')
                  }
                }
              }}
            >
              <Text fontWeight='bold' color='white' fontSize='xl'>
                {route.params?.editModeData ? 'Cancel' : 'Save and Exit'}
              </Text>
            </Button>
            {route.params?.editModeData ? (
              <Button
                flex='1'
                bg='#b71c1c'
                onPress={() => {
                  const activeTabId = tabSlice.activeTabId
                  if (activeTabId) {
                    deleteFishEntry({
                      tabId: activeTabId,
                      id: route.params?.editModeData?.id,
                    })
                    navigation.goBack()
                  }
                }}
              >
                <Text fontWeight='bold' color='white' fontSize='xl'>
                  Delete
                </Text>
              </Button>
            ) : (
              <></>
            )}
            <Button
              flex='1'
              py='5'
              mx='2'
              bg='primary'
              shadow='5'
              isDisabled={route.params?.editModeData ? false : formHasError}
              onPress={() => {
                let payload = returnFormValues()

                const activeTabId = tabSlice.activeTabId
                if (route.params?.editModeData) {
                  if (activeTabId) {
                    updateFishEntry({
                      tabId: activeTabId,
                      id: route.params?.editModeData?.id,
                      ...payload,
                      taxonCode: selectedTaxonCode,
                      numFishCaught: count.value,
                    })
                    navigation.goBack()
                    showSlideAlert(dispatch, 'Fish Input Updated')
                  }
                } else {
                  const activeTabId = tabSlice.activeTabId
                  if (activeTabId) {
                    saveIndividualFish({
                      tabId: activeTabId,
                      formValues: { ...payload, taxonCode: selectedTaxonCode },
                    })
                    showSlideAlert(dispatch, 'Fish Input Saved')
                    if (
                      species.value &&
                      typeof species.value === 'string' &&
                      species.value.includes('Chinook')
                    ) {
                      resetFormState('chinook')
                    } else if (
                      species.value &&
                      typeof species.value === 'string' &&
                      species.value.includes('Steelhead')
                    ) {
                      resetFormState('steelhead')
                    } else {
                      resetFormState('other')
                    }
                  }
                }
              }}
            >
              <Text fontWeight='bold' color='white' fontSize='xl'>
                {route.params?.editModeData
                  ? 'Update'
                  : 'Save and Add Another Fish'}
              </Text>
            </Button>
          </HStack>
        </Box>
        {/* --------- Modals --------- */}
        {tagFishModalOpen && (
          <CustomModal
            isOpen={tagFishModalOpen}
            closeModal={() => setTagFishModalOpen(false)}
            height='80%'
          >
            <TagFishModalContent
              handleMarkFishFormSubmit={handleMarkFishFormSubmit}
              closeModal={() => setTagFishModalOpen(false)}
            />
          </CustomModal>
        )}
        {addGeneticModalOpen && (
          <CustomModal
            isOpen={addGeneticModalOpen}
            closeModal={() => setAddGeneticModalOpen(false)}
            height='100%'
          >
            <AddGeneticsModalContent
              handleGeneticSampleFormSubmit={handleGeneticSamplesFormSubmit}
              closeModal={() => setAddGeneticModalOpen(false)}
              species={species}
              reorderedTaxon={reorderedTaxon}
            />
          </CustomModal>
        )}
        {addMarkModalOpen && (
          <CustomModal
            isOpen={addMarkModalOpen}
            closeModal={() => setAddMarkModalOpen(false)}
            height='100%'
          >
            <AddAnotherMarkModalContent
              // handleAddAnotherMarkFormSubmit={handleAddAnotherMarkFormSubmit}
              closeModal={() => setAddMarkModalOpen(false)}
              screenName={'addIndividualFish'}
              setExistingMarks={setExistingMarks}
              existingMarks={existingMarks}
              existingMarksArray={existingMarks.value}
            />
          </CustomModal>
        )}
        <CustomModal
          isOpen={
            fishMeasureMetModalOpen &&
            !!protocolKeyMet &&
            typeof species.value === 'string' &&
            protocolKeyMet.toLowerCase().includes(species.value.toLowerCase())
          }
          closeModal={closeFishMeasureMetModal}
          height='40%'
          width={'80%'}
        >
          <MeasureMetPlusCount
            species={species}
            closeModal={closeFishMeasureMetModal}
            activeTabId={tabSlice.activeTabId}
            onSaveCallback={resetSpecies}
            protocolKeyMet={protocolKeyMet}
            lifeStageValue={lifeStage.value}
            runValue={run.value}
            dropdownValues={dropdownsStore.values}
          />
        </CustomModal>
      </View>
    </TouchableNativeFeedback>
  )
}

const mapStateToProps = (state: RootState) => {
  let activeTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.activeTabId]
  ) {
    activeTabId = state.tabSlice.activeTabId
  }

  return {
    fishStore: state.fishInput[activeTabId].fishStore,
    tabSlice: state.tabSlice,
    visitSetupState: state.visitSetup,
    visitSetupDefaults: state.visitSetupDefaults,
    visitSetupDefaultsState: state.visitSetupDefaults,
    fishInputSlice: state.fishInput,
    dropdownsStore: state.dropdowns,
    trapOperationsStore: state.trapOperations,
  }
}

export default connect(mapStateToProps, {
  saveIndividualFish,
  updateFishEntry,
  deleteFishEntry,
})(AddFishContent)
