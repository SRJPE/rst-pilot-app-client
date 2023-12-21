import { Entypo } from '@expo/vector-icons'
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import { useState } from 'react'
import CustomModal from '../../components/Shared/CustomModal'
import EditAccountInfoModalContent from '../../components/profile/EditAccountInfoModalContent'
import MonitoringProgramInfoModalContent from '../../components/profile/MonitoringProgramModalContent'
import { AppDispatch } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { clearUserCredentials } from '../../redux/reducers/userCredentialsSlice'

const Profile = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false)
  const [editAccountInfoModalOpen, setEditAccountInfoModalOpen] =
    useState<boolean>(false as boolean)
  const [monitoringProgramInfoModalOpen, setMonitoringProgramInfoModalOpen] =
    useState<boolean>(false as boolean)
  return (
    <>
      <Box overflow='hidden'>
        <VStack alignItems='center' marginTop='16' marginBottom='8'>
          <Avatar
            source={{
              uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
            }}
            size={150}
            borderRadius={100}
            backgroundColor='hsl(0,0%,70%)'
            borderColor='secondary'
            borderWidth={3}
          />
          <Text fontSize={'3xl'}>John Doe</Text>
          <Text fontSize={'lg'} mb={5}>
            jdoe4422@flowwest.com
          </Text>
          <Button
            alignSelf='center'
            bg='transparent'
            borderWidth={1}
            borderColor='primary'
            onPress={() => setEditAccountInfoModalOpen(true)}
          >
            <Text fontWeight='bold' color='primary'>
              EDIT PROFILE
            </Text>
          </Button>
        </VStack>
        <VStack
          py='2%'
          px='4%'
          pt='4'
          overflow='hidden'
          height={'100%'}
          // bg='secondary'
          roundedBottom='xl'
        >
          <Pressable
            my='7'
            onPress={() => setMonitoringProgramInfoModalOpen(true)}
          >
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack>
                <Text fontSize='2xl' bold>
                  Monitoring Program
                </Text>
                <Text fontSize='xl'> {'<Monitoring Program Team Name>'}</Text>
              </VStack>
              <Icon
                as={Entypo}
                name='chevron-right'
                color='black'
                size={8}
                marginX={3}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable my='7'>
            <HStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='2xl' bold>
                View Permit
              </Text>
              <Icon
                as={Entypo}
                name='chevron-right'
                color='black'
                size={8}
                marginX={3}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          <Pressable my='7'>
            <HStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='2xl' bold>
                Change Password
              </Text>
              <Icon
                as={Entypo}
                name='chevron-right'
                color='black'
                size={8}
                marginX={3}
              />
            </HStack>
          </Pressable>
          <Divider bg='#414141' />

          <Pressable my='7' onPress={() => setLogoutModalOpen(true)}>
            <Text fontSize='2xl' fontWeight='bold' color='error'>
              Sign out
            </Text>
          </Pressable>
          {/* <Button
            mt='20'
            alignSelf='center'
            bg='primary'
            color='white'
            onPress={() => navigation.navigate('Create New Program')}
          >
            <Text fontSize='xl' fontWeight='bold' color='white'>
              CREATE NEW PROGRAM
            </Text>
          </Button> */}
        </VStack>
      </Box>
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={editAccountInfoModalOpen}
        closeModal={() => setEditAccountInfoModalOpen(false)}
      >
        <EditAccountInfoModalContent
          closeModal={() => setEditAccountInfoModalOpen(false)}
        />
      </CustomModal>
      <CustomModal
        isOpen={monitoringProgramInfoModalOpen}
        closeModal={() => setMonitoringProgramInfoModalOpen(false)}
        // height='1/1'
      >
        <MonitoringProgramInfoModalContent
          closeModal={() => setMonitoringProgramInfoModalOpen(false)}
        />
      </CustomModal>

      <CustomModal
        isOpen={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
        height='175'
        size='md'
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        <Box display='flex' height='175' paddingX={10} paddingY={5}>
          <Text textAlign='center' fontSize='lg' bold marginBottom={1}>
            Are you sure you want to log out?
          </Text>
          <Text textAlign='center' marginBottom={5}>
            When logged out you will not have access to saved content when
            offline.
          </Text>
          <HStack justifyContent='center'>
            <Button
              marginRight={2}
              borderWidth={1}
              flexGrow={1}
              backgroundColor='transparent'
              borderColor='error'
              color='error'
              onPress={() => setLogoutModalOpen(false)}
            >
              <Text color='error'>Cancel</Text>
            </Button>
            <Button
              background='primary'
              onPress={() => setLogoutModalOpen(false)}
              flexGrow={1}
              marginLeft={3}
            >
              Confirm
            </Button>
          </HStack>
        </Box>
      </CustomModal>
    </>
  )
}
export default Profile
