import React, { useState, useEffect, useRef } from 'react'
import { AppDispatch, RootState } from './store'
import { connect, useDispatch } from 'react-redux'
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
        // const { tokenIssuedAt, tokenExpiresAt } = props.userCredentialsStore

        const tokenExpiresAt = await SecureStore.getItemAsync(
          'userAccessTokenExpiresAt'
        )

        const tokenIsExpired = moment().isAfter(tokenExpiresAt)
        console.log(
          '🚀 ~ file: onStartupProvider.tsx:52 ~ ; ~ tokenIsExpired:',
          tokenIsExpired
        )

        if (tokenIsExpired) {
          //refreshAsync to exchave for new token
          const existingRefreshToken =
            (await SecureStore.getItemAsync('userRefreshToken')) || undefined

          const tokenEndpoint =
            'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_signin'

          // const discovery = useAutoDiscovery(
          //   'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/B2C_1_signin/v2.0/'
          // )

          const refreshResponse = await refreshAsync(
            {
              clientId: REACT_APP_CLIENT_ID,
              refreshToken: existingRefreshToken,
            },
            { tokenEndpoint }
          )

          if (refreshResponse.accessToken) {
            const { accessToken, refreshToken, idToken, issuedAt, expiresIn } =
              refreshResponse

            //if refreshResponse.accessToken clear out previous userAccessToken, userAccessTokenExpiresAt, userRefreshToken, userIdToken from SecureStroage and replace with new values
            await SecureStore.setItemAsync('userAccessToken', accessToken)

            await SecureStore.setItemAsync(
              'userRefreshToken',
              refreshToken as string
            )
            await SecureStore.setItemAsync('userIdToken', idToken as string)

            await SecureStore.setItemAsync(
              'userAccessTokenExpiresAt',
              moment((expiresIn as number) * 1000 + issuedAt * 1000).format()
            )
            console.log(
              'refresh successfu, new token ExpiresAt: ',
              moment((expiresIn as number) * 1000 + issuedAt * 1000).format()
            )
            dispatch(getTrapVisitDropdownValues())
          } else {
            //force logout if new token cannot be retrieved
            setForcedLogoutModalOpen(true)
            return
          }
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

  const [forcedLogoutModalOpen, setForcedLogoutModalOpen] = useState(false)

  const onClose = () => {
    dispatch(clearUserCredentials())
    setForcedLogoutModalOpen(false)
  }

  const cancelRef = useRef(null)

  console.log('forcedLogoutModalOpen', forcedLogoutModalOpen)
  return (
    <>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={forcedLogoutModalOpen}
          onClose={onClose}
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
                <Button width={100} bg='primary' onPress={onClose}>
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
