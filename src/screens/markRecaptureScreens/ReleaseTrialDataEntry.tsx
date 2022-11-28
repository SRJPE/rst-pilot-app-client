import { Formik } from 'formik'
import { KeyboardAvoidingView, Text, View, VStack } from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import NavButtons from '../../components/formContainer/NavButtons'
import MarkRecaptureNavButtons from '../../components/markRecapture/MarkRecaptureNavButtons'
import { AppDispatch, RootState } from '../../redux/store'

const mapStateToProps = (state: RootState) => {
  return {
    releaseTrialDataEntryState: state.releaseTrialDataEntry,
  }
}

const ReleaseDataEntry = ({
  navigation,
  releaseTrialDataEntryState,
}: {
  navigation: any
  releaseTrialDataEntryState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)

  const handleSubmit = (values: any) => {
    //  dispatch(saveReleaseTrial(values))
    //  dispatch(markReleaseTrialCompleted(true))
    //  dispatch(markActiveMarkRecaptureStepCompleted(true))
    //  console.log('🚀 ~ handleSubmit ~ ReleaseTrial', values)
  }

  return (
    <Formik
      // validationSchema={releaseTrialSchema}
      initialValues={releaseTrialDataEntryState.values}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      // initialTouched={{ wildCount: true }}
      // initialErrors={reduxState.completed ? undefined : { wildCount: '' }}
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
          <View flex={1} bg='themeGrey'>
            <VStack space={8} p='10'>
              <Text>TEST RELEASE DATA ENTRY</Text>
            </VStack>
          </View>
          <MarkRecaptureNavButtons navigation={navigation} />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ReleaseDataEntry)
