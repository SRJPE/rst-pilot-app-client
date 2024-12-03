import { Formik } from 'formik'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Input,
  Select,
  Radio,
  Text,
  VStack,
  Center,
  CheckIcon,
  WarningOutlineIcon,
} from 'native-base'
import { useDispatch, useSelector } from 'react-redux'
import {
  IndividualCrewMemberValuesI,
  IndividualCrewMemberState,
  saveIndividualCrewMember,
  updateIndividualCrewMember,
} from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { AppDispatch, RootState } from '../../redux/store'
import FormInputComponent from '../../components/Shared/FormInputComponent'

import CustomModalHeader from '../Shared/CustomModalHeader'
import { crewMembersSchema } from '../../utils/helpers/yupValidations'
import CustomSelect from '../Shared/CustomSelect'
import { useEffect, useState } from 'react'
import { set } from 'lodash'

const AddCrewMemberModalContent = ({
  closeModal,
  addTrapModalContent,
  personnelOptions,
}: {
  closeModal: () => void
  addTrapModalContent?: any
  personnelOptions: Array<IndividualCrewMemberValuesI & { id: number }>
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('')
  const [selectedPersonnel, setSelectedPersonnel] = useState({})
  const [modalDataTemp, setModalDataTemp] = useState({} as any)

  const handleAddCrewMemberSubmission = (
    values: IndividualCrewMemberValuesI
  ) => {
    console.log('🚀 ~ handleAddTrapSubmission ~ values:', values)
    if (values?.uid) {
      dispatch(updateIndividualCrewMember(values))
    } else {
      dispatch(saveIndividualCrewMember(values))
    }
  }

  useEffect(() => {
    setModalDataTemp(addTrapModalContent)
  }, [addTrapModalContent])

  return (
    <Formik
      validationSchema={crewMembersSchema}
      initialValues={IndividualCrewMemberState}
      onSubmit={(values, { resetForm }) => {
        handleAddCrewMemberSubmission(values)
        resetForm()
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        setValues,
        resetForm,
        touched,
        errors,
        values,
      }) => {
        useEffect(() => {
          setValues(modalDataTemp)
        }, [modalDataTemp])
        return (
          <>
            <CustomModalHeader
              headerText={'Add Crew Member'}
              showHeaderButton={true}
              closeModal={() => {
                resetForm()
                setSelectedPersonnelId('')
                closeModal()
              }}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  isDisabled={
                    Object.values(touched).length === 0 ||
                    (Object.values(touched).length > 0 &&
                      Object.values(errors).length > 0)
                  }
                  onPress={() => {
                    handleSubmit()
                    closeModal()
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Save
                  </Text>
                </Button>
              }
            />
            <VStack mx='5%' my='2%' space={4}>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Search for existing User
                  </Text>
                </FormControl.Label>
                {/* <Input //TODO: implement search
                  height='50px'
                  fontSize='16'
                  placeholder='Search for existing User'
                  value={''}
                /> */}
                {/* <CustomSelect
                  selectedValue={selectedPersonnel}
                  placeholder='Search for Existing User'
                  onValueChange={() => setSelectedPersonnel('willie')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={personnelList}
                /> */}

                <Select
                  height='50px'
                  fontSize='16'
                  minWidth='100'
                  accessibilityLabel='Select existing user'
                  placeholder='Select existing user'
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt='1'
                  selectedValue={selectedPersonnelId}
                  onValueChange={newValue => {
                    const newSelectedPersonnel = personnelOptions.find(
                      personnel => personnel.id.toString() === newValue
                    )

                    const selectedPersonnelAgency =
                      dropdownValues?.fundingAgency.find(
                        agency => agency.id === selectedPersonnel?.agencyId
                      )

                    const formattedPersonnelObj = {
                      firstName: newSelectedPersonnel?.firstName,
                      lastName: newSelectedPersonnel?.lastName,
                      phoneNumber: newSelectedPersonnel?.phone,
                      email: newSelectedPersonnel?.email,
                      isLead: newSelectedPersonnel?.role === 'lead',
                      agency: selectedPersonnelAgency?.definition || '',
                      orcidId: newSelectedPersonnel?.orcidId,
                      uid: newSelectedPersonnel?.uid,
                    }

                    setSelectedPersonnelId(newSelectedPersonnel.id.toString())
                    setSelectedPersonnel(newSelectedPersonnel)
                    setValues(formattedPersonnelObj)
                  }}
                >
                  {personnelOptions.map(personnel => {
                    return (
                      <Select.Item
                        key={personnel.id}
                        label={`${personnel.firstName} ${personnel.lastName}`}
                        value={`${personnel.id}`}
                      />
                    )
                  })}
                </Select>
              </FormControl>

              <Divider thickness='3' my='2%' />

              <HStack justifyContent='space-between'>
                <FormInputComponent
                  label={'First Name'}
                  touched={touched}
                  errors={errors}
                  value={values.firstName ? `${values.firstName}` : ''}
                  camelName={'firstName'}
                  width={'45%'}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                />
                <FormInputComponent
                  label={'Last Name'}
                  touched={touched}
                  errors={errors}
                  value={values.lastName ? `${values.lastName}` : ''}
                  camelName={'lastName'}
                  width={'45%'}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                />
              </HStack>

              <HStack justifyContent='space-between'>
                <FormInputComponent
                  label={'Phone Number'}
                  touched={touched}
                  errors={errors}
                  value={values.phoneNumber ? `${values.phoneNumber}` : ''}
                  camelName={'phoneNumber'}
                  // keyboardType={'phone'} //TODO add phone styling
                  width={'45%'}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                />
                <FormInputComponent
                  label={'Email'}
                  touched={touched}
                  errors={errors}
                  value={values.email ? `${values.email}` : ''}
                  camelName={'email'}
                  width={'45%'}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
              </HStack>

              <HStack justifyContent='space-between'>
                <FormControl w='45%'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Funding Agency
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values.agency as string}
                    placeholder='Funding Agency'
                    onValueChange={handleChange('agency')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues?.fundingAgency}
                  />
                </FormControl>
                <FormInputComponent
                  label={'Orcid ID (optional)'}
                  touched={touched}
                  errors={errors}
                  value={values.orcidId ? `${values.orcidId}` : ''}
                  camelName={'orcidId'}
                  width={'45%'}
                  onChangeText={handleChange('orcidId')}
                  onBlur={handleBlur('orcidId')}
                />
              </HStack>

              <FormControl w='30%'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Is Lead
                  </Text>
                </FormControl.Label>
                <Radio.Group
                  name='isLead'
                  accessibilityLabel='is lead'
                  value={`${values.isLead}`}
                  onChange={(value: any) => {
                    setFieldTouched('isLead', true)
                    if (value === 'true') {
                      setFieldValue('isLead', true)
                    } else {
                      setFieldValue('isLead', false)
                    }
                  }}
                >
                  <Radio
                    colorScheme='primary'
                    value='false'
                    my={1}
                    _icon={{ color: 'primary' }}
                  >
                    No
                  </Radio>
                  <Radio
                    colorScheme='primary'
                    value='true'
                    my={1}
                    _icon={{ color: 'primary' }}
                  >
                    Yes
                  </Radio>
                </Radio.Group>
              </FormControl>
            </VStack>
          </>
        )
      }}
    </Formik>
  )
}

export default AddCrewMemberModalContent
