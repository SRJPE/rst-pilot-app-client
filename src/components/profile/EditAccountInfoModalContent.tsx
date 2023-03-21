import React from 'react'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { Input } from 'native-base'

//just an initial outline

const EditAccountInfoModalContent = ({ closeModal }: { closeModal: any }) => {
  return (
    <>
      <CustomModalHeader
        headerText={'Edit Account Info'}
        showHeaderButton={true}
        closeModal={closeModal}
        // headerButton={
        //   <Button
        //     bg='primary'
        //     mx='2'
        //     px='10'
        //     shadow='3'
        //     // isDisabled={
        //     //   (touched && Object.keys(touched).length === 0) ||
        //     //   (errors && Object.keys(errors).length > 0)
        //     // }
        //     onPress={() => {
        //       // handleSubmit()
        //       closeModal()
        //     }}
        //   >
        //     <Text fontSize='xl' color='white'>
        //       Save
        //     </Text>
        //   </Button>
        // }
      />
      <Divider my={2} thickness='3' />
      <VStack space={5} m='5%'>
        <FormControl>
          <HStack space={4} alignItems='center'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                First Name
              </Text>
            </FormControl.Label>

            {/* {touched.sampleIdNumber &&
              errors.sampleIdNumber &&
              RenderErrorMessage(errors, 'sampleIdNumber')} */}
          </HStack>
          <Input
            height='50px'
            fontSize='16'
            placeholder='First Name'
            keyboardType='default'
            // onChangeText={handleChange('sampleIdNumber')}
            // onBlur={handleBlur('sampleIdNumber')}
            // value={values.sampleIdNumber}
          />
        </FormControl>
        <FormControl>
          <HStack space={4} alignItems='center'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Last Name
              </Text>
            </FormControl.Label>

            {/* {touched.sampleIdNumber &&
              errors.sampleIdNumber &&
              RenderErrorMessage(errors, 'sampleIdNumber')} */}
          </HStack>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Last Name'
            keyboardType='default'
            // onChangeText={handleChange('sampleIdNumber')}
            // onBlur={handleBlur('sampleIdNumber')}
            // value={values.sampleIdNumber}
          />
        </FormControl>
        <FormControl>
          <HStack space={4} alignItems='center'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Email
              </Text>
            </FormControl.Label>

            {/* {touched.sampleIdNumber &&
              errors.sampleIdNumber &&
              RenderErrorMessage(errors, 'sampleIdNumber')} */}
          </HStack>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Email'
            keyboardType='default'
            // onChangeText={handleChange('sampleIdNumber')}
            // onBlur={handleBlur('sampleIdNumber')}
            // value={values.sampleIdNumber}
          />
        </FormControl>
        <Button
          mt='100'
          alignSelf='center'
          borderRadius={10}
          bg='primary'
          h='60px'
          w='400px'
          shadow='5'
          _disabled={{
            opacity: '75',
          }}
          // isDisabled={email === '' || password === ''}
          onPress={() => {
            // handleSubmit()
            closeModal()
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Save
          </Text>
        </Button>
      </VStack>
    </>
  )
}

export default EditAccountInfoModalContent
