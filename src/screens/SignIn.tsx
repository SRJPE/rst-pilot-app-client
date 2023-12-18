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
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
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

  // const redirectUri = makeRedirectUri({
  //   scheme: 'com.onmicrosoft.rstb2c.rsttabletapp',
  //   // scheme: undefined,
  //   path: 'oauth/redirect',
  // })

  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'

  // ('com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect')

  const clientId = REACT_APP_CLIENT_ID

  // We store the JWT in here
  const [token, setToken] = React.useState<{
    accessToken: string | undefined
    refreshToken: string | undefined
  } | null>(null)

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
                    ).then(res => {
                      const tokenResponse = {
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken,
                      }

                      console.log('🚀 ~ promptAsync ~ res:', res)
                      setToken(tokenResponse)
                      dispatch(saveUserCredentials(tokenResponse))
                    })
                  }
                })
              }
            }
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              Sign in with Microsoft
            </Text>
          </Button>
          <HStack justifyContent='space-between' w='400px'>
            <Pressable>
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
    userCredentialsStore: state.userCredentials.storedCredentials,
  }
}

export default connect(mapStateToProps)(SignIn)
