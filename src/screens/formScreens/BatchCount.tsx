import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  // Radio,
  ScrollView,
  Switch,
  Text,
  View,
  VStack,
} from 'native-base'
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from '@/components/ui/radio'
import { CircleIcon } from '@/components/ui/icon'
import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import BatchCharacteristicsModalContent from '../../components/form/batchCount/BatchCharacteristicsModalContent'
import BatchCountButtonGrid from '../../components/form/batchCount/BatchCountButtonGrid'
import BatchCountDataTable from '../../components/form/batchCount/BatchCountDataTable'
import BatchCountHistogram from '../../components/form/batchCount/BatchCountHistogram'
import BatchCountTableModal from '../../components/form/batchCount/BatchCountTableModal'
import ForkLengthButtonGroup from '../../components/form/batchCount/ForkLengthButtonGroup'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader, {
  AddFishModalHeaderButton,
} from '../../components/Shared/CustomModalHeader'
import {
  removeLastForkLengthEntered,
  resetBatchCountSlice,
} from '../../redux/reducers/formSlices/batchCountSlice'
import {
  saveBatchCount,
  getFishMeasureCounts,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { find } from 'lodash'
import { calculateLastFish, checkFishMeasureProtocol } from '../../utils/utils'
import FishEntriesSummary from '../../components/form/FishEntriesSummary'
import MeasureMetPlusCount from '../../components/form/MeasureMetPlusCount'

const BatchCount = ({
  route,
  tabSlice,
  batchCountStore,
  trapOperationsStore,
  dropdownsStore,
  selectedProgramId,
  visitSetupDefaults,
  fishInputSlice,
}: {
  route: any
  tabSlice: TabStateI
  batchCountStore: any
  trapOperationsStore: any
  dropdownsStore: any
  selectedProgramId: number | null
  visitSetupDefaults: any
  fishInputSlice: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const currentProgramInfo = find(
    visitSetupDefaults.programs,
    (program: any) => program.id === selectedProgramId
  )
  const navigation = useNavigation()
  const [firstButton, setFirstButton] = useState(0 as number)
  const [numberOfAdditionalButtons, setNumberOfAdditionalButtons] = useState(
    0 as number
  )
  const [showTableModal, setShowTableModal] = useState(false as boolean)
  const [showTable, setShowTable] = useState(false as boolean)
  const [lifeStageRadioValue, setLifeStageRadioValue] = useState('' as string)

  const [batchCharacteristicsModalOpen, setBatchCharacteristicsModalOpen] =
    useState(true as boolean)
  const [modalInitialData, setModalInitialData] = useState({
    forkLength: '',
    count: '',
  } as any)

  const [deadIsLocked, setDeadIsLocked] = useState(false as boolean)
  const [deadToggle, setDeadToggle] = useState(false as boolean)
  const [markToggle, setMarkToggle] = useState(false as boolean)
  const [FC1Toggle, setFC1Toggle] = useState(false as boolean)
  const [FC2Toggle, setFC2Toggle] = useState(false as boolean)
  const [FC3Toggle, setFC3Toggle] = useState(false as boolean)
  const [totalCatchCount, setTotalCatchCount] = useState(0 as number)
  const [combinedFishMeasureCounts, setCombinedFishMeasureCounts] = useState(
    {} as Record<string, any>
  )
  const [fishMeasureMetModalOpen, setFishMeasureMetModalOpen] = useState(
    false as boolean
  )
  const [protocolKeyMet, setProtocolKeyMet] = useState(null as string | null)

  const { tabId, batchCharacteristics, forkLengths } = batchCountStore
  const { species, fishConditions, existingMarks } = batchCharacteristics

  const [selectedProgramObj, setSelectedProgramObj] = useState({} as any)

  useEffect(() => {
    const currentProgramInfo = find(
      visitSetupDefaults.programs,
      (program: any) => program.id === selectedProgramId
    )
    setSelectedProgramObj(currentProgramInfo)
  }, [visitSetupDefaults.programs, selectedProgramId])

  const handlePressRemoveFish = () => {
    dispatch(removeLastForkLengthEntered())
  }

  const handlePressSaveBatchCount = () => {
    if (tabId) {
      dispatch(saveBatchCount({ ...batchCountStore }))
      dispatch(resetBatchCountSlice())
      showSlideAlert(dispatch, 'Batch Count Saved')
      // @ts-ignore
      navigation.navigate('Trap Visit Form', {
        screen: 'Fish Input',
      })
    }
  }
  const handlePressSaveAndStartNewBatchCount = () => {
    dispatch(saveBatchCount({ ...batchCountStore }))
    dispatch(resetBatchCountSlice())

    showSlideAlert(dispatch, 'Batch Count Saved')
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

  const handleToggles = (toggleName: string) => {
    switch (toggleName) {
      case 'dead':
        if (deadIsLocked) return
        setDeadToggle(!deadToggle)
        break
      case 'mark':
        setMarkToggle(!markToggle)
        break
      case 'FC1':
        setFC1Toggle(!FC1Toggle)
        break
      case 'FC2':
        setFC2Toggle(!FC2Toggle)
        break
      case 'FC3':
        setFC3Toggle(!FC3Toggle)
        break

      default:
        setMarkToggle(false)
        setFC1Toggle(false)
        setFC2Toggle(false)
        setFC3Toggle(false)
        if (deadIsLocked) return
        setDeadToggle(false)
        break
    }
  }

  const handlePressLockDead = () => {
    setDeadIsLocked(!deadIsLocked)
  }

  useEffect(() => {
    if (!tabSlice?.activeTabId || !fishInputSlice) return

    if (batchCharacteristicsModalOpen) {
      return
    }
    const fishMeasureCounts = fishInputSlice?.[tabSlice.activeTabId]
      ?.fishMeasureCounts as Record<
      string,
      { individualCount: number; plusCount: number }
    >

    const batchCountFishStore = Object.values(batchCountStore?.forkLengths).map(
      (flObj: any) => {
        return {
          forkLength: flObj.forkLength,
          run: flObj?.runDefinition,
          lifeStage: flObj?.lifeStage?.toLowerCase(),
          species: batchCountStore?.batchCharacteristics?.species,
          numFishCaught: 1,
        }
      }
    )

    const existingFishStore = fishInputSlice?.[tabSlice.activeTabId]
      ?.fishStore as Record<string, { numFishCaught: number }>

    const combinedFishStoreObj = {
      ...existingFishStore,
    } as Record<string, any>

    let nextIndex = Object.keys(combinedFishStoreObj).length
    batchCountFishStore.forEach(fish => {
      combinedFishStoreObj[nextIndex] = fish
      nextIndex++
    })

    const combinedFishMeasureCountsObj =
      getFishMeasureCounts(combinedFishStoreObj)
    setCombinedFishMeasureCounts(combinedFishMeasureCountsObj)

    if (!combinedFishStoreObj) return

    const total = Object.values(combinedFishStoreObj).reduce(
      (sum, fishObj) =>
        sum + (fishObj.numFishCaught ? Number(fishObj.numFishCaught) : 0),
      0
    )

    setTotalCatchCount(total)

    const protocolResult = checkFishMeasureProtocol({
      fishMeasureCounts: combinedFishMeasureCountsObj,
      fishMeasureProtocol: route.params?.fishMeasureProtocol,
      speciesValue: species as string,
      runValue: '' as string,
      lifeStageValue: '' as string,
    })

    if (protocolResult && protocolResult.protocolMet) {
      setFishMeasureMetModalOpen(true)
    } else {
      setFishMeasureMetModalOpen(false)
    }

    if (protocolResult && protocolResult.protocolKeyMet) {
      setProtocolKeyMet(protocolResult.protocolKeyMet)
    } else {
      setProtocolKeyMet(null)
    }
  }, [
    tabSlice.activeTabId,
    fishInputSlice,
    species,
    batchCountStore.forkLengths,
  ])

  const closeFishMeasureMetModal = () => {
    setFishMeasureMetModalOpen(false)
  }

  const navState = navigation?.getState()
  const currentRoute = navState?.routes[navState?.index]

  return currentRoute?.name === 'Batch Count' ? (
    <>
      <ScrollView
        scrollEnabled
        flex={1}
        bg='#fff'
        borderWidth='10'
        borderColor='themeGrey'
      >
        <View style={{ paddingBottom: 100 }}>
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
            <Box px='2%'>
              <HStack space={6}>
                <VStack>
                  <HStack space={6} mb='2'></HStack>
                </VStack>
              </HStack>
            </Box>
            <Divider m='1%' />

            {combinedFishMeasureCounts &&
              Object.keys(combinedFishMeasureCounts).length && (
                <Box mb={4}>
                  <FishEntriesSummary
                    lastFishEntry={{
                      species: batchCountStore.batchCharacteristics.species,
                      forkLength: calculateLastFish(
                        batchCountStore.forkLengths
                      ),
                    }}
                    totalCatchCount={totalCatchCount}
                    fishMeasureProtocol={
                      route.params?.fishMeasureProtocol || {}
                    }
                    fishMeasureCounts={combinedFishMeasureCounts}
                  />
                </Box>
              )}

            {showTable ? (
              <ScrollView height='369'>
                <BatchCountDataTable
                  handleShowTableModal={handleShowTableModal}
                />
              </ScrollView>
            ) : (
              <Box
                w='5/6'
                alignSelf='center'
                alignItems='center'
                justifyContent='center'
                bg='secondary'
              >
                <BatchCountHistogram />
              </Box>
            )}
            <VStack space={3}>
              <HStack
                alignItems='center'
                justifyContent='center'
                my={2}
                space={4}
                mt={5}
              >
                <Text fontSize='16'>Show Histogram</Text>
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

              <>
                <Divider />

                <Box px='2%'>
                  <Text bold mb={2}>
                    Fish Conditions:
                  </Text>
                  <HStack space={3} alignItems='center'>
                    <HStack alignItems='center' space={4}>
                      <HStack space={2} alignItems={'center'}>
                        <Checkbox
                          value='dead'
                          isChecked={deadToggle}
                          shadow='3'
                          _checked={{
                            bg: 'primary',
                            borderColor: 'primary',
                          }}
                          size='md'
                          isDisabled={deadIsLocked}
                          onChange={() => handleToggles(`dead`)}
                        />
                        <HStack space={1} alignItems={'center'}>
                          <Text fontSize='16'>Dead</Text>
                          <IconButton
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
                        </HStack>
                      </HStack>
                      {existingMarks && existingMarks.length > 0 && (
                        <HStack space={2}>
                          <Checkbox
                            value='mark'
                            isChecked={markToggle}
                            shadow='3'
                            _checked={{
                              bg: 'primary',
                              borderColor: 'primary',
                            }}
                            size='md'
                            onChange={() => handleToggles('mark')}
                          />
                          <Text fontSize='16'>Marked</Text>
                        </HStack>
                      )}
                      {fishConditions.length > 0 &&
                        fishConditions.map(
                          (condition: string, index: number) => (
                            <HStack space={2}>
                              <Checkbox
                                value={`FC${index + 1}`}
                                shadow='3'
                                _checked={{
                                  bg: 'primary',
                                  borderColor: 'primary',
                                }}
                                size='md'
                                isChecked={
                                  index + 1 === 1
                                    ? FC1Toggle
                                    : index + 1 === 2
                                    ? FC2Toggle
                                    : FC3Toggle
                                }
                                onChange={() => handleToggles(`FC${index + 1}`)}
                              />
                              <Text fontSize='16'>{`${
                                index + 1
                              }. ${condition}`}</Text>
                            </HStack>
                          )
                        )}
                    </HStack>
                  </HStack>
                </Box>
                {species === 'Chinook salmon' && (
                  <Box px='2%'>
                    <Divider mb='1%' />
                    <Text bold mb={2}>
                      Life Stage:
                    </Text>
                    <HStack space={4} alignItems='center'>
                      <RadioGroup
                        // name='lifeStageRadioGroup'
                        value={lifeStageRadioValue}
                        onChange={nextValue => {
                          setLifeStageRadioValue(nextValue)
                        }}
                      >
                        <HStack
                          // direction={{
                          //   base: 'column',
                          //   md: 'row',
                          // }}
                          // alignItems={{
                          //   base: 'flex-start',
                          //   md: 'center',
                          // }}
                          space={10}
                          // w='75%'
                          // maxW='300px'
                        >
                          <Radio value='Yolk Sac Fry'>
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel selectionColor='primary' size='lg'>
                              Yolk Sac Fry
                            </RadioLabel>
                          </Radio>
                          <Radio
                            // colorScheme='primary'
                            value='Fry'
                            // my={1}
                            // _icon={{ color: 'primary' }}
                          >
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Fry</RadioLabel>
                          </Radio>
                          <Radio
                            // colorScheme='primary'
                            value='Parr'
                            // my={1}
                            // _icon={{ color: 'primary' }}
                          >
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Parr</RadioLabel>
                          </Radio>
                          <Radio
                            // colorScheme='primary'
                            value='Silvery Parr'
                            // my={1}
                            // _icon={{ color: 'primary' }}
                          >
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Silvery Parr</RadioLabel>
                          </Radio>
                          <Radio
                            // colorScheme='primary'
                            value='Smolt'
                            // my={1}
                            // _icon={{ color: 'primary' }}
                          >
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Smolt</RadioLabel>
                          </Radio>
                        </HStack>
                      </RadioGroup>
                    </HStack>
                    <Divider mt='1%' />
                  </Box>
                )}

                <VStack alignItems='center' justifyContent='center'>
                  <Heading size='sm' pb='2%'>
                    {showTable
                      ? 'Record count for each fork length: '
                      : 'Select size range for fork length buttons: '}
                  </Heading>
                  <ForkLengthButtonGroup
                    setFirstButton={setFirstButton}
                    setLifeStageRadioValue={setLifeStageRadioValue}
                    setNumberOfAdditionalButtons={setNumberOfAdditionalButtons}
                    selectedProgramObj={selectedProgramObj}
                  />
                </VStack>
                <BatchCountButtonGrid
                  firstButton={firstButton}
                  numberOfAdditionalButtons={numberOfAdditionalButtons}
                  selectedLifeStage={lifeStageRadioValue}
                  ignoreLifeStage={species !== 'Chinook salmon'}
                  deadToggle={deadToggle}
                  markToggle={markToggle}
                  fishConditions={[FC1Toggle, FC2Toggle, FC3Toggle]
                    .map((toggle, index) =>
                      toggle ? fishConditions[index] : null
                    )
                    .filter(condition => condition !== null)}
                  handleToggles={handleToggles}
                  trapOperationsStore={trapOperationsStore}
                  dropdownsStore={dropdownsStore}
                  activeTabId={tabSlice.activeTabId}
                  species={species}
                  selectedProgramObj={route?.params?.selectedProgramObj}
                />
                {species !== 'Chinook salmon' && <View mb='65'></View>}
              </>

              <HStack
                px='2%'
                justifyContent='space-between'
                borderTopWidth={1}
                borderColor={'gray.300'}
                pt={5}
              >
                <Button
                  bg={'transparent'}
                  onPress={() => handlePressRemoveFish()}
                  isDisabled={calculateTotalCount() === 0}
                >
                  <Text fontSize='lg' bold color='error'>
                    Remove Last Fish
                  </Text>
                </Button>
                <Button
                  bg={'transparent'}
                  onPress={() => setBatchCharacteristicsModalOpen(true)}
                >
                  <Text fontSize='lg' bold color='primary'>
                    Update Batch Characteristics
                  </Text>
                </Button>

                <Button
                  bg='transparent'
                  borderColor='primary'
                  borderWidth={1}
                  onPress={handlePressSaveAndStartNewBatchCount}
                >
                  <Text fontSize='lg' bold color='primary'>
                    Save & Start New
                  </Text>
                </Button>
                <Button bg='primary' onPress={handlePressSaveBatchCount}>
                  <Text fontSize='lg' bold color='white'>
                    Save & Exit
                  </Text>
                </Button>
              </HStack>
            </VStack>
          </Pressable>
        </View>
      </ScrollView>
      {/* --------- Modals --------- */}
      {batchCharacteristicsModalOpen && (
        <CustomModal
          isOpen={batchCharacteristicsModalOpen}
          closeModal={() => setBatchCharacteristicsModalOpen(false)}
          height='100%'
        >
          <BatchCharacteristicsModalContent
            closeModal={() => setBatchCharacteristicsModalOpen(false)}
          />
        </CustomModal>
      )}

      {showTableModal && (
        <BatchCountTableModal
          showTableModal={showTableModal}
          setShowTableModal={setShowTableModal}
          modalInitialData={modalInitialData}
        />
      )}
      {fishMeasureMetModalOpen && (
        <CustomModal
          isOpen={fishMeasureMetModalOpen}
          closeModal={closeFishMeasureMetModal}
          height='40%'
          width={'80%'}
        >
          <MeasureMetPlusCount
            species={{ value: species }}
            closeModal={closeFishMeasureMetModal}
            activeTabId={tabSlice.activeTabId}
            protocolKeyMet={protocolKeyMet}
            lifeStageValue={''}
            runValue={''}
            onSaveCallback={handlePressSaveBatchCount}
          />
        </CustomModal>
      )}
    </>
  ) : (
    <></>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
    trapOperationsStore: state.trapOperations,
    dropdownsStore: state.dropdowns,
    selectedProgramId:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.programId,
    visitSetupDefaults: state.visitSetupDefaults,
    fishInputSlice: state.fishInput,
  }
}
export default connect(mapStateToProps)(BatchCount)
