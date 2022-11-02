import React, { useEffect } from 'react'
import { AppDispatch } from './store'
import { useDispatch } from 'react-redux'
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'
import { getTrapVisitDropdownValues } from './reducers/dropdownsSlice'
import { getVisitSetupDefaults } from './reducers/visitSetupDefaults'
import { connectionChanged } from './reducers/connectivitySlice'

type Props = {
  children: React.ReactNode
}

const OnStartupProvider = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  let unsubscribe: NetInfoSubscription

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
    dispatch(getVisitSetupDefaults(1))
    unsubscribe = NetInfo.addEventListener((connectionState) => {
      dispatch(connectionChanged(connectionState))
    })
  }, [])

  useEffect(() => () => unsubscribe(), [])

  return <>{props.children}</>
}

export default OnStartupProvider
