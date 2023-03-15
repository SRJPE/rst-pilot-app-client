import { Entypo } from '@expo/vector-icons'
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
import { useState } from 'react'
import CustomModal from '../../components/Shared/CustomModal'
import EditAccountInfoModalContent from '../../components/profile/EditAccountInfoModalContent'

const Profile = ({ navigation }: { navigation: any }) => {
  const [editAccountInfoModalOpen, setEditAccountInfoModalOpen] = useState(
    false as boolean
  )
  return (
    // <View flex={1} justifyContent='center' alignItems='center'>
    //   <Text fontSize='xl'>Profile Placeholder</Text>
    // </View>
    <>
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
          User Profile
        </Center>
        <VStack
          py='2%'
          px='4%'
          pt='4'
          overflow='hidden'
          height={'100%'}
          // bg='secondary'
          roundedBottom='xl'
        >
          <Pressable my='5%'>
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack space={4}>
                <Heading>Jordan Hong</Heading>
                <Text fontSize='2xl'>jhoang@flowwest.com</Text>
              </VStack>
              <Pressable onPress={() => setEditAccountInfoModalOpen(true)}>
                <Text color='primary' fontSize='2xl' fontWeight='600'>
                  Edit
                </Text>
              </Pressable>
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable my='5%'>
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack space={4}>
                <Heading>Monitoring Program</Heading>
                <Text fontSize='2xl'>Monitoring Program Team Name</Text>
              </VStack>
              <IconButton
                icon={<Icon as={Entypo} name='chevron-right' />}
                borderRadius='full'
                _icon={{
                  size: 10,
                }}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable my='5%'>
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack space={4}>
                <Heading>View Permit</Heading>
                {/* <Text fontSize='2xl'>Monitoring Program Team Name</Text> */}
              </VStack>
              <IconButton
                icon={<Icon as={Entypo} name='chevron-right' />}
                borderRadius='full'
                _icon={{
                  size: 10,
                }}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable my='5%'>
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack space={4}>
                <Heading>Change Password</Heading>
              </VStack>
              <IconButton
                icon={<Icon as={Entypo} name='chevron-right' />}
                borderRadius='full'
                _icon={{
                  size: 10,
                }}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />

          <Pressable
            mt='20'
            alignSelf='center'
            onPress={() => navigation.navigate('Home')}
          >
            <Text fontSize='2xl' fontWeight='bold' color='#FF0000'>
              Sign out
            </Text>
          </Pressable>
          <Button
            mt='20'
            alignSelf='center'
            bg='primary'
            color='white'
            onPress={() => navigation.navigate('Create New Program')}
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              CREATE NEW PROGRAM
            </Text>
          </Button>
        </VStack>
      </Box>
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={editAccountInfoModalOpen}
        closeModal={() => setEditAccountInfoModalOpen(false)}
        // height='1/1'
      >
        <EditAccountInfoModalContent
          closeModal={() => setEditAccountInfoModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}
export default Profile
