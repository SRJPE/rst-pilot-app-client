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
import { editProfile } from '../../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import api from '../../api/axiosConfig'
import CustomSelect from '../Shared/CustomSelect'
import * as SecureStore from 'expo-secure-store'

const editAccountValidationSchema = Yup.object().shape({
  firstName: Yup.string().label('First Name').required(),
  lastName: Yup.string().label('Last Name').required(),
  phone: Yup.string().label('Job Title'),
  agencyId: Yup.string().label('Agency').required(),
  emailAddress: Yup.string().label('Email').email().required(),
  role: Yup.string().label('Role').required(),
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
        headerText={'Edit Account Info'}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <Formik
        validationSchema={editAccountValidationSchema}
        initialValues={{
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          agencyId: user.agencyId || '',
          emailAddress: user.emailAddress || '',
          role: user.role || '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { firstName, lastName, phone, agencyId, emailAddress, role } =
            values

          const editedUserResponse = await api
            .patch(`user/${user.azureUid}/edit`, {
              firstName,
              lastName,
              phone,
              agencyId,
            })
            .catch(err => {
              console.log(
                '🚀 ~ file: AddNewUserModalContent.tsx:240 ~ onSubmit={ ~ err:',
                err
              )

              setSubmissionMessage({
                success: false,
                message:
                  'There was an error updating the user. Please try again.',
              })
              setSubmitting(false)
            })

          if (editedUserResponse?.status === 200) {
            await dispatch(
              editProfile({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                agencyId,
                role,
              })
            )
            setSubmissionMessage({
              success: true,
              message: 'User successfully updated',
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
                  value={values.emailAddress}
                  isDisabled={true}
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
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Funding Agency
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.agencyId.toString()}
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
                  selectedValue={values.role as string}
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

export default EditAccountInfoModalContent
