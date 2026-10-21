import { useEffect } from 'react'
import { VStack } from 'native-base'
import FormStackNavigation from '../FormStackNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { getTrapVisitDropdownValues } from '../../redux/reducers/dropdownsSlice'
import { getVisitSetupDefaults } from '../../redux/reducers/visitSetupDefaults'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>()
  const userCredentialsStore = useSelector(
    (state: RootState) => state.userCredentials
  )
  const connectivityState = useSelector((state: any) => state.connectivity)
  const dropdownStatus = useSelector(
    (state: RootState) => state.dropdowns.status
  )

  useEffect(() => {
    if (
      userCredentialsStore?.id &&
      connectivityState.isConnected &&
      connectivityState.isInternetReachable &&
      dropdownStatus !== 'fulfilled'
    ) {
      dispatch(getTrapVisitDropdownValues(userCredentialsStore.id))
    }
  }, [
    userCredentialsStore?.id,
    connectivityState.isConnected,
    connectivityState.isInternetReachable,
  ])

  // getVisitSetupDefaults (programs/trapLocations/programFormFields - the
  // admin-configured field layout, including counterStart/counterEnd/
  // totalRevolutions) is otherwise only fetched from Home.tsx/SignIn.tsx. A
  // user who resumes a trap visit directly (e.g. the drawer's "Trap Visit
  // Form" item) without revisiting Home this session never refetches it, so
  // the form runs on whatever was last persisted to AsyncStorage - stale or
  // missing config added since, with nothing to self-heal it. Refresh here
  // too, mirroring the dropdown refresh above, whenever this flow is entered.
  useEffect(() => {
    if (
      userCredentialsStore?.id &&
      connectivityState.isConnected &&
      connectivityState.isInternetReachable
    ) {
      dispatch(getVisitSetupDefaults(userCredentialsStore.id))
    }
  }, [
    userCredentialsStore?.id,
    connectivityState.isConnected,
    connectivityState.isInternetReachable,
  ])

  return (
    <VStack h='full' justifyContent='space-between'>
      <FormStackNavigation />
    </VStack>
  )
}
