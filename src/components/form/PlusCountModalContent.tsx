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
} from 'native-base'
import React from 'react'
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

const initialFormValues = {
  species: '',
  lifeStage: '',
  run: '',
  count: '',
  plusCountMethod: '',
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

  const handleFormSubmit = (values: any) => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(savePlusCount({ tabId: activeTabId, ...values }))
      console.log('🚀 ~ Plus Count Values: ', values)
      showSlideAlert(dispatch, 'Plus count')
    }
  }

  return (
    <ScrollView>
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
                <FormControl w='31%'>
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
                  <CustomSelect
                    selectedValue={values.species}
                    placeholder={'Species'}
                    onValueChange={handleChange('species')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={reorderedTaxon.map((item: any) => ({
                      label: item.commonname,
                      value: item.commonname,
                    }))}
                  />
                </FormControl>
                <FormControl w='31%'>
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
                    selectOptions={alphabeticalLifeStage.map((item: any) => ({
                      label: item.definition,
                      value: item.definition,
                    }))}
                  />
                </FormControl>

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
              </HStack>
              <FormControl>
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
    </ScrollView>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}
export default connect(mapStateToProps)(PlusCountModalContent)
