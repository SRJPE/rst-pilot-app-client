import React, { useEffect, useState } from 'react'
import {
  Heading,
  Icon,
  Input,
  KeyboardAvoidingView,
  Pressable,
  VStack,
  Image,
  Text,
  Button,
  HStack,
} from 'native-base'
import { ImageBackground } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import {
  AuthRequest,
  AuthRequestConfig,
  exchangeCodeAsync,
  fetchDiscoveryAsync,
  makeRedirectUri,
  Prompt,
  ResponseType,
  TokenResponse,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import api from '../api/axiosConfig'
import { saveUserCredentials } from '../redux/reducers/userCredentialsSlice'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import {
  // @ts-ignore
  REACT_APP_REDIRECT_URI,
  // @ts-ignore
  REACT_APP_CLIENT_ID,
  // @ts-ignore
  REACT_APP_TENANT_ID,
} from '@env'
import AppLogo from '../components/Shared/AppLogo'

WebBrowser.maybeCompleteAuthSession()

const SignIn = ({
  userCredentialsStore,
  navigation,
}: {
  userCredentialsStore: any
  navigation: any
}) => {
  console.log('🚀 ~ userCredentialsStore:', userCredentialsStore)

  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState('' as string)
  const [password, setPassword] = useState('' as string)
  const [show, setShow] = React.useState(false as boolean)
  // const [discovery, setDiscovery]: any = useState({} as any)
  const [authRequest, setAuthRequest]: any = useState({} as any)
  const [authorizeResult, setAuthorizeResult]: any = useState({} as any)

  const handleChangeEmail = (text: string) => {
    setEmail(text)
  }
  const handleChangePassword = (text: string) => {
    setPassword(text)
  }

  // useEffect(() => {
  //   const getSession = async () => {
  //     const d = await fetchDiscoveryAsync(
  //       `https://login.microsoftonline.com/${REACT_APP_TENANT_ID}/v2.0`
  //     )

  //     const authRequestOptions: AuthRequestConfig = {
  //       prompt: Prompt.Login,
  //       responseType: ResponseType.Code,
  //       scopes: ['openid', 'profile', 'email', 'offline_access'],
  //       usePKCE: true,
  //       clientId: REACT_APP_CLIENT_ID,
  //       redirectUri: REACT_APP_REDIRECT_URI,
  //     }
  //     const authRequest = new AuthRequest(authRequestOptions)
  //     setAuthRequest(authRequest)
  //     setDiscovery(d)
  //   }
  //   getSession()
  // }, [])

  // useEffect(() => {
  //   const getCodeExchange = async () => {
  //     const tokenResult = await exchangeCodeAsync(
  //       {
  //         code: authorizeResult.params.code,
  //         clientId: REACT_APP_CLIENT_ID,
  //         redirectUri: REACT_APP_REDIRECT_URI,
  //         extraParams: {
  //           code_verifier: authRequest.codeVerifier || '',
  //         },
  //       },
  //       discovery
  //     )
  //     console.log('🚀 ~ getCodeExchange ~ tokenResult:', tokenResult)
  //     dispatch(saveUserCredentials(tokenResult))
  //   }

  //   if (authorizeResult && authorizeResult.type == 'error') {
  //     //Handle error
  //   }

  //   if (
  //     authorizeResult &&
  //     authorizeResult.type == 'success' &&
  //     authRequest &&
  //     authRequest.codeVerifier
  //   ) {
  //     getCodeExchange()
  //   }
  // }, [authorizeResult, authRequest])

  // Endpoint
  const discovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/B2C_1_signin/v2.0/'
  )
  console.log('🚀 ~ discovery:', discovery)

  // const redirectUri = makeRedirectUri({
  //   scheme: 'com.onmicrosoft.rstb2c.rsttabletapp',
  //   // scheme: undefined,
  //   path: 'oauth/redirect',
  // })

  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'

  // ('com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect')

  const clientId = REACT_APP_CLIENT_ID

  // We store the JWT in here
  // const [token, setToken] = React.useState<{
  //   accessToken: string | undefined
  //   refreshToken: string | undefined
  //   idToken: string | undefined
  // } | null>(null)

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
  console.log('🚀 ~ request:', request)

  async function saveSecureStore(key: string, value: string) {
    await SecureStore.setItemAsync(key, value)
  }

  //Web Browser Change Password
  const [result, setResult] = useState<WebBrowser.WebBrowserResult | null>(null)

  const handleChangePasswordButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(
      `https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_password_reset&client_id=cfae2097-cff5-45ab-a238-96873bf15888&nonce=defaultNonce&redirect_uri=com.onmicrosoft.rstb2c.rsttabletapp%3A%2F%2Foauth%2Fredirect&scope=openid&response_type=code&prompt=login`
    )
    setResult(result)
  }

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
          {/* {authRequest && discovery ? ( */}
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
            // isDisabled={email === '' || password === ''}
            // isDisabled={!authRequest.request}
            onPress={
              //   async () => {
              //   const authorizeResult = await authRequest.promptAsync(discovery)
              //   setAuthorizeResult(authorizeResult)
              // }
              () => {
                promptAsync().then(codeResponse => {
                  if (
                    request &&
                    codeResponse?.type === 'success' &&
                    discovery
                  ) {
                    console.log('🚀 ~ request:', request)
                    console.log(
                      '🚀 ~ promptAsync ~ codeResponse:',
                      codeResponse
                    )
                    exchangeCodeAsync(
                      {
                        clientId,
                        code: codeResponse.params.code,
                        extraParams: request.codeVerifier
                          ? { code_verifier: request.codeVerifier }
                          : undefined,
                        redirectUri,
                      },
                      discovery
                    ).then(async res => {
                      const { accessToken, refreshToken, idToken } = res
                      const userRes = await api.get('user/current', {
                        headers: { idToken: idToken as string },
                      })

                      await SecureStore.setItemAsync(
                        'userAccessToken',
                        accessToken
                      )
                      await SecureStore.setItemAsync(
                        'userRefreshToken',
                        refreshToken as string
                      )
                      await SecureStore.setItemAsync(
                        'userIdToken',
                        idToken as string
                      )

                      dispatch(
                        saveUserCredentials({
                          ...userCredentialsStore,
                          ...userRes.data,
                        })
                      )
                    })
                  }
                })
              }
            }
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              Sign In
            </Text>
          </Button>
          <HStack justifyContent='space-between' w='400px'>
            <Pressable
              onPress={async () => await handleChangePasswordButtonAsync()}
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
