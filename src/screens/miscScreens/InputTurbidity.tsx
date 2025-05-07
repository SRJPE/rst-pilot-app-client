import {
  Box,
  Button,
  HStack,
  Text,
  ScrollView,
  VStack,
  Divider,
  Icon,
} from 'native-base'
import { Formik } from 'formik'
import { RootState, AppDispatch } from '../../redux/store'
import { connect, useDispatch } from 'react-redux'
import { retrieveTrapVisitsRequiringTurbidity } from '../../utils/helpers/helperFunctions'
import type { InitialStateI } from '../../redux/reducers/visitSetupDefaults'
import * as yup from 'yup'
import FormInputComponent, {
  TextInputAdornment,
} from '../../components/Shared/FormInputComponent'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { Keyboard } from 'react-native'
import api from '../../api/axiosConfig'
import { Ionicons } from '@expo/vector-icons'
import { fetchPreviousTrapAndCatch } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { QARanges } from '../../utils/utils'

const TurbiditySchema = yup.object({
  waterTurbidity: yup
    .number()
    .required('Water Turbidity is required')
    .typeError('Value must be a number'),
})

function InputTurbidity({
  navigation,
  userCredentialsStore,
  previousTrapVisits,
  visitSetupDefaultState,
}: {
  navigation: any
  userCredentialsStore: any
  previousTrapVisits: any[]

  //TODO: import correct type so component cant be passed to the connect function without error  ==> previousTrapVisits: TrapVisitResponse[]
  visitSetupDefaultState: InitialStateI
}) {
  const dispatch = useDispatch<AppDispatch>()

  const checkTurbidityRange = (value: string) => {
    if (['', '-'].includes(value)) return

    const isValid =
      Number(value) > 0 && Number(value) <= QARanges.waterTurbidity.max
    const showWarning = isValid === false
    return showWarning
  }

  const trapVisitsRequiringTurbidity =
    retrieveTrapVisitsRequiringTurbidity(previousTrapVisits)

  const generateTrapVisitTableData = (
    trapVisits: {
      trapVisitId: number
      programId: number
      trapLocationId: number
      waterTurbidity: number | null
      trapVisitEndTime: string
    }[]
  ) => {
    return trapVisits.map(trapVisit => {
      const program = visitSetupDefaultState.programs.find(
        (program: any) => program.id === trapVisit.programId
      )

      const trapLocation = visitSetupDefaultState.trapLocations.find(
        (trapLocation: any) => trapLocation.id === trapVisit.trapLocationId
      )

      return {
        trapVisitId: trapVisit.trapVisitId,
        programId: trapVisit.programId,
        programName: program?.programName,
        waterTurbidity: trapVisit.waterTurbidity,
        trapLocationName: trapLocation?.trapName,
        trapVisitEndTime: trapVisit.trapVisitEndTime,
      }
    })
  }
  const trapVisitTableData = generateTrapVisitTableData(
    trapVisitsRequiringTurbidity
  )

  return (
    <ScrollView flex={1} p={5}>
      <VStack
        space={5}
        bg='white'
        pb={5}
        h={'full'}
        borderRadius={5}
        overflow={'hidden'}
      >
        <Text fontSize='xl' bold bg='primary' color='white' p={5}>
          Input Water Turbidity
        </Text>
        <Text fontSize='md' p={5}>
          The following trap visits require water turbidity input. Click the
          Input Turbidity button to edit the water turbidity for each trap visit
          and complete record.
        </Text>
        {trapVisitTableData.map(trapVisit => (
          <Formik
            key={trapVisit.trapVisitId}
            initialValues={{
              waterTurbidity: '',
            }}
            validationSchema={TurbiditySchema}
            onSubmit={(values, { setSubmitting }) => {
              api
                .put(`trap-visit/${trapVisit.trapVisitId}/environmental`, {
                  waterTurbidity: values.waterTurbidity,
                })
                .then(response => {
                  // Handle success

                  if (response.data.status !== 200) {
                    throw new Error('Water turbidity could not be saved')
                  }
                  dispatch(fetchPreviousTrapAndCatch())

                  showSlideAlert(
                    dispatch,
                    'Water turbidity saved successfully',
                    'success'
                  )
                })
                .catch(error => {
                  console.error('Error:', error)
                  // Handle error
                  showSlideAlert(
                    dispatch,
                    'Water turbidity could not be saved',
                    'error'
                  )
                })
                .finally(() => {
                  setSubmitting(false)
                })
            }}
          >
            {({
              isSubmitting,
              handleSubmit,
              handleBlur,
              touched,
              values,
              errors,
              submitForm,
              handleChange,
              resetForm,
            }) => {
              // Reset the form when the page is navigated away
              useFocusEffect(
                useCallback(() => {
                  return () => {
                    resetForm() // Reset the form state
                  }
                }, [resetForm])
              )

              const displayInputWarning = checkTurbidityRange(
                values.waterTurbidity
              )

              return (
                <>
                  <Box
                    key={trapVisit.trapVisitId}
                    borderColor={'secondary'}
                    shadow={1}
                    borderWidth={1}
                    borderTopWidth={5}
                    borderRadius={5}
                    borderTopColor={'primary'}
                    p={5}
                    mx={5}
                    background={'lightBlue.50'}
                  >
                    <Text fontSize='md'>
                      <Text bold>Program:</Text> {trapVisit.programName}
                    </Text>
                    <Text fontSize='md'>
                      <Text bold>Trap Location:</Text>{' '}
                      {trapVisit.trapLocationName}
                    </Text>
                    <Text fontSize='md'>
                      <Text bold>Trap Visit End Time:</Text>{' '}
                      {new Date(trapVisit.trapVisitEndTime).toLocaleString()}
                    </Text>
                    <Divider my={2} />
                    <HStack alignItems='center' space={3} h={100}>
                      <Box flex={3}>
                        <FormInputComponent
                          showWarning={displayInputWarning}
                          label={'Water Turbidity (via CDEC)'}
                          placeholder='0'
                          touched={touched}
                          errors={errors}
                          value={values.waterTurbidity}
                          camelName={'waterTurbidity'}
                          onChangeText={handleChange('waterTurbidity')}
                          onBlur={handleBlur('waterTurbidity')}
                          RightElement={<TextInputAdornment text='ntu' />}
                        />
                      </Box>
                      <Box flex={1} mt={3}>
                        <Button
                          isDisabled={isSubmitting}
                          isLoading={isSubmitting}
                          isLoadingText='Saving...'
                          onPress={() => submitForm()}
                          variant={'solid'}
                          bg='primary'
                          py={3}
                        >
                          <Text color='white' bold>
                            Save
                          </Text>
                        </Button>
                      </Box>
                    </HStack>
                  </Box>
                </>
              )
            }}
          </Formik>
        ))}
        {trapVisitTableData.length === 0 && (
          <VStack
            alignItems={'center'}
            justifyContent='center'
            space={2}
            flex={1}
          >
            <Icon
              as={Ionicons}
              name='checkmark-circle-outline'
              size='6xl'
              color='primary'
            />
            <Text fontSize='lg' textAlign='center'>
              No trap visits requiring water turbidity input.
            </Text>
          </VStack>
        )}
        <Button
          bg={'primary'}
          mt='auto'
          mx={25}
          onPress={() => {
            Keyboard.dismiss()
            navigation.navigate('Home')
          }}
        >
          <HStack space={3} alignItems='center'>
            <Icon as={Ionicons} name='home' size='lg' color='white' />
            <Text fontSize='md' color='white'>
              Return Home
            </Text>
          </HStack>
        </Button>
      </VStack>
    </ScrollView>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
    visitSetupDefaultState: state.visitSetupDefaults,
    previousTrapVisits:
      state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
  }
}

export default connect(mapStateToProps)(InputTurbidity)
