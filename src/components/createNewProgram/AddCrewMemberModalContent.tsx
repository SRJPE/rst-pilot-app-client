import { Formik } from 'formik'
import {
  Box,
  Button,
  FormControl,
  HStack,
  Radio,
  Text,
  VStack,
} from 'native-base'

import { useDispatch, useSelector } from 'react-redux'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import {
  IndividualCrewMemberState,
  IndividualCrewMemberValuesI,
  saveIndividualCrewMember,
  updateIndividualCrewMember,
} from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { AppDispatch, RootState } from '../../redux/store'

import { useCallback, useEffect, useState } from 'react'
import { Searchbar } from 'react-native-paper'
import { PersonnelObject } from '../../screens/accountScreens/createNewProgram/CrewMembers'
import { crewMembersSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import CrewMemberEntryModeToggle from './CrewMemberEntryModeToggle'
import QuickAddCrewTable from './QuickAddCrewTable'

export type CrewMemberEntryMode = 'search' | 'manual'

const AddCrewMemberModalContent = ({
  closeModal,
  addTrapModalContent,
  personnelOptions,
}: {
  closeModal: () => void
  addTrapModalContent?: any
  personnelOptions: Array<PersonnelObject>
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const [crewMemberEntryMode, setCrewMemberEntryMode] =
    useState<CrewMemberEntryMode>('search')

  const [modalDataTemp, setModalDataTemp] = useState({} as any)
  const [emailSearchValue, setEmailSearchValue] = useState<string>('')
  const [emailSearchResults, setEmailSearchResults] = useState<
    PersonnelObject[]
  >([])

  const resetSearch = () => {
    setEmailSearchValue('')
    setEmailSearchResults([])
    setShowNoResultsMessage(false)
  }

  const checkExistingEmail = useCallback(
    (email: string | null) => {
      const emailExists = personnelOptions.some(
        personnel => personnel?.email?.toLowerCase() === email?.toLowerCase()
      )
      if (emailExists) {
        return { email: 'Email already exists' }
      } else {
        return null
      }
    },
    [personnelOptions]
  )

  const handleAddCrewMemberSubmission = (
    values: IndividualCrewMemberValuesI
  ) => {
    if (values?.uid) {
      dispatch(updateIndividualCrewMember(values))
    } else {
      dispatch(saveIndividualCrewMember(values))
    }
  }

  const changeCrewMemberEntryMode = (mode: CrewMemberEntryMode) => {
    setCrewMemberEntryMode(mode)
  }

  const [showNoResultsMessage, setShowNoResultsMessage] =
    useState<boolean>(false)

  useEffect(() => {
    setModalDataTemp(addTrapModalContent)
  }, [addTrapModalContent])

  return (
    <Formik
      validationSchema={crewMembersSchema}
      initialValues={IndividualCrewMemberState}
      onSubmit={(values, { resetForm }) => {
        handleAddCrewMemberSubmission(values)
        resetForm()
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        setValues,
        resetForm,
        touched,
        errors,
        values,
      }) => {
        useEffect(() => {
          setValues(modalDataTemp)
        }, [modalDataTemp])

        const emailExistsError = checkExistingEmail(values.email)

        const noInputsTouched = Object.keys(touched).length === 0

        const formInvalid =
          noInputsTouched ||
          Object.values(errors).length > 0 ||
          Boolean(emailExistsError)

        return (
          <>
            <CustomModalHeader
              headerText={'Add Crew Member'}
              showHeaderButton={false}
              closeModal={() => {
                resetForm()
                closeModal()
                resetSearch()
                changeCrewMemberEntryMode('search')
              }}
            />
            <CrewMemberEntryModeToggle
              resetForm={resetForm}
              resetSearch={resetSearch}
              changeCrewMemberEntryMode={changeCrewMemberEntryMode}
              crewMemberEntryMode={crewMemberEntryMode}
            />
            {crewMemberEntryMode === 'search' && (
              <VStack space={3} mx='5%' my='2%'>
                <Text color='black' fontSize='lg'>
                  Search for existing user
                </Text>
                <HStack>
                  <Searchbar
                    placeholder='Enter email address to search for user'
                    value={emailSearchValue}
                    onChangeText={e => setEmailSearchValue(e.trim())}
                    style={{ flexGrow: 1 }}
                  />
                  <Button
                    bg='primary'
                    mx='2'
                    px='10'
                    shadow='3'
                    isDisabled={emailSearchValue.length === 0}
                    onPress={() => {
                      setShowNoResultsMessage(false)
                      const searchResults = personnelOptions.filter(personnel =>
                        personnel.email
                          ?.toLowerCase()
                          .includes(emailSearchValue.toLowerCase())
                      )
                      setEmailSearchResults(searchResults)
                      if (searchResults.length === 0) {
                        setShowNoResultsMessage(true)
                      }
                    }}
                  >
                    <Text fontSize='xl' color='white'>
                      Search
                    </Text>
                  </Button>
                </HStack>
                <Box marginTop={5}>
                  <QuickAddCrewTable
                    resetSearch={resetSearch}
                    emailSearchResults={emailSearchResults}
                    changeCrewMemberEntryMode={changeCrewMemberEntryMode}
                    handleAddCrewMemberSubmission={
                      handleAddCrewMemberSubmission
                    }
                    showNoResultsMessage={showNoResultsMessage}
                    closeModal={closeModal}
                  />
                </Box>
              </VStack>
            )}

            {crewMemberEntryMode === 'manual' && (
              <VStack mx='5%' my='2%' space={4}>
                <HStack justifyContent='space-between'>
                  <FormInputComponent
                    label={'First Name'}
                    touched={touched}
                    errors={errors}
                    value={values.firstName || ''}
                    camelName={'firstName'}
                    width={'45%'}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                  />
                  <FormInputComponent
                    label={'Last Name'}
                    touched={touched}
                    errors={errors}
                    value={values.lastName || ''}
                    camelName={'lastName'}
                    width={'45%'}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                  />
                </HStack>
                <HStack justifyContent='space-between'>
                  <FormInputComponent
                    label={'Phone Number'}
                    touched={touched}
                    errors={errors}
                    value={values.phoneNumber || ''}
                    camelName={'phoneNumber'}
                    // keyboardType={'phone'} //TODO add phone styling
                    width={'45%'}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                  />
                  <FormInputComponent
                    label={'Email'}
                    touched={touched}
                    errors={emailExistsError || errors}
                    value={values.email?.trim() || ''}
                    camelName={'email'}
                    width={'45%'}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </HStack>
                <HStack justifyContent='space-between'>
                  <FormControl w='45%'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Funding Agency
                      </Text>
                    </FormControl.Label>
                    <CustomSelect
                      dataType='fundingAgency'
                      selectedValue={values.agency as string}
                      placeholder='Funding Agency'
                      onValueChange={handleChange('agency')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={dropdownValues?.fundingAgency}
                    />
                  </FormControl>
                  <FormInputComponent
                    label={'Orcid ID (optional)'}
                    touched={touched}
                    errors={errors}
                    value={values.orcidId || ''}
                    camelName={'orcidId'}
                    width={'45%'}
                    onChangeText={handleChange('orcidId')}
                    onBlur={handleBlur('orcidId')}
                  />
                </HStack>
                <FormControl w='30%'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Is Lead
                    </Text>
                  </FormControl.Label>
                  <Radio.Group
                    name='isLead'
                    accessibilityLabel='is lead'
                    value={`${values.isLead}`}
                    onChange={(value: any) => {
                      setFieldTouched('isLead', true)
                      if (value === 'true') {
                        setFieldValue('isLead', true)
                      } else {
                        setFieldValue('isLead', false)
                      }
                    }}
                  >
                    <Radio
                      colorScheme='primary'
                      value='false'
                      my={1}
                      _icon={{ color: 'primary' }}
                    >
                      No
                    </Radio>
                    <Radio
                      colorScheme='primary'
                      value='true'
                      my={1}
                      _icon={{ color: 'primary' }}
                    >
                      Yes
                    </Radio>
                  </Radio.Group>
                </FormControl>
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  isDisabled={formInvalid}
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
            )}
          </>
        )
      }}
    </Formik>
  )
}

export default AddCrewMemberModalContent
