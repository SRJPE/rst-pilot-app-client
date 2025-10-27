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
import { retrieveGeneticSamplesRequiringLabData } from '../../utils/helpers/helperFunctions'
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

const GeneticsSchema = yup.object({
  geneticInfo: yup
    .string()
    .required('Genetic Information is required')
    .typeError('Value must be a string'),
})

function Genetics({
  navigation,
  userCredentialsStore,
  previousCatchRecords,
  visitSetupDefaultState,
}: {
  navigation: any
  userCredentialsStore: any
  previousCatchRecords: any[]

  //TODO: import correct type so component cant be passed to the connect function without error  ==> previousCatchRecords: TrapVisitResponse[]
  visitSetupDefaultState: InitialStateI
}) {
  const dispatch = useDispatch<AppDispatch>()

  const geneticSamplesRequiringLabData =
    retrieveGeneticSamplesRequiringLabData(previousCatchRecords)

  console.log('geneticSamplesRequiringLabData', geneticSamplesRequiringLabData)

  const generateGeneticsListData = (geneticsArray: any[]) => {
    return geneticsArray.map(geneticObj => {
      const program = visitSetupDefaultState.programs.find(
        (program: any) => program.id === geneticObj.programId
      )

      const trapLocation = visitSetupDefaultState.trapLocations.find(
        (trapLocation: any) => trapLocation.id === geneticObj.trapLocationId
      )

      return {
        ...geneticObj,
      }
    })
  }
  const geneticsListData = generateGeneticsListData(
    geneticSamplesRequiringLabData
  )

  const renderTrapVisitDateTime = (trapVisit: any) => {
    if (trapVisit.trapVisitEndTime) {
      return (
        <Text fontSize='md'>
          <Text bold>Trap Visit Time:</Text>{' '}
          {new Date(trapVisit.trapVisitEndTime).toLocaleString()}
        </Text>
      )
    } else if (trapVisit.trapVisitStartTime) {
      return (
        <Text fontSize='md'>
          <Text bold>Trap Visit Time:</Text>{' '}
          {new Date(trapVisit.trapVisitStartTime).toLocaleString()}
        </Text>
      )
    }
  }

  console.log('geneticsListData', geneticsListData)

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
          Input Genetic Information
        </Text>
        <Text fontSize='md' p={5}>
          The following genetic samples are missing lab weight. Enter the value
          for each catch record and click the Save button to upload the data
        </Text>
        {geneticsListData.map(geneticObj => (
          <Formik
            key={geneticObj.id}
            initialValues={{
              waterTurbidity: '',
            }}
            validationSchema={GeneticsSchema}
            onSubmit={(values, { setSubmitting }) => {
              api
                .put(`trap-visit/${geneticObj.id}/environmental`, {
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

              const displayInputWarning = false

              return (
                <>
                  <Box
                    key={geneticObj.geneticObjId}
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
                    <Text fontSize='xl'>
                      <Text bold>Genetic Sample Id:</Text> {geneticObj.sampleId}
                    </Text>
                    {renderTrapVisitDateTime(geneticObj)}
                    <Divider my={2} />
                    <HStack alignItems='center' space={3} h={100}>
                      <Box flex={3}>
                        <FormInputComponent
                          showWarning={displayInputWarning}
                          label={'Lab Weight'}
                          placeholder='0'
                          touched={touched}
                          errors={errors}
                          value={values.waterTurbidity}
                          camelName={'waterTurbidity'}
                          onChangeText={handleChange('waterTurbidity')}
                          onBlur={handleBlur('waterTurbidity')}
                          RightElement={<TextInputAdornment text='g' />}
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
        {geneticsListData.length === 0 && (
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
              No trap visits requiring genetics input.
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
    previousCatchRecords:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(Genetics)
