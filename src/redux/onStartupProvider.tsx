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

      const userOnStart = props.userCredentialsStore.azureUid

      if (userOnStart) {
        const tokenRefreshed = await refreshUserToken(dispatch)

        if (tokenRefreshed === 'No refresh token found') {
          dispatch(setForcedLogoutModalOpen(true))
          return
        } else if (tokenRefreshed === 'Tokens refreshed') {
          console.log(
            '🚀 ~ file: onStartupProvider.tsx:47 ~ Tokens refreshed on application launch'
          )
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
