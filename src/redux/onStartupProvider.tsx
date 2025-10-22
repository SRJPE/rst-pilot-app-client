import { Ionicons } from '@expo/vector-icons'
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'
import { AlertDialog, Button, Center, HStack, Icon, Text } from 'native-base'
import React, { useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { refreshUserToken } from '../utils/authUtils'
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

  let unsubscribe: NetInfoSubscription

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async connectionState => {
      const { isConnected, isInternetReachable, userCredentialsStore } = props
      if (
        isConnected != connectionState.isConnected ||
        isInternetReachable != connectionState.isInternetReachable
      ) {
        dispatch(connectionChanged(connectionState as any))
      }

      const userOnStart = userCredentialsStore.azureUid
      if (userOnStart) {
        try {
          const tokenRefreshResponse = await refreshUserToken(dispatch)

          if (
            tokenRefreshResponse &&
            [
              'No refresh token found',
              'Tokens could not be refreshed',
            ].includes(tokenRefreshResponse) &&
            isConnected &&
            isInternetReachable
          ) {
            dispatch(setForcedLogoutModalOpen(true))
            return
          }

          if (tokenRefreshResponse === 'Tokens refreshed') {
            return
          }
        } catch (error) {
          console.error('Error refreshing token:', error)
        }
      }
    })

    return () => {
      if (unsubscribe) {
        unsubscribe()
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
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps, {})(OnStartupProvider)
