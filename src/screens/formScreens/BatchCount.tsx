import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Pressable,
  Radio,
  ScrollView,
  Stack,
  Text,
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
  saveBatchCount,
} from '../../redux/reducers/formSlices/fishInputSlice'
import BatchCountHistogram from '../../components/form/batchCount/BatchCountHistogram'
import { Switch } from 'native-base'
import BatchCountDataTable from '../../components/form/batchCount/BatchCountDataTable'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import BatchCountTableModal from '../../components/form/batchCount/BatchCountTableModal'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'

const BatchCount = ({
  route,
  fishInputSlice,
  tabSlice,
  activeTabId,
}: {
  route: any
  fishInputSlice: any
  tabSlice: TabStateI
  activeTabId: string
}) => {
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
  const [modalInitialData, setModalInitialData] = useState({
    forkLength: '',
    count: '',
  } as any)
  const { species, adiposeClipped, dead, existingMark, forkLengths } =
    fishInputSlice[activeTabId].batchCharacteristics

  const { height: screenHeight } = useWindowDimensions()

  const [lifeStageRadioValue, setLifeStageRadioValue] = useState('' as string)

  useEffect(() => {
    if (species === '') {
      setBatchCharacteristicsModalOpen(true)
    }
  }, [])

  const handlePressRemoveFish = () => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(removeLastForkLengthEntered({ tabId: activeTabId }))
    }
  }

  const handlePressSaveBatchCount = () => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(saveBatchCount({ tabId: activeTabId }))
      showSlideAlert(dispatch, 'Batch Count')
      // @ts-ignore
      navigation.navigate('Trap Visit Form', {
        screen: 'Fish Input',
      })
    }
  }
  const handlePressSaveAndStartNewBatchCount = () => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(saveBatchCount({ tabId: activeTabId }))
      showSlideAlert(dispatch, 'Batch Count')
      setBatchCharacteristicsModalOpen(true)
    }
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
                />
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
                  <Button
                    bg='primary'
                    onPress={() => console.log('Fork Lengths: ', forkLengths)}
                  >
                    <Text fontSize='lg' bold color='white'>
                      LOG
                    </Text>
                  </Button>
                </HStack>
              </VStack>
              <VStack space={4}>
                <Heading size='md'>
                  Fork length of last fish entered: {calculateLastFish()}
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
  let activeTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.activeTabId]
  ) {
    activeTabId = state.tabSlice.activeTabId
  }

  return {
    fishInputSlice: state.fishInput,
    tabSlice: state.tabSlice,
    activeTabId,
  }
}
export default connect(mapStateToProps)(BatchCount)
