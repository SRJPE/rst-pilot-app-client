import { Button, HStack, Icon, Text } from 'native-base'
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

  return (
    <Button
      rounded='xs'
      // alignSelf='center'
      minWidth='60%'
      borderRadius='5'
      variant={'outline'}
      bg={completed ? 'primary' : 'white'}
      _stack={{
        //this property accesses the the HStack inside the button
        space: '20',
        alignItems: 'center',
        // justifyContent: 'spaceBetween',
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
          <Text color={completed ? '#FFFFFF' : 'primary'}>
            {completed ? 'Completed' : 'Edit'}
          </Text>
        </Button>
      }
      onPress={handleButtonPress}
    >
      {/* <HStack space={20} alignItems='center'>
        <Icon
          as={Ionicons}
          name={completed ? 'checkmark-circle-outline' : 'warning-outline'}
          size='2xl'
          color={completed ? '#FFFFFF' : 'primary'}
        />
        <Text
          fontSize='md'
          fontWeight='bold'
          color={completed ? '#FFFFFF' : 'primary'}
        >
          {name}
        </Text>
        <Button justifyContent='flex-end' onPress={handleButtonPress}>
          <Text color={completed ? '#FFFFFF' : 'primary'}>
            {completed ? 'Completed' : 'Edit'}
          </Text>
        </Button>
      </HStack> */}
      <Text
        fontSize='md'
        fontWeight='bold'
        color={completed ? '#FFFFFF' : 'primary'}
      >
        {name}
      </Text>
    </Button>
  )
}

export default IncompleteSectionButton
