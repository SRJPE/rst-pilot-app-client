import { VStack } from 'native-base'
import QCNavigation from '../QCNavigation'

export default function QCForm({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <QCNavigation />
    </VStack>
  )
}
