import { Entypo } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
  AuthSessionResult,
  exchangeCodeAsync,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import AddNewUserModalContent from '../../components/profile/AddNewUserModalContent'
import EditAccountInfoModalContent from '../../components/profile/EditAccountInfoModalContent'
import CustomModal from '../../components/Shared/CustomModal'
import { clearUserCredentials } from '../../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { MonitoringProgram } from '../../utils/interfaces'

import {
  // @ts-ignore
  EXPO_PUBLIC_CLIENT_ID,
} from '@env'
import MonitoringProgramInfoModalContent from '../../components/profile/MonitoringProgramModalContent'

const Profile = ({
  userCredentialsStore,
  navigation,
}: {
  userCredentialsStore: any
  navigation: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false)
  const [selectedMonitoringProgramInfo, setSelectedMonitoringProgramInfo] =
    useState<MonitoringProgram | null>(null)
  const [editAccountInfoModalOpen, setEditAccountInfoModalOpen] =
    useState<boolean>(false)
  const [monitoringProgramInfoModalOpen, setMonitoringProgramInfoModalOpen] =
    useState<boolean>(false)
  const [addNewUserModalOpen, setAddNewUserModalOpen] = useState<boolean>(false)

  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'
  const clientId = EXPO_PUBLIC_CLIENT_ID

  const passwordResetDiscovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/B2C_1_password_reset/v2.0/'
  )
  const userIsLead = userCredentialsStore.role === 'lead'

  const userPrograms = userCredentialsStore?.userPrograms || []
  //////////////////////////////////////////////

  const [pwResetRequest, pwResetResponse, pwResetPromptAsync] = useAuthRequest(
    {
      clientId,
      scopes: [
        'openid',
        'profile',
        'email',
        'offline_access',
        'https://rsttabletapp.onmicrosoft.com/jpe-server-api/api.read',
        'https://rsttabletapp.onmicrosoft.com/jpe-server-api/api.write',
      ],
      redirectUri,
    },
    passwordResetDiscovery
  )

  //////////////////////////////////////////////
  //Web Browser Change Password
  const handleChangePasswordButtonAsync = async () => {
    pwResetPromptAsync().then((codeResponse: AuthSessionResult) => {
      if (
        pwResetRequest &&
        codeResponse?.type === 'success' &&
        passwordResetDiscovery
      ) {
        exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: pwResetRequest.codeVerifier
              ? { code_verifier: pwResetRequest.codeVerifier }
              : undefined,
            redirectUri,
          },
          passwordResetDiscovery
        )
        //note: leaving this here for the team to decide if new tokens are needed on a password change from the profile screen

        // .then(async res => {
        //   const { accessToken, refreshToken, idToken } = res
        //   const userRes = await api.get('user/current', {
        //     headers: { idToken: idToken as string },
        //   })

        //   await SecureStore.setItemAsync('userAccessToken', accessToken)
        //   await SecureStore.setItemAsync(
        //     'userRefreshToken',
        //     refreshToken as string
        //   )
        //   await SecureStore.setItemAsync('userIdToken', idToken as string)

        //   dispatch(
        //     saveUserCredentials({
        //       ...userCredentialsStore,
        //       ...userRes.data,
        //     })
        //   )
        // })
      }
    })
  }

  return (
    <>
      <Box overflow='hidden'>
        <VStack alignItems='center' marginTop='16' marginBottom='8'>
          <Text fontSize={'3xl'}>{userCredentialsStore.displayName}</Text>
          <Text fontSize={'lg'}>{userCredentialsStore.emailAddress}</Text>
          <Text fontSize={'xl'} mb={5}>
            {userCredentialsStore.role === 'lead' ? 'Lead' : 'Non-Lead'}
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
          roundedBottom='xl'
        >
          <HStack justifyContent='space-between' alignItems='center'>
            <VStack py='7'>
              <HStack
                justifyContent='space-between'
                alignItems='center'
                width='100%'
              >
                <Text fontSize='2xl' bold mb={5}>
                  {userPrograms.length === 1
                    ? 'Monitoring Program'
                    : 'Monitoring Programs'}
                </Text>
                <Button
                  mb={15}
                  alignSelf='center'
                  bg='transparent'
                  onPress={() => navigation.navigate('Monitoring Program')}
                >
                  <HStack alignItems='center'>
                    <Icon
                      as={Ionicons}
                      name={'add'}
                      size={'lg'}
                      opacity={0.75}
                      color={'primary'}
                      mr='1'
                    />
                    <Text fontSize='lg' fontWeight='bold' color='primary'>
                      Create New Program
                    </Text>
                  </HStack>
                </Button>
              </HStack>
              <HStack
                // space={5}
                style={{ columnGap: 10 }}
                flexWrap={'wrap'}
              >
                {userPrograms.length === 0 ? (
                  <Text fontSize='xl'>No Monitoring Programs Available</Text>
                ) : (
                  userPrograms.map((program: any) => (
                    <Button
                      key={program.id}
                      borderWidth={1}
                      borderColor='dark.500'
                      mb={5}
                      onPress={() => {
                        setSelectedMonitoringProgramInfo(program)
                        setMonitoringProgramInfoModalOpen(true)
                      }}
                    >
                      <Text fontSize='lg'>{program.programName}</Text>
                    </Button>
                  ))
                )}
              </HStack>
            </VStack>
          </HStack>
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
          <Pressable
            my='7'
            onPress={async () => await handleChangePasswordButtonAsync()}
          >
            <HStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='2xl' bold>
                Change Password
              </Text>
            </HStack>
          </Pressable>
          <Divider bg='#414141' />
          {userIsLead && (
            <>
              <Pressable
                my='7'
                onPress={async () => {
                  setAddNewUserModalOpen(true)
                }}
              >
                <HStack justifyContent='space-between' alignItems='center'>
                  <Text fontSize='2xl' bold>
                    Create New User
                  </Text>
                </HStack>
              </Pressable>
              <Divider bg='#414141' />
            </>
          )}

          <Pressable
            my='7'
            onPress={() => {
              ///////
              setLogoutModalOpen(true)
            }}
          >
            <Text fontSize='2xl' fontWeight='bold' color='#FF0000'>
              Sign out
            </Text>
          </Pressable>
        </VStack>
      </Box>
      {/* --------- Modals --------- */}

      {/* Edit Account Info Modal */}
      {editAccountInfoModalOpen && (
        <CustomModal
          isOpen={editAccountInfoModalOpen}
          closeModal={() => setEditAccountInfoModalOpen(false)}
        >
          <EditAccountInfoModalContent
            closeModal={() => setEditAccountInfoModalOpen(false)}
            user={userCredentialsStore}
          />
        </CustomModal>
      )}
      {monitoringProgramInfoModalOpen && (
        <CustomModal
          isOpen={monitoringProgramInfoModalOpen}
          closeModal={() => setMonitoringProgramInfoModalOpen(false)}
          height='full'
        >
          <MonitoringProgramInfoModalContent
            closeModal={() => setMonitoringProgramInfoModalOpen(false)}
            monitoringProgramInfo={selectedMonitoringProgramInfo}
          />
        </CustomModal>
      )}
      {/* Logout Modal */}
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
              onPress={() => {
                setLogoutModalOpen(false)
                dispatch(clearUserCredentials())
              }}
              flexGrow={1}
              marginLeft={3}
            >
              Confirm
            </Button>
          </HStack>
        </Box>
      </CustomModal>

      {/* Add New User Modal */}
      {userIsLead && addNewUserModalOpen && (
        <CustomModal
          isOpen={addNewUserModalOpen}
          closeModal={() => setAddNewUserModalOpen(false)}
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <Box display='flex' paddingX={10} paddingY={5}>
            <AddNewUserModalContent
              closeModal={() => setAddNewUserModalOpen(false)}
            />
          </Box>
        </CustomModal>
      )}
    </>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(Profile)
