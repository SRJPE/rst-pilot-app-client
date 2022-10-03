import { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { LogBox } from 'react-native'
import { AppDispatch } from '../redux/store'
import {
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../redux/reducers/visitSetupSlice'
import {
  markTrapStatusCompleted,
  saveTrapStatus,
} from '../redux/reducers/trapStatusSlice'
import {
  markTrapOperationsCompleted,
  saveTrapOperations,
} from '../redux/reducers/trapOperationsSlice'
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
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../redux/reducers/fishProcessingSlice'

const FormStack = createStackNavigator()

const stepToActionsLookup = {
  1: {
    name: 'Visit Setup',
    save: saveVisitSetup,
    completed: markVisitSetupCompleted,
  },
  2: {
    name: 'Trap Status',
    save: saveTrapStatus,
    completed: markTrapStatusCompleted,
  },
  3: {
    name: 'Trap Operations',
    save: saveTrapOperations,
    completed: markTrapOperationsCompleted,
  },
  4: {
    name: 'Fish Processing',
    save: saveFishProcessing,
    completed: markFishProcessingCompleted,
  },
}

export default function FormStackNavigation() {
  const [stepToSubmit, setStepToSubmit] = useState(0 as number)
  const [activeFormState, setActiveFormState] = useState({} as any)
  const [reduxFormState, setReduxFormState] = useState({} as any)
  const navigationState = useSelector((state: any) => state.navigation)
  const reduxState = useSelector((state: any) => state?.values)
  const dispatch = useDispatch<AppDispatch>()
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ])

  useEffect(() => {
    console.log('call dispatch for respective step: ', stepToSubmit)
    console.log('payload for dispatch: ', activeFormState)

    // Dispatch
    const actionsForStep =
      stepToActionsLookup[stepToSubmit as keyof typeof stepToActionsLookup]

    if (actionsForStep) {
      dispatch(actionsForStep?.save(activeFormState))
      dispatch(actionsForStep?.completed(true))
    } else {
      console.log('*********** ActionForStep currently Undefined ***********')
    }

    //then reset for next screen
    //###### NOT RESETTING PROPERLY ##########
    setStepToSubmit(0)
    setActiveFormState({})
    console.log(
      '🚀 ~ FormStackNavigation ~ stepToSubmit IN USE EFFECT',
      stepToSubmit
    )
    console.log(
      '🚀 ~ FormStackNavigation ~ activeFormState IN USE EFFECT',
      activeFormState
    )
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

    //check for?
    // if () {
    //   navigation.setParams({
    //     activeFormState: reduxStore,
    //   })
    // }
    // call 'setOptions' to update screen params (params will not change otherwise)
    navigation.setParams({
      activeFormState: formData,
    })
  }

  // const resetActiveFormState = (
  //   navigation: any,
  //   // step: number,
  //   reduxStore: any
  // ) => {
  //   console.log(
  //     '🚀 ~ FormStackNavigation ~ RESET ACTIVE FORM STATE',
  //     activeFormState
  //   )
  //   setActiveFormState(reduxStore)

  //   navigation.setParams({
  //     activeFormState: reduxStore,
  //   })
  // }

  return (
    <FormStack.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{ header: props => <ProgressHeader {...props} /> }}
    >
      <FormStack.Screen
        name='Visit Setup'
        component={VisitSetup}
        initialParams={{
          step: 1,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='Trap Status'
        component={TrapStatus}
        initialParams={{
          step: 2,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='Trap Operations'
        component={TrapOperations}
        initialParams={{
          step: 3,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='Fish Input'
        component={FishInput}
        initialParams={{
          step: 4,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='Fish Processing'
        component={FishProcessing}
        initialParams={{
          step: 5,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='High Flows'
        component={HighFlows}
        initialParams={{
          step: 6,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='High Temperatures'
        component={HighTemperatures}
        initialParams={{
          step: 7,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='Non Functional Trap'
        component={NonFunctionalTrap}
        initialParams={{
          step: 8,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='No Fish Caught'
        component={NoFishCaught}
        initialParams={{
          step: 9,
          passToActiveFormState,
          activeFormState,
        }}
      />
      <FormStack.Screen
        name='End Trapping'
        component={EndTrapping}
        initialParams={{
          step: 10,
          passToActiveFormState,
          activeFormState,
        }}
      />
    </FormStack.Navigator>
  )
}
