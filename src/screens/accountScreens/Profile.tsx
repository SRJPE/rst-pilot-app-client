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
import { useEffect, useState } from 'react'
import CustomModal from '../../components/Shared/CustomModal'
import EditAccountInfoModalContent from '../../components/profile/EditAccountInfoModalContent'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch } from 'react-redux'
import { clearUserCredentials } from '../../redux/reducers/userCredentialsSlice'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/axiosConfig'

const Profile = ({
  userCredentialsStore,
  navigation,
}: {
  userCredentialsStore: any
  navigation: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [editAccountInfoModalOpen, setEditAccountInfoModalOpen] = useState(
    false as boolean
  )
  // const [user, setUser] = useState<any>({})

  // useEffect(() => {
  //   ;(async () => {
  //     const idToken = await SecureStore.getItemAsync('userIdToken')
  //     const accessToken = await SecureStore.getItemAsync('userAccessToken')
  //     if (idToken) {
  //       const userRes = await api.get('user/current', {
  //         headers: { idToken },
  //       })
  //       console.log('🚀 ~ ; ~ userRes:', userRes)

  //       setUser(userRes.data)
  //     }
  //   })()
  // }, [])
  return (
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
                <Heading>
                  {userCredentialsStore?.displayName || 'No Name'}
                </Heading>
                <Text fontSize='2xl'>
                  {userCredentialsStore?.emailAddress || 'No email'}
                </Text>
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
            onPress={() => {
              // AuthSession.dismiss()
              dispatch(clearUserCredentials())
            }}
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
            onPress={() => navigation.navigate('Monitoring Program')}
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              MONITORING PROGRAM
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
const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(Profile)
