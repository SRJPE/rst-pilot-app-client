import { KeyboardAvoidingView, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import ReleaseTrialWild from './ReleaseTrialWild'
import ReleaseTrialHatchery from './ReleaseTrialHatchery'

export default function ReleaseTrial({ navigation }: { navigation: any }) {
  return (
    <>
      <KeyboardAvoidingView
        //this can help with keyboard overlay
        flex={1}
        bg='themeGrey'
      >
        <VStack space={8} p='10'>
          <ReleaseTrialWild />
          <ReleaseTrialHatchery />
        </VStack>
      </KeyboardAvoidingView>
      <NavButtons navigation={navigation} />
    </>
  )
}
