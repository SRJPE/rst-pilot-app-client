import React from 'react'
import {
  Box,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
const CrewMembers = ({ navigation }: { navigation: any }) => {
  const handleEditCrewMember = () => {}

  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Box
          bg='primary'
          _text={{
            color: '#FFF',
            fontWeight: '700',
            fontSize: '2xl',
          }}
          px='6'
          py='3'
        >
          Permitting Information
        </Box>
        <VStack py='5%' px='10%' space={5}>
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
            <Pressable onPress={handleEditCrewMember}>
              <Ionicons name='md-pencil' size={30} color='grey' />
            </Pressable>
          </HStack>
          <Text>First Name:</Text>
          <Text>Last Name:</Text>
          <Text>Email:</Text>
        </VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}
export default CrewMembers
