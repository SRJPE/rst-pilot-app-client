import React, { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Popover,
  Radio,
  ScrollView,
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
import { saveGeneticSampleData } from '../../redux/reducers/addGeneticSamplesSlice'
import { saveMarkOrTagData } from '../../redux/reducers/addMarksOrTagsSlice'
import { MaterialIcons } from '@expo/vector-icons'

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
  const [markFishModalOpen, setMarkFishModalOpen] = useState(false)
  const [addGeneticModalOpen, setAddGeneticModalOpen] = useState(false)
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

  return (
    <>
      <Formik
        validationSchema={addIndividualFishSchema}
        initialValues={individualFishInitialState}
        onSubmit={(values) => {
          handleFormSubmit(values)
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
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
                <VStack w='1/2' paddingRight={5}>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Species
                    </Text>
                  </FormControl.Label>
                  <FormControl>
                    <CustomSelect
                      selectedValue={values.species}
                      placeholder={'Species'}
                      onValueChange={handleChange('species')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={speciesDictionary}
                    />
                  </FormControl>
                </VStack>

                <Divider my={5} />

                <HStack marginBottom={5}>
                  <VStack w='1/2' paddingRight={5}>
                    <FormControl w='full'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Fork Length
                        </Text>
                      </FormControl.Label>
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
                        right={4}
                        fontSize={16}
                      >
                        {'mm'}
                      </Text>
                    </FormControl>
                  </VStack>

                  <VStack w='1/2' paddingLeft={5}>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Run
                      </Text>
                    </FormControl.Label>
                    <FormControl w='full'>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Calculated from fork length (disabled)'
                        keyboardType='numeric'
                        onChangeText={handleChange('run')}
                        onBlur={handleBlur('run')}
                        value={values.run}
                      />
                    </FormControl>
                  </VStack>
                </HStack>

                <HStack marginBottom={5}>
                  <VStack w='1/2' paddingRight='5'>
                    <HStack space={2} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Lifestage
                        </Text>
                      </FormControl.Label>

                      <Popover
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
                          accessibilityLabel='Existing Mark Info'
                          w='56'
                        >
                          <Popover.Arrow />
                          <Popover.CloseButton />
                          <Popover.Header>Lifestage</Popover.Header>
                          <Popover.Body>
                            <Text>{''}</Text>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    </HStack>

                    <FormControl w='full'>
                      <CustomSelect
                        selectedValue={values.lifestage}
                        placeholder={'Lifestage'}
                        onValueChange={handleChange('lifestage')}
                        setFieldTouched={setFieldTouched}
                        selectOptions={dropdownValues.lifeStage.map(
                          (item: any) => ({
                            label: item.definition,
                            value: item.definition,
                          })
                        )}
                      />
                    </FormControl>
                  </VStack>
                  <VStack w='1/2' paddingLeft='5'>
                    <FormControl w='full'>
                      <FormControl.Label pb='3'>
                        <Text color='black' fontSize='xl'>
                          Weight (optional)
                        </Text>
                      </FormControl.Label>
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
                  </VStack>
                </HStack>

                <VStack w='full'>
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
                </VStack>

                <VStack w='full' marginBottom={5}>
                  <HStack space={2} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Add Existing Mark
                      </Text>
                    </FormControl.Label>
                    <Popover
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
                        w='56'
                      >
                        <Popover.Arrow />
                        <Popover.CloseButton />
                        <Popover.Header>Existing Mark </Popover.Header>
                        <Popover.Body>
                          <Text>{`The buttons below are abbreviated versions of marks recently used for efficiency trials. If you catch a fish with any other existing marks please use the select another mark type. This will open up a window where you can specify mark type, color, position, and code if applicable. 

Abbreviations follow a consistent format “mark type abbreviation - color abbreviation - position abbreviation” 
`}</Text>
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
                </VStack>

                <VStack w='full' marginBottom={5}>
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
                </VStack>

                <VStack w='full' marginBottom={5}>
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
                  <Text
                    color='#A19C9C'
                    marginTop='2'
                    // color='black'
                    fontSize='xl'
                  >
                    Place in a seperate bucket
                  </Text>
                </VStack>

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
