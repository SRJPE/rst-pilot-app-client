import { CircleIcon } from '@/components/ui/icon'
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio'
import BatchCountButtonGrid from '@/src/components/form/batchCount/BatchCountButtonGrid'
import BatchCountTableModal from '@/src/components/form/batchCount/BatchCountTableModal'
import ForkLengthButtonGroup from '@/src/components/form/batchCount/ForkLengthButtonGroup'
import MultiSpeciesBatchChart from '@/src/components/form/batchCount/MultiSpeciesBatchChart'
import FishEntriesSummary from '@/src/components/form/FishEntriesSummary'
import MeasureMetPlusCount from '@/src/components/form/MeasureMetPlusCount'
import MultiSpeciesModalContent from '@/src/components/form/MultiSpeciesModalContent'
import CustomModal from '@/src/components/Shared/CustomModal'
import CustomModalHeader from '@/src/components/Shared/CustomModalHeader'
import {
  removeLastForkLengthEntered,
  resetBatchCountSlice,
} from '@/src/redux/reducers/formSlices/batchCountSlice'
import {
  getFishMeasureCounts,
  saveBatchCount,
  savePlusCount,
} from '@/src/redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '@/src/redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '@/src/redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import {
  calculateLastFish,
  checkFishMeasureProtocol,
  findTaxonCode,
  reorderTaxon,
} from '@/src/utils/utils'
import { FontAwesome } from '@expo/vector-icons'
import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native'
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
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Keyboard } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { getLadObject } from '../../utils/helpers/helperFunctions'
import ToggleLockButton from '@/src/components/Shared/ToggleLockButton'
import { find, keyBy } from 'lodash'

const MultiSpecies = ({
  route,
  tabSlice,
  batchCountStore,
  trapOperationsStore,
  dropdownsStore,
  fishInputSlice,
  visitSetupDefaults,
  selectedProgramId,
  visitSetupState,
}: {
  route: any
  tabSlice: TabStateI
  batchCountStore: any
  trapOperationsStore: any
  dropdownsStore: any
  fishInputSlice: any
  visitSetupDefaults: any
  selectedProgramId: number | null
  visitSetupState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()
  const [firstButton, setFirstButton] = useState<number>(0)
  const [tabIndex, setTabIndex] = React.useState<number>(0)

  const [numberOfAdditionalButtons, setNumberOfAdditionalButtons] = useState(
    0 as number
  )
  const [showTableModal, setShowTableModal] = useState(false as boolean)
  const [showTable, setShowTable] = useState(false as boolean)
  const [lifeStageRadioValue, setLifeStageRadioValue] = useState('' as string)
  const [speciesRadioValue, setSpeciesRadioValue] = useState<string>('')

  const [multiSpeciesModalOpen, setMultiSpeciesModalOpen] = useState(
    true as boolean
  )
  const [modalInitialData, setModalInitialData] = useState({
    forkLength: '',
    count: '',
  } as any)

  const [deadIsLocked, setDeadIsLocked] = useState(false as boolean)
  const [deadToggle, setDeadToggle] = useState(false as boolean)
  const [markToggle, setMarkToggle] = useState(false as boolean)
  const [miltingIsLocked, setMiltingIsLocked] = useState(false as boolean)
  const [miltingToggle, setMiltingToggle] = useState(false as boolean)
  const [eggsIsLocked, setEggsIsLocked] = useState(false as boolean)
  const [eggsToggle, setEggsToggle] = useState(false as boolean)
  const [adiposeClippedToggle, setAdiposeClippedToggle] = useState(
    false as boolean
  )
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
  const [showAddPlusCountButton, setShowAddPlusCountButton] =
    useState<boolean>(false)
  const [programFormFieldsObj, setProgramFormFieldsObj] = useState(
    {} as Record<string, any>
  )
  const [protocolKeyMet, setProtocolKeyMet] = useState(null as string | null)
  const [protocolKeyMetRun, setProtocolKeyMetRun] = useState('' as string)
  const [protocolKeyMetLifeStage, setProtocolKeyMetLifeStage] = useState(
    '' as string
  )

  const [lengthAtDateModel, setLengthAtDateModel] = useState([] as number[])
  const [programLADModelName, setProgramLADModelName] = useState<string | null>(
    null
  )
  const [ladObject, setLadObject] = useState<any>(null)

  const isFocused = useIsFocused()

  const reorderedTaxon = reorderTaxon(dropdownsStore.values.taxon)

  const { tabId, batchCharacteristics, forkLengths } = batchCountStore
  const { multiSpecies, fishConditions, existingMarks, adiposeClipped } =
    batchCharacteristics

  useEffect(() => {
    if (!isFocused) {
      console.log('🧹 Screen blurred — clearing form')
      setFishMeasureMetModalOpen(false)
      setProtocolKeyMet(null)
      setProtocolKeyMetRun('')
      setProtocolKeyMetLifeStage('')
      setSpeciesRadioValue('')
      setLifeStageRadioValue('')
    }
  }, [isFocused])

  useEffect(() => {
    const defaultSpeciesRadioValue =
      batchCountStore.batchCharacteristics?.multiSpecies?.[0]

    setSpeciesRadioValue(defaultSpeciesRadioValue || '')
  }, [batchCountStore.batchCharacteristics?.multiSpecies[0]])

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
  }, [visitSetupDefaults])

  useEffect(() => {
    if (tabSlice.activeTabId) {
      const ladObjectForTrapDate = getLadObject({
        activeTabId: tabSlice.activeTabId,
        trapOperationsStore,
        lengthAtDateModel,
      })
      setLadObject(ladObjectForTrapDate)
    } else {
      setLadObject(null)
    }
  }, [lengthAtDateModel, tabSlice.activeTabId])

  const handlePressRemoveFish = () => {
    dispatch(removeLastForkLengthEntered())
  }

  const handlePressSaveBatchCount = () => {
    if (tabId) {
      const forkLengthsArray = Object.values(batchCountStore.forkLengths)

      const groupedForkLengths = {
        individualFish: forkLengthsArray.filter(
          (flObj: any) => flObj.forkLength && !flObj.plusCount
        ),
        plusCounts: forkLengthsArray.filter(
          (flObj: any) => flObj.numFishCaught && flObj.plusCount
        ),
      }

      const formattedForkLengths = groupedForkLengths.individualFish.reduce<
        Record<any, unknown>
      >((acc, item, idx) => {
        acc[idx] = item

        return acc
      }, {} as Record<number, string>)

      const batchCountData = {
        tabId,
        batchCharacteristics,
        forkLengths: formattedForkLengths,
      }

      const plusCountData = groupedForkLengths.plusCounts

      dispatch(saveBatchCount(batchCountData))

      if (plusCountData.length > 0) {
        plusCountData.forEach((plusCountObj: any) => {
          dispatch(savePlusCount(plusCountObj))
        })
      }

      dispatch(resetBatchCountSlice())
      showSlideAlert(dispatch, 'Multi Species Batch Count Saved')

      // @ts-ignore
      navigation.replace('Fish Input')
    }
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
        if (deadIsLocked) break
        setDeadToggle(!deadToggle)
        break
      case 'mark':
        setMarkToggle(!markToggle)
        break
      case 'adiposeClipped':
        setAdiposeClippedToggle(!adiposeClippedToggle)
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

        setMiltingToggle(!miltingToggle)
        break
      case 'eggs':
        if (eggsIsLocked) return

        setEggsToggle(!eggsToggle)
        break

      default:
        setMarkToggle(false)
        setEggsToggle(false)
        setMiltingToggle(false)
        setFC1Toggle(false)
        setFC2Toggle(false)
        setFC3Toggle(false)
        setAdiposeClippedToggle(false)
        if (deadIsLocked) break
        setDeadToggle(false)
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

  const navState = navigation?.getState()
  const currentRoute = navState?.routes[navState?.index]
  useFocusEffect(
    useCallback(() => {
      // Early exits
      if (
        currentRoute?.name !== 'Multi Species' ||
        !tabSlice?.activeTabId ||
        !fishInputSlice ||
        multiSpeciesModalOpen
      ) {
        setFishMeasureMetModalOpen(false)
        setProtocolKeyMet(null)
        return
      }

      // Build batch store (memoized outside)
      const batchCountFishStore = Object.values(
        batchCountStore?.forkLengths || {}
      ).map((flObj: any) => ({
        forkLength: flObj.forkLength,
        run: flObj?.runDefinition,
        lifeStage: flObj?.lifeStage?.toLowerCase(),
        species: flObj?.species,
        numFishCaught: flObj?.numFishCaught || 1,
        plusCount: flObj?.plusCount || false,
      }))

      const existingFishStore =
        fishInputSlice[tabSlice.activeTabId]?.fishStore ?? {}
      const combinedFishStoreObj: Record<string, any> = { ...existingFishStore }

      let total = Object.values(existingFishStore).reduce(
        (sum, fishObj) => sum + ((fishObj as any).numFishCaught || 0),
        0
      ) as number

      let nextIndex = Object.keys(combinedFishStoreObj).length
      batchCountFishStore.forEach(fish => {
        combinedFishStoreObj[nextIndex++] = fish
        total += fish.numFishCaught || 0
      })

      setTotalCatchCount(total)

      const combinedFishMeasureCountsObj =
        getFishMeasureCounts(combinedFishStoreObj)
      setCombinedFishMeasureCounts(combinedFishMeasureCountsObj)

      const plusCountExists = batchCountFishStore.some(
        fishObj => fishObj.species === speciesRadioValue && fishObj.plusCount
      )

      const protocolResult = checkFishMeasureProtocol({
        fishMeasureCounts: combinedFishMeasureCountsObj,
        fishMeasureProtocol: route.params?.fishMeasureProtocol,
        speciesValue: speciesRadioValue,
        runValue: '',
        lifeStageValue: '',
      })

      if (protocolResult?.protocolMet) {
        setShowAddPlusCountButton(true)
        if (!plusCountExists) setFishMeasureMetModalOpen(true)
      } else {
        setShowAddPlusCountButton(false)
        setFishMeasureMetModalOpen(false)
      }

      setProtocolKeyMet(protocolResult?.protocolKeyMet ?? null)
    }, [
      tabSlice.activeTabId,
      speciesRadioValue,
      batchCountStore.forkLengths,
      currentRoute?.name,
      multiSpeciesModalOpen,
      fishInputSlice,
      route.params?.fishMeasureProtocol,
    ])
  )

  const handleAddPlusCountClick = () => {
    setFishMeasureMetModalOpen(true)
    if (tabSlice?.activeTabId && speciesRadioValue) {
      // Build batch store (memoized outside)
      const batchCountFishStore = Object.values(
        batchCountStore?.forkLengths || {}
      ).map((flObj: any) => ({
        forkLength: flObj.forkLength,
        run: flObj?.runDefinition,
        lifeStage: flObj?.lifeStage?.toLowerCase(),
        species: flObj?.species,
        numFishCaught: flObj?.numFishCaught || 1,
        plusCount: flObj?.plusCount || false,
      }))

      const existingFishStore =
        fishInputSlice[tabSlice.activeTabId]?.fishStore ?? {}
      const combinedFishStoreObj: Record<string, any> = { ...existingFishStore }

      let total = Object.values(existingFishStore).reduce(
        (sum, fishObj) => sum + ((fishObj as any).numFishCaught || 0),
        0
      ) as number

      let nextIndex = Object.keys(combinedFishStoreObj).length
      batchCountFishStore.forEach(fish => {
        combinedFishStoreObj[nextIndex++] = fish
        total += fish.numFishCaught || 0
      })
      const combinedFishMeasureCountsObj =
        getFishMeasureCounts(combinedFishStoreObj)
      setCombinedFishMeasureCounts(combinedFishMeasureCountsObj)
      const protocolResult = checkFishMeasureProtocol({
        fishMeasureCounts: combinedFishMeasureCountsObj,
        fishMeasureProtocol: route.params?.fishMeasureProtocol,
        speciesValue: speciesRadioValue,
        runValue: '',
        lifeStageValue: '',
      })

      if (protocolResult?.protocolMet) {
        setShowAddPlusCountButton(true)
      } else {
        setShowAddPlusCountButton(false)
        setFishMeasureMetModalOpen(false)
      }

      setProtocolKeyMet(protocolResult?.protocolKeyMet ?? null)
    }
  }

  const closeFishMeasureMetModal = () => {
    setFishMeasureMetModalOpen(false)
    setProtocolKeyMet(null)
  }

  const currentSpeciesFishMeasureProtocol =
    route.params?.fishMeasureProtocol[speciesRadioValue]

  const showMiltingToggle =
    programFormFieldsObj?.['milting'] &&
    !speciesRadioValue.toLocaleLowerCase().includes('shrimp')

  const showEggsToggle =
    programFormFieldsObj?.['eggs'] &&
    speciesRadioValue.toLocaleLowerCase().includes('shrimp')

  if (!isFocused) {
    return null
  }

  return currentRoute?.name === 'Multi Species' ? (
    <>
      <ScrollView
        scrollEnabled
        flex={1}
        bg='#fff'
        borderWidth='10'
        borderColor='themeGrey'
      >
        <View style={{ paddingBottom: 50 }}>
          <Pressable onPress={Keyboard.dismiss}>
            <HStack space={10}>
              <CustomModalHeader
                closeModal={() => dispatch(resetBatchCountSlice())}
                headerText={
                  tabSlice.activeTabId
                    ? `Multi Species Entry - ${
                        tabSlice.tabs[tabSlice.activeTabId].name
                      }`
                    : 'Multi Species Entry'
                }
                showConfirmationModal={true}
                showHeaderButton={true}
                navigateBack={true}
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
                      species: speciesRadioValue,
                      ...calculateLastFish(batchCountStore.forkLengths),
                    }}
                    totalCatchCount={totalCatchCount}
                    fishMeasureProtocol={
                      route.params?.fishMeasureProtocol || {}
                    }
                    fishMeasureCounts={combinedFishMeasureCounts}
                    showSpeciesCounts={false}
                  />
                </Box>
              )}

            <MultiSpeciesBatchChart
              tabIndex={tabIndex}
              setTabIndex={setTabIndex}
              speciesRadioValue={speciesRadioValue}
              setSpeciesRadioValue={setSpeciesRadioValue}
              fishMeasureCounts={combinedFishMeasureCounts}
            />
            <VStack space={3}>
              <>
                <Box px='2%'>
                  <Divider mb='1%' />
                  <Text bold mb={2}>
                    Species:
                  </Text>
                  <VStack>
                    <RadioGroup
                      value={speciesRadioValue}
                      onChange={nextValue => {
                        setSpeciesRadioValue(nextValue)
                      }}
                    >
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 25,
                        }}
                      >
                        {multiSpecies?.map((spec: string, index: number) => (
                          <Radio value={spec} key={index}>
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <Text selectionColor='' fontSize='15'>
                              {spec}
                            </Text>
                          </Radio>
                        ))}
                      </Box>
                    </RadioGroup>
                  </VStack>
                  <Divider mt='1%' />
                </Box>

                <Box px='2%'>
                  <Text bold mb={2}>
                    Fish Conditions:
                  </Text>
                  <HStack space={3} alignItems='center'>
                    <HStack alignItems='center' space={4}>
                      <HStack space={1} alignItems={'center'}>
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
                          mr={1}
                        />
                        <Text fontSize='16'>Dead</Text>
                        <ToggleLockButton
                          isLocked={deadIsLocked}
                          onPress={handlePressLockDead}
                        />
                      </HStack>
                      {showMiltingToggle && (
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
                            <ToggleLockButton
                              isLocked={miltingIsLocked}
                              onPress={handlePressLockMilting}
                            />
                          </HStack>
                        </HStack>
                      )}
                      {showEggsToggle && (
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
                            <ToggleLockButton
                              isLocked={eggsIsLocked}
                              onPress={handlePressLockEggs}
                            />
                          </HStack>
                        </HStack>
                      )}

                      <HStack space={2}>
                        <Checkbox
                          value='mark'
                          isChecked={adiposeClippedToggle}
                          shadow='3'
                          _checked={{
                            bg: 'primary',
                            borderColor: 'primary',
                          }}
                          size='md'
                          onChange={() => handleToggles('adiposeClipped')}
                        />
                        <Text fontSize='16'>Adipose Clipped</Text>
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

                {speciesRadioValue === 'Chinook salmon' && (
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
                        <HStack space={10}>
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
                          <Radio value='Fry'>
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Fry</RadioLabel>
                          </Radio>
                          <Radio value='Parr'>
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Parr</RadioLabel>
                          </Radio>
                          <Radio value='Silvery Parr'>
                            <RadioIndicator style={{ width: 25, height: 25 }}>
                              <RadioIcon
                                as={CircleIcon}
                                style={{ width: 15, height: 15 }}
                              />
                            </RadioIndicator>
                            <RadioLabel>Silvery Parr</RadioLabel>
                          </Radio>
                          <Radio value='Smolt'>
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

                {showAddPlusCountButton ? (
                  <>
                    <Divider mb='1%' />

                    <Button
                      leftIcon={<Icon as={FontAwesome} name={'plus'} />}
                      background='primary'
                      mr='auto'
                      px={5}
                      onPress={handleAddPlusCountClick}
                    >
                      <Text color='white' fontSize={18}>
                        Add Plus Count
                      </Text>
                    </Button>
                  </>
                ) : (
                  <>
                    <VStack alignItems='center' justifyContent='center'>
                      <Heading size='sm' pb='2%'>
                        {showTable
                          ? 'Record count for each fork length: '
                          : 'Select size range for fork length buttons: '}
                      </Heading>
                      <ForkLengthButtonGroup
                        setFirstButton={setFirstButton}
                        setLifeStageRadioValue={setLifeStageRadioValue}
                        setNumberOfAdditionalButtons={
                          setNumberOfAdditionalButtons
                        }
                        selectedProgramObj={route?.params?.selectedProgramObj}
                        disabled={speciesRadioValue === ''}
                      />
                    </VStack>
                    <BatchCountButtonGrid
                      firstButton={firstButton}
                      numberOfAdditionalButtons={numberOfAdditionalButtons}
                      selectedLifeStage={lifeStageRadioValue}
                      ignoreLifeStage={speciesRadioValue !== 'Chinook salmon'}
                      deadToggle={deadToggle}
                      markToggle={markToggle}
                      adiposeClippedToggle={adiposeClippedToggle}
                      fishConditions={[FC1Toggle, FC2Toggle, FC3Toggle]
                        .map((toggle, index) =>
                          toggle ? fishConditions[index] : null
                        )
                        .filter(condition => condition !== null)}
                      handleToggles={handleToggles}
                      activeTabId={tabSlice.activeTabId}
                      species={speciesRadioValue}
                      taxonCode={findTaxonCode(
                        speciesRadioValue,
                        reorderedTaxon
                      )}
                      ladObject={ladObject}
                      miltingToggle={miltingToggle}
                      eggsToggle={eggsToggle}
                      visitSetupState={visitSetupState}
                    />
                  </>
                )}
                {speciesRadioValue !== 'Chinook salmon' && (
                  <View mb='65'></View>
                )}
              </>

              <HStack
                px='2%'
                justifyContent='space-between'
                borderTopWidth={1}
                borderColor={'gray.300'}
                pt={5}
              >
                <Button
                  flex={1}
                  bg={'transparent'}
                  onPress={() => handlePressRemoveFish()}
                  isDisabled={calculateTotalCount() === 0}
                >
                  <Text fontSize='lg' bold color='error'>
                    Remove Last Fish
                  </Text>
                </Button>
                <Button
                  flex={2}
                  bg={'transparent'}
                  onPress={() => setMultiSpeciesModalOpen(true)}
                >
                  <Text fontSize='lg' bold color='primary'>
                    Update Batch Characteristics
                  </Text>
                </Button>

                <Button
                  flex={1}
                  bg='primary'
                  onPress={handlePressSaveBatchCount}
                >
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
      {multiSpeciesModalOpen && (
        <CustomModal
          isOpen={multiSpeciesModalOpen}
          closeModal={() => setMultiSpeciesModalOpen(false)}
          height='100%'
        >
          <MultiSpeciesModalContent
            closeModal={() => setMultiSpeciesModalOpen(false)}
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
          isOpen={
            fishMeasureMetModalOpen &&
            !!protocolKeyMet &&
            protocolKeyMet
              .toLowerCase()
              .includes(speciesRadioValue.toLowerCase())
          }
          closeModal={closeFishMeasureMetModal}
          height='40%'
          width={'80%'}
        >
          <MeasureMetPlusCount
            mode={'multiSpecies'}
            species={{ value: speciesRadioValue }}
            closeModal={closeFishMeasureMetModal}
            activeTabId={tabSlice.activeTabId}
            protocolKeyMet={protocolKeyMet}
            lifeStageValue={''}
            runValue={''}
            //TODO: Originally the function being walled was saveBatchCount. The plus count should be added to the batch count but not closed out.
            //? Does the plus count need to be editable after entry?
            onSaveCallback={closeFishMeasureMetModal}
            dropdownValues={dropdownsStore.values}
            multiSpecies={true}
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
    fishInputSlice: state.fishInput,
    visitSetupDefaults: state.visitSetupDefaults,
    selectedProgramId:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.programId,
    visitSetupState: state.visitSetup,
  }
}
export default connect(mapStateToProps)(MultiSpecies)
