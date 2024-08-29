import React, { useCallback, useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Popover,
  Radio,
  ScrollView,
  View,
  Text,
  VStack,
  Pressable,
  Center,
  Badge,
} from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  addIndividualFishSchema,
  addIndividualFishSchemaOptionalLifeStage,
  addIndividualFishSchemaOtherSpecies,
} from '../../utils/helpers/yupValidations'
import Ionicons from '@expo/vector-icons/Ionicons'
import CustomModal from '../../components/Shared/CustomModal'
import CustomSelect from '../../components/Shared/CustomSelect'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../../components/Shared/CustomModalHeader'
import MarkFishModalContent from '../../components/form/MarkFishModalContent'
import AddGeneticsModalContent from '../../components/form/AddGeneticsModalContent'
import {
  FishStoreI,
  individualFishInitialState,
  saveIndividualFish,
  updateFishEntry,
  deleteFishEntry,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { saveGeneticSampleData } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { saveMarkOrTagData } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { MaterialIcons } from '@expo/vector-icons'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import { useNavigation } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { Keyboard, useWindowDimensions } from 'react-native'
import { alphabeticalSort, QARanges, reorderTaxon } from '../../utils/utils'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import AddAnotherMarkModalContent from '../../components/Shared/AddAnotherMarkModalContent'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import MarkBadgeList from '../../components/markRecapture/MarkBadgeList'
import { uid } from 'uid'
import SpeciesDropDown from '../../components/form/SpeciesDropDown'
import FishConditionsDropDown from '../../components/form/FishConditionsDropDown'
import { startCase } from 'lodash'

export interface ReleaseMarkI {
  id?: number
  releaseId?: number
  markPosition: number
  markType: number
  markColor: number
}

const AddFishContent = ({
  route,
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
  updateFishEntry,
  deleteFishEntry,
  activeTab,
  setActiveTab,
  closeModal,
  fishStore,
  tabSlice,
}: {
  route?: any
  saveIndividualFish: any
  saveMarkOrTagData: any
  saveGeneticSampleData: any
  updateFishEntry: any
  deleteFishEntry: any
  activeTab: any
  setActiveTab: any
  closeModal: any
  fishStore: FishStoreI
  tabSlice: TabStateI
}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch<AppDispatch>()
  // @ts-ignore
  const lastAddedFish = fishStore[Object.keys(fishStore).pop()]
  const [fishUID, setFishUID] = useState(uid() as string)

  const [validationSchema, setValidationSchema] = useState<
    'default' | 'optionalLifeStage' | 'otherSpecies'
  >('default')
  const [markFishModalOpen, setMarkFishModalOpen] = useState(false as boolean)
  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)
  const [addGeneticModalOpen, setAddGeneticModalOpen] = useState(
    false as boolean
  )
  const { height: screenHeight } = useWindowDimensions()

  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const reorderedTaxon = reorderTaxon(dropdownValues.taxon)

  const alphabeticalLifeStage = alphabeticalSort(
    dropdownValues.lifeStage,
    'definition'
  )

  const handleMarkFishFormSubmit = (values: any) => {
    saveMarkOrTagData({ ...values, UID: fishUID })
  }

  const handleGeneticSampleFormSubmit = (values: any) => {
    saveGeneticSampleData({ ...values, UID: fishUID })
  }

  useEffect(() => {
    setFishUID(uid())
  }, [])

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
    navigation.navigate('Trap Visit Form', {
      screen: 'Batch Count',
    })
  }

  // ------------------------------------------------------------------------------------------------------------------------

  interface FormValueI {
    value: Array<any> | string | boolean | null
    touched: boolean
    error: string
    required: boolean
  }

  const errorMessages = {
    species: { emptyError: 'Fish species required' },
    forkLength: {
      typeError: 'Input must be a number',
      emptyError: 'Fish fork length required',
    },
    weight: { typeError: 'Input must be a number' },
    lifeStage: { emptyError: 'Fish life stage required' },
    adiposeClipped: { emptyError: 'Fish adipose clipped status required' },
    dead: { emptyError: 'Fish mortality required' },
  }

  const createFormValueDefault = ({
    value,
    required = false,
    error = '',
    touched = false,
  }: {
    value: Array<any> | string | boolean | null
    required?: boolean
    error?: string
    touched?: boolean
  }) => {
    return { value, touched, error, required }
  }

  const stateDefaults = {
    whenSpeciesChinook: {
      species: createFormValueDefault({ value: null, required: true }),
      count: createFormValueDefault({ value: null }),
      forkLength: createFormValueDefault({ value: null, required: true }),
      run: createFormValueDefault({ value: null }),
      weight: createFormValueDefault({ value: null }),
      lifeStage: createFormValueDefault({ value: null, required: true }),
      adiposeClipped: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      existingMarks: createFormValueDefault({ value: [] }),
      dead: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      plusCountMethod: createFormValueDefault({ value: null }),
      fishConditions: createFormValueDefault({ value: [] }),
    },
    whenSpeciesSteelhead: {
      species: createFormValueDefault({ value: null, required: true }),
      count: createFormValueDefault({ value: null }),
      forkLength: createFormValueDefault({ value: null, required: true }),
      run: createFormValueDefault({ value: null }),
      weight: createFormValueDefault({ value: null }),
      lifeStage: createFormValueDefault({ value: null, required: true }),
      adiposeClipped: createFormValueDefault({
        value: null,
        touched: true,
      }),
      existingMarks: createFormValueDefault({ value: [] }),
      dead: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      plusCountMethod: createFormValueDefault({ value: null }),
      fishConditions: createFormValueDefault({ value: [] }),
    },
    whenSpeciesOther: {
      species: createFormValueDefault({ value: null, required: true }),
      count: createFormValueDefault({ value: null }),
      forkLength: createFormValueDefault({ value: null, required: true }),
      run: createFormValueDefault({ value: null }),
      weight: createFormValueDefault({ value: null }),
      lifeStage: createFormValueDefault({ value: null }),
      adiposeClipped: createFormValueDefault({
        value: null,
        touched: true,
        required: false,
      }),
      existingMarks: createFormValueDefault({ value: [] }),
      dead: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      plusCountMethod: createFormValueDefault({ value: null }),
      fishConditions: createFormValueDefault({ value: [] }),
    },
  }

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
          value: route.params?.editModeData.forkLength.toString(),
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
  const [dead, setDead] = useState<FormValueI>(
    !route.params?.editModeData
      ? stateDefaults.whenSpeciesChinook.dead
      : createFormValueDefault({
          value: route.params?.editModeData.dead,
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
    plusCountMethod,
  ])

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
      plusCountMethod,
    ]
    let hasError = false
    formValues.every((field) => {
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
    setPlusCountMethod(stateDefaults[identifier].plusCountMethod)
    setFormHasError(true)
    setFishUID(uid())
    setRecentExistingMarks([])
  }

  //RECENT MARKS ADDITIONS
  const [recentExistingMarks, setRecentExistingMarks] = useState<any[]>([])

  const returnDefinitionArray = (dropdownsArray: any[]) => {
    return dropdownsArray.map((dropdownObj: any) => {
      return dropdownObj.definition
    })
  }

  const markTypeValues = returnDefinitionArray(dropdownValues.markType)
  const markColorValues = returnDefinitionArray(dropdownValues.markColor)
  const bodyPartValues = returnDefinitionArray(dropdownValues.bodyPart)

  const decodedRecentReleaseMarks = (twoMostRecentReleaseMarks: any) => {
    return twoMostRecentReleaseMarks.map((mark: ReleaseMarkI) => {
      return {
        ...mark,
        markType: markTypeValues[mark.markType - 1],
        markColor: markColorValues[mark.markColor - 1],
        markPosition: bodyPartValues[mark.markPosition - 1],
      }
    })
  }

  const handlePressRecentExistingMarkButton = (
    selectedRecentReleaseMark: ReleaseMarkI
  ) => {
    if (
      recentExistingMarks.some(
        (mark) => mark.id === selectedRecentReleaseMark.id
      )
    ) {
      setRecentExistingMarks(
        recentExistingMarks.filter(
          (mark) => mark.id !== selectedRecentReleaseMark.id
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
      return fieldValue || 'not recorded'
    } else {
      return fieldValue || null
    }
  }
  const returnFormValues = () => {
    let values = {
      species: species.value,
      forkLength: forkLength.value,
      run: determineValueNotRecordedOrNull(species.value, 'run', run.value),
      fishConditions: fishConditions.value,
      weight: weight.value,
      lifeStage: determineValueNotRecordedOrNull(
        species.value,
        'lifeStage',
        lifeStage.value
      ),
      adiposeClipped: adiposeClipped.value,
      // @ts-ignore
      existingMarks: [...existingMarks.value, ...recentExistingMarks],
      dead: dead.value,
      plusCountMethod: plusCountMethod.value,
    }

    return values
  }

  /* Additions for species and fish condition dropdowns */
  const [speciesDropDownOpen, setSpeciesDropDownOpen] = useState(
    false as boolean
  )
  const [speciesList, setSpeciesList] = useState<
    { label: string; value: string }[]
  >(
    reorderedTaxon.map((taxon: any) => ({
      label: taxon?.commonname,
      value: taxon?.commonname,
    }))
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

  return (
    <>
      <ScrollView
        scrollEnabled={screenHeight < 1180}
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
                    ? `Edit Fish - ${tabSlice.tabs[tabSlice.activeTabId].name}`
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
            <HStack alignItems='center'>
              <FormControl w='1/2' pr='5' mb={speciesDropDownOpen ? 180 : 0}>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Species
                    </Text>
                  </FormControl.Label>
                  <Popover
                    placement='bottom right'
                    trigger={(triggerProps) => {
                      return (
                        <IconButton
                          {...triggerProps}
                          icon={
                            <Icon
                              as={MaterialIcons}
                              color='black'
                              name='info-outline'
                              size='xl'
                            />
                          }
                        ></IconButton>
                      )
                    }}
                  >
                    <Popover.Content
                      mx='10'
                      mb='10'
                      accessibilityLabel='Species Lookup'
                      minW='720'
                      minH='300'
                      backgroundColor='light.100'
                    >
                      <Popover.Arrow />
                      <Popover.CloseButton />
                      <Popover.Body p={0}>
                        <ScrollView>
                          <Image
                            source={require('../../../assets/speciesID/Species_ID_Sheet_1-1.jpg')}
                            alt='Species ID'
                            size='1000px'
                          />
                          <Image
                            source={require('../../../assets/speciesID/Species_ID_Sheet_2-2.jpg')}
                            alt='Species ID'
                            size='1000px'
                          />
                          <Image
                            source={require('../../../assets/speciesID/Species_ID_Sheet_3-3.jpg')}
                            alt='Species ID'
                            size='1000px'
                          />
                          <Image
                            source={require('../../../assets/speciesID/Species_ID_Sheet_4-end.jpg')}
                            alt='Species ID'
                            size='1000px'
                          />
                        </ScrollView>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>

                  {species.touched &&
                    species.error &&
                    RenderErrorMessage(species.error, 'species')}
                </HStack>
                <SpeciesDropDown
                  editModeValue={route.params?.editModeData?.species}
                  open={speciesDropDownOpen}
                  onOpen={onSpeciesOpen}
                  setOpen={setSpeciesDropDownOpen}
                  list={speciesList}
                  setList={setSpeciesList}
                  speciesValue={species.value as string}
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
                  setFieldTouched={() =>
                    setSpecies({ ...species, touched: true })
                  }
                />
              </FormControl>
            </HStack>

            <Divider mt={1} />

            {(species.value as string) !== '' && species.value !== null && (
              <>
                <VStack space={4}>
                  <HStack space={4}>
                    <FormControl
                      w={route.params?.editModeData ? '1/3' : '1/2'}
                      pr='5'
                    >
                      <HStack space={4} alignItems='center'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Fork Length
                          </Text>
                        </FormControl.Label>
                        {renderForkLengthWarning(
                          Number(forkLength.value),
                          lifeStage.value as string
                        )}
                        {forkLength.touched &&
                          forkLength.error &&
                          RenderErrorMessage(
                            { forkLength: forkLength.error },
                            'forkLength'
                          )}
                      </HStack>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={(value) => {
                          let payload: FormValueI = {
                            ...forkLength,
                            value,
                            touched: true,
                            error: '',
                          }
                          if (value === '') {
                            payload.error = errorMessages.forkLength.emptyError
                          } else if (!Number(value)) {
                            payload.error = errorMessages.forkLength.typeError
                          }
                          setForkLength(payload)
                        }}
                        // TODO - onBlur logic?
                        // onBlur={handleBlur('forkLength')}
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
                      w={route.params?.editModeData ? '1/3' : '1/2'}
                      paddingRight='9'
                    >
                      <HStack space={4} alignItems='center'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Weight (optional)
                          </Text>
                        </FormControl.Label>
                        {renderWeightWarning(
                          Number(weight.value),
                          weight.value as string
                        )}
                        {weight.touched &&
                          weight.error &&
                          RenderErrorMessage(
                            { weight: weight.error },
                            'weight'
                          )}
                      </HStack>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={(value) => {
                          let payload: FormValueI = {
                            ...weight,
                            value,
                            touched: true,
                            error: '',
                          }
                          if (value === '') {
                            payload.error = ''
                          } else if (!Number(value)) {
                            payload.error = errorMessages.weight.typeError
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
                      <FormControl w='1/3' pr='5'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Count
                          </Text>
                        </FormControl.Label>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType='numeric'
                          onChangeText={(value) =>
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

                  <HStack space={4} alignItems='center'>
                    {(species.value === 'Chinook salmon' ||
                      species.value === 'Steelhead / rainbow trout') && (
                      <FormControl w='1/2' paddingRight='5'>
                        <HStack space={2} alignItems='center' mb='-1.5'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Life Stage{' '}
                              {validationSchema == 'optionalLifeStage'
                                ? '(optional)'
                                : ''}
                            </Text>
                          </FormControl.Label>

                          <Popover
                            placement='bottom right'
                            trigger={(triggerProps) => {
                              return (
                                <IconButton
                                  {...triggerProps}
                                  icon={
                                    <Icon
                                      as={MaterialIcons}
                                      color='black'
                                      name='info-outline'
                                      size='xl'
                                    />
                                  }
                                ></IconButton>
                              )
                            }}
                          >
                            <Popover.Content
                              ml='10'
                              accessibilityLabel='Existing Mark Info'
                              w='720'
                              h='600'
                            >
                              <Popover.Arrow />
                              <Popover.CloseButton />
                              <Popover.Body p={0}>
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
                              </Popover.Body>
                            </Popover.Content>
                          </Popover>
                          {lifeStage.touched &&
                            lifeStage.error &&
                            RenderErrorMessage(
                              { lifeStage: lifeStage.error },
                              'lifeStage'
                            )}
                        </HStack>

                        <CustomSelect
                          selectedValue={lifeStage.value as string}
                          placeholder={'Life Stage'}
                          onValueChange={(value: string) => {
                            let payload: FormValueI = {
                              ...lifeStage,
                              value,
                              error: '',
                            }
                            setLifeStage(payload)
                          }}
                          setFieldTouched={() => {
                            let payload = { ...lifeStage, touched: true }
                            if (!lifeStage.value)
                              payload.error = errorMessages.lifeStage.emptyError
                            setLifeStage(payload)
                          }}
                          selectOptions={alphabeticalLifeStage
                            .filter((item: any) => {
                              if (
                                item?.definition?.includes('juvenile') ||
                                item?.definition?.includes('adult')
                              ) {
                                return item
                              } else if (species.value == 'Chinook salmon') {
                                return item
                              }
                            })
                            .map((item: any) => ({
                              label: item?.definition,
                              value: item?.definition,
                            }))}
                        />
                      </FormControl>
                    )}
                    {species.value == 'Chinook salmon' && (
                      <FormControl w='1/2' paddingRight='9'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Run
                          </Text>
                        </FormControl.Label>
                        <CustomSelect
                          selectedValue={run.value as string}
                          placeholder={'Run'}
                          onValueChange={(value: string) =>
                            setRun({ ...run, value })
                          }
                          setFieldTouched={() =>
                            setRun({ ...run, touched: true })
                          }
                          selectOptions={dropdownValues?.run}
                        />
                      </FormControl>
                    )}
                  </HStack>

                  <FormControl
                    w='100%'
                    paddingRight='9'
                    mb={fishConditionsDropdownOpen ? 160 : 0}
                  >
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
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

                  <HStack space={4} w='80%'>
                    {(species.value == 'Chinook salmon' ||
                      species.value == 'Steelhead / rainbow trout') && (
                      <FormControl w='full'>
                        <HStack space={2} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Add Existing Mark
                            </Text>
                          </FormControl.Label>
                          <Popover
                            placement='top right'
                            trigger={(triggerProps) => {
                              return (
                                <IconButton
                                  {...triggerProps}
                                  icon={
                                    <Icon
                                      as={MaterialIcons}
                                      color='black'
                                      name='info-outline'
                                      size='xl'
                                    />
                                  }
                                ></IconButton>
                              )
                            }}
                          >
                            <Popover.Content
                              accessibilityLabel='Existing Mark  Info'
                              w='600'
                              ml='10'
                            >
                              <Popover.Arrow />
                              <Popover.CloseButton />
                              <Popover.Header>
                                Click on one more existing mark buttons to add
                                marks.
                              </Popover.Header>
                              <Popover.Body p={4}>
                                <VStack space={2}>
                                  <Text fontSize='md'>
                                    The existing mark buttons display
                                    abbreviated versions of marks recently used
                                    for efficiency trials. If you catch a fish
                                    with other existing marks, please click on
                                    “select another mark type”. This will open
                                    up a window where you can specify mark type,
                                    color, position, and code if applicable.
                                  </Text>
                                  <Divider />

                                  <Text fontSize='md'>
                                    Abbreviations follow a consistent format
                                    “mark type abbreviation - color abbreviation
                                    - position abbreviation”. All of these
                                    fields are only applicable to some mark
                                    types. Any fields that are not applicable to
                                    a particular mark type are left blank.
                                  </Text>
                                  <Text fontSize='md'>
                                    Below are some examples of common marks:
                                  </Text>
                                  <HStack space={2} alignItems='flex-start'>
                                    <Avatar size={'2'} mt={'2'} />
                                    <Text fontSize='md'>
                                      CWT: Coded wire tag
                                    </Text>
                                  </HStack>
                                  <HStack space={2} alignItems='flex-start'>
                                    <Avatar size={'2'} mt={'2'} />
                                    <Text fontSize='md'>Fin Clip</Text>
                                  </HStack>
                                </VStack>
                              </Popover.Body>
                            </Popover.Content>
                          </Popover>
                        </HStack>
                        <VStack space={4}>
                          <VStack space={5}>
                            {dropdownValues.twoMostRecentReleaseMarks.length >
                              0 &&
                              decodedRecentReleaseMarks(
                                dropdownValues.twoMostRecentReleaseMarks
                              ).map((recentReleaseMark: any, index: number) => {
                                const {
                                  id,
                                  markType,
                                  markColor,
                                  markPosition,
                                } = recentReleaseMark
                                return (
                                  <Button
                                    key={index}
                                    bg={
                                      recentExistingMarks.some(
                                        (mark: ReleaseMarkI) => mark.id === id
                                      )
                                        ? 'primary'
                                        : 'secondary'
                                    }
                                    shadow='3'
                                    borderRadius='5'
                                    w='90%'
                                    onPress={() => {
                                      handlePressRecentExistingMarkButton(
                                        recentReleaseMark
                                      )
                                    }}
                                  >
                                    <Text
                                      color={
                                        recentExistingMarks.some(
                                          (mark: ReleaseMarkI) => mark.id === id
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
                            badgeListContent={existingMarks.value}
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
                          onPress={() => setMarkFishModalOpen(true)}
                        >
                          <Text color='primary'>Tag Fish</Text>
                        </Button>
                      )}
                      {species.value === 'Chinook salmon' && (
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
                      )}
                    </HStack>
                  )}
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
              } else {
                const activeTabId = tabSlice.activeTabId
                if (activeTabId) {
                  let payload = returnFormValues()
                  saveIndividualFish({
                    tabId: activeTabId,
                    formValues: payload,
                    UID: fishUID,
                  })
                  navigation.goBack()
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
                    numFishCaught: count.value,
                  })
                  navigation.goBack()
                }
              } else {
                const activeTabId = tabSlice.activeTabId
                if (activeTabId) {
                  saveIndividualFish({
                    tabId: activeTabId,
                    formValues: payload,
                  })
                  showSlideAlert(dispatch, 'Fish')
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
      <CustomModal
        isOpen={markFishModalOpen}
        closeModal={() => setMarkFishModalOpen(false)}
        height='3/4'
      >
        <MarkFishModalContent
          handleMarkFishFormSubmit={handleMarkFishFormSubmit}
          closeModal={() => setMarkFishModalOpen(false)}
        />
      </CustomModal>
      <CustomModal
        isOpen={addGeneticModalOpen}
        closeModal={() => setAddGeneticModalOpen(false)}
        height='3/4'
      >
        <AddGeneticsModalContent
          handleGeneticSampleFormSubmit={handleGeneticSampleFormSubmit}
          closeModal={() => setAddGeneticModalOpen(false)}
        />
      </CustomModal>
      <CustomModal
        isOpen={addMarkModalOpen}
        closeModal={() => setAddMarkModalOpen(false)}
        height='1/2'
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
    </>
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
  }
}

export default connect(mapStateToProps, {
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
  updateFishEntry,
  deleteFishEntry,
})(AddFishContent)
