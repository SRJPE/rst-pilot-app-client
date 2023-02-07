import React, { useMemo, useState } from 'react'
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
import { Formik } from 'formik'
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
import SpeciesPopoverContent from '../../components/form/popovers/SpeciesPopoverContent'
import LifeStagePopoverContent from '../../components/form/popovers/LifeStagePopoverContent'
import AddExistingMarkPopoverContent from '../../components/form/popovers/AddExistingMarkPopoverContent'

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

  const popoverTrigger = (triggerProps: any) => {
    return (
      <IconButton
        {...triggerProps}
        icon={<Icon as={MaterialIcons} name='info-outline' size='lg' />}
      ></IconButton>
    )
  }
  const [species, setSpecies] = useState('' as string)

  return (
    <Formik
      validationSchema={validationSchemas[validationSchema]}
      initialValues={
        route.params?.editModeData
          ? route.params.editModeData
          : individualFishInitialState
      }
      onSubmit={(values) => {
        handleFormSubmit(values)
        showSlideAlert(dispatch, 'Fish')
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        resetForm,
        touched,
        errors,
        values,
      }) => (
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
                  headerText={
                    route.params?.editModeData ? 'Edit Fish' : 'Add Fish'
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
                  <FormControl w='1/2' pr='5'>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Species
                        </Text>
                      </FormControl.Label>
                      <Popover
                        placement='bottom right'
                        trigger={popoverTrigger}
                      >
                        <SpeciesPopoverContent />
                      </Popover>

                      {touched.species &&
                        errors.species &&
                        RenderErrorMessage(errors, 'species')}
                    </HStack>
                    <CustomSelect
                      selectedValue={values.species}
                      placeholder={'Species'}
                      onValueChange={(value: any) => {
                        resetForm(resetFormValues)
                        handleChange('species')(value)
                        setSpecies(value)
                        if (value == 'Chinook salmon') {
                          setValidationSchema('default')
                        } else if (value == 'Steelhead / rainbow trout') {
                          setValidationSchema('optionalLifeStage')
                        } else {
                          setValidationSchema('otherSpecies')
                        }
                      }}
                      setFieldTouched={setFieldTouched}
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
                {species.length > 0 && (
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
                            onChangeText={handleChange('numFishCaught')}
                            onBlur={handleBlur('numFishCaught')}
                            value={values.count}
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
                            Number(values.forkLength),
                            values.lifeStage
                          )}
                          {touched.forkLength &&
                            errors.forkLength &&
                            RenderErrorMessage(errors, 'forkLength')}
                        </HStack>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType='numeric'
                          onChangeText={handleChange('forkLength')}
                          onBlur={handleBlur('forkLength')}
                          value={values.forkLength}
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
                          species === 'Chinook salmon' ||
                          species === 'Steelhead / rainbow trout'
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
                            Number(values.weight),
                            values.lifeStage
                          )}
                          {touched.weight &&
                            errors.weight &&
                            RenderErrorMessage(errors, 'weight')}
                        </HStack>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType='numeric'
                          onChangeText={handleChange('weight')}
                          onBlur={handleBlur('weight')}
                          value={values.weight}
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
                      {(species === 'Chinook salmon' ||
                        species === 'Steelhead / rainbow trout') && (
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
                              trigger={popoverTrigger}
                            >
                              <LifeStagePopoverContent />
                            </Popover>
                            {touched.lifeStage &&
                              errors.lifeStage &&
                              RenderErrorMessage(errors, 'lifeStage')}
                          </HStack>

                          <CustomSelect
                            selectedValue={values.lifeStage}
                            placeholder={'Life Stage'}
                            onValueChange={handleChange('lifeStage')}
                            setFieldTouched={setFieldTouched}
                            selectOptions={alphabeticalLifeStage
                              .filter((item: any) => {
                                if (
                                  item?.definition?.includes('juvenile') ||
                                  item?.definition?.includes('adult')
                                ) {
                                  return item
                                } else if (species == 'Chinook salmon') {
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
                          selectedValue={values.run}
                          placeholder={'Run'}
                          onValueChange={handleChange('run')}
                          setFieldTouched={setFieldTouched}
                          selectOptions={dropdownValues?.run}
                        />
                      </FormControl>
                    </HStack>
                    {species === 'Chinook salmon' && (
                      <FormControl w='1/2'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Adipose Clipped
                          </Text>
                        </FormControl.Label>

                        <Radio.Group
                          name='adiposeClipped'
                          accessibilityLabel='adipose clipped'
                          value={`${values.adiposeClipped}`}
                          onChange={(value: any) => {
                            if (value === 'true') {
                              setFieldValue('adiposeClipped', true)
                            } else {
                              setFieldValue('adiposeClipped', false)
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
                    {(species == 'Chinook salmon' ||
                      species == 'Steelhead / rainbow trout') && (
                      <FormControl w='full'>
                        <HStack space={2} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Add Existing Mark
                            </Text>
                          </FormControl.Label>
                          <Popover
                            placement='top right'
                            trigger={popoverTrigger}
                          >
                            <AddExistingMarkPopoverContent />
                          </Popover>
                        </HStack>

                        <HStack>
                          <Button
                            bg={
                              values.existingMark === 'CWT'
                                ? 'primary'
                                : 'secondary'
                            }
                            py='1'
                            px='12'
                            shadow='3'
                            borderRadius='5'
                            marginRight='10'
                            onPress={() => setFieldValue('existingMark', 'CWT')}
                          >
                            <Text
                              color={
                                values.existingMark === 'CWT'
                                  ? 'white'
                                  : 'primary'
                              }
                            >
                              CWT
                            </Text>
                          </Button>
                          <Button
                            bg={
                              values.existingMark === 'Fin Clip'
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
                              setFieldValue('existingMark', 'Fin Clip')
                            }
                          >
                            <Text
                              color={
                                values.existingMark === 'Fin Clip'
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
                    {species === 'other' && (
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
                            values.lifeStage.length > 0
                              ? values.lifeStage
                              : 'adult'
                          }
                          onChange={(value: any) => {
                            if (value === 'adult') {
                              setFieldValue('lifeStage', 'adult')
                            } else {
                              setFieldValue('lifeStage', 'juvenile')
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
                        value={`${values.dead}`}
                        onChange={(value: any) => {
                          if (value === 'true') {
                            setFieldValue('dead', true)
                          } else {
                            setFieldValue('dead', false)
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

                    {species === 'Chinook salmon' && (
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
                          value={`${values.willBeUsedInRecapture}`}
                          onChange={(value: any) => {
                            if (value === 'true') {
                              setFieldValue('willBeUsedInRecapture', true)
                            } else {
                              setFieldValue('willBeUsedInRecapture', false)
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
                          Place in a seperate bucket
                        </Text>
                      </FormControl>
                    )}
                    <HStack mb={'4'}>
                      {(species === 'Chinook salmon' ||
                        species === 'Steelhead / rainbow trout') && (
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
                      {species === 'Chinook salmon' && (
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
                isDisabled={
                  route.params?.editModeData
                    ? false
                    : handleSaveButtonDisable(touched, errors)
                }
                onPress={() => {
                  if (route.params?.editModeData) {
                    navigation.goBack()
                  } else {
                    handleSubmit()
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
                isDisabled={
                  route.params?.editModeData
                    ? false
                    : handleSaveButtonDisable(touched, errors)
                }
                onPress={() => {
                  if (route.params?.editModeData) {
                    updateFishEntry({
                      id: route.params?.editModeData?.id,
                      ...values,
                    })
                    navigation.goBack()
                  } else {
                    // bypasses formik to fix async issues.
                    // This should be fine since the button is only enabled when the form is valid
                    saveIndividualFish({ ...values })
                    showSlideAlert(dispatch, 'Fish')
                    resetForm({
                      values: {
                        species: values.species,
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
                    })
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
      )}
    </Formik>
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
