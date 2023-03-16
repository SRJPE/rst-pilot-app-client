import React from 'react'
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import { Feather, Ionicons } from '@expo/vector-icons'
const CrewMembers = ({ navigation }: { navigation: any }) => {
  const handleEditCrewMember = () => {}

  return (
    <Box overflow='hidden'>
      <Center
        bg='primary'
        _text={{
          alignSelf: 'center',
          color: '#FFF',
          fontWeight: '700',
          fontSize: 'xl',
        }}
        bottom='0'
        px='6'
        py='1.5'
      >
        Add Trapping Crew
      </Center>
      <Button my='5' mx='40' bg='primary' onPress={() => navigation.goBack()}>
        GO BACK
      </Button>
      <VStack py='5%' px='10%' space={5}>
        <Text fontSize='lg' color='grey'>
          {
            'Please add some additional information about yourself and add your crew \nmembers. Accounts will be created for all crew'
          }
        </Text>
        <HStack space={5} alignItems='center'>
          <Icon as={Ionicons} name='person-circle' size='5xl' color='primary' />
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
  )
}
export default CrewMembers

//   {
//   as: Ionicons,
//   name: 'md-pencil',
//   color: 'grey',
// }
