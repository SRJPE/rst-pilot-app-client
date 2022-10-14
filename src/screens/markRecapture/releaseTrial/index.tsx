import { KeyboardAvoidingView, View, VStack } from 'native-base'
import ReleaseTrialWild from './ReleaseTrialWild'
import ReleaseTrialHatchery from './ReleaseTrialHatchery'
import MarkRecaptureNavButtons from '../../../components/markRecapture/MarkRecaptureNavButtons'
import { Formik } from 'formik'
import { RootState } from '../../../redux/store'
import { connect } from 'react-redux'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.releaseTrial,
  }
}

const ReleaseTrial = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  console.log('🚀 ~ Release Trial ~ reduxState', reduxState)

  return (
    <Formik
      // validationSchema={trapVisitSchema}
      initialValues={reduxState.values}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      // initialTouched={{ stream: true }}
      // initialErrors={reduxState.completed ? undefined : { stream: '' }}
      onSubmit={values => {
        // handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        values,
      }) => (
        <>
          <KeyboardAvoidingView
            //this can help with keyboard overlay
            flex={1}
            bg='themeGrey'
          >
            <VStack space={8} p='10'>
              <ReleaseTrialWild
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                touched={touched}
                errors={errors}
                values={values}
              />
              <ReleaseTrialHatchery />
            </VStack>
          </KeyboardAvoidingView>
          <MarkRecaptureNavButtons navigation={navigation} />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ReleaseTrial)
