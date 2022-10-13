import {
  Button,
  Heading,
  Icon,
  Image,
  KeyboardAvoidingView,
  Text,
  View,
  VStack,
} from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import NavButtons from '../../../components/formContainer/NavButtons'
import ReleaseTrialWild from './ReleaseTrialWild'
import ReleaseTrialHatchery from './ReleaseTrialHatchery'
import { Platform } from 'react-native'

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
