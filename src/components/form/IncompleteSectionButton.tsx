import { Button, Icon, Text } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'

const IncompleteSectionButton = ({
  name,
  completed,
  navigation,
  step,
}: {
  name: string
  completed: boolean
  navigation: any
  step: number
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const handleButtonPress = () => {
    navigation.navigate('Trap Visit Form', { screen: name })
    dispatch(updateActiveStep(step))
  }

  const calculateMargin = () => {
    switch (name) {
      case 'Visit Setup':
        return 220
      case 'Trap Status':
        return 213
      case 'Trap Pre-Processing':
        return 144
      case 'Fish Processing':
        return 181
      case 'Fish Input':
        return 228
      case 'Trap Post-Processing':
        return 135
      default:
        break
    }
  }

  return (
    <Button
      rounded='xs'
      alignSelf='center'
      w='75%'
      borderRadius='5'
      variant={'outline'}
      bg={completed ? 'primary' : 'white'}
      justifyContent='space-between'
      _stack={{
        //this property accesses the the HStack inside the button
        space: '10',
        alignItems: 'center',
        // alignSelf: 'flex-end',
        // justifyContent: 'space-between',
        // marginX: '5',
      }}
      _icon={
        {
          // mx: '5',
        }
      }
      leftIcon={
        completed ? (
          <Icon
            as={Ionicons}
            name='checkmark-circle-outline'
            size='2xl'
            color={completed ? '#FFFFFF' : 'primary'}
          />
        ) : (
          <Icon
            as={Ionicons}
            name='warning-outline'
            size='2xl'
            color={completed ? '#FFFFFF' : 'primary'}
          />
        )
      }
      endIcon={
        <Button onPress={handleButtonPress}>
          <Text
            fontSize='16'
            color={completed ? '#FFFFFF' : 'primary'}
            alignSelf='flex-end'
          >
            {completed ? 'Completed' : 'Edit'}
          </Text>
        </Button>
      }
      onPress={handleButtonPress}
    >
      <Text
        fontSize='md'
        fontWeight='bold'
        color={completed ? '#FFFFFF' : 'primary'}
        mr={calculateMargin()}
      >
        {name}
      </Text>
    </Button>
  )
}

export default IncompleteSectionButton
