import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Pressable,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import CustomModal from '../../../components/Shared/CustomModal'
import AddCrewMemberModalContent from '../../../components/createNewProgram/AddCrewMemberModalContent'
import AppLogo from '../../../components/Shared/AppLogo'
import CrewMemberDataTable from '../../../components/createNewProgram/CrewMemberDataTable'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  IndividualCrewMemberState,
  saveIndividualCrewMember,
  removeIndividualCrewMember,
  IndividualCrewMemberValuesI,
} from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { Formik } from 'formik'
import FormInputComponent from '../../../components/Shared/FormInputComponent'
import CustomSelect from '../../../components/Shared/CustomSelect'
import { crewMembersLeadSchema } from '../../../utils/helpers/yupValidations'
import { InitialStateI as UserCredentialsState } from '../../../redux/reducers/userCredentialsSlice'

import { CrewMembersStoreI } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { PersonnelInitialStateI } from '../../../redux/reducers/personnelSlice'
import { markCreateNewProgramStepIncomplete } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { set } from 'lodash'

export type PersonnelObject = IndividualCrewMemberValuesI & {
  id: number
  phone: string
  role: string
  agencyId: number
}

const CrewMembers = ({
  navigation,
  crewMembersStore,
  userCredentialsStore,
  personnelStore,
}: {
  navigation: any
  crewMembersStore: CrewMembersStoreI
  userCredentialsStore: UserCredentialsState
  personnelStore: PersonnelInitialStateI
}) => {
  const [addCrewMemberModalOpen, setAddCrewMemberModalOpen] = useState(
    false as boolean
  )
  const [addTrapModalContent, setAddTrapModalContent] = useState(
    IndividualCrewMemberState as any
  )
  const { firstName, lastName, phone, emailAddress } = userCredentialsStore

  const [filteredPersonnel, setFilteredPersonnel] = useState(
    personnelStore.personnelOptions as PersonnelObject[]
  )

  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const updatedCrewMembersStore = useSelector(
    (state: RootState) => state.crewMembers.crewMembersStore
  )

  const updatedCrewMembersArray = Object.values(updatedCrewMembersStore)

  useEffect(() => {
    const crewMemberIds = updatedCrewMembersArray.map(
      (crewMember: IndividualCrewMemberValuesI & { id: string }) =>
        crewMember.id
    )

    if (updatedCrewMembersArray.length === 0) {
      dispatch(markCreateNewProgramStepIncomplete('crewMembers'))
    }
  }, [updatedCrewMembersStore])

  const personnelOptions = personnelStore.personnelOptions as PersonnelObject[]

  const handleSaveTeamLeadInformation = (values: any) => {
    let payload = {
      firstName,
      lastName,
      phoneNumber: phone,
      email: emailAddress,
      ...values,
      isLead: true,
    }
    dispatch(saveIndividualCrewMember(payload))
  }

  const handleDeleteCrewMember = (uid: string) => {
    dispatch(removeIndividualCrewMember(uid))
  }

  const handleShowTableModal = (selectedRowData: any) => {
    setAddTrapModalContent(selectedRowData)
    setAddCrewMemberModalOpen(true)
  }

  return (
    <>
      <Formik
        validationSchema={crewMembersLeadSchema}
        initialValues={{ agency: '', orcidId: '' }}
        onSubmit={values => {
          handleSaveTeamLeadInformation(values)
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
        }) => {
          console.log('🚀 ~ file: CrewMembers.tsx:112 ~ errors:', errors)

          return (
            <>
              <View flex={1} bg='#fff'>
                <Center bg='primary' py='5%'>
                  <AppLogo imageSize={200} />
                </Center>
                <VStack py='5%' px='10%' space={5}>
                  <Heading alignSelf='center'>Add Trapping Crew</Heading>
                  <Text fontSize='lg' color='grey'>
                    {
                      'Please add some additional information about yourself and add your crew \nmembers. Accounts will be created for all crew'
                    }
                  </Text>
                </VStack>
                {Object.values(crewMembersStore).length === 0 ? (
                  <VStack pb='5%' px='10%' space={5}>
                    <HStack
                      space={5}
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <HStack
                        space={5}
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Icon
                          as={Ionicons}
                          name='person-circle'
                          size='5xl'
                          color='primary'
                        />
                        <Heading alignSelf='center'>You (Team Lead)</Heading>
                      </HStack>
                      <Button bg='primary' onPress={() => handleSubmit()}>
                        <Text fontSize='xl' color='white'>
                          Save your information
                        </Text>
                      </Button>
                    </HStack>
                    <Text>First Name: {firstName}</Text>
                    <Text>Last Name: {lastName}</Text>
                    <Text>Phone Number: {phone || 'Not Entered'}</Text>
                    <Text>Email: {emailAddress}</Text>
                    <HStack space={10} alignItems='flex-start'>
                      <FormControl w='45%' isInvalid={Boolean(errors.agency)}>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Funding Agency
                          </Text>
                        </FormControl.Label>
                        <CustomSelect
                          selectedValue={values.agency}
                          placeholder='Funding Agency'
                          onValueChange={handleChange('agency')}
                          setFieldTouched={setFieldTouched}
                          selectOptions={dropdownValues?.fundingAgency}
                        />
                        <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
                          {errors.agency}*
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormInputComponent
                        width={'45%'}
                        label={'Orcid ID'}
                        touched={touched}
                        errors={errors}
                        value={values.orcidId ? `${values.orcidId}` : ''}
                        camelName={'orcidId'}
                        onChangeText={handleChange('orcidId')}
                        onBlur={handleBlur('orcidId')}
                      />
                    </HStack>
                  </VStack>
                ) : (
                  <ScrollView h={300}>
                    <CrewMemberDataTable
                      handleRemoveCrewMember={handleDeleteCrewMember}
                      handleShowTableModal={handleShowTableModal}
                    />
                  </ScrollView>
                )}
                <Divider my='1%' />
                <VStack py='5%' px='10%' space={5}>
                  <Pressable onPress={() => setAddCrewMemberModalOpen(true)}>
                    <HStack alignItems='center'>
                      <Icon
                        as={Ionicons}
                        name={'add-circle'}
                        size='3xl'
                        color='primary'
                        marginRight='1'
                      />
                      <Text color='primary' fontSize='xl'>
                        Add crew Member
                      </Text>
                    </HStack>
                  </Pressable>
                </VStack>
              </View>
              <CreateNewProgramNavButtons navigation={navigation} />
              {/* --------- Modals --------- */}
              <CustomModal
                isOpen={addCrewMemberModalOpen}
                closeModal={() => setAddCrewMemberModalOpen(false)}
                height='70%'
              >
                <AddCrewMemberModalContent
                  personnelOptions={personnelOptions}
                  addTrapModalContent={addTrapModalContent}
                  closeModal={() => setAddCrewMemberModalOpen(false)}
                />
              </CustomModal>
            </>
          )
        }}
      </Formik>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    crewMembersStore: state.crewMembers.crewMembersStore,
    userCredentialsStore: state.userCredentials,
    personnelStore: state.personnel,
  }
}

export default connect(mapStateToProps)(CrewMembers)
