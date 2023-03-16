import React, { useState } from 'react'
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
import { StyleSheet, ImageBackground } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

export const AppLogo = ({
  addBorder,
  imageSize,
}: {
  addBorder?: boolean
  imageSize?: number
}) => {
  return (
    <Image
      source={require('../../assets/chinook_salmon_rotated.jpeg')}
      height={imageSize}
      width={imageSize}
      borderRadius={1000}
      borderColor={addBorder ? 'primary' : '#fff'}
      borderWidth={addBorder ? 5 : 0}
      alt='salmon logo'
    />
  )
}

const SignIn = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('' as string)
  const [password, setPassword] = useState('' as string)
  const [show, setShow] = React.useState(false as boolean)

  const handleChangeEmail = (text: string) => {
    setEmail(text)
  }
  const handleChangePassword = (text: string) => {
    setPassword(text)
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
            onPress={() => navigation.navigate('Home')}
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              Sign In
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
export default SignIn
