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
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
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

const SignIn = ({ navigation }: { navigation: any }) => {
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

  console.log('🚀 ~ SignIn ~ discovery:', discovery)

  // const redirectUri = makeRedirectUri({
  //   scheme: 'com.onmicrosoft.rstb2c.rsttabletapp',
  //   // scheme: undefined,
  //   path: 'oauth/redirect',
  // })

  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'
  console.log('🚀 ~ SignIn ~ redirectUri:', redirectUri)

  // ('com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect')

  const clientId = REACT_APP_CLIENT_ID

  // We store the JWT in here
  const [token, setToken] = React.useState<string | null>(null)

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
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
          <Input
            focusOutlineColor='#fff'
            variant='filled'
            fontSize='2xl'
            h='60px'
            w='450px'
            placeholder='Email'
            onChangeText={handleChangeEmail}
            value={email}
            _focus={{
              bg: '#fff',
            }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name='mail' />}
                size={7}
                ml='2'
                color='muted.400'
              />
            }
          />
          <Input
            focusOutlineColor='#fff'
            variant='filled'
            fontSize='2xl'
            h='60px'
            w='450px'
            placeholder='Password'
            onChangeText={handleChangePassword}
            value={password}
            _focus={{
              bg: '#fff',
            }}
            type={show ? 'text' : 'password'}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name='lock' />}
                size={7}
                ml='2'
                color='muted.400'
              />
            }
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? 'visibility' : 'visibility-off'}
                    />
                  }
                  size={7}
                  mr='2'
                  color='muted.400'
                />
              </Pressable>
            }
          />
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
                      console.log('🚀 ~ res.accessToken:', res.accessToken)
                      setToken(res.accessToken)
                      dispatch(saveUserCredentials(res.accessToken))
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
          <Text color='#fff' fontSize='lg'>
            Token: {token}
          </Text>
          {/* ) : (
            <></>
          )} */}
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
export default SignIn
