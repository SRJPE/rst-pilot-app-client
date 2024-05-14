import React, { useState } from 'react'
import {
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
} from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { Formik } from 'formik'
import FormInputComponent from '../../../components/Shared/FormInputComponent'
import CustomSelect from '../../../components/Shared/CustomSelect'
import { crewMembersLeadSchema } from '../../../utils/helpers/yupValidations'

export const sampleTeamLead = {
  //to be replaced when a logged in user is persisted
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '1234567890',
  email: 'test@flowwest.com',
  isLead: true,
}

const CrewMembers = ({
  navigation,
  crewMembersStore,
}: {
  navigation: any
  crewMembersStore: any
}) => {
  const [addCrewMemberModalOpen, setAddCrewMemberModalOpen] = useState(
    false as boolean
  )
  const [addTrapModalContent, setAddTrapModalContent] = useState(
    IndividualCrewMemberState as any
  )
  const { firstName, lastName, phoneNumber, email } = sampleTeamLead
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const handleSaveTeamLeadInformation = (values: any) => {
    let payload = {
      ...sampleTeamLead,
      ...values,
    }
    console.log('🚀 ~ handleSaveTeamLeadInformation ~ payload:', payload)
    dispatch(saveIndividualCrewMember(payload))
  }
  const handleShowTableModal = (selectedRowData: any) => {
    const modalDataContainer = {} as any
    Object.keys(selectedRowData).forEach((key: string) => {
      modalDataContainer[key] = selectedRowData[key].toString()
    })
    setAddTrapModalContent(modalDataContainer)
    setAddCrewMemberModalOpen(true)
  }

  return (
    <>
      <Formik
        validationSchema={crewMembersLeadSchema}
        initialValues={{ agency: '', orcidId: '' }}
        onSubmit={(values) => {
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
        }) => (
          <>
            <View flex={1} bg='#fff'>
              <Center bg='primary' py='5%'>
                <AppLogo imageSize={200} />
              </Center>
              <VStack py='5%' px='10%' space={5}>
                <Heading alignSelf='center'>Add Trapping Crew</Heading>
                <Text fontSize='lg' color='grey'>
                  {
                    'Please add some additional information about yourself and add your crew \nmembers. Accounts will be created for all crew members.'
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
                  <Text>Phone Number: {phoneNumber}</Text>
                  <Text>Email: {email}</Text>
                  <HStack space={10} alignItems='center'>
                    <FormControl w='45%'>
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
              height='50%'
            >
              <AddCrewMemberModalContent
                addTrapModalContent={addTrapModalContent}
                closeModal={() => setAddCrewMemberModalOpen(false)}
              />
            </CustomModal>
          </>
        )}
      </Formik>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    crewMembersStore: state.crewMembers.crewMembersStore,
  }
}

export default connect(mapStateToProps)(CrewMembers)
