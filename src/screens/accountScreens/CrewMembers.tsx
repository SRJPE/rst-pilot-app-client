import React, { useState } from 'react'
import {
  Box,
  Center,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
import CustomModal from '../../components/Shared/CustomModal'
import AddCrewMemberModalContent from '../../components/createNewProgram/AddCrewMemberModalContent'
import { AppLogo } from '../SignIn'
const CrewMembers = ({ navigation }: { navigation: any }) => {
  const [addCrewMemberModalOpen, setAddCrewMemberModalOpen] = useState(
    false as boolean
  )

  const initialState = {
    agency: '',
    orchidID: '',
  }
  const handleAddCrewMember = () => {}

  return (
    <>
      <View flex={1} bg='#fff'>
        {/* <Box
          bg='primary'
          _text={{
            color: '#FFF',
            fontWeight: '700',
            fontSize: '2xl',
          }}
          px='6'
          py='3'
        >
          Add Trapping Crew
        </Box> */}

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
          <HStack space={5} alignItems='center'>
            <Icon
              as={Ionicons}
              name='person-circle'
              size='5xl'
              color='primary'
            />
            <Heading alignSelf='center'>You (Team Lead)</Heading>
            <Pressable onPress={handleAddCrewMember}>
              <Ionicons name='md-pencil' size={30} color='grey' />
            </Pressable>
          </HStack>
          <Text>First Name:</Text>
          <Text>Last Name:</Text>
          <Text>Email:</Text>
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
                // keyboardType='numeric'
                // onChange={debouncedOnChange}
                // onBlur={props.onBlur}
                value={initialState.agency}
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
                // keyboardType='numeric'
                // onChange={debouncedOnChange}
                // onBlur={props.onBlur}
                value={initialState.orchidID}
              />
            </FormControl>
          </HStack>
        </VStack>
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
export default CrewMembers
