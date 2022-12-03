import Ionicons from '@expo/vector-icons/Ionicons'
import { Formik } from 'formik'
import {
  FormControl,
  Input,
  View,
  VStack,
  Text,
  Button,
  Divider,
  HStack,
} from 'native-base'
import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addAnotherMarkSchema } from '../../utils/helpers/yupValidations'
import { QARanges } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import RenderErrorMessage from '../Shared/RenderErrorMessage'
import RenderWarningMessage from '../Shared/RenderWarningMessage'

const initialFormValues = {
  type: '',
  number: '',
  position: '',
  crewMemberTagging: '',
  comments: '',
}

const mapStateToProps = (state: RootState) => {
  return {
    addAnotherMarkValues: state.addAnotherMark.values,
  }
}

/*
This modal needs its submission connected to the main formik form of each component
this will depend on if it is in add fish or in mark recapture
*/

const AddAnotherMarkModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
  addAnotherMarkValues,
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
  addAnotherMarkValues: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const { markType, markColor, bodyPart } = dropdownValues.values

  const handleSubmit = (values: any) => {
    // handleMarkFishFormSubmit(values)
    showSlideAlert(dispatch, 'Mark or tag')
  }

  return (
    <Formik
      validationSchema={addAnotherMarkSchema}
      initialValues={addAnotherMarkValues}
      onSubmit={(values) => {
        handleSubmit(values)
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
            headerText={'Add Another Mark'}
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
          <Divider my={2} thickness='3' />
          <View>
            <VStack space={6} paddingX='10' paddingTop='7' paddingBottom='3'>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Mark Type
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.markType}
                  placeholder='Type'
                  onValueChange={handleChange('markType')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={markType.concat([
                    { id: 1, definition: 'Bismark Brown' },
                  ])}
                />
                {touched.markType &&
                  errors.markType &&
                  RenderErrorMessage(errors, 'markType')}
              </FormControl>

              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Mark Color
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.markColor}
                  placeholder='Color'
                  onValueChange={handleChange('markColor')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={markColor}
                />
                {touched.markColor &&
                  errors.markColor &&
                  RenderErrorMessage(errors, 'markColor')}
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Mark Position
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.markPosition}
                  placeholder='Position'
                  onValueChange={handleChange('markPosition')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={bodyPart}
                />
                {touched.markPosition &&
                  errors.markPosition &&
                  RenderErrorMessage(errors, 'markPosition')}
              </FormControl>
              <FormControl>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Mark Number
                    </Text>
                  </FormControl.Label>
                  {Number(values.markNumber) > QARanges.markNumber.max &&
                    RenderWarningMessage()}
                  {touched.markNumber &&
                    errors.markNumber &&
                    RenderErrorMessage(errors, 'markNumber')}
                </HStack>
                <Input
                  mt={1}
                  height='50px'
                  fontSize='16'
                  placeholder='Number'
                  keyboardType='numeric'
                  onChangeText={handleChange('markNumber')}
                  onBlur={handleBlur('markNumber')}
                  value={values.markNumber}
                />
                {touched.markNumber &&
                  errors.markNumber &&
                  RenderErrorMessage(errors, 'markNumber')}
              </FormControl>
            </VStack>
          </View>
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(AddAnotherMarkModalContent)
