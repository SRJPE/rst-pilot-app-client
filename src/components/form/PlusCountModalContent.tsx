import { Formik } from 'formik'
import {
  FormControl,
  Input,
  ScrollView,
  VStack,
  Text,
  Button,
  Heading,
  HStack,
  Radio,
  View,
} from 'native-base'
import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { savePlusCount } from '../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addPlusCountsSchema } from '../../utils/helpers/yupValidations'
import { alphabeticalSort, QARanges, reorderTaxon } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import RenderErrorMessage from '../Shared/RenderErrorMessage'
import RenderWarningMessage from '../Shared/RenderWarningMessage'
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
}: {
  closeModal: any
  tabSlice: TabStateI
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { lifeStage, run, plusCountMethodology, taxon } = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const reorderedTaxon = reorderTaxon(taxon)
  const alphabeticalLifeStage = alphabeticalSort(lifeStage, 'definition')

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
  const [lifeStageDropDownOpen, setLifeStageDropDownOpen] = useState(
    false as boolean
  )
  const [lifeStageList, setLifeStageList] = useState<
    { label: string; value: string }[]
  >([
    { label: 'adult', value: 'adult' },
    { label: 'juvenile', value: 'juvenile' },
  ])

  const handleFormSubmit = (values: any) => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(
        savePlusCount({
          tabId: activeTabId,
          ...values,
        })
      )
      console.log('🚀 ~ Plus Count Values: ', values)
      showSlideAlert(dispatch, 'Plus count')
    }
  }

  return (
    <View>
      <Formik
        validationSchema={addPlusCountsSchema}
        initialValues={{ ...initialFormValues, plusCountMethod: 'none' }}
        onSubmit={(values) => handleFormSubmit(values)}
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
        }) => (
          <>
            <CustomModalHeader
              headerText={`Enter Plus Count`}
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
            <VStack space={5} paddingX='20' paddingTop='7' paddingBottom='3'>
              <HStack space={6}>
                <FormControl w='31%' mb={speciesDropDownOpen ? 250 : 0}>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Species
                      </Text>
                    </FormControl.Label>

                    {touched.species &&
                      errors.species &&
                      RenderErrorMessage(errors, 'species')}
                  </HStack>
                  <SpeciesDropDown
                    open={speciesDropDownOpen}
                    setOpen={setSpeciesDropDownOpen}
                    list={speciesList}
                    setList={setSpeciesList}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                  />
                </FormControl>
                {(values.species === 'Chinook salmon' ||
                  values.species === 'Steelhead / rainbow trout' ||
                  !values.species) && (
                  <FormControl w='31%' mb={lifeStageDropDownOpen ? 250 : 0}>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Life Stage
                        </Text>
                      </FormControl.Label>

                      {touched.lifeStage &&
                        errors.lifeStage &&
                        RenderErrorMessage(errors, 'lifeStage')}
                    </HStack>
                    <CustomSelect
                      selectedValue={values.lifeStage}
                      placeholder={'Life stage'}
                      onValueChange={handleChange('lifeStage')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={
                        values.species === 'Chinook salmon'
                          ? alphabeticalLifeStage.map((item: any) => ({
                              label: item.definition,
                              value: item.definition,
                            }))
                          : [
                              { label: 'adult', value: 'adult' },
                              { label: 'juvenile', value: 'juvenile' },
                            ]
                      }
                    />
                  </FormControl>
                )}

                {(values.species === 'Chinook salmon' || !values.species) && (
                  <FormControl w='31%'>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Run
                        </Text>
                      </FormControl.Label>

                      {touched.run &&
                        errors.run &&
                        RenderErrorMessage(errors, 'run')}
                    </HStack>

                    <CustomSelect
                      selectedValue={values.run}
                      placeholder={'Run'}
                      onValueChange={handleChange('run')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={run.map((item: any) => ({
                        label: item.definition,
                        value: item.definition,
                      }))}
                    />
                  </FormControl>
                )}
              </HStack>
              <HStack space={6}>
                <FormControl w='48.5%'>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Count
                      </Text>
                    </FormControl.Label>
                    {touched.count &&
                      errors.count &&
                      RenderErrorMessage(errors, 'count')}
                  </HStack>
                  <Input
                    height='50px'
                    fontSize='16'
                    placeholder='Enter count'
                    keyboardType='numeric'
                    onChangeText={handleChange('count')}
                    onBlur={handleBlur('count')}
                    value={values.count}
                  />
                </FormControl>
                <FormControl w='48.5%' paddingLeft='5'>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Dead
                      </Text>
                    </FormControl.Label>
                    {touched.dead &&
                      errors.dead &&
                      RenderErrorMessage(errors, 'dead')}
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
                    </HStack>
                  </Radio.Group>
                </FormControl>
              </HStack>

              <FormControl>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Plus Count Method
                    </Text>
                  </FormControl.Label>

                  {touched.plusCountMethod &&
                    errors.plusCountMethod &&
                    RenderErrorMessage(errors, 'plusCountMethod')}
                </HStack>
                <CustomSelect
                  selectedValue={values.plusCountMethod}
                  placeholder={'Method'}
                  onValueChange={handleChange('plusCountMethod')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={plusCountMethodology.map((item: any) => ({
                    label: item.definition,
                    value: item.definition,
                  }))}
                />
              </FormControl>
            </VStack>
          </>
        )}
      </Formik>
    </View>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}
export default connect(mapStateToProps)(PlusCountModalContent)
