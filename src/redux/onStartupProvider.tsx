import { Ionicons } from '@expo/vector-icons'
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'
import { AlertDialog, Button, Center, HStack, Icon, Text } from 'native-base'
import React, { useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { connectionChanged } from './reducers/connectivitySlice'
import { setForcedLogoutModalOpen } from './reducers/userAuthSlice'
import { clearUserCredentials } from './reducers/userCredentialsSlice'
import { AppDispatch, RootState } from './store'

type Props = {
  children: React.ReactNode
  isConnected: boolean
  isInternetReachable?: boolean
  userCredentialsStore: any
}

const OnStartupProvider = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const { forcedLogoutModalOpen } = useSelector(
    (state: RootState) => state.userAuth
  )

  let unsubscribe: NetInfoSubscription | null = null

  useEffect(() => {
    unsubscribe = NetInfo.addEventListener(async connectionState => {
      const { isConnected, isInternetReachable } = props
      if (
        isConnected != connectionState.isConnected ||
        isInternetReachable != connectionState.isInternetReachable
      ) {
        // connectionChanged itself fans out real API calls (e.g.
        // fetchPreviousTrapAndCatch/fetchExistingMarks) whenever a user is
        // logged in, which already go through axiosConfig.ts's interceptor -
        // that lazily and safely refreshes the token on demand (via the
        // shared lock in authUtils.refreshUserToken) without this listener
        // needing its own separate, racing proactive refresh call.
        dispatch(connectionChanged(connectionState as any))
      }
    })

    return () => {
      try {
        if (unsubscribe) {
          unsubscribe()
        }
      } catch (err) {
        console.error('Error unsubscribing NetInfo listener:', err)
      }
    }
  }, [props.isConnected, props.isInternetReachable, dispatch])

  const cancelRef = useRef(null)

  const forceLogoutModelOnClose = () => {
    dispatch(clearUserCredentials())
    dispatch(setForcedLogoutModalOpen(false))
  }
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
                    OK
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
    isInternetReachable: state.connectivity.isInternetReachable,
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps, {})(OnStartupProvider)
