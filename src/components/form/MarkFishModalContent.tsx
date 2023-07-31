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
import { QARanges } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import RenderErrorMessage from '../Shared/RenderErrorMessage'
import RenderWarningMessage from '../Shared/RenderWarningMessage'

const initialFormValues = {
  markType: '',
  markCode: '',
  markPosition: '',
  markColor: '',
  crewMember: '',
  comments: '',
}

const mapStateToProps = (state: RootState) => {
  const activeTabId = state.tabSlice.activeTabId
  return {
    crewMembers: activeTabId
      ? state.visitSetup[activeTabId].values.crew
      : state.visitSetup['placeholderId'].values.crew,
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
              <VStack space={5} paddingX='10' paddingTop='7' paddingBottom='3'>
                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Type
                      </Text>
                    </FormControl.Label>
                    {touched.markType &&
                      errors.markType &&
                      RenderErrorMessage(errors, 'markType')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.markType}
                    placeholder={'Type'}
                    onValueChange={handleChange('markType')}
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
                        Code
                      </Text>
                    </FormControl.Label>
                    {Number(values.markCode) > QARanges.markNumber.max && (
                      <RenderWarningMessage />
                    )}
                    {touched.markCode &&
                      errors.markCode &&
                      RenderErrorMessage(errors, 'markCode')}
                  </HStack>
                  <Input
                    height='50px'
                    fontSize='16'
                    placeholder='Mark Code'
                    keyboardType='numeric'
                    onChangeText={handleChange('markCode')}
                    onBlur={handleBlur('markCode')}
                    value={values.markCode}
                  />
                </FormControl>

                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Position
                      </Text>
                    </FormControl.Label>
                    {touched.markPosition &&
                      errors.markPosition &&
                      RenderErrorMessage(errors, 'markPosition')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.markPosition}
                    placeholder={'Mark Position'}
                    onValueChange={handleChange('markPosition')}
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

                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Color (optional)
                      </Text>
                    </FormControl.Label>
                    {touched.markColor &&
                      errors.markColor &&
                      RenderErrorMessage(errors, 'markColor')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.markColor}
                    placeholder={'Mark Color'}
                    onValueChange={handleChange('markColor')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={
                      dropdownValues.markColor
                        ? dropdownValues.markColor.map((item: any) => ({
                            label: item.definition,
                            value: item.definition,
                          }))
                        : []
                    }
                  />
                </FormControl>

                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Crew Member Tagging
                      </Text>
                    </FormControl.Label>
                    {touched.crewMember &&
                      errors.crewMember &&
                      RenderErrorMessage(errors, 'crewMember')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.crewMember}
                    placeholder={'Crew Member'}
                    onValueChange={handleChange('crewMember')}
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
