import {
  Button,
  Divider,
  FormControl,
  HStack,
  Input,
  Radio,
  Text,
  VStack,
} from 'native-base'
import { useState } from 'react'

import CustomModalHeader from '../Shared/CustomModalHeader'

const AddCrewMemberModalContent = ({ closeModal }: { closeModal: any }) => {
  const [isLeadRadioValue, setIsLeadRadioValue] = useState(false)
  const initialState = {
    search: '',
    firstName: '',
    lastName: '',
    email: '',
    agency: '',
    orchidID: '',
    isLead: '',
  }

  return (
    <>
      <CustomModalHeader
        headerText={'Add Crew Member'}
        showHeaderButton={true}
        closeModal={closeModal}
        headerButton={
          <Button
            bg='primary'
            mx='2'
            px='10'
            shadow='3'
            // isDisabled={}
            onPress={() => {
              // handleSubmit()
              closeModal()
            }}
          >
            <Text fontSize='xl' color='white'>
              Save
            </Text>
          </Button>
        }
      />
      <Divider my='1%' thickness='3' />
      <VStack mx='5%' my='2%' space={4}>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Search for existing User
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Search for existing User'
            // keyboardType='numeric'
            // onChange={debouncedOnChange}
            // onBlur={props.onBlur}
            value={initialState.search}
          />
        </FormControl>
        <Divider thickness='3' my='2%' />
        <HStack space={10} justifyContent='space-between'>
          <FormControl w='45%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                First Name
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='First Name'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.firstName}
            />
          </FormControl>
          <FormControl w='45%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Last Name
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Last Name'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.lastName}
            />
          </FormControl>
        </HStack>
        {/* <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              First Name
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='First Name'
            // keyboardType='numeric'
            // onChange={debouncedOnChange}
            // onBlur={props.onBlur}
            value={initialState.firstName}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Last Name
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Last Name'
            // keyboardType='numeric'
            // onChange={debouncedOnChange}
            // onBlur={props.onBlur}
            value={initialState.lastName}
          />
        </FormControl> */}

        <HStack space={10} justifyContent='space-between'>
          <FormControl w='45%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Email
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Email'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.email}
            />
          </FormControl>
          <FormControl w='45%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Agency
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Agency'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.agency}
            />
          </FormControl>
        </HStack>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Orchid ID (optional)
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Orchid ID '
            // keyboardType='numeric'
            // onChange={debouncedOnChange}
            // onBlur={props.onBlur}
            value={initialState.orchidID}
          />
        </FormControl>
        <FormControl w='30%'>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Is Lead
            </Text>
          </FormControl.Label>
          <Radio.Group
            name='coneSetting'
            accessibilityLabel='cone setting'
            value={`${isLeadRadioValue}`}
            onChange={(value: any) => {
              if (value === 'true') {
                setIsLeadRadioValue(true)
              } else {
                setIsLeadRadioValue(false)
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
}

export default AddCrewMemberModalContent
