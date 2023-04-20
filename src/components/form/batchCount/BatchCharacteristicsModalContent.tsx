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

const initialFormValues = {
  species: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '',
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
      console.log('🚀 ~ BatchCount Values: ', { ...values, tabId: activeTabId })
      showSlideAlert(dispatch, 'Batch characteristics')
    }
  }

  return (
    <ScrollView>
      <Formik
        // validationSchema={}
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
                  // isDisabled={
                  //   (touched && Object.keys(touched).length === 0) ||
                  //   (errors && Object.keys(errors).length > 0)
                  // }
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
            <Divider my={2} thickness='3' />
            <VStack px='5%' space={4}>
              <Text justifyContent='center' fontSize='lg'>
                Please return to the individual fish input if you plan on
                marking or sampling a fish.
              </Text>
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
                  onValueChange={(value: any) => handleChange('species')(value)}
                  setFieldTouched={setFieldTouched}
                  selectOptions={reorderedTaxon.map((taxon: any) => ({
                    label: taxon?.commonname,
                    value: taxon?.commonname,
                  }))}
                />
              </FormControl>

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

                  <FormControl w='full'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Dead
                      </Text>
                    </FormControl.Label>
                    <Radio.Group
                      name='dead'
                      accessibilityLabel='dead'
                      value={`${values.dead}`}
                      onChange={(value: any) => {
                        if (value === 'true') {
                          setFieldValue('dead', true)
                        } else {
                          setFieldValue('dead', false)
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

                <VStack space={4} w={'100%'}>
                  <Text color='black' fontSize='xl'>
                    Add Existing Mark
                  </Text>
                  <MarkBadgeList
                    badgeListContent={batchCountStore.existingMarks || []}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    field='existingMarks'
                  />
                  <Pressable onPress={() => setAddMarkModalOpen(true)}>
                    <HStack alignItems='center'>
                      <Icon
                        as={Ionicons}
                        name={'add-circle'}
                        size='3xl'
                        color='primary'
                        marginRight='1'
                      />
                      <Text color='primary' fontSize='lg'>
                        Add Another Mark
                      </Text>
                    </HStack>
                  </Pressable>
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
