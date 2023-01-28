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
import ForkLengthButtonGroup from '../../components/form/batchCount/ForkLengthButtonGroup'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../../components/Shared/CustomModalHeader'
import { AppDispatch, RootState } from '../../redux/store'
import { capitalize } from 'lodash'
import {
  removeLastForkLengthEntered,
  saveBatchCount,
} from '../../redux/reducers/formSlices/fishInputSlice'
import BatchCountHistogram from '../../components/form/batchCount/BatchCountHistogram'

const BatchCount = ({ route, fishStore }: { route: any; fishStore: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()
  const [forkLengthRange, setForkLengthRange] = useState(0 as number)
  const [processedData, setProcessedData] = useState([] as any)
  const [batchCharacteristicsModalOpen, setBatchCharacteristicsModalOpen] =
    useState(false as boolean)
  const { lifeStage, adiposeClipped, dead, existingMark, forkLengths } =
    fishStore.batchCharacteristics

  useEffect(() => {
    processData()
  }, [forkLengths])

  useEffect(() => {
    if (lifeStage === '') {
      setBatchCharacteristicsModalOpen(true)
    }
  }, [])

  const processData = () => {
    //create a copy of the data
    const processedDataCopy: any = [...processedData]
    //store the last entry in a variable
    const lastEntry = [...forkLengths].pop()
    if (lastEntry === undefined) return

    //if this is the first entry
    if (forkLengths.length === 1) {
      //then create our first entry into processedData
      setProcessedData([{ forkLength: lastEntry, count: 1 }])
      //exit function
      return
    }
    //find the index of the last entry in the processedDataCopy
    let indexOfFoundEntry = processedDataCopy.findIndex(
      (entry: any) => entry.forkLength === lastEntry
    )

    //if the last entry does already exist, then increment the count
    if (indexOfFoundEntry > -1) {
      processedDataCopy[indexOfFoundEntry].count++
    } else {
      //otherwise create the new data with the last entry
      setProcessedData([
        ...processedDataCopy,
        { forkLength: lastEntry, count: 1 },
      ])
    }
  }

  const handlePressRemoveFish = () => {
    dispatch(removeLastForkLengthEntered())
  }
  const handlePressSaveBatchCount = () => {
    dispatch(saveBatchCount(processedData))
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
            <BatchCountHistogram processedData={processedData} />
          </Box>
          <HStack alignItems='center' space={10}>
            <Heading size='md' p='2%'>
              Select size range for forkLength buttons:
            </Heading>
            <Text>MODE TOGGLE PLACEHOLDER</Text>
          </HStack>
          <VStack space={4}>
            <ForkLengthButtonGroup setForkLengthRange={setForkLengthRange} />
            <BatchCountButtonGrid buttonValueStart={forkLengthRange} />
            <HStack p='2%' justifyContent='space-between'>
              <Heading size='md'>
                TotalCount: {forkLengths ? forkLengths.length : 0}
              </Heading>
              <Button bg='primary' onPress={handlePressSaveBatchCount}>
                <Text fontSize='lg' bold color='white'>
                  Save Batch Count
                </Text>
              </Button>
              <VStack space={4}>
                <Heading size='md'>LastFishEntered: forkLength ={}</Heading>
                <Button bg='primary' onPress={handlePressRemoveFish}>
                  <Text fontSize='lg' bold color='white'>
                    Remove Last Fish
                  </Text>
                </Button>
                <Button
                  bg='primary'
                  onPress={() => console.log(fishStore, forkLengths)}
                >
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
