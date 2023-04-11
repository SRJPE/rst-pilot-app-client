import { Badge, Button, HStack, Icon, Text } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'
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
    navigation.navigate('Trap Visit Form', { screen: name })
    dispatch(updateActiveStep(step))
  }
  const calculateMargin = () => {
    switch (name) {
      case 'Visit Setup':
        return 220
      case 'Trap Operations':
        return 213
      case 'Fish Processing':
        return 181
      case 'Fish Input':
        return 228
      case 'Trap Post-Processing':
        return 135
      default:
        return 0
    }
  }
  const badgeMargin = 3
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
      {Object.keys(pageErrors).length ? (
        <HStack justifyContent={'start'}>
          <Text
            fontSize='md'
            fontWeight='bold'
            color={completed ? '#FFFFFF' : 'primary'}
            mr={badgeMargin}
          >
            {name}
          </Text>
          <Badge
            colorScheme='danger'
            rounded='full'
            zIndex={1}
            variant='solid'
            alignSelf='flex-end'
            mr={calculateMargin() - badgeMargin}
            _text={{
              fontSize: 16,
            }}
          >
            {Object.keys(pageErrors).length}
          </Badge>
        </HStack>
      ) : (
        <Text
          fontSize='md'
          fontWeight='bold'
          color={completed ? '#FFFFFF' : 'primary'}
          mr={calculateMargin()}
        >
          {name}
        </Text>
      )}
    </Button>
  )
}

export default IncompleteSectionButton
