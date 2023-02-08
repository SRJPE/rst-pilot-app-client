import React, { useState } from 'react'
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
}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch<AppDispatch>()
  // @ts-ignore
  const lastAddedFish = fishStore[Object.keys(fishStore).pop()]
  const validationSchemas = {
    default: addIndividualFishSchema,
    optionalLifeStage: addIndividualFishSchemaOptionalLifeStage,
    otherSpecies: addIndividualFishSchemaOtherSpecies,
  }
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

  const handleFormSubmit = (values: any) => {
    saveIndividualFish(values)
  }

  const handleMarkFishFormSubmit = (values: any) => {
    saveMarkOrTagData(values)
  }

  const handleGeneticSampleFormSubmit = (values: any) => {
    saveGeneticSampleData(values)
  }

  const handleSaveButtonDisable = (touched: any, errors: any) => {
    return (
      (touched && Object.keys(touched).length === 0) ||
      (errors && Object.keys(errors).length > 0)
    )
  }

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

  const resetFormValues = {
    values: {
      species: '',
      forkLength: '',
      run: '',
      weight: '',
      lifeStage: '',
      adiposeClipped: false,
      existingMark: '',
      dead: false,
      willBeUsedInRecapture: false,
      plusCountMethod: '',
    },
  }

  const buttonNav = () => {
    // @ts-ignore
    navigation.navigate('Trap Visit Form', {
      screen: 'Batch Count',
    })
  }

  // ------------------------------------------------------------------------------------------------------------------------

  interface FormValueI {
    value: string | boolean
    touched: boolean
    error: boolean
  }

  const createFormValueDefault = (value: string | boolean) => {
    return { value, touched: false, error: false }
  }

  const [species, setSpecies] = useState<FormValueI>(createFormValueDefault(''))
  const [count, setCount] = useState<FormValueI>(createFormValueDefault(''))
  const [forkLength, setForkLength] = useState<FormValueI>(
    createFormValueDefault('')
  )
  const [run, setRun] = useState<FormValueI>(createFormValueDefault(''))
  const [weight, setWeight] = useState<FormValueI>(createFormValueDefault(''))
  const [lifeStage, setLifeStage] = useState<FormValueI>(
    createFormValueDefault('')
  )
  const [adiposeClipped, setAdiposeClipped] = useState<FormValueI>(
    createFormValueDefault(false)
  )
  const [existingMark, setExistingMark] = useState<FormValueI>(
    createFormValueDefault('')
  )
  const [dead, setDead] = useState<FormValueI>(createFormValueDefault(false))
  const [willBeUsedInRecapture, setWillBeUsedInRecapture] =
    useState<FormValueI>(createFormValueDefault(false))
  const [plusCountMethod, setPlusCountMethod] = useState<FormValueI>(
    createFormValueDefault('')
  )

  const resetFormState = () => {
    setSpecies(createFormValueDefault(''))
    setForkLength(createFormValueDefault(''))
    setRun(createFormValueDefault(''))
    setWeight(createFormValueDefault(''))
    setLifeStage(createFormValueDefault(''))
    setAdiposeClipped(createFormValueDefault(false))
    setExistingMark(createFormValueDefault(''))
    setDead(createFormValueDefault(false))
    setWillBeUsedInRecapture(createFormValueDefault(false))
    setPlusCountMethod(createFormValueDefault(''))
  }

  return (
    <>
      <ScrollView
        flex={1}
        scrollEnabled={screenHeight < 1180}
        bg='#fff'
        borderWidth='10'
        borderBottomWidth='0'
        borderColor='themeGrey'
      >
        <Pressable onPress={Keyboard.dismiss}>
          <HStack space={10}>
            <CustomModalHeader
              headerText={route.params?.editModeData ? 'Edit Fish' : 'Add Fish'}
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
              <FormControl w='1/2' pr='5'>
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
                <CustomSelect
                  selectedValue={species.value as string}
                  placeholder={'Species'}
                  onValueChange={(value: string) => {
                    resetFormState()
                    setSpecies({ ...species, value })
                    // TODO - validation logic
                    // if (value == 'Chinook salmon') {
                    //   setValidationSchema('default')
                    // } else if (value == 'Steelhead / rainbow trout') {
                    //   setValidationSchema('optionalLifeStage')
                    // } else {
                    //   setValidationSchema('otherSpecies')
                    // }
                  }}
                  setFieldTouched={() =>
                    setSpecies({ ...species, touched: true })
                  }
                  selectOptions={reorderedTaxon.map((taxon: any) => ({
                    label: taxon?.commonname,
                    value: taxon?.commonname,
                  }))}
                />
              </FormControl>
              {/* <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl' paddingBottom='3'>
                        Reset Form
                      </Text>
                    </FormControl.Label>
                    <Button
                      h='50'
                      w='1/2'
                      bg='primary'
                      onPress={() => resetForm(resetFormValues)}
                    >
                      Clear All Values
                    </Button>
                  </FormControl> */}
            </HStack>

            <Divider mt={1} />
            {
              // TODO - verify logic below works as intended
            }
            {(species.value as string) !== '' && (
              <>
                {route.params?.editModeData ? (
                  <HStack alignItems='center'>
                    <FormControl w='1/2' pr='5'>
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
                        onChangeText={(value) => setCount({ ...count, value })}
                        // TODO - onBlur logic?
                        // onBlur={handleBlur('numFishCaught')}
                        value={count.value as string}
                      />
                    </FormControl>
                  </HStack>
                ) : (
                  <></>
                )}

                <HStack>
                  <FormControl w='1/2' pr='5'>
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
                      onChangeText={(value) =>
                        setForkLength({ ...forkLength, value })
                      }
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
                    w='47%'
                    paddingLeft={
                      species.value === 'Chinook salmon' ||
                      species.value === 'Steelhead / rainbow trout'
                        ? '5'
                        : '0'
                    }
                  >
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Weight (optional)
                        </Text>
                      </FormControl.Label>
                      {renderWeightWarning(
                        Number(weight.value),
                        lifeStage.value as string
                      )}
                      {weight.touched &&
                        weight.error &&
                        RenderErrorMessage({ weight: weight.error }, 'weight')}
                    </HStack>
                    <Input
                      height='50px'
                      fontSize='16'
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={(value) => setWeight({ ...weight, value })}
                      // TODO - onBlur logic?
                      // onBlur={handleBlur('weight')}
                      value={weight.value as string}
                    />
                    <Text
                      color='#A1A1A1'
                      position='absolute'
                      top={50}
                      right={4}
                      fontSize={16}
                    >
                      {'g'}
                    </Text>
                  </FormControl>
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
                        onValueChange={(value: string) =>
                          setLifeStage({ ...lifeStage, value })
                        }
                        setFieldTouched={() =>
                          setLifeStage({ ...lifeStage, touched: true })
                        }
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
                      setFieldTouched={() => setRun({ ...run, touched: true })}
                      selectOptions={dropdownValues?.run}
                    />
                  </FormControl>
                </HStack>
                {species.value === 'Chinook salmon' && (
                  <FormControl w='1/2'>
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
                          setAdiposeClipped({ ...adiposeClipped, value: true })
                        } else {
                          setAdiposeClipped({ ...adiposeClipped, value: false })
                        }
                      }}
                    >
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
                    </Radio.Group>
                  </FormControl>
                )}
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
                                The existing mark buttons display abbreviated
                                versions of marks recently used for efficiency
                                trials. If you catch a fish with other existing
                                marks, please click on “select another mark
                                type”. This will open up a window where you can
                                specify mark type, color, position, and code if
                                applicable.
                              </Text>
                              <Divider />

                              <Text fontSize='md'>
                                Abbreviations follow a consistent format “mark
                                type abbreviation - color abbreviation -
                                position abbreviation”. All of these fields are
                                only applicable to some mark types. Any fields
                                that are not applicable to a particular mark
                                type are left blank.
                              </Text>
                              <Text fontSize='md'>
                                Below are some examples of common marks:
                              </Text>
                              <HStack space={2} alignItems='flex-start'>
                                <Avatar size={'2'} mt={'2'} />
                                <Text fontSize='md'>CWT: Coded wire tag</Text>
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

                    <HStack>
                      <Button
                        bg={
                          existingMark.value === 'CWT' ? 'primary' : 'secondary'
                        }
                        py='1'
                        px='12'
                        shadow='3'
                        borderRadius='5'
                        marginRight='10'
                        onPress={() =>
                          setExistingMark({ ...existingMark, value: 'CWT' })
                        }
                      >
                        <Text
                          color={
                            existingMark.value === 'CWT' ? 'white' : 'primary'
                          }
                        >
                          CWT
                        </Text>
                      </Button>
                      <Button
                        bg={
                          existingMark.value === 'Fin Clip'
                            ? 'primary'
                            : 'secondary'
                        }
                        color='#007C7C'
                        py='1'
                        px='12'
                        shadow='3'
                        borderRadius='5'
                        marginRight='10'
                        onPress={() =>
                          setExistingMark({
                            ...existingMark,
                            value: 'Fin Clip',
                          })
                        }
                      >
                        <Text
                          color={
                            existingMark.value === 'Fin Clip'
                              ? 'white'
                              : 'primary'
                          }
                        >
                          Fin Clip
                        </Text>
                      </Button>
                      <Pressable onPress={() => setAddMarkModalOpen(true)}>
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
                    </HStack>
                  </FormControl>
                )}
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

                <FormControl w='full'>
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
                  </Radio.Group>
                </FormControl>

                {species.value === 'Chinook salmon' && (
                  <FormControl w='full'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Will this fish be used in your next mark recapture
                        trial?
                      </Text>
                    </FormControl.Label>
                    <Radio.Group
                      name='willBeUsedInRecapture'
                      accessibilityLabel='Will be used in recapture?'
                      value={`${willBeUsedInRecapture.value}`}
                      onChange={(value: any) => {
                        if (value === 'true') {
                          setWillBeUsedInRecapture({
                            ...willBeUsedInRecapture,
                            value: true,
                          })
                        } else {
                          setWillBeUsedInRecapture({
                            ...willBeUsedInRecapture,
                            value: false,
                          })
                        }
                      }}
                    >
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
                    </Radio.Group>
                    <Text color='#A19C9C' marginTop='2' fontSize='xl'>
                      Place in a separate bucket
                    </Text>
                  </FormControl>
                )}
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
            // TODO - fix value for isDisabled
            isDisabled={
              false
              // route.params?.editModeData
              //   ? false
              //   : handleSaveButtonDisable(touched, errors)
            }
            onPress={() => {
              if (route.params?.editModeData) {
                navigation.goBack()
              } else {
                // handleSubmit()
                navigation.goBack()
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
                deleteFishEntry(route.params?.editModeData?.id)
                navigation.goBack()
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
            // TODO - fix value for isDisabled
            isDisabled={
              false
              // route.params?.editModeData
              //   ? false
              //   : handleSaveButtonDisable(touched, errors)
            }
            onPress={() => {
              if (route.params?.editModeData) {
                // TODO - payload for redux submission
                // updateFishEntry({
                //   id: route.params?.editModeData?.id,
                //   ...values,
                // })
                navigation.goBack()
              } else {
                // bypasses formik to fix async issues.
                // This should be fine since the button is only enabled when the form is valid
                // saveIndividualFish({ ...values })
                showSlideAlert(dispatch, 'Fish')
                resetFormState()
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
        height='3/4'
      >
        <AddAnotherMarkModalContent
          // handleAddAnotherMarkFormSubmit={handleAddAnotherMarkFormSubmit}
          closeModal={() => setAddMarkModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    fishStore: state.fishInput.fishStore,
  }
}

export default connect(mapStateToProps, {
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
  updateFishEntry,
  deleteFishEntry,
})(AddFishContent)
