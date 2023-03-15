import React from 'react'
import { Avatar, Button, HStack, Icon, Pressable, Text } from 'native-base'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'

const CreateNewProgramButton = ({
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
    //  navigation.navigate('Trap Visit Form', { screen: name })
    //  dispatch(updateActiveStep(step))
  }

  return (
    <Button
      rounded='xs'
      alignSelf='center'
      w='100%'
      h='10%'
      borderRadius='5'
      borderColor='primary'
      variant={'outline'}
      bg={completed ? 'primary' : 'white'}
      justifyContent='space-between'
      leftIcon={
        completed ? (
          <Icon
            as={Ionicons}
            name='checkmark-circle-outline'
            size='5xl'
            ml='2'
            color={completed ? '#FFFFFF' : 'primary'}
          />
        ) : (
          <Avatar
            borderWidth='3'
            size='md'
            borderColor='primary'
            ml='2'
            bg='#fff'
          >
            <Text color='primary' fontSize='lg' fontWeight='bold'>
              {step}
            </Text>
          </Avatar>
        )
      }
      onPress={handleButtonPress}
    >
      <HStack justifyContent='space-between' width='480px'>
        <Text
          fontSize='xl'
          fontWeight='bold'
          color={completed ? '#FFFFFF' : 'black'}
          ml='10'
        >
          {name}
        </Text>
        <Pressable onPress={handleButtonPress}>
          <Text
            fontSize='xl'
            color={completed ? '#FFFFFF' : 'primary'}
            alignSelf='flex-end'
          >
            {completed ? 'Completed' : 'Start'}
          </Text>
        </Pressable>
      </HStack>
    </Button>
  )
}

export default CreateNewProgramButton
