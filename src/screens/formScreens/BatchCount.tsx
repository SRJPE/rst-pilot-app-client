import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import { useState } from 'react'
import { Keyboard } from 'react-native'
import BatchCountButtonGrid from '../../components/form/batchCount/BatchCountButtonGrid'
import BatchCountGraph from '../../components/form/batchCount/BatchCountGraph'
import ForkLengthButtonGroup from '../../components/form/batchCount/ForkLengthButtonGroup'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'

const BatchCount = ({ route }: { route: any }) => {
  const [forkLengthRange, setForkLengthRange] = useState(0 as number)

  const lifeStage = 'test'
  const adiposeClipped = 'test'
  const dead = 'test'
  const mark = 'test'

  const navigation = useNavigation()

  const buttonNav = () => {
    // @ts-ignore
    navigation.navigate('Trap Visit Form', {
      screen: 'Add Fish',
    })
  }
  return (
    <>
      <View
        flex={1}
        bg='#fff'
        borderWidth='10'
        borderBottomWidth='0'
        borderColor='themeGrey'
      >
        <Pressable onPress={Keyboard.dismiss}>
          <HStack space={10}>
            <CustomModalHeader
              headerText={route.params?.editModeData ? 'Edit Fish' : 'Add Fish'}
              showHeaderButton={true}
              // closeModal={closeModal}
              // navigateBack={true}
              headerButton={null}
              //   AddFishModalHeaderButton({
              //   activeTab,
              //   setActiveTab,
              // })
              // }
            />
            <Button bg='primary' onPress={buttonNav}>
              <Text>ADD FISH TEMP BUTTON</Text>
            </Button>
          </HStack>
          <Divider mb='1' />
          <Box p='2%'>
            <HStack space={6}>
              <Text bold>Selected Batch Characteristics:</Text>
              <Text>LifeStage: {lifeStage}</Text>
              <Text>Adiposed Clipped: {adiposeClipped}</Text>
              <Text>Dead: {dead}</Text>
              <Text>Mark: {mark}</Text>
            </HStack>
            <Pressable>
              <Text>New Batch</Text>
            </Pressable>
          </Box>
          <Divider mb='1' />
          <BatchCountGraph />
          <HStack alignItems='center' space={10}>
            <Heading size='md' p='2%'>
              Select size range for fork length buttons:
            </Heading>
            <Text>MODE TOGGLE PLACEHOLDER</Text>
          </HStack>
          <VStack space={4}>
            <ForkLengthButtonGroup setForkLengthRange={setForkLengthRange} />
            <BatchCountButtonGrid buttonValueStart={forkLengthRange} />
          </VStack>
        </Pressable>
      </View>
    </>
  )
}

export default BatchCount
