import { useMemo, useState } from 'react'
import { Button, KeyboardAvoidingView, Text, View, VStack } from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  addSpeciesToMultiSpecies,
  batchCountI,
} from '../../../redux/reducers/formSlices/batchCountSlice'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  fetchRecentlyUsedSpecies,
  handleSpeciesSearchTextChange,
  reorderTaxon,
} from '../../../utils/utils'
import { Taxon } from '../../../utils/interfaces'
import CustomModalHeader from '../../Shared/CustomModalHeader'
import SpeciesDropDown from '../SpeciesDropDown'

const stripRecentPrefix = (value: string) =>
  value?.includes('recent_') ? value.split('_')[1] : value

const AddSpeciesTabModalContent = ({
  closeModal,
  tabSlice,
  batchCountStore,
  visitSetupState,
  visitSetupDefaultsSlice,
  onAdded,
}: {
  closeModal: any
  tabSlice: TabStateI
  batchCountStore: batchCountI
  visitSetupState: any
  visitSetupDefaultsSlice: any
  onAdded?: (species: string) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const activeTabId = tabSlice.activeTabId || 'placeholderId'
  const activeProgramId = visitSetupState?.[activeTabId]?.values?.programId
  const defaultTaxonList = dropdownValues?.taxon
  const currentProgramTaxon = dropdownValues?.programTaxonAbbreviation?.[
    activeProgramId
  ] as Taxon[]

  const reorderedTaxon = useMemo(
    () => reorderTaxon(currentProgramTaxon || defaultTaxonList, true),
    [currentProgramTaxon, activeProgramId]
  )

  const existingSpecies =
    batchCountStore?.batchCharacteristics?.multiSpecies || []

  const recentlyUsedSpecies = fetchRecentlyUsedSpecies({
    siteId: visitSetupState?.[activeTabId]?.values.trapLocationId,
    trapLocations: visitSetupDefaultsSlice.trapLocations,
  })

  // species already added to this batch shouldn't be selectable again
  const defaultSpeciesList = useMemo(() => {
    const list = [
      ...recentlyUsedSpecies,
      { label: 'All Species', value: 'allSpecies' },
      ...reorderedTaxon,
    ]
    return list.filter((item: any) => {
      if (item.value === 'allSpecies') return true
      return !existingSpecies.includes(stripRecentPrefix(item.value))
    })
  }, [recentlyUsedSpecies, reorderedTaxon, existingSpecies])

  const [speciesDropDownOpen, setSpeciesDropDownOpen] = useState(
    false as boolean
  )
  const [speciesList, setSpeciesList] =
    useState<{ label: string; value: string }[]>(defaultSpeciesList)
  const [selectedSpecies, setSelectedSpecies] = useState('' as string)

  const handleAdd = () => {
    if (!selectedSpecies || !activeTabId) return
    dispatch(
      addSpeciesToMultiSpecies({ tabId: activeTabId, species: selectedSpecies })
    )
    showSlideAlert(dispatch, 'Species added')
    if (onAdded) onAdded(selectedSpecies)
    closeModal()
  }

  return (
    <KeyboardAvoidingView behavior='padding'>
      <View>
        <CustomModalHeader
          headerText='Add Species'
          showHeaderButton={false}
          closeModal={closeModal}
        />
        <VStack space={4} paddingX='8' paddingTop='4' paddingBottom='3'>
          <SpeciesDropDown
            open={speciesDropDownOpen}
            setOpen={setSpeciesDropDownOpen}
            list={speciesList}
            setList={setSpeciesList}
            onClose={() => setSpeciesList(defaultSpeciesList)}
            onChangeSearchText={searchValue =>
              handleSpeciesSearchTextChange({
                reorderedTaxon,
                searchValue,
                setSpeciesList,
                defaultSpeciesList,
              })
            }
            onChangeValue={(value: string) => {
              setSelectedSpecies(stripRecentPrefix(value))
            }}
          />
          <Button
            bg='primary'
            px='10'
            shadow='3'
            isDisabled={!selectedSpecies}
            onPress={handleAdd}
          >
            <Text fontSize='xl' color='white'>
              Add
            </Text>
          </Button>
        </VStack>
      </View>
    </KeyboardAvoidingView>
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

export default connect(mapStateToProps)(AddSpeciesTabModalContent)
