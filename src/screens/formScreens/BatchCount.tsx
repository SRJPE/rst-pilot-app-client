import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
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
  removeForkLength,
  removeLastForkLengthEntered,
  saveBatchCount,
} from '../../redux/reducers/formSlices/fishInputSlice'
import BatchCountHistogram from '../../components/form/batchCount/BatchCountHistogram'
import { Switch } from 'native-base'
import BatchCountDataTable from '../../components/form/batchCount/BatchCountDataTable'

const BatchCount = ({ route, fishStore }: { route: any; fishStore: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()
  const [forkLengthRange, setForkLengthRange] = useState(0 as number)
  const [showTableModal, setShowTableModal] = useState(false as boolean)

  const [processedData, setProcessedData] = useState(
    [] as { forkLength: number; count: number }[]
  )
  const [showTable, setShowTable] = useState(false as boolean)
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
    const processedDataCopy: { forkLength: number; count: number }[] = [
      ...processedData,
    ]
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
      (entry: { forkLength: number; count: number }) =>
        entry.forkLength === lastEntry
    )

    //if the last entry does already exist, then increment the count
    if (indexOfFoundEntry > -1) {
      processedDataCopy[indexOfFoundEntry].count++
      setProcessedData(processedDataCopy)
    } else {
      //otherwise create the new data with the last entry
      setProcessedData([
        ...processedDataCopy,
        { forkLength: lastEntry, count: 1 },
      ])
    }
  }

  const handlePressRemoveFish = (
    lastEntry: number = forkLengths[forkLengths.length - 1]
  ) => {
    const processedDataCopy: { forkLength: number; count: number }[] = [
      ...processedData,
    ]
    if (forkLengths.length === 0) return
    if (processedDataCopy.length === 0) return

    let indexOfFoundEntry = processedDataCopy.findIndex(
      (entry: any) => entry.forkLength === lastEntry
    )

    if (indexOfFoundEntry > -1) {
      if (processedDataCopy[indexOfFoundEntry].count === 1) {
        processedDataCopy.splice(indexOfFoundEntry, 1)
      } else {
        processedDataCopy[indexOfFoundEntry].count--
      }
    }

    setProcessedData(processedDataCopy)
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
  const [modalData, setModalData] = useState({
    forkLength: '',
    count: '',
  } as any)
  // const [value, setValue] = useState<string>('')

  const handleChangeText = (text: string) =>
    setModalData({ ...modalData, count: text })
  const handleShowTableModal = (selectedRow: any) => {
    setModalData({
      forkLength: selectedRow.forkLength,
      count: selectedRow.count,
    })
    // setValue(selectedRow.count)
    // setModalData({ ...modalData, count: selectedRow.count })
    setShowTableModal(true)
  }

  const handleEditForkLengthCount = (newCount: any) => {
    //find the current item in the processedData
    //if the new count is 0
    //delete that object from the processedData
    //otherwise
    //set the count to be the new count

    const processedDataCopy: { forkLength: number; count: number }[] = [
      ...processedData,
    ]

    let indexOfFoundEntry = processedDataCopy.findIndex(
      (entry: { forkLength: number; count: number }) =>
        entry.forkLength === modalData.forkLength
    )
    if (newCount < 1) {
      processedDataCopy.splice(indexOfFoundEntry, 1)
    } else {
      processedDataCopy[indexOfFoundEntry].count = newCount
    }
    setProcessedData(processedDataCopy)

    //also need to remove the entry from the forkLengths array
    dispatch(removeForkLength(modalData))

    // processData()
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
              navigateBack={true}
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
            h='2/6'
            w='5/6'
            alignSelf='center'
            alignItems='center'
            justifyContent='center'
            bg='secondary'
          >
            <BatchCountHistogram processedData={processedData} />
          </Box>
          <HStack alignItems='center' space={10}>
            <Heading size='md' p='2%'>
              Select size range for fork length buttons:
            </Heading>
            <HStack alignItems='center' space={4}>
              <Text>Show Table</Text>
              <Switch onToggle={() => setShowTable(!showTable)} size='sm' />
            </HStack>
          </HStack>
          <VStack space={8}>
            {showTable ? (
              <BatchCountDataTable
                processedData={processedData}
                handleShowTableModal={handleShowTableModal}
              />
            ) : (
              <>
                <ForkLengthButtonGroup
                  setForkLengthRange={setForkLengthRange}
                />
                <BatchCountButtonGrid buttonValueStart={forkLengthRange} />
              </>
            )}
            {/* <ForkLengthButtonGroup setForkLengthRange={setForkLengthRange} />
             <BatchCountButtonGrid buttonValueStart={forkLengthRange} /> */}
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
                <Heading size='md'>
                  LastFishEntered: fork length ={' '}
                  {forkLengths[forkLengths.length - 1]}
                </Heading>
                <Button bg='primary' onPress={() => handlePressRemoveFish()}>
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
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={batchCharacteristicsModalOpen}
        closeModal={() => setBatchCharacteristicsModalOpen(false)}
        height='1/2'
      >
        <BatchCharacteristicsModalContent
          closeModal={() => setBatchCharacteristicsModalOpen(false)}
        />
      </CustomModal>
      <Modal isOpen={showTableModal} onClose={() => setShowTableModal(false)}>
        <Modal.Content maxWidth='400px'>
          <Modal.CloseButton />
          <Modal.Header>
            <Heading color='black' fontSize='2xl'>
              Edit Fork Length Count
            </Heading>
          </Modal.Header>
          <Modal.Body>
            <HStack alignItems='center'>
              <Text color='black' fontSize='xl'>
                Fork Length (cm):{' '}
              </Text>
              <Text bold color='black' fontSize='2xl'>
                {modalData.forkLength}
              </Text>
            </HStack>
            <FormControl mt='3'>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Count
                </Text>
              </FormControl.Label>
              <Input
                size='2xl'
                value={modalData.count}
                onChangeText={handleChangeText}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant='ghost'
                colorScheme='blueGray'
                onPress={() => {
                  setShowTableModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                bg='primary'
                onPress={() => {
                  setShowTableModal(false)
                  handleEditForkLengthCount(modalData.count)
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    fishStore: state.fishInput,
  }
}
export default connect(mapStateToProps)(BatchCount)
