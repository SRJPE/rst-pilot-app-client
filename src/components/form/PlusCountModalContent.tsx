import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import {
  Button,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Radio,
  ScrollView,
  Text,
  View,
  VStack,
  KeyboardAvoidingView,
} from 'native-base'
import React, { useMemo, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { connect, useDispatch, useSelector } from 'react-redux'
import { savePlusCount } from '../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addPlusCountsSchema } from '../../utils/helpers/yupValidations'
import { FormValueI, ReleaseMarkI, Taxon } from '../../utils/interfaces'
import {
  alphabeticalSort,
  createFormValueDefault,
  fetchRecentlyUsedSpecies,
  findTaxonCode,
  getAddFishStateDefaults,
  handleSpeciesSearchTextChange,
  reorderTaxon,
} from '../../utils/utils'
import MarkBadgeList from '../markRecapture/MarkBadgeList'
import AddAnotherMarkModalContent from '../Shared/AddAnotherMarkModalContent'
import CustomModal from '../Shared/CustomModal'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import FormInputComponent from '../Shared/FormInputComponent'
import AddExistingMark from './AddExistingMark'
import SpeciesDropDown from './SpeciesDropDown'

const initialFormValues = {
  species: '',
  lifeStage: '',
  run: '',
  count: '',
  plusCountMethod: '',
  dead: false,
}

const PlusCountModalContent = ({
  closeModal,
  tabSlice,
  batchCountStore,
  visitSetupState,
  visitSetupDefaultsSlice,
  route,
}: {
  route?: any
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
  const { lifeStage, run, plusCountMethodology, taxon } = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const tabId = tabSlice?.activeTabId || 'placeholderId'
  const activeProgramId = visitSetupState?.[tabId]?.values?.programId
  const currentProgramTaxon = dropdownValues?.programTaxonAbbreviation?.[
    activeProgramId
  ] as Taxon[]

  const recentlyUsedSpecies = fetchRecentlyUsedSpecies({
    siteId: visitSetupState?.[tabId || 'placeholderId']?.values.trapLocationId,
    trapLocations: visitSetupDefaultsSlice?.trapLocations,
  })

  const defaultTaxonList = dropdownValues?.taxon

  const reorderedTaxon = useMemo(
    () => reorderTaxon(currentProgramTaxon || defaultTaxonList, true),

    [currentProgramTaxon, activeProgramId]
  )

  const alphabeticalLifeStage = alphabeticalSort(lifeStage, 'definition')

  const [speciesDropDownOpen, setSpeciesDropDownOpen] = useState(
    false as boolean
  )
  const defaultSpeciesList = [
    ...recentlyUsedSpecies,
    { label: 'All Species', value: 'allSpecies' },
    ...reorderedTaxon,
  ]

  const stateDefaults = getAddFishStateDefaults()

  const [speciesList, setSpeciesList] =
    useState<{ label: string; value: string }[]>(defaultSpeciesList)

  const [species, setSpecies] = useState<FormValueI>(
    route?.params?.editModeData
      ? createFormValueDefault({
          value: route.params?.editModeData.species,
          touched: true,
          required: false,
        })
      : stateDefaults.whenSpeciesChinook.species
  )

  //RECENT MARKS ADDITIONS
  const [recentExistingMarks, setRecentExistingMarks] = useState<any[]>([])
  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)
  const [existingMarks, setExistingMarks] = useState<any>(
    createFormValueDefault({
      value: [],
      touched: true,
      required: false,
    })
  )

  const handlePressRecentExistingMarkButton = (
    selectedRecentReleaseMark: ReleaseMarkI
  ) => {
    if (
      recentExistingMarks.some(mark => mark.id === selectedRecentReleaseMark.id)
    ) {
      setRecentExistingMarks(
        recentExistingMarks.filter(
          mark => mark.id !== selectedRecentReleaseMark.id
        )
      )
    } else {
      setRecentExistingMarks([
        ...recentExistingMarks,
        selectedRecentReleaseMark,
      ])
    }
  }

  const handleFormSubmit = (values: any) => {
    const taxonCode = findTaxonCode(values.species, reorderedTaxon)
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(
        savePlusCount({
          tabId: activeTabId,
          existingMarks: [...existingMarks.value, ...recentExistingMarks],
          ...values,
          taxonCode,
        })
      )
      console.log('🚀 ~ Plus Count Values: ', values)
      showSlideAlert(dispatch, 'Plus count')
    }
  }

  return (
    <>
      <KeyboardAvoidingView flex='1' behavior='padding'>
        <ScrollView scrollEnabled>
          <Formik
            validationSchema={addPlusCountsSchema}
            enableReinitialize
            initialValues={{ ...initialFormValues, plusCountMethod: 'none' }}
            onSubmit={(values, { resetForm }) => {
              console.log('species', species)
              handleFormSubmit({ ...values, species: species.value })
              resetForm()
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldTouched,
              touched,
              errors,
              values,
              setFieldValue,
              resetForm,
            }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (speciesDropDownOpen) {
                      setSpeciesDropDownOpen(false)
                      setSpeciesList(defaultSpeciesList)
                      setFieldTouched('species', true)
                    }
                  }}
                >
                  <View>
                    <CustomModalHeader
                      headerText={`Enter Plus Count`}
                      showHeaderButton={false}
                      closeModal={closeModal}
                    />
                    <VStack
                      space={5}
                      paddingX='20'
                      paddingTop='7'
                      paddingBottom='3'
                    >
                      <SpeciesDropDown
                        editModeValue={route?.params?.editModeData?.species}
                        open={speciesDropDownOpen}
                        setOpen={setSpeciesDropDownOpen}
                        list={speciesList}
                        setList={setSpeciesList}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        speciesValue={species.value as string}
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
                        onChangeValue={(value: string) => {
                          const formattedValue = value.includes('recent')
                            ? value.split('_')[1]
                            : value

                          let payload = {
                            ...species,
                            value: formattedValue,
                            touched: true,
                          }

                          setFieldValue('species', formattedValue)

                          //if in edit mode, do not reset form state based on species
                          if (route?.params?.editModeData !== undefined) return

                          setSpecies(payload)
                        }}
                      />
                      {(values.species === 'Chinook salmon' ||
                        values.species === 'Steelhead / rainbow trout' ||
                        !values.species) && (
                        <CustomSelect
                          label='Life Stage (optional)'
                          camelName='lifeStage'
                          errors={errors}
                          touched={touched}
                          selectedValue={values.lifeStage}
                          placeholder={'Select Life stage'}
                          onValueChange={handleChange('lifeStage')}
                          setFieldTouched={() => setFieldTouched('lifeStage')}
                          selectOptions={alphabeticalLifeStage.map(
                            (item: any) => ({
                              label: item.definition,
                              value: item.definition,
                            })
                          )}
                        />
                      )}
                      {(values.species === 'Chinook salmon' ||
                        !values.species) && (
                        <CustomSelect
                          label='Run (optional)'
                          camelName='run'
                          errors={errors}
                          touched={touched}
                          selectedValue={values.run}
                          placeholder={'Run'}
                          onValueChange={handleChange('run')}
                          setFieldTouched={() => setFieldTouched('run')}
                          selectOptions={run.map((item: any) => ({
                            label: item.definition,
                            value: item.definition,
                          }))}
                        />
                      )}
                      <FormInputComponent
                        label='Count'
                        placeholder='0'
                        touched={touched}
                        errors={errors}
                        camelName='count'
                        onBlur={handleBlur('count')}
                        value={values.count}
                        onChangeText={handleChange('count')}
                      />
                      {/* //TODO: Fix bug where input won't blur unless dropdown is clicked ^ */}
                      <FormControl w='48.5%'>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Dead
                            </Text>
                          </FormControl.Label>
                        </HStack>
                        <Radio.Group
                          name='dead'
                          accessibilityLabel='dead'
                          value={`${values.dead}`}
                          onChange={(value: any) => {
                            setFieldTouched('dead', true)
                            if (value === 'true') {
                              setFieldValue('dead', true)
                            } else {
                              setFieldValue('dead', false)
                            }
                          }}
                        >
                          <HStack space={4}>
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
                          </HStack>
                        </Radio.Group>
                      </FormControl>
                      <CustomSelect
                        label='Plus Count Method'
                        camelName='plusCountMethod'
                        errors={errors}
                        touched={touched}
                        selectedValue={values.plusCountMethod}
                        placeholder={'Method'}
                        onValueChange={handleChange('plusCountMethod')}
                        setFieldTouched={() =>
                          setFieldTouched('plusCountMethod')
                        }
                        selectOptions={plusCountMethodology.map(
                          (item: any) => ({
                            label: item.definition,
                            value: item.definition,
                          })
                        )}
                      />
                      <VStack space={4} w={'100%'}>
                        <AddExistingMark
                          dropdownValues={dropdownValues}
                          activeTabId={tabSlice.activeTabId}
                          recentExistingMarks={recentExistingMarks}
                          handlePressRecentExistingMarkButton={
                            handlePressRecentExistingMarkButton
                          }
                          visitSetupState={visitSetupState}
                        />
                        <MarkBadgeList
                          badgeListContent={existingMarks.value}
                          field='existingMarks'
                          setExistingMarks={setExistingMarks}
                        />
                        <Pressable
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
                      </VStack>
                      <Button
                        bg='primary'
                        px='10'
                        shadow='3'
                        isDisabled={
                          (touched && Object.keys(touched).length === 0) ||
                          (errors && Object.keys(errors).length > 0)
                        }
                        onPress={() => {
                          handleSubmit()
                          closeModal()
                        }}
                      >
                        <Text fontSize='xl' color='white'>
                          Save
                        </Text>
                      </Button>
                    </VStack>
                  </View>
                </TouchableWithoutFeedback>
              )
            }}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* --------- Modals --------- */}
      {addMarkModalOpen && (
        <CustomModal
          isOpen={addMarkModalOpen}
          closeModal={() => setAddMarkModalOpen(false)}
          height='100%'
        >
          <AddAnotherMarkModalContent
            closeModal={() => setAddMarkModalOpen(false)}
            screenName={'plusCount'}
            setExistingMarks={setExistingMarks}
            existingMarks={existingMarks}
            existingMarksArray={existingMarks.value}
          />
        </CustomModal>
      )}
    </>
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
export default connect(mapStateToProps)(PlusCountModalContent)
