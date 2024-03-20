import React, { useEffect } from 'react'
import { AppDispatch, RootState } from './store'
import { connect, useDispatch } from 'react-redux'
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'
import { getTrapVisitDropdownValues } from './reducers/dropdownsSlice'
import { getVisitSetupDefaults } from './reducers/visitSetupDefaults'
import { connectionChanged } from './reducers/connectivitySlice'

type Props = {
  children: React.ReactNode
  isConnected: boolean
  isInternetReachable: boolean
}

const OnStartupProvider = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  let unsubscribe: NetInfoSubscription

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
    dispatch(getVisitSetupDefaults(1))
    unsubscribe = NetInfo.addEventListener(connectionState => {
      if (
        props.isConnected != connectionState.isConnected ||
        props.isInternetReachable != connectionState.isInternetReachable
      ) {
        dispatch(connectionChanged(connectionState as any))
      }
    })
  }, [props.isConnected])

  useEffect(() => () => unsubscribe(), [])

  return <>{props.children}</>
}

const mapStateToProps = (state: RootState) => {
  return {
    isConnected: state.connectivity.isConnected,
  }
}

export default connect(mapStateToProps, {})(OnStartupProvider)
