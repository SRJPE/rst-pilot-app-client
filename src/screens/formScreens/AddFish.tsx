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
import { Formik } from 'formik'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  addIndividualFishSchema,
  addIndividualFishSchemaOptionalLifeStage,
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
  individualFishInitialState,
  saveIndividualFish,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { saveGeneticSampleData } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { saveMarkOrTagData } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { MaterialIcons } from '@expo/vector-icons'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import { useNavigation } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { Keyboard } from 'react-native'
import { QARanges } from '../../utils/utils'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'

const AddFishContent = ({
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
  activeTab,
  setActiveTab,
  closeModal,
  individualFishStore,
  taxonDropdowns,
}: {
  saveIndividualFish: any
  saveMarkOrTagData: any
  saveGeneticSampleData: any
  activeTab: any
  setActiveTab: any
  closeModal: any
  individualFishStore: any
  taxonDropdowns: any
}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch<AppDispatch>()
  const lastAddedFish = [...individualFishStore].pop() as any
  const validationSchemas = {
    default: addIndividualFishSchema,
    optionalLifeStage: addIndividualFishSchemaOptionalLifeStage,
  }
  const [validationSchema, setValidationSchema] = useState<
    'default' | 'optionalLifeStage'
  >('default')
  const [markFishModalOpen, setMarkFishModalOpen] = useState(false as boolean)
  const [addGeneticModalOpen, setAddGeneticModalOpen] = useState(
    false as boolean
  )
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
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

  return (
    <Formik
      validationSchema={validationSchemas[validationSchema]}
      initialValues={lastAddedFish ? lastAddedFish : individualFishInitialState}
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
          <View
            flex={1}
            bg='#fff'
            borderWidth='10'
            borderBottomWidth='0'
            borderColor='themeGrey'
          >
            <Pressable onPress={Keyboard.dismiss}>
              <CustomModalHeader
                headerText={'Add Fish'}
                showHeaderButton={true}
                closeModal={closeModal}
                navigateBack={true}
                headerButton={null}
                //   AddFishModalHeaderButton({
                //   activeTab,
                //   setActiveTab,
                // })
                // }
              />
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
                          ml='10'
                          accessibilityLabel='Species Lookup'
                          minW='720'
                          minH='300'
                          backgroundColor='light.100'
                        >
                          <Popover.Arrow />
                          <Popover.CloseButton />
                          <Popover.Body p={0} flex={1}>
                            <ScrollView>
                              <Center>
                                <Popover.Header>Species Lookup</Popover.Header>
                              </Center>
                            </ScrollView>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>

                      {touched.species &&
                        errors.species &&
                        RenderErrorMessage(errors, 'species')}
                    </HStack>
                    <CustomSelect
                      selectedValue={values.species}
                      placeholder={'Species'}
                      onValueChange={(value: any) => {
                        handleChange('species')(value)
                        if (value == 'Steelhead') {
                          setValidationSchema('optionalLifeStage')
                        } else {
                          setValidationSchema('default')
                        }
                      }}
                      setFieldTouched={setFieldTouched}
                      selectOptions={taxonDropdowns
                        .map((taxon: any) => {
                          if (taxon?.commonname == 'Chinook salmon') {
                            return {
                              label: 'Chinook',
                              value: 'Chinook',
                            }
                          } else if (
                            taxon?.commonname == 'Steelhead / rainbow trout'
                          ) {
                            return {
                              label: 'Steelhead',
                              value: 'Steelhead',
                            }
                          } else {
                            return {
                              label: taxon?.commonname,
                              value: taxon?.commonname,
                            }
                          }
                        })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Reset Form
                      </Text>
                    </FormControl.Label>
                    <Button
                      h='50'
                      w='1/2'
                      bg='primary'
                      onPress={() =>
                        resetForm({
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
                        })
                      }
                    >
                      Clear All Values
                    </Button>
                  </FormControl>
                </HStack>

                <Divider mt={1} />
                {values.species.length > 0 && (
                  <>
                    <HStack>
                      <FormControl w='1/2' pr='5'>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Fork Length
                            </Text>
                          </FormControl.Label>
                          {Number(values.forkLength) >
                            QARanges.forkLength.max && RenderWarningMessage()}
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
                      {values.species !== 'other' &&
                        values.species !== 'Steelhead' && (
                          <FormControl w='1/2' paddingLeft={5}>
                            <HStack space={4} alignItems='center'>
                              <FormControl.Label>
                                <Text color='black' fontSize='xl'>
                                  Run:
                                </Text>
                              </FormControl.Label>
                              <Text color='grey' fontSize='sm'>
                                (currently disabled)
                              </Text>
                              {/* {touched.run &&
                        errors.run &&
                        RenderErrorMessage(errors, 'run')} */}
                            </HStack>
                            {/* <Input
                      height='50px'
                      fontSize='16'
                      placeholder='Calculated from fork length (disabled)'
                      keyboardType='numeric'
                      onChangeText={handleChange('run')}
                      onBlur={handleBlur('run')}
                      value={values.run}
                    /> */}
                          </FormControl>
                        )}
                    </HStack>

                    <HStack>
                      {(values.species === 'Chinook' ||
                        values.species === 'Steelhead') && (
                        <FormControl w='1/2' paddingRight='5'>
                          <HStack space={2} alignItems='center'>
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
                            {touched.lifeStage &&
                              errors.lifeStage &&
                              RenderErrorMessage(errors, 'lifeStage')}
                          </HStack>

                          <CustomSelect
                            selectedValue={values.lifeStage}
                            placeholder={'Life Stage'}
                            onValueChange={handleChange('lifeStage')}
                            setFieldTouched={setFieldTouched}
                            selectOptions={dropdownValues.lifeStage.map(
                              (item: any) => ({
                                label: item.definition,
                                value: item.definition,
                              })
                            )}
                          />
                        </FormControl>
                      )}
                      {values.species !== 'other' && (
                        <FormControl
                          w='47%'
                          paddingLeft={
                            values.species === 'Chinook' ||
                            values.species === 'Steelhead'
                              ? '5'
                              : '0'
                          }
                        >
                          <HStack space={4} alignItems='center'>
                            <FormControl.Label pb='3'>
                              <Text color='black' fontSize='xl'>
                                Weight (optional)
                              </Text>
                            </FormControl.Label>
                            {Number(values.weight) > QARanges.weight.max &&
                              RenderWarningMessage()}
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
                            top={60}
                            right={4}
                            fontSize={16}
                          >
                            {'g'}
                          </Text>
                        </FormControl>
                      )}
                    </HStack>
                    {values.species === 'Chinook' && (
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
                        </Radio.Group>
                      </FormControl>
                    )}
                    {values.species !== 'other' && (
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
                          <HStack alignItems='center' opacity={0.25}>
                            <Icon
                              as={Ionicons}
                              name={'add-circle'}
                              size='3xl'
                              opacity={0.75}
                              color='primary'
                              marginRight='1'
                            />
                            <Text color='primary' fontSize='lg'>
                              Select another mark type
                            </Text>
                          </HStack>
                        </HStack>
                      </FormControl>
                    )}
                    {values.species === 'other' && (
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
                      </Radio.Group>
                    </FormControl>

                    {values.species === 'Chinook' && (
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
                        </Radio.Group>
                        <Text color='#A19C9C' marginTop='2' fontSize='xl'>
                          Place in a seperate bucket
                        </Text>
                      </FormControl>
                    )}
                    <HStack mb={'4'}>
                      {values.species !== 'other' && (
                        <Button
                          height='50px'
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
                      {values.species === 'Chinook' && (
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
                          <Text color='primary'>Tag Genetic Sample</Text>
                        </Button>
                      )}
                    </HStack>
                  </>
                )}
              </VStack>
            </Pressable>
          </View>
          <Box bg='themeGrey' pb='12' py='6' px='3'>
            <HStack justifyContent='space-evenly'>
              <Button
                flex='1'
                py='5'
                mx='2'
                bg='#F9A38C'
                shadow='5'
                isDisabled={handleSaveButtonDisable(touched, errors)}
                onPress={() => {
                  handleSubmit()
                  navigation.goBack()
                }}
              >
                <Text fontWeight='bold' color='white' fontSize='xl'>
                  Save and Exit
                </Text>
              </Button>
              {/* <Button onPress={() => console.log(reduxState)}>
                    Log Redux State
                  </Button> */}
              <Button
                flex='1'
                py='5'
                mx='2'
                bg='primary'
                shadow='5'
                isDisabled={handleSaveButtonDisable(touched, errors)}
                onPress={() => handleSubmit()}
              >
                <Text fontWeight='bold' color='white' fontSize='xl'>
                  Save and Add Another Fish
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
        </>
      )}
    </Formik>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    individualFishStore: state.fishInput.individualFish,
    taxonDropdowns: state.dropdowns.values.taxon,
  }
}

export default connect(mapStateToProps, {
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
})(AddFishContent)
