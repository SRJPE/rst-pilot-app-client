import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import React, { memo, useCallback, useState, useMemo } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  addMarkToBatchCountExistingMarks,
  saveBatchCharacteristics,
} from '../../../redux/reducers/formSlices/batchCountSlice'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  reorderTaxon,
  returnDefinitionArray,
  decodedRecentReleaseMarks,
} from '../../../utils/utils'
import CustomModalHeader from '../../Shared/CustomModalHeader'
import CustomSelect from '../../Shared/CustomSelect'
import MarkBadgeList from '../../markRecapture/MarkBadgeList'
import CustomModal from '../../Shared/CustomModal'
import AddAnotherMarkModalContent from '../../Shared/AddAnotherMarkModalContent'
import { batchCharacteristicsSchema } from '../../../utils/helpers/yupValidations'
import { ReleaseMarkI } from '../../../utils/interfaces'
import SpeciesDropDown from '../SpeciesDropDown'
import FishConditionsDropDown from '../FishConditionsDropDown'
import { startCase } from 'lodash'

const BatchCharacteristicsModalContent = ({
  closeModal,
  tabSlice,
  batchCountStore,
  visitSetupState,
}: {
  closeModal: any
  tabSlice: TabStateI
  batchCountStore: any
  visitSetupState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const reorderedTaxon = useMemo(
    () => reorderTaxon(dropdownValues.taxon),
    [dropdownValues.taxon]
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
  const [speciesList, setSpeciesList] = useState<
    { label: string; value: string }[]
  >(
    reorderedTaxon.map((taxon: any) => ({
      label: taxon?.commonname,
      value: taxon?.commonname,
    }))
  )

  const onSpeciesOpen = useCallback(() => {
    setFishConditionDropdownOpen(false)
  }, [])
  const onFishConditionOpen = useCallback(() => {
    setSpeciesDropDownOpen(false)
  }, [])

  const handleFormSubmit = (values: any) => {
    delete values.existingMarks
    delete values.batchCountExistingMarks
    let activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      if (recentExistingMarks.length === 1) {
        dispatch(
          saveBatchCharacteristics({
            ...values,
            tabId: activeTabId,
          })
        )
        dispatch(addMarkToBatchCountExistingMarks(recentExistingMarks[0]))
        console.log('🚀 ~handleFormSubmit BatchCount Values: ', {
          ...values,
          tabId: activeTabId,
        })
        showSlideAlert(dispatch, 'Batch characteristics')
      } else {
        dispatch(
          saveBatchCharacteristics({
            ...values,

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
              closeModal={closeModal}
            />
            <VStack px='5%' space={4}>
              <Text justifyContent='center' fontSize='lg'>
                Please return to the individual fish input if you plan on
                marking or sampling a fish.
              </Text>
              <VStack space={4}>
                <FormControl pr='5' mb={speciesDropDownOpen ? 180 : 0}>
                  <FormControl.Label>
                    <Text color='black' fontSize='md'>
                      Species
                    </Text>
                  </FormControl.Label>

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
                  />
                </FormControl>
                <FormControl
                  w='100%'
                  pr='5'
                  mb={fishConditionDropdownOpen ? 160 : 0}
                >
                  <FormControl.Label>
                    <Text color='black' fontSize='md'>
                      Fish Condition
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
                <Text color='black' fontSize='xl'>
                  Add Existing Mark
                </Text>
                {batchCountStore.batchCharacteristics.existingMarks.length <
                  1 && (
                  <VStack space={5}>
                    {dropdownValues?.releaseMarks?.length > 0 &&
                      decodedRecentReleaseMarks(
                        dropdownValues,
                        tabSlice?.activeTabId
                          ? visitSetupState?.[tabSlice.activeTabId]?.values
                              ?.programId
                          : null
                      ).map((recentReleaseMark: any, index: number) => {
                        const {
                          id,
                          markType,
                          markColor,
                          markPosition,
                          releasedAt,
                        } = recentReleaseMark
                        return (
                          <Button
                            key={index}
                            bg={
                              recentExistingMarks.some(
                                (mark: ReleaseMarkI) => mark.id === id
                              )
                                ? 'primary'
                                : 'secondary'
                            }
                            shadow='3'
                            borderRadius='5'
                            w='100%'
                            justifyContent='flex-start'
                            onPress={() => {
                              handlePressRecentExistingMarkButton(
                                recentReleaseMark
                              )
                            }}
                          >
                            <Text
                              color={
                                recentExistingMarks.some(
                                  (mark: ReleaseMarkI) => mark.id === id
                                )
                                  ? 'white'
                                  : 'primary'
                              }
                              fontWeight='500'
                              fontSize='md'
                            >
                              Released On:{' '}
                              {new Date(releasedAt).toLocaleDateString()}
                              {` (${markType}${
                                markColor ? `- ${markColor}` : ''
                              } ${markPosition ? `- ${markPosition}` : ''})`}
                            </Text>
                          </Button>
                        )
                      })}
                  </VStack>
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
                height='1/2'
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
  }
}

export default connect(mapStateToProps)(memo(BatchCharacteristicsModalContent))
