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
  View,
} from 'native-base'
import React, { memo, useCallback, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  addMarkToBatchCountExistingMarks,
  saveBatchCharacteristics,
} from '../../../redux/reducers/formSlices/batchCountSlice'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { alphabeticalSort, reorderTaxon } from '../../../utils/utils'
import CustomModalHeader from '../../Shared/CustomModalHeader'
import CustomSelect from '../../Shared/CustomSelect'
import RenderErrorMessage from '../../Shared/RenderErrorMessage'
import MarkBadgeList from '../../markRecapture/MarkBadgeList'
import CustomModal from '../../Shared/CustomModal'
import AddAnotherMarkModalContent from '../../Shared/AddAnotherMarkModalContent'
import { batchCharacteristicsSchema } from '../../../utils/helpers/yupValidations'
import { ReleaseMarkI } from '../../../screens/formScreens/AddFish'
import SpeciesDropDown from '../SpeciesDropDown'
import FishConditionsDropDown from '../FishConditionsDropDown'
import { startCase } from 'lodash'

const BatchCharacteristicsModalContent = ({
  closeModal,
  tabSlice,
  batchCountStore,
}: {
  closeModal: any
  tabSlice: TabStateI
  batchCountStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [addMarkModalOpen, setAddMarkModalOpen] = useState(false as boolean)
  const [recentExistingMarks, setRecentExistingMarks] = useState<any[]>([])

  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const reorderedTaxon = reorderTaxon(dropdownValues.taxon)

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

  const returnDefinitionArray = (dropdownsArray: any[]) => {
    return dropdownsArray.map((dropdownObj: any) => {
      return dropdownObj.definition
    })
  }

  const markTypeValues = returnDefinitionArray(dropdownValues.markType)
  const markColorValues = returnDefinitionArray(dropdownValues.markColor)
  const bodyPartValues = returnDefinitionArray(dropdownValues.bodyPart)

  const decodedRecentReleaseMarks = (twoMostRecentReleaseMarks: any) => {
    return twoMostRecentReleaseMarks.map((mark: ReleaseMarkI) => {
      return {
        ...mark,
        markType: markTypeValues[mark.markType - 1],
        markColor: markColorValues[mark.markColor - 1],
        markPosition: bodyPartValues[mark.markPosition - 1],
      }
    })
  }

  const handlePressRecentExistingMarkButton = (
    selectedRecentReleaseMark: ReleaseMarkI
  ) => {
    setRecentExistingMarks([selectedRecentReleaseMark])
  }

  return (
    <View>
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
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
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
              }
            />
            <VStack px='5%' space={4}>
              <Text justifyContent='center' fontSize='lg'>
                Please return to the individual fish input if you plan on
                marking or sampling a fish.
              </Text>
              <VStack space={4}>
                <FormControl w='1/2' pr='5' mb={speciesDropDownOpen ? 180 : 0}>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Species
                    </Text>
                  </FormControl.Label>

                  {touched.species &&
                    errors.species &&
                    RenderErrorMessage(errors, 'species')}

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
                    <Text color='black' fontSize='xl'>
                      Fish Condition
                    </Text>
                  </FormControl.Label>

                  {touched.fishConditions &&
                    errors.fishConditions &&
                    RenderErrorMessage(errors, 'fishConditions')}

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

              <HStack space={10}>
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
                      {dropdownValues.twoMostRecentReleaseMarks.length > 0 &&
                        decodedRecentReleaseMarks(
                          dropdownValues.twoMostRecentReleaseMarks
                        ).map((recentReleaseMark: any, index: number) => {
                          const { id, markType, markColor, markPosition } =
                            recentReleaseMark
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
                              w='90%'
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
                                {`${markType}${
                                  markColor ? `- ${markColor}` : ''
                                } ${markPosition ? `- ${markPosition}` : ''}`}
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
              </HStack>
            </VStack>
            {/* --------- Modals --------- */}

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
          </>
        )}
      </Formik>
    </View>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
  }
}

export default connect(mapStateToProps)(memo(BatchCharacteristicsModalContent))
