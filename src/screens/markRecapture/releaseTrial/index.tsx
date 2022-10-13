import { KeyboardAvoidingView, View, VStack } from 'native-base'
import ReleaseTrialWild from './ReleaseTrialWild'
import ReleaseTrialHatchery from './ReleaseTrialHatchery'
import MarkRecaptureNavButtons from '../../../components/markRecapture/MarkRecaptureNavButtons'

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
      <MarkRecaptureNavButtons navigation={navigation} />
    </>
  )
}
