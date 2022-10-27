import { useState } from 'react'
import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../../../redux/reducers/formSlices/visitSetupSlice'
import {
  Select,
  FormControl,
  CheckIcon,
  Heading,
  VStack,
  Text,
  View,
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapVisitSchema } from '../../../utils/helpers/yupValidations'
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'

import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import CustomSelect from '../../../components/Shared/CustomSelect'

const mapStateToProps = (state: RootState) => {
  return {
    visitSetupState: state.visitSetup,
    visitSetupDefaultsState: state.visitSetupDefaults,
  }
}

const VisitSetup = ({
  navigation,
  visitSetupState,
  visitSetupDefaultsState,
}: {
  navigation: any
  visitSetupState: any
  visitSetupDefaultsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null
  )

  const handleSubmit = (values: any) => {
    dispatch(saveVisitSetup(values))
    dispatch(markVisitSetupCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ Visit', values)
  }

  const updateSelectedProgram = (streamName: string) => {
    let programId = null
    visitSetupDefaultsState?.programs.forEach((program: any) => {
      if (program.streamName === streamName) programId = program.id
    })
    setSelectedProgramId(programId)
  }

  return (
    <Formik
      validationSchema={trapVisitSchema}
      initialValues={visitSetupState.values}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      // maybe this is not needed for first step in form?
      // initialTouched={{ trapSite: crew }}
      // initialErrors={visitSetupState.completed ? undefined : { crew: '' }}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        touched,
        errors,
        values,
      }) => (
        <>
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={10}>
              <Heading mt='2'>Which stream are you trapping on?</Heading>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Stream
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.stream}
                  placeholder='Stream'
                  onValueChange={(itemValue: string) => {
                    setFieldValue('stream', itemValue)
                    updateSelectedProgram(itemValue)
                  }}
                  setFieldTouched={setFieldTouched}
                  selectOptions={visitSetupDefaultsState?.programs?.map(
                    (program: any) => ({
                      label: program?.streamName,
                      value: program?.streamName,
                    })
                  )}
                />
                {touched.stream &&
                  errors.stream &&
                  renderErrorMessage(errors, 'stream')}
              </FormControl>
              {values.stream && (
                <>
                  <FormControl>
                    <Heading fontSize='lg' mb='4'>
                      Confirm the following values:
                    </Heading>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Trap Site
                      </Text>
                    </FormControl.Label>
                    <CustomSelect
                      selectedValue={values.trapSite}
                      placeholder='Trap Site'
                      onValueChange={handleChange('trapSite')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={visitSetupDefaultsState?.trapLocations?.map(
                        (trapLocation: any) => ({
                          label: trapLocation?.siteName,
                          value: trapLocation?.siteName,
                        })
                      )}
                    />
                    {touched.trapSite &&
                      errors.trapSite &&
                      renderErrorMessage(errors, 'trapSite')}
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Crew
                      </Text>
                    </FormControl.Label>
                    <CrewDropDown
                      crewList={visitSetupDefaultsState?.crewMembers[
                        selectedProgramId ? selectedProgramId - 1 : 0
                      ].map((crewMember: any) => ({
                        label: `${crewMember?.firstName} ${crewMember?.lastName}`,
                        value: `${crewMember?.firstName} ${crewMember?.lastName}`,
                      }))}
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
                    />
                    {/* {touched.crew &&
                      errors.crew &&
                      renderErrorMessage(errors, 'crew')} */}
                  </FormControl>
                </>
              )}
            </VStack>
          </View>
          <NavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
          />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(VisitSetup)
