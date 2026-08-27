import React from 'react'
import { Formik, useFormikContext } from 'formik'
import {
  FormControl,
  View,
  VStack,
  Text,
  Button,
  Divider,
  ScrollView,
  Input,
} from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import { addMarkToAppliedMarks } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { addMarkToBatchCountExistingMarks } from '../../redux/reducers/formSlices/batchCountSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import {
  addAnotherMarkSchema,
  addAnotherMarkMultiLocationSchema,
} from '../../utils/helpers/yupValidations'
import { QARanges } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import { ReleaseMarkI } from '../../redux/reducers/addAnotherMarkSlice'

const mapStateToProps = (state: RootState) => {
  return {
    addAnotherMarkValues: state.addAnotherMark.values,
  }
}
/*
Make sure to take BisMark Brown into account 
  => {values.markType !== 'Bismark Brown' && ( <render other dropdowns> )
*/
const AddAnotherMarkModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
  addAnotherMarkValues,
  screenName,
  existingMarks,
  setExistingMarks,
  existingMarksArray,
  multiLocation,
  releaseSiteOptions,
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
  addAnotherMarkValues: any
  screenName: string
  existingMarks?: any
  setExistingMarks?: any
  existingMarksArray?: any
  multiLocation?: boolean
  releaseSiteOptions?: any[]
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const { markType, markColor, bodyPart } = dropdownValues.values

  // sort markType dropdown values array where the object with definition key is 'Bismark Brown' is placed at the beginning of the array
  const sortedDropdownValues = [...markType].sort((a: any, b: any) => {
    if (a.definition === 'bismark brown') return -1
    if (b.definition === 'bismark brown') return 1
    return 0
  })

  const handleSubmit = (values: ReleaseMarkI) => {
    //if the modal is opened in batch count
    if (screenName === 'batchCount') {
      dispatch(addMarkToBatchCountExistingMarks(values))
    } else if (screenName === 'markRecaptureRelease') {
      //if the modal is opened in mark recapture / release
      dispatch(addMarkToAppliedMarks(values))
    } else if (
      screenName === 'addIndividualFish' ||
      screenName === 'plusCount'
    ) {
      setExistingMarks({
        ...existingMarks,
        value: [...existingMarksArray, values],
      })
    }
    showSlideAlert(dispatch, 'Mark or tag')
  }

  const schema = multiLocation
    ? addAnotherMarkMultiLocationSchema
    : addAnotherMarkSchema

  return (
    <Formik
      validationSchema={schema}
      initialValues={addAnotherMarkValues}
      initialErrors={{ markType: '' }}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldTouched,
        touched,
        errors,
        values,
        setFieldValue,
      }) => (
        <>
          <CustomModalHeader
            headerText={'Add Mark'}
            showHeaderButton={false}
            closeModal={closeModal}
          />
          <ScrollView>
            <VStack space={6} paddingX='10' paddingTop='7' paddingBottom='3'>
              <CustomSelect
                selectedValue={values.markType}
                placeholder='Select Mark Type'
                onValueChange={(itemValue: string) => {
                  setFieldValue('markType', itemValue).then(() => {
                    setFieldTouched('markType', true)
                  })
                }}
                selectOptions={sortedDropdownValues}
                errors={errors}
                touched={touched}
                camelName='markType'
                label='Mark Type'
              />

              <CustomSelect
                selectedValue={values.markColor}
                placeholder='Color'
                onValueChange={(itemValue: string) => {
                  setFieldValue('markColor', itemValue).then(() => {
                    setFieldTouched('markColor', true)
                  })
                }}
                selectOptions={markColor}
                errors={errors}
                touched={touched}
                camelName='markColor'
                label='Mark Color'
              />

              <CustomSelect
                selectedValue={values.markPosition}
                placeholder='Position'
                onValueChange={(itemValue: string) => {
                  setFieldValue('markPosition', itemValue).then(() => {
                    setFieldTouched('markPosition', true)
                  })
                }}
                selectOptions={bodyPart}
                errors={errors}
                touched={touched}
                camelName='markPosition'
                label='Mark Position'
              />

              {multiLocation && (
                <>
                  <FormControl
                    isRequired
                    isInvalid={touched.fishCount && !!errors.fishCount}
                  >
                    <FormControl.Label>
                      <Text fontSize='md'>Fish Count</Text>
                    </FormControl.Label>
                    <Input
                      size='xl'
                      keyboardType='numeric'
                      placeholder='0'
                      value={values.fishCount != null ? String(values.fishCount) : ''}
                      onChangeText={text => {
                        const num = parseInt(text.replace(/[^0-9]/g, ''), 10)
                        setFieldValue('fishCount', isNaN(num) ? null : num).then(
                          () => setFieldTouched('fishCount', true)
                        )
                      }}
                    />
                    {touched.fishCount && errors.fishCount && (
                      <FormControl.ErrorMessage>
                        {errors.fishCount as string}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>

                  <CustomSelect
                    selectedValue={values.releaseSiteName || ''}
                    placeholder='Select Release Location'
                    onValueChange={(itemValue: string) => {
                      setFieldValue('releaseSiteName', itemValue).then(() => {
                        setFieldTouched('releaseSiteName', true)
                      })
                    }}
                    selectOptions={(releaseSiteOptions || []).map((rs: any) => ({
                      label: rs.releaseSiteName,
                      value: rs.releaseSiteName,
                    }))}
                    errors={errors}
                    touched={touched}
                    camelName='releaseSiteName'
                    label='Release Location'
                  />
                </>
              )}

              <Button
                bg='primary'
                mx='2'
                mt={5}
                px='10'
                shadow='3'
                isDisabled={Object.keys(errors).length > 0}
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
          </ScrollView>
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(AddAnotherMarkModalContent)
