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
import { connect } from 'react-redux'
import BatchCharacteristicsModalContent from '../../components/form/batchCount/BatchCharacteristicsModalContent'
import BatchCountButtonGrid from '../../components/form/batchCount/BatchCountButtonGrid'
import BatchCountGraph from '../../components/form/batchCount/BatchCountGraph'
import ForkLengthButtonGroup from '../../components/form/batchCount/ForkLengthButtonGroup'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import { RootState } from '../../redux/store'
import { capitalize } from 'lodash'

const BatchCount = ({ route, fishStore }: { route: any; fishStore: any }) => {
  const [forkLengthRange, setForkLengthRange] = useState(0 as number)
  const [batchCharacteristicsModalOpen, setBatchCharacteristicsModalOpen] =
    useState(false as boolean)
  const { lifeStage, adiposeClipped, dead, existingMark } =
    fishStore.batchCharacteristics

  const totalCount = 'test'
  const lastEntered = 'test'

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
          <Divider m='1%' />
          <Box p='2%'>
            <HStack space={6}>
              <Text bold>Selected Batch Characteristics:</Text>
              <Text>Life Stage: {capitalize(lifeStage)}</Text>
              <Text>Adiposed Clipped: {adiposeClipped ? 'Yes' : 'No'}</Text>
              <Text>Dead: {dead ? 'Yes' : 'No'}</Text>
              <Text>Mark: {existingMark ? existingMark : 'N/A'}</Text>
            </HStack>
            <Pressable onPress={() => setBatchCharacteristicsModalOpen(true)}>
              <Text>New Batch</Text>
            </Pressable>
          </Box>
          <Divider m='1%' />
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
            <HStack p='2%' justifyContent='space-between'>
              <Heading size='md'>TotalCount: {totalCount}</Heading>
              <VStack space={4}>
                <Heading size='md'>
                  LastFishEntered: fork length = {lastEntered}
                </Heading>
                <Button bg='primary'>
                  <Text fontSize='lg' bold color='white'>
                    Remove Last Fish
                  </Text>
                </Button>
              </VStack>
            </HStack>
          </VStack>
        </Pressable>
      </View>
      {/* --------- Modal --------- */}
      <CustomModal
        isOpen={batchCharacteristicsModalOpen}
        closeModal={() => setBatchCharacteristicsModalOpen(false)}
        height='1/2'
      >
        <BatchCharacteristicsModalContent
          // handleMarkFishFormSubmit={handleMarkFishFormSubmit}
          closeModal={() => setBatchCharacteristicsModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    fishStore: state.fishInput,
  }
}
export default connect(mapStateToProps)(BatchCount)
