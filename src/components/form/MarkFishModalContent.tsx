import Ionicons from '@expo/vector-icons/Ionicons'
import { Formik } from 'formik'
import {
  FormControl,
  HStack,
  Icon,
  Input,
  ScrollView,
  VStack,
  Text,
  Button,
  Divider,
} from 'native-base'
import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addMarksOrTagsSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import renderErrorMessage from '../Shared/RenderErrorMessage'

const initialFormValues = {
  type: '',
  number: '',
  position: '',
  crewMemberTagging: '',
  comments: '',
}

const mapStateToProps = (state: RootState) => {
  return {
    crewMembers: state.visitSetup.values.crew,
  }
}

const MarkFishModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
  crewMembers,
}: {
  handleMarkFishFormSubmit: any
  closeModal: any
  crewMembers: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const handleFormSubmit = (values: any) => {
    handleMarkFishFormSubmit(values)
    showSlideAlert(dispatch, 'Mark or tag')
  }
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  return (
    <ScrollView>
      <Formik
        validationSchema={addMarksOrTagsSchema}
        initialValues={initialFormValues}
        onSubmit={values => handleFormSubmit(values)}
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
              headerText={'Mark or Tag a Fish'}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  isDisabled={
                    (touched && Object.keys(touched).length === 0) ||
                    (errors && Object.keys(errors).length > 0)
                  }
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
            <>
              <Divider my={2} thickness='3' />
              <VStack space={5} paddingX='10' paddingTop='7' paddingBottom='3'>
                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Type
                      </Text>
                    </FormControl.Label>

                    {touched.type &&
                      errors.type &&
                      renderErrorMessage(errors, 'type')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.type}
                    placeholder={'Type'}
                    onValueChange={handleChange('type')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues.markType.map((item: any) => ({
                      label: item.definition,
                      value: item.definition,
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Number
                      </Text>
                    </FormControl.Label>

                    {touched.number &&
                      errors.number &&
                      renderErrorMessage(errors, 'number')}
                  </HStack>
                  <Input
                    height='50px'
                    fontSize='16'
                    placeholder='Enter number'
                    keyboardType='numeric'
                    onChangeText={handleChange('number')}
                    onBlur={handleBlur('number')}
                    value={values.number}
                  />
                </FormControl>

                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Position
                      </Text>
                    </FormControl.Label>

                    {touched.position &&
                      errors.position &&
                      renderErrorMessage(errors, 'position')}
                  </HStack>

                  <CustomSelect
                    selectedValue={values.position}
                    placeholder={'Mark Position'}
                    onValueChange={handleChange('position')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={
                      dropdownValues.bodyPart
                        ? dropdownValues.bodyPart.map((item: any) => ({
                            label: item.definition,
                            value: item.definition,
                          }))
                        : []
                    }
                  />
                </FormControl>

                <HStack alignItems='center' opacity={0.25}>
                  <Icon
                    as={Ionicons}
                    name={'add-circle'}
                    size='3xl'
                    opacity={0.75}
                    color='primary'
                    marginRight='1'
                  />
                  <Text color='primary' fontSize='xl'>
                    Add another tag
                  </Text>
                </HStack>

                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Crew Member Tagging
                      </Text>
                    </FormControl.Label>

                    {touched.crewMemberTagging &&
                      errors.crewMemberTagging &&
                      renderErrorMessage(errors, 'crewMemberTagging')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.crewMemberTagging}
                    placeholder={'Crew Member'}
                    onValueChange={handleChange('crewMemberTagging')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={crewMembers.map((item: any) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </FormControl>

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
                    onChangeText={handleChange('comments')}
                    onBlur={handleBlur('comments')}
                    value={values.comments}
                  />
                </FormControl>
              </VStack>
            </>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

export default connect(mapStateToProps)(MarkFishModalContent)
