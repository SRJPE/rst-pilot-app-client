import * as WebBrowser from 'expo-web-browser'
import {
  Button,
  Heading,
  HStack,
  KeyboardAvoidingView,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import React from 'react'
import { ImageBackground } from 'react-native'

import {
  // @ts-ignore
  REACT_APP_CLIENT_ID,
} from '@env'
import {
  AuthRequest,
  AuthRequestPromptOptions,
  AuthSessionResult,
  DiscoveryDocument,
  exchangeCodeAsync,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { connect, useDispatch } from 'react-redux'
import api from '../api/axiosConfig'
import AppLogo from '../components/Shared/AppLogo'
import { saveUserCredentials } from '../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState } from '../redux/store'
import { getVisitSetupDefaults } from '../redux/reducers/visitSetupDefaults'

WebBrowser.maybeCompleteAuthSession()

const SignIn = ({ userCredentialsStore }: { userCredentialsStore: any }) => {
  const dispatch = useDispatch<AppDispatch>()

  // Endpoint
  const discovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/B2C_1_signin/v2.0/'
  )
  const passwordResetDiscovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/B2C_1_password_reset/v2.0/'
  )
  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'
  const clientId = REACT_APP_CLIENT_ID

  // Request
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
  const [pwResetRequest, pwResetResponse, pwResetPromptAsync] = useAuthRequest(
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
    passwordResetDiscovery
  )

  const handleUserAuthFlow = (
    promptAsyncFn: (
      options?: AuthRequestPromptOptions | undefined
    ) => Promise<AuthSessionResult>,
    requestObj: AuthRequest | null,
    discoveryObj: DiscoveryDocument | null
  ) =>
    promptAsyncFn().then((codeResponse: AuthSessionResult) => {
      if (requestObj && codeResponse?.type === 'success' && discoveryObj) {
        exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: requestObj.codeVerifier
              ? { code_verifier: requestObj.codeVerifier }
              : undefined,
            redirectUri,
          },
          discoveryObj
        ).then(async res => {
          const { accessToken, refreshToken, idToken, scope } = res
          const userRes = await api.get('user/current', {
            headers: {
              idToken: idToken as string,
              ['Authorization']: `Bearer ${accessToken}`,
            },
          })

          const personnelResponse = await api.get(
            `personnel/azure/${userRes.data.azureUid}`,
            {
              headers: {
                idToken: idToken as string,
                ['Authorization']: `Bearer ${accessToken}`,
              },
            }
          )

          dispatch(getVisitSetupDefaults(personnelResponse.data.id))

          await SecureStore.setItemAsync('userAccessToken', accessToken)

          await SecureStore.setItemAsync(
            'userRefreshToken',
            refreshToken as string
          )
          await SecureStore.setItemAsync('userIdToken', idToken as string)

          dispatch(
            saveUserCredentials({
              ...userCredentialsStore,
              ...userRes.data,
              ...personnelResponse.data,
            })
          )
        })
      }
    })

  return (
    <KeyboardAvoidingView flex='1' behavior='padding'>
      <ImageBackground
        style={[{ flex: 1 }]}
        source={require('../../assets/background_image.png')}
        resizeMode='cover'
      >
        <VStack justifyContent='center' alignItems='center' mt='120' space={10}>
          <AppLogo imageSize={375} />
          <Heading color='#FFF' fontWeight={300} fontSize='7xl' mb={16}>
            Data Tackle{' '}
          </Heading>
          <Button
            borderRadius={10}
            bg='primary'
            h='60px'
            w='450px'
            shadow='5'
            _disabled={{
              opacity: '75',
            }}
            disabled={!request}
            onPress={() => handleUserAuthFlow(promptAsync, request, discovery)}
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              Sign In
            </Text>
          </Button>
          <HStack justifyContent='space-between' w='400px'>
            <Pressable
              onPress={() =>
                handleUserAuthFlow(
                  pwResetPromptAsync,
                  pwResetRequest,
                  passwordResetDiscovery
                )
              }
            >
              <Text color='#fff' fontSize='lg'>
                Forgot Password
              </Text>
            </Pressable>
            <Pressable>
              <Text color='#fff' fontSize='lg'>
                Create Account
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(SignIn)
