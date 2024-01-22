import { Entypo } from '@expo/vector-icons'
import { useAuthRequest, useAutoDiscovery } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import EditAccountInfoModalContent from '../../components/profile/EditAccountInfoModalContent'
import CustomModal from '../../components/Shared/CustomModal'
import { clearUserCredentials } from '../../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState } from '../../redux/store'

import {
  // @ts-ignore
  REACT_APP_CLIENT_ID,
} from '@env'
import MonitoringProgramInfoModalContent from '../../components/profile/MonitoringProgramModalContent'

const Profile = ({
  userCredentialsStore,
  navigation,
}: {
  userCredentialsStore: any
  navigation: any
}) => {
  console.log('🚀 ~ userCredentialsStore 4:', userCredentialsStore)

  const dispatch = useDispatch<AppDispatch>()
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false)
  const [editAccountInfoModalOpen, setEditAccountInfoModalOpen] =
    useState<boolean>(false)
  const [monitoringProgramInfoModalOpen, setMonitoringProgramInfoModalOpen] =
    useState<boolean>(false)

  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'
  const clientId = REACT_APP_CLIENT_ID

  const discovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_password_reset'
  )

  //////////////////////////////////////////////

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

  //////////////////////////////////////////////
  //Web Browser Change Password
  const [result, setResult] = useState<WebBrowser.WebBrowserResult | null>(null)

  const handleChangePasswordButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(
      `https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_password_reset&client_id=cfae2097-cff5-45ab-a238-96873bf15888&nonce=defaultNonce&redirect_uri=com.onmicrosoft.rstb2c.rsttabletapp%3A%2F%2Foauth%2Fredirect&scope=openid&response_type=code&prompt=login`
    )
    setResult(result)
    // promptAsync().then(codeResponse => {
    //   if (request && codeResponse?.type === 'success' && discovery) {
    //     console.log('🚀 ~ request:', request)
    //     console.log('🚀 ~ promptAsync ~ codeResponse:', codeResponse)
    //     exchangeCodeAsync(
    //       {
    //         clientId,
    //         code: codeResponse.params.code,
    //         extraParams: request.codeVerifier
    //           ? { code_verifier: request.codeVerifier }
    //           : undefined,
    //         redirectUri,
    //       },
    //       discovery
    //     ).then(async res => {
    //       const { accessToken, refreshToken, idToken } = res
    //       const userRes = await api.get('user/current', {
    //         headers: { idToken: idToken as string },
    //       })

    //       await SecureStore.setItemAsync('userAccessToken', accessToken)
    //       await SecureStore.setItemAsync(
    //         'userRefreshToken',
    //         refreshToken as string
    //       )
    //       await SecureStore.setItemAsync('userIdToken', idToken as string)

    //       dispatch(
    //         saveUserCredentials({
    //           ...userCredentialsStore,
    //           ...userRes.data,
    //         })
    //       )
    //     })
    //   }
    // })
  }

  return (
    <>
      <Box overflow='hidden'>
        <VStack alignItems='center' marginTop='16' marginBottom='8'>
          {/* <Avatar
            source={{
              uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
            }}
            size={150}
            borderRadius={100}
            backgroundColor='hsl(0,0%,70%)'
            borderColor='secondary'
            borderWidth={3}
          /> */}
          <Text fontSize={'3xl'}>{userCredentialsStore.displayName}</Text>
          <Text fontSize={'xl'}>{userCredentialsStore.jobTitle}</Text>
          <Text fontSize={'lg'} mb={5}>
            {userCredentialsStore.emailAddress}
          </Text>
          <Button
            alignSelf='center'
            bg='transparent'
            borderWidth={1}
            borderColor='primary'
            onPress={() => setEditAccountInfoModalOpen(true)}
          >
            <Text fontWeight='bold' color='primary'>
              EDIT PROFILE
            </Text>
          </Button>
        </VStack>
        <VStack
          py='2%'
          px='4%'
          pt='4'
          overflow='hidden'
          height={'100%'}
          // bg='secondary'
          roundedBottom='xl'
        >
          <Pressable
            my='7'
            onPress={() => setMonitoringProgramInfoModalOpen(true)}
          >
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack>
                <Text fontSize='2xl' bold>
                  Monitoring Program
                </Text>
                <Text fontSize='xl'> {'<Monitoring Program Team Name>'}</Text>
              </VStack>
              <Icon
                as={Entypo}
                name='chevron-right'
                color='black'
                size={8}
                marginX={3}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable my='7'>
            <HStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='2xl' bold>
                View Permit
              </Text>
              <Icon
                as={Entypo}
                name='chevron-right'
                color='black'
                size={8}
                marginX={3}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable
            my='7'
            onPress={async () => await handleChangePasswordButtonAsync()}
          >
            <HStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='2xl' bold>
                Change Password
              </Text>
            </HStack>
          </Pressable>
          <Divider bg='#414141' />

          <Pressable
            my='7'
            onPress={async () => {
              const accessToken = await SecureStore.getItemAsync(
                'userAccessToken'
              )
              const refreshToken = await SecureStore.getItemAsync(
                'userRefreshToken'
              )
              console.log('🚀 ~ onPress={ ~ refreshToken:', refreshToken)

              ///////
              setLogoutModalOpen(true)
              // dispatch(clearUserCredentials())
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
      {editAccountInfoModalOpen && (
        <CustomModal
          isOpen={editAccountInfoModalOpen}
          closeModal={() => setEditAccountInfoModalOpen(false)}
        >
          <EditAccountInfoModalContent
            closeModal={() => setEditAccountInfoModalOpen(false)}
            user={userCredentialsStore}
          />
        </CustomModal>
      )}
      <CustomModal
        isOpen={monitoringProgramInfoModalOpen}
        closeModal={() => setMonitoringProgramInfoModalOpen(false)}
        // height='1/1'
      >
        <MonitoringProgramInfoModalContent
          closeModal={() => setMonitoringProgramInfoModalOpen(false)}
        />
      </CustomModal>

      <CustomModal
        isOpen={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
        height='175'
        size='md'
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        <Box display='flex' height='175' paddingX={10} paddingY={5}>
          <Text textAlign='center' fontSize='lg' bold marginBottom={1}>
            Are you sure you want to log out?
          </Text>
          <Text textAlign='center' marginBottom={5}>
            When logged out you will not have access to saved content when
            offline.
          </Text>
          <HStack justifyContent='center'>
            <Button
              marginRight={2}
              borderWidth={1}
              flexGrow={1}
              backgroundColor='transparent'
              borderColor='error'
              color='error'
              onPress={() => setLogoutModalOpen(false)}
            >
              <Text color='error'>Cancel</Text>
            </Button>
            <Button
              background='primary'
              onPress={() => {
                setLogoutModalOpen(false)
                dispatch(clearUserCredentials())
              }}
              flexGrow={1}
              marginLeft={3}
            >
              Confirm
            </Button>
          </HStack>
        </Box>
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
