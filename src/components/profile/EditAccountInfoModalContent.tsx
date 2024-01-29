import { Formik } from 'formik'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Input,
  Text,
  VStack,
} from 'native-base'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { editProfile } from '../../redux/reducers/userCredentialsSlice'
import { AppDispatch } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'

const editAccountValidationSchema = Yup.object().shape({
  firstName: Yup.string().label('First Name').required(),
  lastName: Yup.string().label('Last Name').required(),
  jobTitle: Yup.string().label('Job Title'),
  department: Yup.string().label('Department'),
})

//just an initial outline
const EditAccountInfoModalContent = ({
  closeModal,
  user,
}: {
  closeModal: () => void
  user: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <CustomModalHeader
        headerText={'Edit Account Info'}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <Divider my={2} thickness='3' />
      <Formik
        validationSchema={editAccountValidationSchema}
        initialValues={{
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          jobTitle: user.jobTitle || '',
          department: user.department || '',
          emailAddress: user.emailAddress || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(editProfile(values))
          setSubmitting(false)
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          isSubmitting,
          errors,
          touched,
        }) => {
          return (
            <VStack space={5} m='5%'>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Email
                  </Text>
                </FormControl.Label>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Email'
                  keyboardType='default'
                  isDisabled
                  onChangeText={handleChange('emailAddress')}
                  onBlur={handleBlur('emailAddress')}
                  value={values.emailAddress}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    First Name
                  </Text>
                </FormControl.Label>

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
                {errors.firstName && touched.firstName ? (
                  <Text mt='2' color='red.800'>
                    {errors.firstName as string}
                  </Text>
                ) : null}
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Last Name
                  </Text>
                </FormControl.Label>
                <Input
                  isDisabled={isSubmitting}
                  height='50px'
                  fontSize='16'
                  placeholder='Last Name'
                  keyboardType='default'
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                />
                {errors.lastName && touched.lastName ? (
                  <Text mt='2' color='red.800'>
                    {errors.lastName as string}
                  </Text>
                ) : null}
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Department
                  </Text>
                </FormControl.Label>
                <Input
                  isDisabled={isSubmitting}
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
                <Input
                  isDisabled={isSubmitting}
                  height='50px'
                  fontSize='16'
                  placeholder='Job Title'
                  keyboardType='default'
                  onChangeText={handleChange('jobTitle')}
                  onBlur={handleBlur('jobTitle')}
                  value={values.jobTitle}
                />
              </FormControl>

              <HStack mt='50' space={5}>
                <Button
                  variant='outline'
                  alignSelf='center'
                  borderRadius={10}
                  borderColor='red.800'
                  flexGrow={1}
                  h='60px'
                  _disabled={{
                    opacity: '75',
                  }}
                  onPress={() => {
                    closeModal()
                  }}
                >
                  <Text fontSize='xl' fontWeight='bold' color='red.800'>
                    Close
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
