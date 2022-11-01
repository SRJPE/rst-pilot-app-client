import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  CheckIcon,
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
  Slide,
  Text,
  VStack,
} from 'native-base'
import { Formik } from 'formik'
import { connect, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { addIndividualFishSchema } from '../../utils/helpers/yupValidations'
import Ionicons from '@expo/vector-icons/Ionicons'
import CustomModal from '../Shared/CustomModal'
import CustomSelect from '../Shared/CustomSelect'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../Shared/CustomModalHeader'
import MarkFishModalContent from './MarkFishModalContent'
import AddGeneticsModalContent from './AddGeneticsModalContent'
import {
  individualFishInitialState,
  saveIndividualFish,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { saveGeneticSampleData } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { saveMarkOrTagData } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import renderErrorMessage from './RenderErrorMessage'

const speciesDictionary = [{ label: 'Chinook', value: 'Chinook' }]

const AddFishModalContent = ({
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
  activeTab,
  setActiveTab,
  closeModal,
}: {
  saveIndividualFish: any
  saveMarkOrTagData: any
  saveGeneticSampleData: any
  activeTab: any
  setActiveTab: any
  closeModal: any
}) => {
  const [markFishModalOpen, setMarkFishModalOpen] = useState(false as boolean)
  const [addGeneticModalOpen, setAddGeneticModalOpen] = useState(
    false as boolean
  )
  const [isSlideOpen, setIsSlideOpen] = React.useState(false as boolean)

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

  const waitThenCloseSlide = () => {
    setTimeout(() => {
      setIsSlideOpen(false)
    }, 3000)
  }

  return (
    <>
      <Formik
        validationSchema={addIndividualFishSchema}
        initialValues={individualFishInitialState}
        // initialTouched={{ adiposeClipped: true }}
        // initialErrors={{ adiposeClipped: '' }}
        onSubmit={values => {
          handleFormSubmit(values)
          setIsSlideOpen(!isSlideOpen)
          waitThenCloseSlide()
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
            <CustomModalHeader
              headerText={'Add Fish'}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={AddFishModalHeaderButton({
                activeTab,
                setActiveTab,
              })}
            />
            <ScrollView>
              <VStack paddingX='10' paddingTop='2' paddingBottom='3'>
                <HStack marginBottom={5} alignItems='center'>
                  <FormControl w='1/2' pr='5'>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Species
                        </Text>
                      </FormControl.Label>

                      {touched.species &&
                        errors.species &&
                        renderErrorMessage(errors, 'species')}
                    </HStack>
                    <CustomSelect
                      selectedValue={values.species}
                      placeholder={'Species'}
                      onValueChange={handleChange('species')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={speciesDictionary}
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

                <Divider my={5} />

                <HStack marginBottom={5}>
                  <FormControl w='1/2' pr='5'>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Fork Length
                        </Text>
                      </FormControl.Label>

                      {touched.forkLength &&
                        errors.forkLength &&
                        renderErrorMessage(errors, 'forkLength')}
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
                        renderErrorMessage(errors, 'run')} */}
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
                </HStack>

                <HStack marginBottom={5}>
                  <FormControl w='1/2' paddingRight='5'>
                    <HStack space={2} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Life Stage
                        </Text>
                      </FormControl.Label>

                      <Popover
                        placement='bottom right'
                        trigger={triggerProps => {
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
                                source={require('../../assets/life_stage_image.png')}
                                alt='Life Stage Image'
                                // style={{ position: 'absolute' }}
                                width='720'
                              />
                              <Image
                                source={require('../../assets/life_stage_table.png')}
                                alt='Life Stage Image'
                              />
                            </ScrollView>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                      {touched.lifeStage &&
                        errors.lifeStage &&
                        renderErrorMessage(errors, 'lifeStage')}
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

                  <FormControl w='1/2' paddingLeft='5'>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label pb='3'>
                        <Text color='black' fontSize='xl'>
                          Weight (optional)
                        </Text>
                      </FormControl.Label>

                      {touched.weight &&
                        errors.weight &&
                        renderErrorMessage(errors, 'weight')}
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
                </HStack>

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
                    <Radio colorScheme='primary' value='true' my={1}>
                      True
                    </Radio>
                    <Radio colorScheme='primary' value='false' my={1}>
                      False
                    </Radio>
                  </Radio.Group>
                </FormControl>

                <FormControl w='full' marginBottom={5}>
                  <HStack space={2} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Add Existing Mark
                      </Text>
                    </FormControl.Label>
                    <Popover
                      placement='top right'
                      trigger={triggerProps => {
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
                          Click on one more existing mark buttons to add marks.
                        </Popover.Header>
                        <Popover.Body p={4}>
                          <VStack space={2}>
                            <Text fontSize='md'>
                              The existing mark buttons display abbreviated
                              versions of marks recently used for efficiency
                              trials. If you catch a fish with other existing
                              marks, please click on “select another mark type”.
                              This will open up a window where you can specify
                              mark type, color, position, and code if
                              applicable.
                            </Text>
                            <Divider />

                            <Text fontSize='md'>
                              Abbreviations follow a consistent format “mark
                              type abbreviation - color abbreviation - position
                              abbreviation”. All of these fields are only
                              applicable to some mark types. Any fields that are
                              not applicable to a particular mark type are left
                              blank.
                            </Text>
                            <Text fontSize='md'>
                              Below are some examples of common marks:
                            </Text>
                            <HStack space={2} alignItems='flex-start'>
                              <Avatar size={'2'} mt={'2'} />
                              <Text fontSize='md'>BIS-BR: Bismarck Brown</Text>
                            </HStack>
                            <HStack space={2} alignItems='flex-start'>
                              <Avatar size={'2'} mt={'2'} />
                              <Text fontSize='md'>
                                ELA-PUR-FIN: Elastomer Yellow Fin
                              </Text>
                            </HStack>
                            <HStack space={2} alignItems='flex-start'>
                              <Avatar size={'2'} mt={'2'} />
                              <Text fontSize='md'>CWT: Coded wire tag</Text>
                            </HStack>
                          </VStack>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>
                  </HStack>

                  <HStack>
                    <Button
                      bg={
                        values.existingMark === 'E - Y - F'
                          ? 'primary'
                          : 'secondary'
                      }
                      py='1'
                      px='12'
                      shadow='3'
                      borderRadius='5'
                      marginRight='10'
                      onPress={() => setFieldValue('existingMark', 'E - Y - F')}
                    >
                      <Text
                        color={
                          values.existingMark === 'E - Y - F'
                            ? 'white'
                            : 'primary'
                        }
                      >
                        E - Y - F
                      </Text>
                    </Button>
                    <Button
                      bg={
                        values.existingMark === 'Bis Brown'
                          ? 'primary'
                          : 'secondary'
                      }
                      color='#007C7C'
                      py='1'
                      px='12'
                      shadow='3'
                      borderRadius='5'
                      marginRight='10'
                      onPress={() => setFieldValue('existingMark', 'Bis Brown')}
                    >
                      <Text
                        color={
                          values.existingMark === 'Bis Brown'
                            ? 'white'
                            : 'primary'
                        }
                      >
                        Bis Brown
                      </Text>
                    </Button>
                    <HStack alignItems='center'>
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

                <FormControl w='full' marginBottom={5}>
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
                    <Radio colorScheme='primary' value='true' my={1}>
                      True
                    </Radio>
                    <Radio colorScheme='primary' value='false' my={1}>
                      False
                    </Radio>
                  </Radio.Group>
                </FormControl>

                <FormControl w='full' marginBottom={5}>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Will this fish be used in your next mark recapture trial?
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
                    <Radio colorScheme='primary' value='true' my={1}>
                      True
                    </Radio>
                    <Radio colorScheme='primary' value='false' my={1}>
                      False
                    </Radio>
                  </Radio.Group>
                  <Text color='#A19C9C' marginTop='2' fontSize='xl'>
                    Place in a seperate bucket
                  </Text>
                </FormControl>

                <HStack>
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
                </HStack>
              </VStack>

              <Box bg='themeGrey' py='6' px='3'>
                <HStack justifyContent='space-evenly' bg='themeGrey'>
                  <Button
                    flex='1'
                    py='5'
                    mx='2'
                    bg='#F9A38C'
                    isDisabled={handleSaveButtonDisable(touched, errors)}
                    onPress={() => {
                      handleSubmit()
                      closeModal()
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
                    isDisabled={handleSaveButtonDisable(touched, errors)}
                    onPress={() => handleSubmit()}
                  >
                    <Text fontWeight='bold' color='white' fontSize='xl'>
                      Save and Add Another Fish
                    </Text>
                  </Button>
                </HStack>
              </Box>
            </ScrollView>
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
            {/* --------- Slide --------- */}
            <Slide
              in={isSlideOpen}
              placement='top'
              //  duration={200}
            >
              <Box
                w='100%'
                position='absolute'
                p='2'
                borderRadius='xs'
                bg='emerald.100'
                alignItems='center'
                justifyContent='center'
                safeArea
              >
                <HStack space={4} alignItems='center'>
                  <CheckIcon size='6' color='emerald.600' mt='1' />
                  {/* <Icon
                    as={FontAwesome5}
                    name='fish'
                    size='8'
                    color='emerald.600'
                  /> */}
                  <Text
                    fontSize={16}
                    color='emerald.600'
                    textAlign='center'
                    fontWeight='medium'
                  >
                    Fish added successfully
                  </Text>
                </HStack>
              </Box>
            </Slide>
          </>
        )}
      </Formik>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {}
}

export default connect(mapStateToProps, {
  saveIndividualFish,
  saveMarkOrTagData,
  saveGeneticSampleData,
})(AddFishModalContent)
