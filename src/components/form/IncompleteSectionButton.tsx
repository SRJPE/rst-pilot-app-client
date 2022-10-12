import { Button, Heading, Icon, Image, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/navigationSlice'

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
      bg={completed ? 'primary' : 'white'}
      // bg='primary'
      alignSelf='center'
      justifyContent='space-evenly'
      minWidth='1/2'
      borderRadius='5'
      variant={'outline'}
      _stack={{
        space: '3.5',
        alignItems: 'center',
      }}
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
