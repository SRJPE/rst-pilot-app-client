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
import { generateErrorMessage } from '../../utils/helpers/helperFunctions'
import FormInputComponent from '../Shared/FormInputComponent'
import { update } from 'lodash'

const editAccountValidationSchema = Yup.object().shape({
  firstName: Yup.string().label('First Name').required(),
  lastName: Yup.string().label('Last Name').required(),
  phone: Yup.string().label('Job Title'),
  agencyDefinition: Yup.string().label('Agency').required(),
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
  console.log('🚀 ~ user:', user)

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
        showHeaderButton={false}
        closeModal={closeModal}
      />
      <Formik
        validationSchema={editAccountValidationSchema}
        initialValues={{
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          agencyDefinition: user.agencyDefinition || '',
          emailAddress: user.emailAddress || '',
          role: user.role || '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const {
            firstName,
            lastName,
            phone,
            agencyDefinition,
            emailAddress,
            role,
          } = values

          const selectedAgency = dropdownValues.find(
            agencyOption => agencyOption.definition === agencyDefinition
          )

          const editedUserResponse = await api
            .patch(`user/${user.azureUid}/edit`, {
              firstName,
              lastName,
              phone,
              agencyId: selectedAgency?.id,
            })
            .catch(error => {
              console.log(
                '🚀 ~ file: EditAccountInfoModalContent.tsx:311 ~ error code',
                error.code
              )
              const errorMessage = generateErrorMessage(
                error.code || 'Error during request to edit user (ln 81)'
              )

              setSubmissionMessage({
                success: false,
                message: errorMessage,
              })

              setSubmitting(false)
            })

          if (editedUserResponse?.status === 200) {
            await dispatch(
              editProfile({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                agency_id: selectedAgency?.id,
                agency_definition: selectedAgency?.definition,
                role,
                updated_at: new Date().toISOString(),
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
            <VStack space={5} p={5}>
              <FormInputComponent
                touched={touched}
                errors={errors}
                placeholder='Enter Email Address'
                isDisabled={true}
                value={values.emailAddress}
                label='Email'
                camelName='emailAddress'
                onChangeText={() => null}
              />
              <FormInputComponent
                touched={touched}
                errors={errors}
                placeholder='Enter First Name'
                value={values.firstName}
                label='First Name'
                camelName='firstName'
                onChangeText={handleChange('firstName')}
                onBlur={() => setFieldTouched('firstName')}
                isDisabled={isSubmitting}
              />
              <FormInputComponent
                touched={touched}
                errors={errors}
                placeholder='Enter Last Name'
                value={values.lastName}
                label='Last Name'
                camelName='lastName'
                onChangeText={handleChange('lastName')}
                onBlur={() => setFieldTouched('lastName')}
                isDisabled={isSubmitting}
              />
              <FormInputComponent
                touched={touched}
                errors={errors}
                placeholder='###-###-#### (Optional)'
                value={values.phone}
                label='Phone Number'
                camelName='phone'
                onChangeText={handleChange('phone')}
                onBlur={() => setFieldTouched('phone')}
                isDisabled={isSubmitting}
              />

              <CustomSelect
                errors={errors}
                touched={touched}
                label='Funding Agency'
                // selectedValue={dropdownValues.find(
                //   agencyOption => agencyOption.id === values.agencyId
                // )}
                selectedValue={values.agencyDefinition}
                placeholder='Funding Agency'
                onValueChange={handleChange('agencyDefinition')}
                camelName='agencyDefinition'
                setFieldTouched={() => setFieldTouched('agencyDefinition')}
                selectOptions={dropdownValues}
                dataType='fundingAgency'
                disabled={isSubmitting}
              />
              <CustomSelect
                errors={errors}
                touched={touched}
                label='Role'
                selectedValue={values.role}
                placeholder='Select a Role'
                onValueChange={handleChange('role')}
                camelName='role'
                setFieldTouched={() => setFieldTouched('role')}
                selectOptions={[
                  { label: 'Lead', value: 'lead' },
                  { label: 'Non-Lead', value: 'non-lead' },
                ]}
                disabled={isSubmitting}
              />

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
