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
import { find, keyBy } from 'lodash'
import {
  calculateLastFish,
  checkFishMeasureProtocol,
  calculateLifeStage,
} from '../../utils/utils'
import FishEntriesSummary from '../../components/form/FishEntriesSummary'
import MeasureMetPlusCount from '../../components/form/MeasureMetPlusCount'
import {
  findLengthAtDateRun,
  findRunDefinition,
} from '../../utils/helpers/helperFunctions'

const BatchCount = ({
  route,
  tabSlice,
  batchCountStore,
  trapOperationsStore,
  dropdownsStore,
  selectedProgramId,
  visitSetupDefaults,
  fishInputSlice,
  visitSetupState,
}: {
  route: any
  tabSlice: TabStateI
  batchCountStore: any
  trapOperationsStore: any
  dropdownsStore: any
  selectedProgramId: number | null
  visitSetupDefaults: any
  fishInputSlice: any
  visitSetupState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

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
  const [miltingIsLocked, setMiltingIsLocked] = useState(false as boolean)
  const [miltingToggle, setMiltingToggle] = useState(false as boolean | null)
  const [eggsIsLocked, setEggsIsLocked] = useState(false as boolean)
  const [eggsToggle, setEggsToggle] = useState(false as boolean | null)
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
  const [programFormFieldsObj, setProgramFormFieldsObj] = useState(
    {} as Record<string, any>
  )
  const [protocolKeyMetRun, setProtocolKeyMetRun] = useState('' as string)
  const [protocolKeyMetLifeStage, setProtocolKeyMetLifeStage] = useState(
    '' as string
  )

  const [lengthAtDateModel, setLengthAtDateModel] = useState([] as number[])
  const [programLADModelName, setProgramLADModelName] = useState<string | null>(
    null
  )
  const [ladObject, setLadObject] = useState<any>(null)

  useEffect(() => {
    setLengthAtDateModel(dropdownsStore.values.lengthAtDateRiver)
  }, [dropdownsStore.values])

  useEffect(() => {
    const selectedProgramObj = route?.params?.selectedProgramObj
    const programLadModelName = selectedProgramObj?.ladModel
      ? selectedProgramObj?.ladModel.toLowerCase()
      : null
    setProgramLADModelName(programLadModelName)
    if (programLadModelName === 'river') {
      setLengthAtDateModel(dropdownsStore.values.lengthAtDateRiver)
    } else if (programLadModelName === 'delta') {
      setLengthAtDateModel(dropdownsStore.values.lengthAtDateDelta)
    }
  }, [dropdownsStore.values])

  useEffect(() => {
    if (lengthAtDateModel && tabSlice.activeTabId) {
      let dateTimeValue = new Date()

      const activeTabId = tabSlice.activeTabId

      if (
        activeTabId &&
        trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
      ) {
        dateTimeValue =
          trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
      } else if (
        activeTabId &&
        trapOperationsStore?.[activeTabId]?.values?.trapVisitStartTime
      ) {
        dateTimeValue =
          trapOperationsStore?.[activeTabId]?.values?.trapVisitStartTime
      }
      const ladObjectForTrapDate = findLengthAtDateRun(
        lengthAtDateModel,
        dateTimeValue
      )

      setLadObject(ladObjectForTrapDate)
    } else {
      setLadObject(null)
    }
  }, [lengthAtDateModel, tabSlice.activeTabId])

  const { tabId, batchCharacteristics, forkLengths } = batchCountStore
  const { species, fishConditions, existingMarks, taxonCode } =
    batchCharacteristics

  const [selectedProgramObj, setSelectedProgramObj] = useState({} as any)

  useEffect(() => {
    const currentProgramInfo = find(
      visitSetupDefaults.programs,
      (program: any) => program.id === selectedProgramId
    )
    setSelectedProgramObj(currentProgramInfo)
  }, [visitSetupDefaults.programs, selectedProgramId])

  useEffect(() => {
    const currentProgramInfo = find(
      visitSetupDefaults.programs,
      (program: any) => program.id === selectedProgramId
    )

    if (!currentProgramInfo) return

    const formFieldsLookup = keyBy(
      currentProgramInfo?.programFormFields,
      'fieldName'
    )
    setProgramFormFieldsObj(formFieldsLookup)

    // if (formFieldsLookup?.['eggs']) {
    //   console.log('set to false')
    //   setEggsToggle(false)
    // } else {
    //   setEggsToggle(null)
    // }
    // if (formFieldsLookup?.['milting']) {
    //   setMiltingToggle(false)
    // } else {
    //   setMiltingToggle(null)
    // }
  }, [visitSetupState, visitSetupDefaults])

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
        params: {
          fishMeasureProtocol: route.params?.fishMeasureProtocol,
          selectedProgramObj: route.params?.selectedProgramObj,
        },
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
      params: {
        fishMeasureProtocol: route.params?.fishMeasureProtocol,
        selectedProgramObj: route.params?.selectedProgramObj,
      },
    })

    dispatch(resetBatchCountSlice())
    closeFishMeasureMetModal()
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
      case 'milting':
        if (miltingIsLocked) return
        // if (miltingToggle === null) return
        setMiltingToggle(!miltingToggle)
        break
      case 'eggs':
        if (eggsIsLocked) return
        // if (eggsToggle === null) return
        setEggsToggle(!eggsToggle)
        break

      default:
        setMarkToggle(false)
        setFC1Toggle(false)
        setFC2Toggle(false)
        setFC3Toggle(false)
        if (deadIsLocked) return
        setDeadToggle(false)
        if (miltingIsLocked) return
        setMiltingToggle(false)
        if (eggsIsLocked) return
        setEggsToggle(false)
        break
    }
  }

  const handlePressLockDead = () => {
    setDeadIsLocked(!deadIsLocked)
  }
  const handlePressLockMilting = () => {
    setMiltingIsLocked(!miltingIsLocked)
  }
  const handlePressLockEggs = () => {
    setEggsIsLocked(!eggsIsLocked)
  }

  useEffect(() => {
    if (currentRoute?.name !== 'Batch Count') {
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      return
    }
    if (!tabSlice?.activeTabId || !fishInputSlice) {
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      return
    }

    if (batchCharacteristicsModalOpen) {
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      return
    }
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
    const lastFish = calculateLastFish(batchCountStore.forkLengths)

    let lastFishRunValue = ''
    let lastFishLifeStageValue = ''
    if (lastFish && species === 'Chinook salmon' && ladObject) {
      const run = findRunDefinition(ladObject, lastFish?.forkLength)
      lastFishRunValue = run || ''
      const lifeStage = calculateLifeStage(Number(lastFish?.forkLength))
      lastFishLifeStageValue = lifeStage || ''
    }

    const protocolResult = checkFishMeasureProtocol({
      fishMeasureCounts: combinedFishMeasureCountsObj,
      fishMeasureProtocol: route.params?.fishMeasureProtocol,
      speciesValue: species as string,
      runValue: lastFishRunValue,
      lifeStageValue: lastFishLifeStageValue,
    })

    if (protocolResult && protocolResult.protocolMet) {
      setFishMeasureMetModalOpen(true)
    } else {
      setFishMeasureMetModalOpen(false)
    }

    if (protocolResult && protocolResult.protocolKeyMet) {
      setProtocolKeyMet(protocolResult.protocolKeyMet)
      setProtocolKeyMetRun(lastFishRunValue || '')
      setProtocolKeyMetLifeStage(lastFishLifeStageValue || '')
    } else {
      setProtocolKeyMet(null)
      setProtocolKeyMetRun('')
      setProtocolKeyMetLifeStage('')
    }
  }, [
    tabSlice.activeTabId,
    fishInputSlice,
    batchCountStore?.batchCharacteristics?.species,
    batchCountStore.forkLengths,
  ])

  const closeFishMeasureMetModal = () => {
    setFishMeasureMetModalOpen(false)
    setProtocolKeyMet(null)
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
                    ? `Batch Count - ${
                        tabSlice.tabs[tabSlice.activeTabId].name
                      }`
                    : 'Batch Count'
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
                    lastFishEntry={
                      Object.keys(batchCountStore.forkLengths).length
                        ? {
                            ...calculateLastFish(batchCountStore.forkLengths),
                            species:
                              batchCountStore.batchCharacteristics.species,
                          }
                        : {}
                    }
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
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
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
                        {programFormFieldsObj?.['milting'] && (
                          <HStack space={2} alignItems={'center'}>
                            <Checkbox
                              value='milting'
                              isChecked={miltingToggle || false}
                              shadow='3'
                              _checked={{
                                bg: 'primary',
                                borderColor: 'primary',
                              }}
                              size='md'
                              isDisabled={miltingIsLocked}
                              onChange={() => handleToggles(`milting`)}
                            />
                            <HStack space={1} alignItems={'center'}>
                              <Text fontSize='16'>Milting</Text>
                              <IconButton
                                onPress={() => handlePressLockMilting()}
                                icon={
                                  <Icon
                                    as={FontAwesome}
                                    name={miltingIsLocked ? 'lock' : 'unlock'}
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
                        )}
                        {programFormFieldsObj?.['eggs'] && (
                          <HStack space={2} alignItems={'center'}>
                            <Checkbox
                              value='eggs'
                              isChecked={eggsToggle || false}
                              shadow='3'
                              _checked={{
                                bg: 'primary',
                                borderColor: 'primary',
                              }}
                              size='md'
                              isDisabled={eggsIsLocked}
                              onChange={() => handleToggles(`eggs`)}
                            />
                            <HStack space={1} alignItems={'center'}>
                              <Text fontSize='16'>Eggs</Text>
                              <IconButton
                                onPress={() => handlePressLockEggs()}
                                icon={
                                  <Icon
                                    as={FontAwesome}
                                    name={eggsIsLocked ? 'lock' : 'unlock'}
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
                        )}
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
                                  onChange={() =>
                                    handleToggles(`FC${index + 1}`)
                                  }
                                />
                                <Text fontSize='16'>{`${
                                  index + 1
                                }. ${condition}`}</Text>
                              </HStack>
                            )
                          )}
                      </HStack>
                    </HStack>
                  </ScrollView>
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
                  miltingToggle={
                    programFormFieldsObj?.['milting'] ? miltingToggle : null
                  }
                  eggsToggle={
                    programFormFieldsObj?.['eggs'] ? eggsToggle : null
                  }
                  fishConditions={[FC1Toggle, FC2Toggle, FC3Toggle]
                    .map((toggle, index) =>
                      toggle ? fishConditions[index] : null
                    )
                    .filter(condition => condition !== null)}
                  handleToggles={handleToggles}
                  activeTabId={tabSlice.activeTabId}
                  species={species}
                  ladObject={ladObject}
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
          lifeStageValue={protocolKeyMetLifeStage}
          runValue={protocolKeyMetRun}
          onSaveCallback={handlePressSaveBatchCount}
          dropdownValues={dropdownsStore.values}
        />
      </CustomModal>
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
    visitSetupState: state.visitSetup,
  }
}
export default connect(mapStateToProps)(BatchCount)
