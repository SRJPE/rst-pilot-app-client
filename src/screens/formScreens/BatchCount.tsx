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
  Radio,
  ScrollView,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base'
import { useEffect, useState } from 'react'
import { Keyboard, useWindowDimensions } from 'react-native'
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
  updateSingleForkLengthCount,
  removeLastForkLengthEntered,
  saveBatchCount,
} from '../../redux/reducers/formSlices/fishInputSlice'
import BatchCountHistogram from '../../components/form/batchCount/BatchCountHistogram'
import { Switch } from 'native-base'
import BatchCountDataTable from '../../components/form/batchCount/BatchCountDataTable'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'

const BatchCount = ({ route, fishStore }: { route: any; fishStore: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()
  const [firstButton, setFirstButton] = useState(0 as number)
  const [numberOfAdditionalButtons, setNumberOfAdditionalButtons] = useState(
    0 as number
  )
  const [showTableModal, setShowTableModal] = useState(false as boolean)
  const [showTable, setShowTable] = useState(false as boolean)
  const [batchCharacteristicsModalOpen, setBatchCharacteristicsModalOpen] =
    useState(false as boolean)
  const [modalData, setModalData] = useState({
    forkLength: '',
    count: '',
  } as any)
  const {
    species,
    adiposeClipped,
    dead,
    existingMark,
    forkLengths,
    lastEnteredForkLength,
  } = fishStore.batchCharacteristics

  const { height: screenHeight } = useWindowDimensions()

  //this is not yet hooked up to the fork length button Group interface
  const [lifeStageRadioValue, setLifeStageRadioValue] = useState('' as string)

  useEffect(() => {
    if (species === '') {
      setBatchCharacteristicsModalOpen(true)
    }
  }, [])

  const handlePressRemoveFish = () => {
    dispatch(removeLastForkLengthEntered())
  }

  const handlePressSaveBatchCount = () => {
    dispatch(saveBatchCount())
    showSlideAlert(dispatch, 'Batch Count')
    // @ts-ignore
    navigation.navigate('Trap Visit Form', {
      screen: 'Fish Input',
    })
  }
  const handlePressSaveAndStartNewBatchCount = () => {
    dispatch(saveBatchCount())
    showSlideAlert(dispatch, 'Batch Count')
    setBatchCharacteristicsModalOpen(true)
  }

  const handleEditForkLengthCount = () => {
    dispatch(updateSingleForkLengthCount(modalData))
  }

  const buttonNav = () => {
    // @ts-ignore
    navigation.navigate('Trap Visit Form', {
      screen: 'Add Fish',
    })
  }
  const handleShowTableModal = (selectedRow: any) => {
    setModalData({
      forkLength: selectedRow.forkLength,
      count: selectedRow.count.toString(),
    })
    setShowTableModal(true)
  }

  const handleChangeModalText = (text: string) => {
    setModalData({ ...modalData, count: text })
  }
  const calculateTotalCount = () => {
    let count: number = 0
    if (!forkLengths) return count
    Object.values(forkLengths).forEach((forkLengthCount: any) => {
      count += forkLengthCount
    })
    return count
  }

  return (
    <>
      <ScrollView
        scrollEnabled={screenHeight < 1180}
        flex={1}
        bg='#fff'
        borderWidth='10'
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
          <Box px='2%'>
            <HStack space={6} mb='2'>
              <Text bold>Selected Batch Characteristics:</Text>
              <Text>
                Species: <Text bold>{capitalize(species)}</Text>
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
            <HStack space={4}>
              <Pressable onPress={handlePressSaveAndStartNewBatchCount}>
                <Text fontSize='16' color='primary' bold>
                  Save and Start New Batch
                </Text>
              </Pressable>
              <Pressable onPress={() => setBatchCharacteristicsModalOpen(true)}>
                <Text fontSize='16' color='primary' bold>
                  Update Batch Characteristics
                </Text>
              </Pressable>
            </HStack>
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
            <BatchCountHistogram />
          </Box>
          <VStack space={4}>
            <HStack
              alignItems='center'
              space={10}
              justifyContent='space-between'
              px='5'
            >
              <Heading size='md' p='2%'>
                {showTable
                  ? 'Record count for each fork length: '
                  : 'Select size range for fork length buttons: '}
              </Heading>
              <HStack alignItems='center' space={4}>
                <Text fontSize='16'>Input Fork Lengths</Text>
                <Switch
                  shadow='3'
                  offTrackColor='primary'
                  onTrackColor='primary'
                  size='md'
                  isChecked={showTable}
                  onToggle={() => setShowTable(!showTable)}
                />
                <Text fontSize='16'>Show Table</Text>
              </HStack>
            </HStack>
            {/* using scrollView to patch the table overflow issues*/}
            {showTable ? (
              <ScrollView height='376'>
                <BatchCountDataTable
                  handleShowTableModal={handleShowTableModal}
                />
              </ScrollView>
            ) : (
              <>
                <ForkLengthButtonGroup
                  setFirstButton={setFirstButton}
                  setLifeStageRadioValue={setLifeStageRadioValue}
                  setNumberOfAdditionalButtons={setNumberOfAdditionalButtons}
                />
                <Box px='2%'>
                  <Divider my='1%' />
                  <HStack space={6} alignItems='center'>
                    <Text bold>Life Stage:</Text>
                    <Radio.Group
                      name='lifeStageRadioGroup'
                      value={lifeStageRadioValue}
                      // onChange={(nextValue) => {
                      //   setLifeStageRadioValue(nextValue)
                      // }}
                    >
                      <Stack
                        direction={{
                          base: 'column',
                          md: 'row',
                        }}
                        alignItems={{
                          base: 'flex-start',
                          md: 'center',
                        }}
                        space={10}
                        w='75%'
                        maxW='300px'
                      >
                        <Radio
                          colorScheme='primary'
                          value='Yolk Sac Fry'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Yolk Sac Fry
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='Fry'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Fry
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='Parr'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Parr
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='Silvery Parr'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Silvery Parr
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='Smolt'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Smolt
                        </Radio>
                      </Stack>
                    </Radio.Group>
                  </HStack>
                  <Divider my='1%' />
                </Box>
                <BatchCountButtonGrid
                  firstButton={firstButton}
                  numberOfAdditionalButtons={numberOfAdditionalButtons}
                />
              </>
            )}
            <HStack px='2%' justifyContent='space-between'>
              <VStack space={4}>
                <Heading size='md'>
                  Total Count: {calculateTotalCount()}
                </Heading>
                <Button bg='primary' onPress={handlePressSaveBatchCount}>
                  <Text fontSize='lg' bold color='white'>
                    Save Batch Count
                  </Text>
                </Button>
              </VStack>
              <VStack space={4}>
                <Heading size='md'>
                  Fork length of last fish entered ={' '}
                  {lastEnteredForkLength ? lastEnteredForkLength : '_'}
                </Heading>
                <Button
                  bg='primary'
                  onPress={() => handlePressRemoveFish()}
                  isDisabled={!lastEnteredForkLength}
                >
                  <Text fontSize='lg' bold color='white'>
                    Remove Last Fish
                  </Text>
                </Button>
                {/* <Button
                  bg='primary'
                  onPress={() => console.log('Fork Lengths: ', forkLengths)}
                >
                  <Text fontSize='lg' bold color='white'>
                    LOG
                  </Text>
                </Button> */}
              </VStack>
            </HStack>
          </VStack>
        </Pressable>
      </ScrollView>
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
                Fork Length:{' '}
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
                isFocused
                keyboardType='numeric'
                onChangeText={handleChangeModalText}
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
                  handleEditForkLengthCount()
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
