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
import FormInputComponent from '../Shared/FormInputComponent'

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

const TagFishModalContent = ({
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

  // sort markType dropdown values array where not recorded is last and everything else is alpha
  const sortedMarkTypeValues = [...dropdownValues.markType].sort(
    (a: any, b: any) => {
      if (a.definition === 'not recorded') return 1
      if (b.definition === 'not recorded') return -1
      return a.definition.localeCompare(b.definition) // Sort alphabetically
      return 0
    }
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
              showHeaderButton={false}
              closeModal={closeModal}
            />
            <>
              <VStack paddingX='10' paddingTop='7' paddingBottom='3'>
                <CustomSelect
                  label='Mark Type'
                  camelName='markType'
                  touched={touched}
                  errors={errors}
                  selectedValue={values.markType}
                  placeholder={'Select Mark Type'}
                  onValueChange={(itemValue: string) => {
                    setFieldValue('markType', itemValue).then(() => {
                      setFieldTouched('markType', true)
                    })
                  }}
                  selectOptions={sortedMarkTypeValues.map((item: any) => ({
                    label: item.definition,
                    value: item.definition,
                  }))}
                />
                <FormInputComponent
                  label='Mark Code'
                  camelName='markCode'
                  placeholder='Enter Mark Code'
                  touched={touched}
                  errors={errors}
                  onChangeText={handleChange('markCode')}
                  onBlur={handleBlur('markCode')}
                  value={values.markCode}
                />

                <CustomSelect
                  touched={touched}
                  errors={errors}
                  label='Mark Position (optional)'
                  camelName='markPosition'
                  selectedValue={values.markPosition}
                  placeholder={'Select Mark Position'}
                  onValueChange={(itemValue: string) => {
                    setFieldValue('markPosition', itemValue).then(() => {
                      setFieldTouched('markPosition', true)
                    })
                  }}
                  selectOptions={
                    dropdownValues.bodyPart
                      ? dropdownValues.bodyPart.map((item: any) => ({
                          label: item.definition,
                          value: item.definition,
                        }))
                      : []
                  }
                />

                <CustomSelect
                  label='Mark Color (optional)'
                  errors={errors}
                  touched={touched}
                  camelName='markColor'
                  selectedValue={values.markColor}
                  placeholder={'Mark Color'}
                  onValueChange={(itemValue: string) => {
                    setFieldValue('markColor', itemValue).then(() => {
                      setFieldTouched('markColor', true)
                    })
                  }}
                  selectOptions={
                    dropdownValues.markColor
                      ? dropdownValues.markColor.map((item: any) => ({
                          label: item.definition,
                          value: item.definition,
                        }))
                      : []
                  }
                />

                <CustomSelect
                  label='Crew Member'
                  camelName='crewMember'
                  touched={touched}
                  errors={errors}
                  selectedValue={values.crewMember}
                  placeholder={'Select Crew Member'}
                  onValueChange={(itemValue: string) => {
                    setFieldValue('crewMember', itemValue).then(() => {
                      setFieldTouched('crewMember', true)
                    })
                  }}
                  selectOptions={crewMembers.map((item: any) => ({
                    label: item,
                    value: item,
                  }))}
                />
                <FormInputComponent
                  label={'Comments (optional)'}
                  multiline={true}
                  touched={touched}
                  errors={errors}
                  value={values.comments}
                  camelName={'comments'}
                  placeholder={'Write a comment'}
                  onChangeText={handleChange('comments')}
                  onBlur={handleBlur('comments')}
                />
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
              </VStack>
            </>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

export default connect(mapStateToProps)(TagFishModalContent)
