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
  Prompt,
  ResponseType,
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

export const AppLogo = ({
  addBorder,
  imageSize,
}: {
  addBorder?: boolean
  imageSize?: number
}) => {
  return (
    <Image
      source={require('../../assets/chinook_salmon.jpeg')}
      height={imageSize}
      width={imageSize}
      borderRadius={1000}
      borderColor={addBorder ? 'primary' : '#fff'}
      borderWidth={addBorder ? 5 : 0}
      alt='salmon logo'
    />
  )
}

WebBrowser.maybeCompleteAuthSession()

const SignIn = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState('' as string)
  const [password, setPassword] = useState('' as string)
  const [show, setShow] = React.useState(false as boolean)
  const [discovery, setDiscovery]: any = useState({} as any)
  const [authRequest, setAuthRequest]: any = useState({} as any)
  const [authorizeResult, setAuthorizeResult]: any = useState({} as any)

  const handleChangeEmail = (text: string) => {
    setEmail(text)
  }
  const handleChangePassword = (text: string) => {
    setPassword(text)
  }

  useEffect(() => {
    const getSession = async () => {
      const d = await fetchDiscoveryAsync(
        `https://login.microsoftonline.com/${REACT_APP_TENANT_ID}/v2.0`
      )

      const authRequestOptions: AuthRequestConfig = {
        prompt: Prompt.Login,
        responseType: ResponseType.Code,
        scopes: ['openid', 'profile', 'email', 'offline_access'],
        usePKCE: true,
        clientId: REACT_APP_CLIENT_ID,
        redirectUri: REACT_APP_REDIRECT_URI,
      }
      const authRequest = new AuthRequest(authRequestOptions)
      setAuthRequest(authRequest)
      setDiscovery(d)
    }
    getSession()
  }, [])

  useEffect(() => {
    const getCodeExchange = async () => {
      const tokenResult = await exchangeCodeAsync(
        {
          code: authorizeResult.params.code,
          clientId: REACT_APP_CLIENT_ID,
          redirectUri: REACT_APP_REDIRECT_URI,
          extraParams: {
            code_verifier: authRequest.codeVerifier || '',
          },
        },
        discovery
      )
      console.log('🚀 ~ getCodeExchange ~ tokenResult:', tokenResult)
      dispatch(saveUserCredentials(tokenResult))
    }

    if (authorizeResult && authorizeResult.type == 'error') {
      //Handle error
    }

    if (
      authorizeResult &&
      authorizeResult.type == 'success' &&
      authRequest &&
      authRequest.codeVerifier
    ) {
      getCodeExchange()
    }
  }, [authorizeResult, authRequest])

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
          {authRequest && discovery ? (
            <Button
              borderRadius={10}
              bg='primary'
              h='60px'
              w='450px'
              shadow='5'
              _disabled={{
                opacity: '75',
              }}
              // isDisabled={email === '' || password === ''}
              // isDisabled={!authRequest.request}
              onPress={async () => {
                const authorizeResult = await authRequest.promptAsync(discovery)
                setAuthorizeResult(authorizeResult)
              }}
            >
              <Text fontSize='xl' fontWeight='bold' color='white'>
                Sign In
              </Text>
            </Button>
          ) : (
            <></>
          )}
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
