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
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { saveIndividualCrewMember } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'

export const sampleTeamLead = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '1234567890',
  email: 'test@flowwest.com',
}

const CrewMembers = ({
  navigation,
  crewMembersStore,
}: {
  navigation: any
  crewMembersStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [agency, setAgency] = useState('' as string)
  const [orchidID, setOrchidID] = useState('' as string)
  const [addCrewMemberModalOpen, setAddCrewMemberModalOpen] = useState(
    false as boolean
  )
  const { firstName, lastName, phoneNumber, email } = sampleTeamLead

  const handleSaveTeamLeadInformation = () => {
    let values = {
      ...sampleTeamLead,
      isLead: true,
      agency,
      orchidID,
    }
    dispatch(saveIndividualCrewMember(values))
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
              {/* <Pressable onPress={handleAddCrewMember}>
                <Ionicons name='md-pencil' size={30} color='grey' />
              </Pressable> */}
              <Button bg='primary' onPress={handleSaveTeamLeadInformation}>
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
                    Agency
                  </Text>
                </FormControl.Label>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Agency'
                  onChangeText={(newValue) => setAgency(newValue)}
                  value={agency}
                />
              </FormControl>
              <FormControl w='45%'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Orchid ID (optional)
                  </Text>
                </FormControl.Label>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Orchid ID (optional)'
                  onChangeText={(newValue) => setOrchidID(newValue)}
                  value={orchidID}
                />
              </FormControl>
            </HStack>
          </VStack>
        ) : (
          <ScrollView h={300}>
            <CrewMemberDataTable />
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
          closeModal={() => setAddCrewMemberModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    crewMembersStore: state.crewMembers.crewMembersStore,
  }
}

export default connect(mapStateToProps)(CrewMembers)
