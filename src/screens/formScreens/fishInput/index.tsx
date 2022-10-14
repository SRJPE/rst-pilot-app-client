import React, { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Heading,
  HStack,
  VStack,
  Text,
  View,
} from 'native-base'
import { Table, Row, Rows } from 'react-native-table-component'
import { StyleSheet } from 'react-native'
import CustomModal from '../../../components/Shared/CustomModal'
import { Formik } from 'formik'
import NavButtons from '../../../components/formContainer/NavButtons'
import { AppDispatch, RootState } from '../../../redux/store'

import { connect, useDispatch } from 'react-redux'
import {
  markFishInputCompleted,
  saveFishInput,
} from '../../../redux/reducers/formSlices/fishInputSlice'
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'
import AddFishModalContent from '../../../components/form/AddFishModalContent'

const styles = StyleSheet.create({
  tableHead: { height: 40, backgroundColor: '#f1f8ff' },
  tableText: { marginVertical: 6, marginLeft: 3 },
})

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.fishInput,
  }
}

const FishInput = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [addFishModalOpen, setAddFishModalOpen] = useState(false)
  const [addFishModalTab, setAddFishModalTab] = useState<
    'Individual' | 'Batch'
  >('Individual')
  const [tableData, setTableData] = useState(reduxState.values.tableData as any)
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(
    reduxState.values.speciesCaptured as Array<string>
  )
  const tableHead = [
    'Species',
    'Fork Length',
    'Weight',
    'Run',
    'Adipose Clipped',
    'Mark Type',
    'Mark Color',
    'CWT Code',
    'Mort',
  ]

  const handleSubmit = (values: any) => {
    // console.log('🚀 ~ handleSubmit ~ checkboxGroupValue', checkboxGroupValue)
    values.speciesCaptured = checkboxGroupValue
    dispatch(saveFishInput(values))
    dispatch(markFishInputCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ Fish Input ~ values', values)
  }

  return (
    <Formik
      // validationSchema={fishInputSchema}
      initialValues={reduxState.values}
      onSubmit={values => handleSubmit(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        values,
      }) => (
        <>
          <View
            flex={1}
            bg='#fff'
            p='10%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={8}>
              <Heading>Which species were captured?</Heading>
              <FormControl w='1/4'>
                <Checkbox.Group //https://github.com/GeekyAnts/NativeBase/issues/5073
                  colorScheme='green'
                  defaultValue={checkboxGroupValue}
                  accessibilityLabel='Select the species captured'
                  onChange={values => setCheckboxGroupValue(values)}
                >
                  <Checkbox value='YOY Chinook' my='1'>
                    YOY Chinook
                  </Checkbox>
                  <Checkbox value='Yearling Chinook' my='1'>
                    Yearling Chinook
                  </Checkbox>
                  <Checkbox value='Recaptured Chinook' my='1'>
                    Recaptured Chinook
                  </Checkbox>
                  <Checkbox value='Steelhead' my='1'>
                    Steelhead
                  </Checkbox>
                  <Checkbox value='Other' my='1'>
                    Other
                  </Checkbox>
                </Checkbox.Group>
              </FormControl>

              <HStack space={10} marginRight='1/4'>
                <Button
                  bg='primary'
                  p='3'
                  borderRadius='5'
                  flex='1'
                  onPress={() => setAddFishModalOpen(true)}
                >
                  <Text fontSize='sm' fontWeight='bold' color='white'>
                    Input Fish Measurements
                  </Text>
                </Button>

                <Button
                  bg='primary'
                  p='3'
                  flex='1'
                  borderRadius='5'
                  onPress={() => {}}
                >
                  <Text fontSize='sm' fontWeight='bold' color='white'>
                    Add Plus Counts
                  </Text>
                </Button>
              </HStack>

              <Box>
                <Heading pb='8'>Catch Table</Heading>
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                  <Row
                    data={tableHead}
                    style={styles.tableHead}
                    textStyle={styles.tableText}
                  />
                  <Rows data={tableData} textStyle={styles.tableText} />
                </Table>
              </Box>
            </VStack>
            {/* --------- Modals --------- */}
            <CustomModal
              isOpen={addFishModalOpen}
              closeModal={() => setAddFishModalOpen(false)}
            >
              <AddFishModalContent
                closeModal={() => setAddFishModalOpen(false)}
                activeTab={addFishModalTab}
                setActiveTab={setAddFishModalTab}
              />
            </CustomModal>
          </View>
          <NavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
            values={values}
          />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(FishInput)
