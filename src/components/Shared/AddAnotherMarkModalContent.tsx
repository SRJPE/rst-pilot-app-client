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
} from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import { addMarkToAppliedMarks } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { addMarkToBatchCountExistingMarks } from '../../redux/reducers/formSlices/batchCountSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addAnotherMarkSchema } from '../../utils/helpers/yupValidations'
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
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
  addAnotherMarkValues: any
  screenName: string
  existingMarks?: any
  setExistingMarks?: any
  existingMarksArray?: any
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

  return (
    <Formik
      validationSchema={addAnotherMarkSchema}
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
                onValueChange={handleChange('markType')}
                setFieldTouched={() => setFieldTouched('markType')}
                selectOptions={sortedDropdownValues}
                errors={errors}
                touched={touched}
                camelName='markType'
                label='Mark Type'
              />

              <CustomSelect
                selectedValue={values.markColor}
                placeholder='Color'
                onValueChange={handleChange('markColor')}
                setFieldTouched={() => setFieldTouched('markColor')}
                selectOptions={markColor}
                errors={errors}
                touched={touched}
                camelName='markColor'
                label='Mark Color'
              />

              <CustomSelect
                selectedValue={values.markPosition}
                placeholder='Position'
                onValueChange={handleChange('markPosition')}
                setFieldTouched={() => setFieldTouched('markPosition')}
                selectOptions={bodyPart}
                errors={errors}
                touched={touched}
                camelName='markPosition'
                label='Mark Position'
              />
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
