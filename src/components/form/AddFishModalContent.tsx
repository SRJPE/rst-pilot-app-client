import React, { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Input,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import { addIndividualFishSchema } from '../../utils/helpers/yupValidations'
import Ionicons from '@expo/vector-icons/Ionicons'
import { saveAddFishModalData } from '../../redux/reducers/formSlices/addIndividualFishSlice'
import CustomModal from '../Shared/CustomModal'
import CustomSelect from '../Shared/CustomSelect'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../Shared/CustomModalHeader'
import MarkFishModalContent from './MarkFishModalContent'
import AddGeneticsModalContent from './AddGeneticsModalContent'
import { saveGeneticSampleData } from '../../redux/reducers/addGeneticSamplesSlice'
import { saveMarkOrTagData } from '../../redux/reducers/addMarksOrTagsSlice'

const speciesDictionary = [{ label: 'Chinook', value: 'Chinook' }]
const lifestageDictionary = [
  { label: 'Yolk sac fry (alevin)', value: 'Yolk sac fry (alevin)' },
  { label: 'YOY (young of the year)', value: 'YOY (young of the year)' },
  { label: 'Fry', value: 'Fry' },
  { label: 'Parr', value: 'Parr' },
  { label: 'Silvery parr', value: 'Silvery parr' },
  { label: 'Age I+', value: 'Age I+' },
  { label: 'Pre-smolt', value: 'Pre-smolt' },
  { label: 'Smolt', value: 'Smolt' },
  { label: 'Yearling', value: 'Yearling' },
  { label: 'Juvenile', value: 'Juvenile' },
  { label: 'Adult', value: 'Adult' },
  { label: 'Ammocoete', value: 'Ammocoete' },
  {
    label: 'Macropthalmia (transformer lamprey)',
    value: 'Macropthalmia (transformer lamprey)',
  },
  { label: 'Mixed', value: 'Mixed' },
  { label: 'Grilse / jack', value: 'Grilse / jack' },
  { label: 'Larva', value: 'Larva' },
  { label: 'Button-up fry', value: 'Button-up fry' },
  { label: 'Unbuttoned fry', value: 'Unbuttoned fry' },
  { label: 'Seamed fry', value: 'Seamed fry' },
  { label: 'Subadult', value: 'Subadult' },
  { label: 'Other', value: 'Other' },
  { label: 'Not recorded', value: 'Not recorded' },
  { label: 'Not applicable (n/a)', value: 'Not applicable (n/a)' },
  { label: 'Unknown', value: 'Unknown' },
  { label: 'See Comments', value: 'See Comments' },
  { label: 'Not yet assigned', value: 'Not yet assigned' },
]

const AddFishModalContent = ({
  reduxState,
  addIndividualFishSliceState,
  saveAddFishModalData,
  saveMarkOrTagData,
  saveGeneticSampleData,
  activeTab,
  setActiveTab,
  closeModal,
}: {
  reduxState: any
  addIndividualFishSliceState: any
  saveAddFishModalData: any
  saveMarkOrTagData: any
  saveGeneticSampleData: any
  activeTab: any
  setActiveTab: any
  closeModal: any
}) => {
  const [markFishModalOpen, setMarkFishModalOpen] = useState(false)
  const [addGeneticModalOpen, setAddGeneticModalOpen] = useState(false)

  const handleFormSubmit = (values: any) => {
    saveAddFishModalData(values)
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
        initialValues={addIndividualFishSliceState.values}
        onSubmit={values => {
          handleFormSubmit(values)
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          touched,
          errors,
          values,
        }) => (
          <>
            <CustomModalHeader
              headerText={'Add Fish'}
              showHeaderButon={true}
              closeModal={closeModal}
              headerButton={AddFishModalHeaderButton({
                activeTab,
                setActiveTab,
              })}
            />
            <ScrollView>
              <VStack paddingX='10' paddingTop='7' paddingBottom='3'>
                <VStack w='1/2' paddingRight={5}>
                  <FormControl.Label>Species</FormControl.Label>
                  <FormControl>
                    <CustomSelect
                      selectedValue={values.species}
                      placeholder={'Species'}
                      onValueChange={handleChange('species')}
                      selectOptions={speciesDictionary}
                    />
                  </FormControl>
                </VStack>

                <Divider my={5} />

                <HStack marginBottom={5}>
                  <VStack w='1/2' paddingRight={5}>
                    <FormControl.Label>Fork Length</FormControl.Label>
                    <FormControl w='full'>
                      <Input
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('forkLength')}
                        onBlur={handleBlur('forkLength')}
                        value={values.forkLength}
                      />
                    </FormControl>
                  </VStack>

                  <VStack w='1/2' paddingLeft={5}>
                    <FormControl.Label>Run</FormControl.Label>
                    <FormControl w='full'>
                      <Input
                        placeholder='Calculated from fork length (disabled)'
                        keyboardType='numeric'
                        onChangeText={handleChange('run')}
                        onBlur={handleBlur('run')}
                        value={values.run}
                      />
                    </FormControl>
                  </VStack>
                </HStack>

                <VStack w='1/2' marginBottom={5} paddingRight='5'>
                  <FormControl.Label>Weight (optional)</FormControl.Label>
                  <FormControl w='full'>
                    <Input
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('weight')}
                      onBlur={handleBlur('weight')}
                      value={values.weight}
                    />
                  </FormControl>
                </VStack>

                <VStack w='1/2' marginBottom={5} paddingRight='5'>
                  <FormControl.Label>Lifestage</FormControl.Label>
                  <FormControl w='full'>
                    <CustomSelect
                      selectedValue={values.lifestage}
                      placeholder={'Lifestage'}
                      onValueChange={handleChange('lifestage')}
                      selectOptions={lifestageDictionary}
                    />
                  </FormControl>
                </VStack>

                <VStack w='full' marginBottom={5}>
                  <FormControl.Label>Adipose Clipped</FormControl.Label>
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
                  <FormControl.Label>Add Existing Mark</FormControl.Label>
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
                  <FormControl.Label>Dead</FormControl.Label>
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
                    Will this fish be used in your next mark recapture trial?
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
                  <Text color='#A19C9C' marginTop='2'>
                    Place in a seperate bucket
                  </Text>
                </VStack>

                <HStack>
                  <Button
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
              height='1/2'
            >
              <MarkFishModalContent
                handleMarkFishFormSubmit={handleMarkFishFormSubmit}
                closeModal={() => setMarkFishModalOpen(false)}
              />
            </CustomModal>
            <CustomModal
              isOpen={addGeneticModalOpen}
              closeModal={() => setAddGeneticModalOpen(false)}
              height='1/2'
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
  return {
    addIndividualFishSliceState: state.addIndividualFish,
    reduxState: state,
  }
}

export default connect(mapStateToProps, {
  saveAddFishModalData,
  saveMarkOrTagData,
  saveGeneticSampleData,
})(AddFishModalContent)
