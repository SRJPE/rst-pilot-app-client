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
import { saveBatchCharacteristics } from '../../../redux/reducers/formSlices/batchCountSlice'
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

const initialFormValues = {
  species: '',
  adiposeClipped: false,
  fishCondition: '',
  existingMarks: [],
}
const fishConditionTempValues = [
  { id: 1, definition: 'Dark coloration' },
  { id: 2, definition: 'Swimming abnormally' },
  { id: 3, definition: 'Bulging eyes' },
  { id: 4, definition: 'Pale gills' },
  { id: 5, definition: 'Bulging abdomen' },
  { id: 6, definition: 'Swollen/protruding vent' },
  { id: 7, definition: 'Bloody eye' },
  { id: 8, definition: 'Fungus' },
  { id: 9, definition: 'none' },
]

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
      dispatch(saveBatchCharacteristics({ ...values, tabId: activeTabId }))
      console.log('🚀 ~handleFormSubmit BatchCount Values: ', {
        ...values,
        tabId: activeTabId,
      })
      showSlideAlert(dispatch, 'Batch characteristics')
    }
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
                    selectOptions={fishConditionTempValues.map(
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
                  <MarkBadgeList
                    badgeListContent={batchCountStore.existingMarks}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    field='batchCountExistingMarks'
                  />
                  {batchCountStore.existingMarks.length < 1 && (
                    <Pressable
                      isDisabled={batchCountStore.existingMarks.length > 0}
                      onPress={() => setAddMarkModalOpen(true)}
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
