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
import {
  clearUserCredentials,
  changePassword,
} from '../../redux/reducers/userCredentialsSlice'
import {
  dismiss,
  exchangeCodeAsync,
  revokeAsync,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/axiosConfig'
import {
  // @ts-ignore
  REACT_APP_REDIRECT_URI,
  // @ts-ignore
  REACT_APP_CLIENT_ID,
  // @ts-ignore
  REACT_APP_TENANT_ID,
} from '@env'

const Profile = ({
  userCredentialsStore,
  navigation,
  clearAllUserCredentials,
}: {
  userCredentialsStore: any
  clearAllUserCredentials: any
  navigation: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [editAccountInfoModalOpen, setEditAccountInfoModalOpen] = useState(
    false as boolean
  )
  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'
  const clientId = REACT_APP_CLIENT_ID

  const discovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_password_reset'
  )

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: [
        'openid',
        'profile',
        'email',
        'offline_access',
        'https://rsttabletapp.onmicrosoft.com/jpe-server-api/api.read',
        'https://rsttabletapp.onmicrosoft.com/jpe-server-api/api.write',
      ],
      redirectUri,
    },
    discovery
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
            onPress={async () => {
              const accessToken = await SecureStore.getItemAsync(
                'userAccessToken'
              )
              console.log('🚀 ~ onPress={ ~ accessToken:', accessToken)

              const refreshToken = await SecureStore.getItemAsync(
                'userRefreshToken'
              )
              console.log('🚀 ~ onPress={ ~ refreshToken:', refreshToken)
              //////////////
              //Attempt #1 Use the dismiss method from Expo-Auth-Session
              //////////////
              // dismiss()

              //////////////
              //Attempt #2 Use the revokeAsync method from Expo-Auth-Session
              //note: Using the useAutoDiscovery hook does not return the required revocationEndpoint
              //////////////
              // if (accessToken) {
              //   const revokeRes = await revokeAsync(
              //     { token: accessToken },
              //     { revocationEndpoint: discovery?.endSessionEndpoint }
              //   )
              // }
              // if (refreshToken) {
              //   const revokeRes = await revokeAsync(
              //     { token: refreshToken },
              //     { revocationEndpoint: discovery?.endSessionEndpoint }
              //   )
              // }

              //////////////
              //Attempt #3 Make a direct call to the end_session_endpoint
              //note: After looking into it some more I think the browser window needs to be opened 0so the href can be visited to trigger the logout event
              //////////////
              // const logoutRes = await fetch(
              //   'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Fjwt.ms%2',
              //   { headers: { authorization: `${accessToken}` } }
              // )
              // console.log('🚀 ~ logoutRes:', logoutRes)
              // console.log('tokens revoked')
              dispatch(clearUserCredentials())
            }}
          >
            <Text fontSize='2xl' fontWeight='bold' color='#FF0000'>
              Sign out
            </Text>
          </Pressable>
          <Button
            mt='5'
            alignSelf='center'
            bg='amber.500'
            onPress={async () =>
              //   async () => {
              //   const authorizeResult = await authRequest.promptAsync(discovery)
              //   setAuthorizeResult(authorizeResult)
              // }
              dispatch(
                changePassword({
                  currentPassword: 'Fishfood123',
                  newPassword: 'Willie123!',
                })
              )
            }
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              RESET PASSWORD{' '}
            </Text>
          </Button>
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

const mapDispatchToProps = dispatch => {
  return {
    clearAllUserCredentials: () => dispatch(clearUserCredentials()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
