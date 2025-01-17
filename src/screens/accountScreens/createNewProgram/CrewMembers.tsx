import { Ionicons } from '@expo/vector-icons'
import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import AddCrewMemberModalContent from '../../../components/createNewProgram/AddCrewMemberModalContent'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import CrewMemberDataTable from '../../../components/createNewProgram/CrewMemberDataTable'
import AppLogo from '../../../components/Shared/AppLogo'
import CustomModal from '../../../components/Shared/CustomModal'
import {
  IndividualCrewMemberState,
  IndividualCrewMemberValuesI,
  removeIndividualCrewMember,
  saveIndividualCrewMember,
} from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { InitialStateI as UserCredentialsState } from '../../../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState } from '../../../redux/store'

import { DataTable } from 'react-native-paper'
import { markCreateNewProgramStepIncomplete } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { CrewMembersStoreI } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { PersonnelInitialStateI } from '../../../redux/reducers/personnelSlice'

export type PersonnelObject = IndividualCrewMemberValuesI & {
  id: number
  phone: string
  role: string
  agencyId: number
  agencyDefinition: string
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

  const {
    firstName,
    lastName,
    phone,
    emailAddress,
    agencyDefinition,
    orcidId,
    id,
  } = userCredentialsStore

  const dispatch = useDispatch<AppDispatch>()

  const updatedCrewMembersStore = useSelector(
    (state: RootState) => state.crewMembers.crewMembersStore
  )

  const updatedCrewMembersArray = Object.values(updatedCrewMembersStore)

  useEffect(() => {
    if (updatedCrewMembersArray.length === 0) {
      dispatch(markCreateNewProgramStepIncomplete('crewMembers'))
    }
  }, [updatedCrewMembersStore])

  const personnelOptions = personnelStore.personnelOptions as PersonnelObject[]

  const handleSaveTeamLeadInformation = () => {
    let payload = {
      firstName,
      lastName,
      phoneNumber: phone,
      email: emailAddress,
      agency: agencyDefinition,
      orcidId,
      isLead: true,
      id,
    }
    dispatch(saveIndividualCrewMember(payload))
  }

  const handleDeleteCrewMember = (uid: string) => {
    dispatch(removeIndividualCrewMember(uid))
  }

  return (
    <>
      <View flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='10%' space={5}>
          <Heading alignSelf='center'>Add Trapping Crew</Heading>
          <Text fontSize='lg' color='grey'>
            Enter the details of the crew members involved in the trapping
            program
          </Text>
        </VStack>

        {Object.values(crewMembersStore).length === 0 ? (
          <VStack>
            <DataTable.Row style={{ marginBottom: 0 }}>
              <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
                <Pressable onPress={() => setAddCrewMemberModalOpen(true)}>
                  <HStack alignItems='center'>
                    <Icon
                      as={Ionicons}
                      name={'add'}
                      size='lg'
                      color='primary'
                      marginRight='1'
                    />
                    <Text color='primary' fontSize='md'>
                      Add Crew Member
                    </Text>
                  </HStack>
                </Pressable>
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Header>
              <DataTable.Title style={{ flex: 2 }}>First Name</DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>Last Name</DataTable.Title>
              <DataTable.Title style={{ flex: 3 }}>Email</DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>Agency</DataTable.Title>
              <DataTable.Title style={{ flex: 1 }}>{''}</DataTable.Title>
            </DataTable.Header>

            <VStack alignItems='center'>
              <Text fontSize='xl' textAlign='center' my={5}>
                No trap crew members assigned to this program yet.
              </Text>
              <Button onPress={() => handleSaveTeamLeadInformation()}>
                <HStack alignItems='center'>
                  <Icon
                    as={Ionicons}
                    name={'person'}
                    size='3xl'
                    color='primary'
                    marginRight='1'
                  />
                  <Text color='primary' fontSize='xl'>
                    Save Your Information
                  </Text>
                </HStack>
              </Button>
              <Text>OR</Text>
              <Button onPress={() => setAddCrewMemberModalOpen(true)}>
                <HStack alignItems='center'>
                  <Icon
                    as={Ionicons}
                    name={'add'}
                    size='3xl'
                    color='primary'
                    marginRight='1'
                  />
                  <Text color='primary' fontSize='xl'>
                    Add Crew Member
                  </Text>
                </HStack>
              </Button>
            </VStack>
          </VStack>
        ) : (
          <ScrollView h={300}>
            <CrewMemberDataTable
              handleRemoveCrewMember={handleDeleteCrewMember}
              handleShowAddCrewModal={() => setAddCrewMemberModalOpen(true)}
            />
          </ScrollView>
        )}
      </View>
      <CreateNewProgramNavButtons navigation={navigation} />
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={addCrewMemberModalOpen}
        closeModal={() => setAddCrewMemberModalOpen(false)}
        height='85%'
      >
        <AddCrewMemberModalContent
          personnelOptions={personnelOptions}
          addTrapModalContent={addTrapModalContent}
          closeModal={() => setAddCrewMemberModalOpen(false)}
        />
      </CustomModal>
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
