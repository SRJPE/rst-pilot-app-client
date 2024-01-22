import React, { useState } from 'react'
import {
  Avatar,
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
  View,
} from 'native-base'
import { Ionicons, FontAwesome } from '@expo/vector-icons'

import CustomModalHeader from '../Shared/CustomModalHeader'
import { Input } from 'native-base'
import { Formik } from 'formik'
import * as ImagePicker from 'expo-image-picker'

//just an initial outline
const EditAccountInfoModalContent = ({ closeModal }: { closeModal: any }) => {
  const [imageSrc, setImageSrc] = useState(
    'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
  )

  const pickImage = async setFieldValue => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    console.log(result)

    if (!result.cancelled) {
      console.log('🚀 ~ pickImage ~ result:', result)
      setFieldValue('image', result.uri)
      setImageSrc(result.uri)
    }
  }

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
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          jobTitle: '',
          department: '',
          email: 'wwhitfield@flowwest.com',
          image:
            'https:i//media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => console.log('Form Values', values), 4000)
          setSubmitting(false)
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          setFieldValue,
          isSubmitting,
        }) => {
          return (
            <VStack space={5} m='5%'>
              <HStack space={10}>
                <Avatar
                  source={{
                    uri: imageSrc,
                    // uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
                  }}
                  size={150}
                  borderRadius={100}
                  backgroundColor='hsl(0,0%,70%)'
                  borderColor='secondary'
                  borderWidth={3}
                />
                <VStack>
                  <Text fontSize='xl'>Profile Picture</Text>
                  <Text fontSize='lg' color='gray.500'>
                    Maximum Size is 2mb
                  </Text>
                  <Text fontSize='lg' color='gray.500'>
                    Supported images: .jpg, .jpeg, .svg
                  </Text>
                  <Button
                    variant='outline'
                    mt={5}
                    borderColor='primary'
                    onPress={() => pickImage(setFieldValue)}
                    leftIcon={
                      <Icon
                        as={Ionicons}
                        name='images'
                        size='sm'
                        color='primary'
                      />
                    }
                  >
                    <Text color='primary'>Upload Image</Text>
                  </Button>
                </VStack>
              </HStack>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Email
                  </Text>
                </FormControl.Label>

                {/* {touched.sampleIdNumber &&
              errors.sampleIdNumber &&
              RenderErrorMessage(errors, 'sampleIdNumber')} */}
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Email'
                  keyboardType='default'
                  isDisabled
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    First Name
                  </Text>
                </FormControl.Label>
                {/* {touched.sampleIdNumber &&
                errors.sampleIdNumber &&
                RenderErrorMessage(errors, 'sampleIdNumber')} */}

                <Input
                  isDisabled={isSubmitting}
                  height='50px'
                  fontSize='16'
                  placeholder='First Name'
                  keyboardType='default'
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Last Name
                  </Text>
                </FormControl.Label>
                {/* {touched.sampleIdNumber &&
                errors.sampleIdNumber &&
                RenderErrorMessage(errors, 'sampleIdNumber')} */}

                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Last Name'
                  keyboardType='default'
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Department
                  </Text>
                </FormControl.Label>

                {/* {touched.sampleIdNumber &&
              errors.sampleIdNumber &&
              RenderErrorMessage(errors, 'sampleIdNumber')} */}
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Department'
                  keyboardType='default'
                  onChangeText={handleChange('department')}
                  onBlur={handleBlur('department')}
                  value={values.department}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Job Title
                  </Text>
                </FormControl.Label>

                {/* {touched.sampleIdNumber &&
              errors.sampleIdNumber &&
              RenderErrorMessage(errors, 'sampleIdNumber')} */}
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Job Title'
                  keyboardType='default'
                  onChangeText={handleChange('jobTitle')}
                  onBlur={handleBlur('jobTitle')}
                  value={values.jobTitle}
                />
              </FormControl>

              <HStack mt='100' space={5}>
                <Button
                  variant='outline'
                  alignSelf='center'
                  borderRadius={10}
                  borderColor='red.800'
                  // bg='red.800'
                  flexGrow={1}
                  h='60px'
                  shadow='5'
                  _disabled={{
                    opacity: '75',
                  }}
                  // isDisabled={email === '' || password === ''}
                  onPress={() => {
                    closeModal()
                  }}
                >
                  <Text fontSize='xl' fontWeight='bold' color='red.800'>
                    Cancel
                  </Text>
                </Button>
                <Button
                  alignSelf='center'
                  borderRadius={10}
                  bg='primary'
                  h='60px'
                  flexGrow={1}
                  shadow='5'
                  _disabled={{
                    opacity: '75',
                  }}
                  // isDisabled={email === '' || password === ''}
                  onPress={() => {
                    handleSubmit()
                    // closeModal()
                  }}
                >
                  <Text fontSize='xl' fontWeight='bold' color='white'>
                    Save
                  </Text>
                </Button>
              </HStack>
            </VStack>
          )
        }}
      </Formik>
    </>
  )
}

export default EditAccountInfoModalContent
