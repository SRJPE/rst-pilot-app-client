import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
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
  removeLastForkLengthEntered,
  resetBatchCountSlice,
} from '../../redux/reducers/formSlices/batchCountSlice'
import { saveBatchCount } from '../../redux/reducers/formSlices/fishInputSlice'
import BatchCountHistogram from '../../components/form/batchCount/BatchCountHistogram'
import { Switch } from 'native-base'
import BatchCountDataTable from '../../components/form/batchCount/BatchCountDataTable'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import BatchCountTableModal from '../../components/form/batchCount/BatchCountTableModal'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons'

const BatchCount = ({
  tabSlice,
  batchCountStore,
}: {
  tabSlice: TabStateI
  batchCountStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()
  const { height: screenHeight } = useWindowDimensions()
  const [firstButton, setFirstButton] = useState(0 as number)
  const [numberOfAdditionalButtons, setNumberOfAdditionalButtons] = useState(
    0 as number
  )
  const [showTableModal, setShowTableModal] = useState(false as boolean)
  const [showTable, setShowTable] = useState(false as boolean)
  const [lifeStageRadioValue, setLifeStageRadioValue] = useState('' as string)
  const [batchCharacteristicsModalOpen, setBatchCharacteristicsModalOpen] =
    useState(false as boolean)
  const [modalInitialData, setModalInitialData] = useState({
    forkLength: '',
    count: '',
  } as any)

  const [deadIsLocked, setDeadIsLocked] = useState(false as boolean)
  const [deadToggle, setDeadToggle] = useState(false as boolean)
  const [markToggle, setMarkToggle] = useState(false as boolean)
  const [conditionToggle, setConditionToggle] = useState(false as boolean)
  const {
    tabId,
    species,
    adiposeClipped,
    fishCondition,
    existingMarks,
    forkLengths,
  } = batchCountStore

  useEffect(() => {
    if (species === '') {
      setBatchCharacteristicsModalOpen(true)
    }
  }, [])

  const handlePressRemoveFish = () => {
    dispatch(removeLastForkLengthEntered())
  }

  const handlePressSaveBatchCount = () => {
    if (tabId) {
      dispatch(saveBatchCount({ ...batchCountStore }))
      dispatch(resetBatchCountSlice())
      showSlideAlert(dispatch, 'Batch Count')
      // @ts-ignore
      navigation.navigate('Trap Visit Form', {
        screen: 'Fish Input',
      })
    }
  }
  const handlePressSaveAndStartNewBatchCount = () => {
    dispatch(saveBatchCount({ ...batchCountStore }))
    dispatch(resetBatchCountSlice())

    showSlideAlert(dispatch, 'Batch Count')
    setBatchCharacteristicsModalOpen(true)
  }

  const buttonNav = () => {
    // @ts-ignore
    navigation.navigate('Trap Visit Form', {
      screen: 'Add Fish',
    })
  }
  const handleShowTableModal = (selectedRowData: any) => {
    const modalDataContainer = {} as any
    Object.keys(selectedRowData).forEach((key: string) => {
      modalDataContainer[key] = selectedRowData[key].toString()
    })
    setModalInitialData(modalDataContainer)
    setShowTableModal(true)
  }

  const calculateTotalCount = () => {
    let count: number = 0
    if (!forkLengths) return count
    Object.values(forkLengths).forEach(() => {
      count += 1
    })
    return count
  }
  const calculateLastFish = (): number | null => {
    let forkLengthOfLastFish: number | null = null
    if (!forkLengths) return null
    Object.values(forkLengths).forEach((entry: any) => {
      forkLengthOfLastFish = entry.forkLength
    })
    return forkLengthOfLastFish
  }

  const handleToggles = (toggleName: string) => {
    switch (toggleName) {
      case 'dead':
        if (deadIsLocked) return
        setDeadToggle(!deadToggle)
        break
      case 'mark':
        setMarkToggle(!markToggle)
        break
      case 'condition':
        setConditionToggle(!conditionToggle)
        break

      default:
        setMarkToggle(false)
        setConditionToggle(false)
        if (deadIsLocked) return
        setDeadToggle(false)
        break
    }
  }

  const handlePressLockDead = () => {
    if (!deadToggle) return
    setDeadIsLocked(!deadIsLocked)
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
              headerText={
                tabSlice.activeTabId
                  ? `Add Batch Count - ${
                      tabSlice.tabs[tabSlice.activeTabId].name
                    }`
                  : 'Add Batch Count'
              }
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
            <HStack space={6}>
              <VStack>
                <HStack space={6} mb='2'>
                  <Text fontSize='16' bold>
                    Selected Batch Characteristics:
                  </Text>
                  <Text>
                    Species: <Text bold>{capitalize(species)}</Text>
                  </Text>
                  <Text>
                    Fish Condition:{' '}
                    <Text bold>{capitalize(fishCondition)}</Text>
                  </Text>
                </HStack>
                <HStack space={6} ml='100'>
                  <Text>
                    Adipose Clipped:{' '}
                    <Text bold>{adiposeClipped ? 'Yes' : 'No'}</Text>
                  </Text>
                  <Text>
                    Mark:{' '}
                    <Text bold>
                      {existingMarks.length > 0
                        ? `${existingMarks[0].markType} - ${existingMarks[0].markColor} - ${existingMarks[0].markPosition}`
                        : 'N/A'}
                    </Text>
                  </Text>
                </HStack>
              </VStack>
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
          <VStack space={3}>
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
            {showTable ? (
              <ScrollView height='369'>
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
                {species === 'Chinook salmon' && (
                  <Box px='2%'>
                    <Divider my='1%' />
                    <HStack space={6} alignItems='center'>
                      <Text bold>Life Stage:</Text>
                      <Radio.Group
                        name='lifeStageRadioGroup'
                        value={lifeStageRadioValue}
                        onChange={(nextValue) => {
                          setLifeStageRadioValue(nextValue)
                        }}
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
                )}
                <BatchCountButtonGrid
                  firstButton={firstButton}
                  numberOfAdditionalButtons={numberOfAdditionalButtons}
                  selectedLifeStage={lifeStageRadioValue}
                  ignoreLifeStage={species !== 'Chinook salmon'}
                  deadToggle={deadToggle}
                  markToggle={markToggle}
                  conditionToggle={conditionToggle}
                  handleToggles={handleToggles}
                />
                {species !== 'Chinook salmon' && <View mb='65'></View>}
              </>
            )}
            <HStack px='2%' justifyContent='space-between'>
              <VStack space={4}>
                <Heading size='md'>
                  Total Count: {calculateTotalCount()}
                </Heading>
                <HStack space={5}>
                  <Button bg='primary' onPress={handlePressSaveBatchCount}>
                    <Text fontSize='lg' bold color='white'>
                      Save Batch Count
                    </Text>
                  </Button>
                </HStack>
              </VStack>
              <VStack alignItems='center' space={2}>
                <HStack alignItems='center' space={2}>
                  <IconButton
                    // color='secondary'
                    // bg='secondary'
                    onPress={() => handlePressLockDead()}
                    icon={
                      <Icon
                        as={FontAwesome}
                        name={deadIsLocked ? 'lock' : 'unlock'}
                      />
                    }
                    borderRadius='full'
                    _icon={{
                      size: 5,
                    }}
                    _pressed={{
                      bg: '#FFF',
                    }}
                  />

                  <Text fontSize='16'>Dead</Text>
                </HStack>
                <Switch
                  shadow='3'
                  offTrackColor='secondary'
                  onTrackColor='primary'
                  size='md'
                  isChecked={deadToggle}
                  // isDisabled={deadIsLocked}
                  onToggle={() => handleToggles('dead')}
                />
              </VStack>
              <VStack alignItems='center' space={4} mt='2'>
                <Text fontSize='16'>Mark</Text>
                <Switch
                  shadow='3'
                  offTrackColor='secondary'
                  onTrackColor='primary'
                  size='md'
                  isChecked={markToggle}
                  onToggle={() => handleToggles('mark')}
                />
              </VStack>
              <VStack alignItems='center' space={4} mt='2'>
                <Text fontSize='16'>Condition</Text>
                <Switch
                  shadow='3'
                  offTrackColor='secondary'
                  onTrackColor='primary'
                  size='md'
                  isChecked={conditionToggle}
                  onToggle={() => handleToggles('condition')}
                />
              </VStack>
              <VStack space={4}>
                <Heading size='md'>
                  Last Fork length Entered: {calculateLastFish()}
                </Heading>
                <Button
                  bg='primary'
                  onPress={() => handlePressRemoveFish()}
                  isDisabled={calculateTotalCount() === 0}
                >
                  <Text fontSize='lg' bold color='white'>
                    Remove Last Fish
                  </Text>
                </Button>
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

      <BatchCountTableModal
        showTableModal={showTableModal}
        setShowTableModal={setShowTableModal}
        modalInitialData={modalInitialData}
      />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
  }
}
export default connect(mapStateToProps)(BatchCount)
