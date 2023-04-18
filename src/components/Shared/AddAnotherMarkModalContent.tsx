import { Formik } from 'formik'
import { FormControl, View, VStack, Text, Button, Divider } from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import { addMarkToAppliedMarks } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addAnotherMarkSchema } from '../../utils/helpers/yupValidations'
import { QARanges } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import RenderErrorMessage from '../Shared/RenderErrorMessage'
import RenderWarningMessage from '../Shared/RenderWarningMessage'

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
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
  addAnotherMarkValues: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const { markType, markColor, bodyPart } = dropdownValues.values

  const handleSubmit = (values: any) => {
    dispatch(addMarkToAppliedMarks(values))
    showSlideAlert(dispatch, 'Mark or tag')
  }

  return (
    <Formik
      validationSchema={addAnotherMarkSchema}
      initialValues={addAnotherMarkValues}
      initialErrors={{ markType: '' }}
      onSubmit={(values) => {
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
            showHeaderButton={true}
            closeModal={closeModal}
            headerButton={
              <Button
                bg='primary'
                mx='2'
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
            </VStack>
          </View>
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(AddAnotherMarkModalContent)
