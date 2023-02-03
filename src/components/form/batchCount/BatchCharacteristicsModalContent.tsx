import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveBatchCharacteristics } from '../../../redux/reducers/formSlices/fishInputSlice'
import { showSlideAlert } from '../../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { alphabeticalSort, reorderTaxon } from '../../../utils/utils'
import CustomModalHeader from '../../Shared/CustomModalHeader'
import CustomSelect from '../../Shared/CustomSelect'
import RenderErrorMessage from '../../Shared/RenderErrorMessage'

const initialFormValues = {
  species: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '',
}

const BatchCharacteristicsModalContent = ({
  closeModal,
}: {
  closeModal: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const reorderedTaxon = reorderTaxon(dropdownValues.taxon)

  const alphabeticalLifeStage = alphabeticalSort(
    dropdownValues.lifeStage,
    'definition'
  )

  const handleFormSubmit = (values: any) => {
    dispatch(saveBatchCharacteristics(values))
    console.log('🚀 ~ BatchCount Values: ', values)
    showSlideAlert(dispatch, 'Batch characteristics')
  }

  return (
    <ScrollView>
      <Formik
        // validationSchema={}
        initialValues={initialFormValues}
        onSubmit={(values) => handleFormSubmit(values)}
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
              headerText={'Batch Characteristics'}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  // isDisabled={
                  //   (touched && Object.keys(touched).length === 0) ||
                  //   (errors && Object.keys(errors).length > 0)
                  // }
                  onPress={() => {
                    handleSubmit()
                    closeModal()
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Save
                  </Text>
                </Button>
              }
            />
            <Divider my={2} thickness='3' />
            <VStack px='5%' space={4}>
              <Text justifyContent='center' fontSize='lg'>
                Please return to the individual fish input if you plan on
                marking or sampling a fish.
              </Text>
              {/* <HStack alignItems='center'> */}
              <FormControl w='1/2' pr='5'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Species
                  </Text>
                </FormControl.Label>

                {touched.species &&
                  errors.species &&
                  RenderErrorMessage(errors, 'species')}

                <CustomSelect
                  selectedValue={values.species}
                  placeholder={'Species'}
                  onValueChange={(value: any) => {
                    // resetForm(resetFormValues)
                    handleChange('species')(value)
                    // if (value == 'Chinook salmon') {
                    //   setValidationSchema('default')
                    // } else if (value == 'Steelhead / rainbow trout') {
                    //   setValidationSchema('optionalLifeStage')
                    // } else {
                    //   setValidationSchema('otherSpecies')
                    // }
                  }}
                  setFieldTouched={setFieldTouched}
                  selectOptions={reorderedTaxon.map((taxon: any) => ({
                    label: taxon?.commonname,
                    value: taxon?.commonname,
                  }))}
                />
              </FormControl>

              <HStack space={10} justifyContent='space-between'>
                <VStack space={4}>
                  <FormControl>
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
                </VStack>
                <FormControl w='full'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Add Existing Mark
                    </Text>
                  </FormControl.Label>

                  <HStack>
                    <Button
                      bg={
                        values.existingMark === 'CWT' ? 'primary' : 'secondary'
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
                          values.existingMark === 'CWT' ? 'white' : 'primary'
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
                      onPress={() => setFieldValue('existingMark', 'Fin Clip')}
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
                    <Pressable
                    // onPress={() => setAddMarkModalOpen(true)}
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
                  </HStack>
                </FormControl>
              </HStack>
            </VStack>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

export default BatchCharacteristicsModalContent
