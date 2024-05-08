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
import React, { memo, useState } from 'react'
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

const initialFormValues = {
  species: '',
  adiposeClipped: false,
  fishCondition: 'none',
}

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

  const alphabeticalLifeStage = alphabeticalSort(
    dropdownValues.lifeStage,
    'definition'
  )

  const handleFormSubmit = (values: any) => {
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
        bodyPart: bodyPartValues[mark.bodyPart - 1],
      }
    })
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
        initialValues={initialFormValues}
        onSubmit={(values) => handleFormSubmit(values)}
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
              <HStack>
                <FormControl w='1/2' pr='5'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Species
                    </Text>
                  </FormControl.Label>

                  {touched.species &&
                    errors.species &&
                    RenderErrorMessage(errors, 'species')}

                  <CustomSelect
                    selectedValue={values.species}
                    placeholder={'Species'}
                    onValueChange={(value: any) =>
                      handleChange('species')(value)
                    }
                    setFieldTouched={setFieldTouched}
                    selectOptions={reorderedTaxon.map((taxon: any) => ({
                      label: taxon?.commonname,
                      value: taxon?.commonname,
                    }))}
                  />
                </FormControl>
                <FormControl w='1/2' pr='5'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Fish Condition
                    </Text>
                  </FormControl.Label>

                  {touched.fishCondition &&
                    errors.fishCondition &&
                    RenderErrorMessage(errors, 'fishCondition')}

                  <CustomSelect
                    selectedValue={values.fishCondition}
                    placeholder={'Fish Condition'}
                    onValueChange={(value: any) =>
                      handleChange('fishCondition')(value)
                    }
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues.fishCondition.map(
                      (condition: any) => ({
                        label: condition?.definition,
                        value: condition?.definition,
                      })
                    )}
                  />
                </FormControl>
              </HStack>

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
                        Yes
                      </Radio>
                      <Radio
                        colorScheme='primary'
                        value='false'
                        my={1}
                        _icon={{ color: 'primary' }}
                      >
                        No
                      </Radio>
                    </Radio.Group>
                  </FormControl>
                </VStack>

                <VStack space={4} w={'80%'}>
                  <Text color='black' fontSize='xl'>
                    Add Existing Mark
                  </Text>
                  {batchCountStore.existingMarks.length < 1 && (
                    <VStack space={5}>
                      {dropdownValues.twoMostRecentReleaseMarks.length > 0 &&
                        decodedRecentReleaseMarks(
                          dropdownValues.twoMostRecentReleaseMarks
                        ).map((recentReleaseMark: any, index: number) => {
                          const { id, markType, markColor, bodyPart } =
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
                                {`${markType} - ${markColor} - ${bodyPart}`}
                              </Text>
                            </Button>
                          )
                        })}
                    </VStack>
                  )}
                  <MarkBadgeList
                    badgeListContent={batchCountStore.existingMarks}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    field='batchCountExistingMarks'
                  />
                  {batchCountStore.existingMarks.length < 1 && (
                    <Pressable
                      isDisabled={batchCountStore.existingMarks.length > 0}
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
    </ScrollView>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
  }
}

export default connect(mapStateToProps)(memo(BatchCharacteristicsModalContent))
