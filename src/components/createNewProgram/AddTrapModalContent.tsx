import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Input,
  Pressable,
  Text,
  VStack,
} from 'native-base'

import CustomModalHeader from '../Shared/CustomModalHeader'

const AddTrapModalContent = ({ closeModal }: { closeModal: any }) => {
  const initialState = {
    trapName: '',
    trapLatitude: '',
    trapLongitude: '',
    coneSize: '',
    USGSStationNumber: '',
    releaseSiteName: '',
    releaseSiteLatitude: '',
    releaseSiteLongitude: '',
  }
  return (
    <>
      <CustomModalHeader
        headerText={'Add Traps'}
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
              Add Trap
            </Text>
          </Button>
        }
      />
      <Divider my='1%' thickness='3' />
      <VStack mx='5%' my='2%' space={6}>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Trap Name
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Trap Name'
            // keyboardType='numeric'
            // onChange={debouncedOnChange}
            // onBlur={props.onBlur}
            value={initialState.trapName}
          />
        </FormControl>
        <HStack space={10} alignItems='center'>
          <FormControl w='40%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Trap Latitude
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Trap Latitude'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.trapLatitude}
            />
          </FormControl>
          <FormControl w='40%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Trap Longitude
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Trap Longitude'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.trapLongitude}
            />
          </FormControl>
          <Pressable onPress={closeModal} alignSelf='flex-end'>
            <Icon
              as={MaterialIcons}
              name={'add-location-alt'}
              size='16'
              color='primary'
            />
          </Pressable>
        </HStack>
        <HStack space={10}>
          <FormControl w='40%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Cone Size
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Cone Size'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.coneSize}
            />
          </FormControl>
          <FormControl w='40%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                USGS station number
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='USGS station number'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.USGSStationNumber}
            />
          </FormControl>
        </HStack>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Release Site Name
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Release Site Name'
            // keyboardType='numeric'
            // onChange={debouncedOnChange}
            // onBlur={props.onBlur}
            value={initialState.releaseSiteName}
          />
        </FormControl>
        <HStack space={10} alignItems='center'>
          <FormControl w='40%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Release Site Latitude
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Release Site Latitude'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.releaseSiteLatitude}
            />
          </FormControl>
          <FormControl w='40%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Release Site Longitude
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Release Site Longitude'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.releaseSiteLongitude}
            />
          </FormControl>
          <Pressable onPress={closeModal} alignSelf='flex-end'>
            <Icon
              as={MaterialIcons}
              name={'add-location-alt'}
              size='16'
              color='primary'
            />
          </Pressable>
        </HStack>
      </VStack>
    </>
  )
}

export default AddTrapModalContent
