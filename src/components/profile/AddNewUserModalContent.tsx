import { Formik } from 'formik'
import {
  Button,
  FormControl,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from 'native-base'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import api from '../../api/axiosConfig'
import CustomSelect from '../Shared/CustomSelect'

const editAccountValidationSchema = Yup.object().shape({
  firstName: Yup.string().label('First Name').required(),
  lastName: Yup.string().label('Last Name').required(),
  mobilePhone: Yup.string().label('Job Title'),
  agencyId: Yup.string().label('Agency').required(),
  emailAddress: Yup.string().label('Email').email().required(),
  role: Yup.string().label('Role').required(),
})

//just an initial outline
const AddNewUserModalContent = ({ closeModal }: { closeModal: () => void }) => {
  const [submissionMessage, setSubmissionMessage] = useState({
    success: false,
    message: '',
  })

  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values.fundingAgency
  )

  return (
    <>
      <CustomModalHeader
        headerText={'Add New User'}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <Formik
        validationSchema={editAccountValidationSchema}
        initialValues={{
          firstName: '',
          lastName: '',
          mobilePhone: '',
          agencyId: '',
          emailAddress: '',
          role: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const {
            firstName,
            lastName,
            mobilePhone,
            agencyId,
            emailAddress,
            role,
          } = values
          const createdUserResponse = await api
            .post(`user/create`, {
              firstName,
              lastName,
              mobilePhone,
              agencyId,
              emailAddress,
            })
            .catch(err => {
              console.log(
                '🚀 ~ file: AddNewUserModalContent.tsx:240 ~ onSubmit={ ~ err:',
                err
              )

              setSubmissionMessage({
                success: false,
                message:
                  'There was an error creating the user. Please try again.',
              })
              setSubmitting(false)
            })

          if (createdUserResponse?.status === 200) {
            setSubmissionMessage({
              success: true,
              message: 'User successfully created',
            })
            await api.post(`/personnel`, {
              first_name: firstName,
              last_name: lastName,
              email: emailAddress,
              phone: mobilePhone,
              agencyId,
              role,
              azure_uid: createdUserResponse.data.id,
            })
            setTimeout(() => {
              closeModal()
            }, 1000)
          }
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
          setFieldTouched,
        }) => {
          return (
            <VStack justifyContent={'space-between'} h={800} m='5%'>
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
                  onChangeText={handleChange('emailAddress')}
                  onBlur={handleBlur('emailAddress')}
                  value={values.emailAddress}
                  isDisabled={isSubmitting}
                />
                {errors.emailAddress && touched.emailAddress ? (
                  <Text mt='2' color='red.800'>
                    {errors.emailAddress as string}
                  </Text>
                ) : null}
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
                    Phone Number
                  </Text>
                </FormControl.Label>
                <Input
                  isDisabled={isSubmitting}
                  height='50px'
                  fontSize='16'
                  placeholder='###-###-#### (Optional)'
                  keyboardType='default'
                  onChangeText={handleChange('mobilePhone')}
                  onBlur={handleBlur('mobilePhone')}
                  value={values.mobilePhone}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Funding Agency
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.agencyId as string}
                  placeholder='Funding Agency'
                  onValueChange={handleChange('agencyId')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={dropdownValues}
                  dataType='fundingAgency'
                  disabled={isSubmitting}
                />
                {errors.agencyId && touched.agencyId ? (
                  <Text mt='2' color='red.800'>
                    {errors.agencyId as string}
                  </Text>
                ) : null}
              </FormControl>

              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Role
                  </Text>
                </FormControl.Label>
                <Select
                  height='50px'
                  fontSize='16'
                  placeholder='Select a role'
                  onValueChange={handleChange('role')}
                  isDisabled={isSubmitting}
                >
                  <Select.Item label='Lead' value='lead' />
                  <Select.Item label='Non-Lead' value='non-lead' />
                </Select>
                {errors.role && touched.role ? (
                  <Text mt='2' color='red.800'>
                    {errors.role as string}
                  </Text>
                ) : null}
              </FormControl>

              {submissionMessage.message && (
                <Text
                  color={submissionMessage.success ? 'green.700' : 'red.700'}
                >
                  {submissionMessage.message}
                </Text>
              )}

              <HStack space={5}>
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
                  isDisabled={isSubmitting || submissionMessage.success}
                  onPress={async () => {
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

export default AddNewUserModalContent
