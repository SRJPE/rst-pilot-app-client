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
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import AddNewUserModalContent from '../../components/profile/AddNewUserModalContent'
import EditAccountInfoModalContent from '../../components/profile/EditAccountInfoModalContent'
import CustomModal from '../../components/Shared/CustomModal'
import { clearUserCredentials } from '../../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState, persistor } from '../../redux/store'
import { MonitoringProgram } from '../../utils/interfaces'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { resetTrapVisitFormPostBundler } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { resetVisitSetupDefaultSlice } from '../../redux/reducers/visitSetupDefaults'
import { resetNavigationSlice } from '../../redux/reducers/formSlices/navigationSlice'
import { resetTabsSlice } from '../../redux/reducers/formSlices/tabSlice'
import { resetVisitSetupSlice } from '../../redux/reducers/formSlices/visitSetupSlice'

import {
  // @ts-ignore
  EXPO_PUBLIC_CLIENT_ID,
} from '@env'
import MonitoringProgramInfoModalContent from '../../components/profile/MonitoringProgramModalContent'
import ConfirmationModalContent from '@/src/components/Shared/ConfirmationModalContent'
import { resetTrapOperationsSlice } from '@/src/redux/reducers/formSlices/trapOperationsSlice'
import { resetTrapPostProcessingSlice } from '@/src/redux/reducers/formSlices/trapPostProcessingSlice'
import { resetFishProcessingSlice } from '@/src/redux/reducers/formSlices/fishProcessingSlice'
import { resetFishInputSlice } from '@/src/redux/reducers/formSlices/fishInputSlice'
import { resetMarksOrTagsSlice } from '@/src/redux/reducers/formSlices/addMarksOrTagsSlice'
import { resetGeneticSamplesSlice } from '@/src/redux/reducers/formSlices/addGeneticSamplesSlice'
import { resetBatchCountSlice } from '@/src/redux/reducers/formSlices/batchCountSlice'
import { getPersonnelDefaults } from '@/src/redux/reducers/personnelSlice'

const Profile = ({
  userCredentialsStore,
  connectivityStore,
  navigation,
  personnelStore,
  crewMembersStore,
  dropdownValues,
}: {
  userCredentialsStore: any
  connectivityStore: any
  navigation: any
  personnelStore: any
  crewMembersStore: any
  dropdownValues: any
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

  const [userPrograms, setUserPrograms] = useState<any>([])

  const redirectUri = 'com.onmicrosoft.rstb2c.rsttabletapp://oauth/redirect'
  const clientId = EXPO_PUBLIC_CLIENT_ID

  const passwordResetDiscovery = useAutoDiscovery(
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/B2C_1_password_reset/v2.0/'
  )
  const userIsLead = userCredentialsStore.role === 'lead'

  useEffect(() => {
    if (userCredentialsStore.userPrograms) {
      setUserPrograms(userCredentialsStore.userPrograms)
      if (selectedMonitoringProgramInfo) {
        const updatedProgram = userCredentialsStore.userPrograms.find(
          (program: any) => program.id === selectedMonitoringProgramInfo.id
        )
        setSelectedMonitoringProgramInfo(updatedProgram)
      }
    }
  }, [userCredentialsStore.userPrograms])

  useEffect(() => {
    if (
      personnelStore.personnelOptions.length === 0 &&
      connectivityStore.isConnected &&
      connectivityStore.isInternetReachable
    ) {
      dispatch(getPersonnelDefaults())
    }
  }, [
    personnelStore.personnelOptions.length,
    connectivityStore.isConnected,
    connectivityStore.isInternetReachable,
  ])

  const deviceIsConnected =
    connectivityStore.isConnected && connectivityStore.isInternetReachable
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
      <ScrollView>
        <Box overflow='hidden'>
          <HStack justifyContent='flex-end' margin={5}>
            <Button onPress={() => navigation.navigate('Home')}>
              <Icon
                as={Ionicons}
                name={'home'}
                size={'xl'}
                opacity={0.75}
                color={'primary'}
                mr='1'
              />
            </Button>
          </HStack>
          <VStack alignItems='center' marginBottom='8'>
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
                    onPress={() => {
                      if (deviceIsConnected) {
                        navigation?.navigate('Monitoring Program')
                      } else {
                        showSlideAlert(
                          dispatch,
                          'Please connect to the internet to create a new program',
                          'error',
                          3000
                        )
                      }
                    }}
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
      </ScrollView>
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
          height='100%'
        >
          <MonitoringProgramInfoModalContent
            closeModal={() => setMonitoringProgramInfoModalOpen(false)}
            monitoringProgramInfo={selectedMonitoringProgramInfo}
            personnelStore={personnelStore}
            crewMembersStore={crewMembersStore}
            dropdownValues={dropdownValues}
            userCredentialsStore={userCredentialsStore}
          />
        </CustomModal>
      )}
      {/* Logout Modal */}
      <CustomModal
        isOpen={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
        height={175}
        width={500}
        size='md'
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          borderRadius: 5,
        }}
      >
        <ConfirmationModalContent
          modalHeader=' Are you sure you want to log out?'
          modalText='When logged out you will not have access to saved content when offline.'
          handlePressCancel={() => setLogoutModalOpen(false)}
          handlePressConfirm={() => {
            // clear cache on sign out to ensure no data from previous user is cached
            persistor.purge()
            dispatch(resetTrapVisitFormPostBundler())
            dispatch(resetVisitSetupDefaultSlice())
            dispatch(resetNavigationSlice())
            dispatch(resetVisitSetupSlice())
            dispatch(resetTabsSlice())
            dispatch(resetGeneticSamplesSlice())
            dispatch(resetMarksOrTagsSlice())
            dispatch(resetFishInputSlice())
            dispatch(resetBatchCountSlice())
            dispatch(resetFishProcessingSlice())
            dispatch(resetTrapPostProcessingSlice())
            dispatch(resetTrapOperationsSlice())

            setLogoutModalOpen(false)
            dispatch(clearUserCredentials())
            // reset navigation
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }}
        />
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
  console.log('state.personnel', state.personnel)
  return {
    userCredentialsStore: state.userCredentials,
    connectivityStore: state.connectivity,
    crewMembersStore: state.crewMembers.crewMembersStore,
    personnelStore: state.personnel,
    dropdownValues: state.dropdowns.values,
  }
}

export default connect(mapStateToProps)(Profile)
