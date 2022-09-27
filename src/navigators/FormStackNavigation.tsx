import { createStackNavigator } from '@react-navigation/stack'
import FishInput from '../screens/formScreens/fishInput'
import FishProcessing from '../screens/formScreens/fishProcessing'
import VisitSetup from '../screens/formScreens/visitSetup'
import TrapStatus from '../screens/formScreens/trapStatus'
import TrapOperations from '../screens/formScreens/trapOperations'
import HighFlows from '../screens/formScreens/trapStatus/HighFlows'
import HighTemperatures from '../screens/formScreens/trapStatus/HighTemperatures'
import ProgressHeader from '../components/formContainer/ProgressHeader'
import NonFunctionalTrap from '../screens/formScreens/trapStatus/NonFunctionalTrap'
import NoFishCaught from '../screens/formScreens/fishProcessing/NoFishCaught'
import EndTrapping from '../screens/formScreens/endTrapping'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import { AppDispatch } from '../redux/store'
import { saveVisitSetup } from '../redux/reducers/visitSetupSlice'
import { saveTrapStatus } from '../redux/reducers/trapStatusSlice'
import { saveTrapOperations } from '../redux/reducers/trapOperationsSlice'
import { saveFishProcessing } from '../redux/reducers/fishProcessingSlice'

const FormStack = createStackNavigator()

export default function FormStackNavigation() {
  const [stepToSubmit, setStepToSubmit] = useState(0 as number)
  const [activeFormState, setActiveFormState] = useState({} as any)
  const navigationState = useSelector((state: any) => state.navigation)
  const dispatch = useDispatch<AppDispatch>()
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ])

  const stepToActions = {
    1: saveVisitSetup, // visitSetupSlice
    2: saveTrapStatus,
    3: saveTrapOperations,
    4: saveFishProcessing,
  }

  useEffect(() => {
    console.log('call dispatch for respective step: ', stepToSubmit)
    console.log('payload for dispatch: ', activeFormState)

    // Dispatch
    const actionForStep =
      stepToActions[stepToSubmit as keyof typeof stepToActions]

    if (actionForStep) {
      dispatch(actionForStep(activeFormState))
    }

    //then reset for next screen
    setStepToSubmit(0)
    setActiveFormState({})
  }, [navigationState.activeStep])

  const passToActiveFormState = (
    navigation: any,
    step: number,
    formData: any
  ) => {
    console.log('passing new form data: ', formData)

    // set local state to prepare for dispatch
    setStepToSubmit(step)
    setActiveFormState(formData)

    // call 'setOptions' to update screen params (params will not change otherwise)
    navigation.setParams({
      activeFormState: formData,
    })
  }

  return (
    <FormStack.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{ header: props => <ProgressHeader {...props} /> }}
    >
      <FormStack.Screen
        name='Visit Setup'
        component={VisitSetup}
        initialParams={{ step: 1, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='Trap Status'
        component={TrapStatus}
        initialParams={{ step: 2, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='Trap Operations'
        component={TrapOperations}
        initialParams={{ step: 3, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='Fish Input'
        component={FishInput}
        initialParams={{ step: 4, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='Fish Processing'
        component={FishProcessing}
        initialParams={{ step: 5, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='High Flows'
        component={HighFlows}
        initialParams={{ step: 6, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='High Temperatures'
        component={HighTemperatures}
        initialParams={{ step: 7, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='Non Functional Trap'
        component={NonFunctionalTrap}
        initialParams={{ step: 8, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='No Fish Caught'
        component={NoFishCaught}
        initialParams={{ step: 9, passToActiveFormState, activeFormState }}
      />
      <FormStack.Screen
        name='End Trapping'
        component={EndTrapping}
        initialParams={{ step: 10, passToActiveFormState, activeFormState }}
      />
    </FormStack.Navigator>
  )
}
