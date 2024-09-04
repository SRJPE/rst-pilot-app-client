import React, { useState, useEffect, useRef } from 'react'
import { AppDispatch, RootState } from './store'
import { connect, useDispatch, useSelector } from 'react-redux'
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'
import { getTrapVisitDropdownValues } from './reducers/dropdownsSlice'
import { getVisitSetupDefaults } from './reducers/visitSetupDefaults'
import { connectionChanged } from './reducers/connectivitySlice'
import moment from 'moment'
import { clear } from 'console'
import { clearUserCredentials } from './reducers/userCredentialsSlice'
import { AlertDialog, Button, Center } from 'native-base'
import { Text, Icon, HStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { refreshAsync, useAutoDiscovery } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { setForcedLogoutModalOpen } from './reducers/userAuthSlice'
import { refreshUserToken } from '../utils/authUtils'
import {
  // @ts-ignore
  REACT_APP_CLIENT_ID,
} from '@env'

type Props = {
  children: React.ReactNode
  isConnected: boolean
  isInternetReachable: boolean
  userCredentialsStore: any
}

const OnStartupProvider = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const { forcedLogoutModalOpen } = useSelector(
    (state: RootState) => state.userAuth
  )

  let unsubscribe: NetInfoSubscription

  useEffect(() => {
    ;(async () => {
      unsubscribe = NetInfo.addEventListener(connectionState => {
        if (
          props.isConnected != connectionState.isConnected ||
          props.isInternetReachable != connectionState.isInternetReachable
        ) {
          dispatch(connectionChanged(connectionState as any))
        }
      })

      console.log('user on start', props.userCredentialsStore)
      const userOnStart = props.userCredentialsStore.azureUid

      if (userOnStart) {
        const tokenRefreshed = await refreshUserToken(dispatch)

        if (tokenRefreshed === 'No refresh token found') {
          dispatch(setForcedLogoutModalOpen(true))
          return
        }
      }
    })()
  }, [props.isConnected])

  useEffect(
    () => () => {
      if (unsubscribe) {
        unsubscribe()
      }
    },
    []
  )

  const cancelRef = useRef(null)

  const forceLogoutModelOnClose = () => {
    dispatch(clearUserCredentials())
    dispatch(setForcedLogoutModalOpen(false))
  }
  console.log('forcedLogoutModalOpen', forcedLogoutModalOpen)
  return (
    <>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={forcedLogoutModalOpen}
          onClose={forceLogoutModelOnClose}
        >
          <AlertDialog.Content>
            <AlertDialog.Header>
              <HStack alignItems='center'>
                <Icon as={Ionicons} name={'alert'} color='grey' />
                <Text>Session Expired</Text>
              </HStack>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text mb={3}>Your session has expired. </Text>
              <Text>You will be redirected to the login page.</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  width={100}
                  bg='primary'
                  onPress={forceLogoutModelOnClose}
                >
                  <Text color='white' fontWeight={500}>
                    Ok
                  </Text>
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
      {props.children}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    isConnected: state.connectivity.isConnected,
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps, {})(OnStartupProvider)
