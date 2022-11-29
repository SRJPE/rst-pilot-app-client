import { Heading, Image, View, VStack } from 'native-base'
import MarkRecaptureNavButtons from '../../components/markRecapture/MarkRecaptureNavButtons'

export default function MarkRecaptureComplete({
  navigation,
}: {
  navigation: any
}) {
  return (
    <>
      <View
        flex={1}
        justifyContent='center'
        alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={12} p='10'>
          <Image
            alignSelf='center'
            source={require('../../../assets/checkmark_outline.png')}
            alt='Warning Icon'
            size='2xl'
            color='themeGrey'
          />
          <Heading textAlign='center'>
            {
              'Please monitor your trap for recaptures \n every 24 hours for the next week.'
            }
          </Heading>
        </VStack>
      </View>
      <MarkRecaptureNavButtons navigation={navigation} />
    </>
  )
}
