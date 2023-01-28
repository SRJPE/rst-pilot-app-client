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
import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import BatchCharacteristicsModalContent from '../../components/form/batchCount/BatchCharacteristicsModalContent'
import BatchCountButtonGrid from '../../components/form/batchCount/BatchCountButtonGrid'
import BatchCountGraph from '../../components/form/batchCount/BatchCountGraph'
import ForkLengthButtonGroup from '../../components/form/batchCount/ForkLengthButtonGroup'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../../components/Shared/CustomModalHeader'
import { AppDispatch, RootState } from '../../redux/store'
import { capitalize } from 'lodash'
import { removeLastForkLengthEntered } from '../../redux/reducers/formSlices/fishInputSlice'

const BatchCount = ({ route, fishStore }: { route: any; fishStore: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [forkLengthRange, setForkLengthRange] = useState(0 as number)
  const [batchCharacteristicsModalOpen, setBatchCharacteristicsModalOpen] =
    useState(false as boolean)
  const navigation = useNavigation()

  const { lifeStage, adiposeClipped, dead, existingMark, forkLengths } =
    fishStore.batchCharacteristics
  // const totalCount = forkLengths?.length
  // const lastEntered = [...forkLengths].pop()
  const totalCount = 'test'
  const lastEntered = 'test'

  useEffect(() => {
    if (lifeStage === '') {
      setBatchCharacteristicsModalOpen(true)
    }
  }, [])

  const handlePressRemoveFish = () => {
    // dispatch(removeLastForkLengthEntered())
  }

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
              // headerButton={null}
              headerButton={AddFishModalHeaderButton({
                activeTab: 'Batch',
                buttonNav,
              })}
            />
            {/* <Button h='50' bg='primary' onPress={buttonNav}
              <Text color='white'>ADD FISH TEMP BUTTON</Text>
            </Button> */}
          </HStack>
          <Divider m='1%' />
          <Box p='2%'>
            <HStack space={6}>
              <Text bold>Selected Batch Characteristics:</Text>
              <Text>
                Life Stage: <Text bold>{capitalize(lifeStage)}</Text>
              </Text>
              <Text>
                Adiposed Clipped:{' '}
                <Text bold>{adiposeClipped ? 'Yes' : 'No'}</Text>
              </Text>
              <Text>
                Dead: <Text bold>{dead ? 'Yes' : 'No'}</Text>
              </Text>
              <Text>
                Mark: <Text bold>{existingMark ? existingMark : 'N/A'}</Text>
              </Text>
            </HStack>
            <Pressable onPress={() => setBatchCharacteristicsModalOpen(true)}>
              <Text fontSize='16' color='primary' bold>
                New Batch
              </Text>
            </Pressable>
          </Box>
          <Divider m='1%' />
          <Box
            h='2/5'
            w='4/5'
            alignSelf='center'
            alignItems='center'
            justifyContent='center'
            bg='secondary'
          >
            <Text>GRAPH</Text>
            {forkLengths && (
              <>
                {/* <Text>{Object.keys(forkLengths)}</Text>
                <Text>{Object.values(forkLengths)}</Text> */}
                <Text>{forkLengths}</Text>
              </>
            )}
          </Box>
          {/* <BatchCountGraph /> */}
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
              {/* <Heading size='md'>
                TotalCount: {forkLengths ? forkLengths.length : 0}
              </Heading> */}
              <VStack space={4}>
                <Heading size='md'>
                  {/* LastFishEntered: fork length ={' '}
                  {forkLengths[forkLengths.length - 1]} */}
                </Heading>
                <Button bg='primary' onPress={handlePressRemoveFish}>
                  <Text fontSize='lg' bold color='white'>
                    Remove Last Fish
                  </Text>
                </Button>
                <Button bg='primary' onPress={() => console.log(fishStore)}>
                  <Text fontSize='lg' bold color='white'>
                    LOG
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
