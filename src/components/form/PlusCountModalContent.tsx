import { Formik } from 'formik'
import {
  Button,
  FormControl,
  HStack,
  Radio,
  Text,
  View,
  VStack,
  ScrollView,
} from 'native-base'
import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { savePlusCount } from '../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addPlusCountsSchema } from '../../utils/helpers/yupValidations'
import { alphabeticalSort, reorderTaxon } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import FormInputComponent from '../Shared/FormInputComponent'
import SpeciesDropDown from './SpeciesDropDown'

const initialFormValues = {
  species: '',
  lifeStage: '',
  run: '',
  count: '',
  plusCountMethod: '',
  dead: false,
  comments: '',
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
    <ScrollView scrollEnabled>
      <Formik
        validationSchema={addPlusCountsSchema}
        enableReinitialize
        initialValues={{ ...initialFormValues, plusCountMethod: 'none' }}
        onSubmit={(values, { resetForm }) => {
          handleFormSubmit(values)
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
        }) => (
          <>
            <CustomModalHeader
              headerText={`Enter Plus Count`}
              showHeaderButton={false}
              closeModal={closeModal}
            />
            <VStack space={5} paddingX='20' paddingTop='7' paddingBottom='3'>
              <FormControl mb={speciesDropDownOpen ? 250 : 0}>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='md'>
                      Species*
                    </Text>
                  </FormControl.Label>

                  {/* //TODO: set error messge for this custom dropdown */}
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
                <CustomSelect
                  label='Life Stage'
                  camelName='lifeStage'
                  errors={errors}
                  touched={touched}
                  selectedValue={values.lifeStage}
                  placeholder={'Select Life stage'}
                  onValueChange={handleChange('lifeStage')}
                  setFieldTouched={() => setFieldTouched('lifeStage')}
                  validationSchema={addPlusCountsSchema}
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
              )}

              {(values.species === 'Chinook salmon' || !values.species) && (
                <CustomSelect
                  label='Run'
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
                  validationSchema={addPlusCountsSchema}
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
                validationSchema={addPlusCountsSchema}
                keyboardType='number-pad'
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
                setFieldTouched={() => setFieldTouched('plusCountMethod')}
                selectOptions={plusCountMethodology.map((item: any) => ({
                  label: item.definition,
                  value: item.definition,
                }))}
                validationSchema={addPlusCountsSchema}
              />
              <FormInputComponent
                camelName='comments'
                value={values.comments}
                touched={touched}
                errors={errors}
                placeholder='Write a comment'
                label='Comments'
                multiline={true}
                onChangeText={handleChange('comments')}
                onBlur={handleBlur('comments')}
                validationSchema={addPlusCountsSchema}
              />
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
          </>
        )}
      </Formik>
    </ScrollView>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}
export default connect(mapStateToProps)(PlusCountModalContent)
