import { useEffect } from 'react'
import { VStack } from 'native-base'
import FormStackNavigation from '../FormStackNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { getTrapVisitDropdownValues } from '../../redux/reducers/dropdownsSlice'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>()
  const userCredentialsStore = useSelector(
    (state: RootState) => state.userCredentials
  )
  const connectivityState = useSelector((state: any) => state.connectivity)
  const dropdownStatus = useSelector((state: RootState) => state.dropdowns.status)

  useEffect(() => {
    if (
      userCredentialsStore?.id &&
      connectivityState.isConnected &&
      connectivityState.isInternetReachable &&
      dropdownStatus !== 'fulfilled'
    ) {
      dispatch(getTrapVisitDropdownValues(userCredentialsStore.id))
    }
  }, [userCredentialsStore?.id, connectivityState.isConnected, connectivityState.isInternetReachable])

  return (
    <VStack h='full' justifyContent='space-between'>
      <FormStackNavigation />
    </VStack>
  )
}
