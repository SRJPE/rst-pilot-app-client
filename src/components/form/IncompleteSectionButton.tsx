import { Badge, Button, HStack, Icon, Pressable, Text } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import {
  togglePreviousPageWasIncompleteSections,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { useEffect, useState } from 'react'

const IncompleteSectionButton = ({
  name,
  completed,
  navigation,
  step,
  tabState,
}: {
  name: string
  completed: boolean
  navigation: any
  step: number
  tabState: TabStateI
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleButtonPress = () => {
    navigation.navigate('Trap Visit Form', {
      screen: name,
    })
    dispatch(updateActiveStep(step))
    dispatch(togglePreviousPageWasIncompleteSections())
  }

  const [pageErrors, setPageErrors] = useState({})

  useEffect(() => {
    Object.keys(tabState.tabs).forEach((tabId) => {
      Object.keys(tabState.tabs[tabId].errorDetails).forEach((pageName) => {
        if (pageName === name) {
          setPageErrors(tabState.tabs[tabId].errorDetails[pageName])
        }
      })
    })
  }, [tabState.tabs])

  return (
    <Button
      rounded='xs'
      alignSelf='center'
      w='100%'
      h='11%'
      borderRadius='5'
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
          <Icon
            as={Ionicons}
            name='warning-outline'
            size='5xl'
            color={completed ? '#FFFFFF' : 'primary'}
          />
        )
      }
      onPress={handleButtonPress}
    >
      <HStack justifyContent='space-between' alignItems='center' width='480px'>
        <Text
          fontSize='xl'
          fontWeight='bold'
          color={completed ? '#FFFFFF' : 'primary'}
          ml='10'
        >
          {`${name}`}
        </Text>

        {Object.keys(pageErrors).length ? (
          <Badge
            colorScheme='danger'
            rounded='full'
            zIndex={1}
            size='xl'
            h='10'
            w='10'
            variant='solid'
            alignSelf='flex-end'
            _text={{
              fontSize: 16,
              color: 'white',
            }}
          >
            <Text color='white' fontWeight='bold' fontSize='xl'>
              {Object.keys(pageErrors).length.toString()}
            </Text>
          </Badge>
        ) : (
          <></>
        )}

        <Pressable onPress={handleButtonPress}>
          <Text
            fontSize='xl'
            color={completed ? '#FFFFFF' : 'primary'}
            alignSelf='flex-end'
            mr='5'
          >
            {completed ? 'Completed' : 'Edit'}
          </Text>
        </Pressable>
      </HStack>
    </Button>
  )
}

export default IncompleteSectionButton
