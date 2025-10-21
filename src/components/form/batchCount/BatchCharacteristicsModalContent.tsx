import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { startCase } from 'lodash'
import {
  Button,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  addMarkToBatchCountExistingMarks,
  saveBatchCharacteristics,
} from '../../../redux/reducers/formSlices/batchCountSlice'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { batchCharacteristicsSchema } from '../../../utils/helpers/yupValidations'
import { ReleaseMarkI, Taxon } from '../../../utils/interfaces'
import {
  fetchRecentlyUsedSpecies,
  findTaxonCode,
  handleSpeciesSearchTextChange,
  reorderTaxon,
} from '../../../utils/utils'
import MarkBadgeList from '../../markRecapture/MarkBadgeList'
import AddAnotherMarkModalContent from '../../Shared/AddAnotherMarkModalContent'
import CustomModal from '../../Shared/CustomModal'
import CustomModalHeader from '../../Shared/CustomModalHeader'
import AddExistingMark from '../AddExistingMark'
import FishConditionsDropDown from '../FishConditionsDropDown'
import SpeciesDropDown from '../SpeciesDropDown'

const BatchCharacteristicsModalContent = ({
  closeModal,
  tabSlice,
  batchCountStore,
  visitSetupState,
  visitSetupDefaultsSlice,
}: {
  closeModal: any
  tabSlice: TabStateI
  batchCountStore: any
  visitSetupState: any
  visitSetupDefaultsSlice: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const tabId = tabSlice?.activeTabId || 'placeholderId'
  const activeProgramId = visitSetupState?.[tabId]?.values?.programId
  const currentProgramTaxon = dropdownValues?.programTaxonAbbreviation?.[
    activeProgramId
  ] as Taxon[]

  const defaultTaxonList = dropdownValues?.taxon

  const recentlyUsedSpecies = fetchRecentlyUsedSpecies({
    siteId: visitSetupState?.[tabId || 'placeholderId']?.values.trapLocationId,
    trapLocations: visitSetupDefaultsSlice.trapLocations,
  })

  const reorderedTaxon = useMemo(
    () => reorderTaxon(currentProgramTaxon || defaultTaxonList, true),
    [currentProgramTaxon, activeProgramId]
  )

  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)
  const [recentExistingMarks, setRecentExistingMarks] = useState<any[]>([])
  const [fishConditionDropdownOpen, setFishConditionDropdownOpen] = useState(
    false as boolean
  )
  const [fishConditionList, setFishConditionList] = useState<
    { label: string; value: string }[]
  >(
    dropdownValues.fishCondition.map((condition: any) => ({
      label: startCase(condition?.definition),
      value: condition?.definition,
    }))
  )
  const [speciesDropDownOpen, setSpeciesDropDownOpen] = useState(
    false as boolean
  )

  const defaultSpeciesList = [
    ...recentlyUsedSpecies,
    { label: 'All Species', value: 'allSpecies' },
    ...reorderedTaxon,
  ]
  const [speciesList, setSpeciesList] =
    useState<{ label: string; value: string }[]>(defaultSpeciesList)

  const onSpeciesOpen = useCallback(() => {
    setFishConditionDropdownOpen(false)
  }, [])
  const onFishConditionOpen = useCallback(() => {
    setSpeciesDropDownOpen(false)
  }, [])

  const navigation = useNavigation() as any

  const handleFormSubmit = (values: any) => {
    const selectedTaxonCode = findTaxonCode(
      values.species as string,
      reorderedTaxon
    )

    const formattedSpecies = values.species.includes('recent')
      ? values.species.split('_')[1]
      : values.species

    delete values.existingMarks
    delete values.batchCountExistingMarks
    let activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      if (recentExistingMarks.length === 1) {
        dispatch(
          saveBatchCharacteristics({
            ...values,
            species: formattedSpecies,
            taxonCode: selectedTaxonCode,
            tabId: activeTabId,
          })
        )
        dispatch(addMarkToBatchCountExistingMarks(recentExistingMarks[0]))

        showSlideAlert(dispatch, 'Batch characteristics')
      } else {
        dispatch(
          saveBatchCharacteristics({
            ...values,

            species: formattedSpecies,
            taxonCode: selectedTaxonCode,
            tabId: activeTabId,
          })
        )
        console.log('🚀 ~handleFormSubmit BatchCount Values: ', {
          ...values,
          tabId: activeTabId,
        })
        showSlideAlert(dispatch, 'Batch characteristics')
      }
    }
  }

  const handlePressRecentExistingMarkButton = (
    selectedRecentReleaseMark: ReleaseMarkI
  ) => {
    setRecentExistingMarks([selectedRecentReleaseMark])
  }

  return (
    <ScrollView>
      <Formik
        validationSchema={batchCharacteristicsSchema}
        initialValues={batchCountStore.batchCharacteristics}
        onSubmit={values => handleFormSubmit(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          touched,
          errors,
          values,
        }) => (
          <>
            <CustomModalHeader
              headerText={'Batch Characteristics'}
              showHeaderButton={false}
              closeModal={() => {
                closeModal()
                if (
                  !values.species &&
                  !batchCountStore.batchCharacteristics.species
                ) {
                  navigation.preload('Fish Input')
                  navigation.navigate('Trap Visit Form', {
                    screen: 'Fish Input',
                  })
                }
              }}
            />
            <VStack px='5%' space={4}>
              <Text justifyContent='center' fontSize='lg'>
                Please return to the individual fish input if you plan on
                marking or sampling a fish.
              </Text>
              <VStack space={4}>
                {/* //TODO: Add error logic for custom species dropdown */}
                {/* //TODO: Replace with Custom Select component */}
                <SpeciesDropDown
                  open={speciesDropDownOpen}
                  onOpen={onSpeciesOpen}
                  setOpen={setSpeciesDropDownOpen}
                  list={speciesList}
                  setList={setSpeciesList}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  onClose={() => {
                    setSpeciesList(defaultSpeciesList)
                  }}
                  onChangeSearchText={searchValue =>
                    handleSpeciesSearchTextChange({
                      reorderedTaxon,
                      searchValue,
                      setSpeciesList,
                      defaultSpeciesList,
                    })
                  }
                />
                <FormControl w='100%'>
                  <FormControl.Label>
                    <Text color='black' fontSize='md'>
                      Fish Condition (optional)
                    </Text>
                  </FormControl.Label>
                  {/* //TODO: Add error logic for custom fish conditions dropdown */}
                  <FishConditionsDropDown
                    open={fishConditionDropdownOpen}
                    onOpen={onFishConditionOpen}
                    setOpen={setFishConditionDropdownOpen}
                    list={fishConditionList}
                    setList={setFishConditionList}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                  />
                </FormControl>
              </VStack>
              <VStack space={4} w={'20%'}>
                <FormControl>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Adipose Clipped
                    </Text>
                  </FormControl.Label>
                  <Radio.Group
                    name='adiposeClipped'
                    accessibilityLabel='adipose clipped'
                    value={`${values.adiposeClipped}`}
                    onChange={(value: any) => {
                      if (value === 'true') {
                        setFieldValue('adiposeClipped', true)
                      } else {
                        setFieldValue('adiposeClipped', false)
                      }
                    }}
                  >
                    <Radio
                      colorScheme='primary'
                      value='true'
                      my={1}
                      _icon={{ color: 'primary' }}
                    >
                      True
                    </Radio>
                    <Radio
                      colorScheme='primary'
                      value='false'
                      my={1}
                      _icon={{ color: 'primary' }}
                    >
                      False
                    </Radio>
                  </Radio.Group>
                </FormControl>
              </VStack>
              <VStack space={4} w={'80%'}>
                {batchCountStore.batchCharacteristics.existingMarks.length <
                  1 && (
                  <AddExistingMark
                    dropdownValues={dropdownValues}
                    activeTabId={tabSlice.activeTabId}
                    recentExistingMarks={recentExistingMarks}
                    handlePressRecentExistingMarkButton={
                      handlePressRecentExistingMarkButton
                    }
                    visitSetupState={visitSetupState}
                  />
                )}
                <MarkBadgeList
                  badgeListContent={
                    batchCountStore.batchCharacteristics.existingMarks
                  }
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  field='batchCountExistingMarks'
                />
                {batchCountStore.batchCharacteristics.existingMarks.length <
                  1 && (
                  <Pressable
                    isDisabled={
                      batchCountStore.batchCharacteristics.existingMarks
                        .length > 0
                    }
                    onPress={() => {
                      setRecentExistingMarks([])
                      setAddMarkModalOpen(true)
                    }}
                  >
                    <HStack alignItems='center'>
                      <Icon
                        as={Ionicons}
                        name={'add-circle'}
                        size='3xl'
                        color='primary'
                        marginRight='1'
                      />
                      <Text color='primary' fontSize='lg'>
                        Add Mark
                      </Text>
                    </HStack>
                  </Pressable>
                )}
              </VStack>
              <Button
                bg='primary'
                mx='2'
                px='10'
                shadow='3'
                isDisabled={
                  (touched && Object.keys(touched).length === 0) ||
                  (errors && Object.keys(errors).length > 0)
                }
                onPress={() => {
                  handleSubmit()
                  setFishConditionDropdownOpen(false)
                  closeModal()
                }}
              >
                <Text fontSize='xl' color='white'>
                  Save
                </Text>
              </Button>
            </VStack>
            {/* --------- Modals --------- */}
            {addMarkModalOpen && (
              <CustomModal
                isOpen={addMarkModalOpen}
                closeModal={() => setAddMarkModalOpen(false)}
                height='100%'
              >
                <AddAnotherMarkModalContent
                  closeModal={() => setAddMarkModalOpen(false)}
                  screenName={'batchCount'}
                />
              </CustomModal>
            )}
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
    visitSetupState: state.visitSetup,
    visitSetupDefaultsSlice: state.visitSetupDefaults,
  }
}

export default connect(mapStateToProps)(memo(BatchCharacteristicsModalContent))
