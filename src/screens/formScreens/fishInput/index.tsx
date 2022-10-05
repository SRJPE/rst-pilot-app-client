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
} from 'native-base'
import { Table, Row, Rows } from 'react-native-table-component'
import { StyleSheet } from 'react-native'
import CustomModal from '../../../components/Shared/CustomModal'
import AddFishModalContent from '../../../components/form/AddFishModalContent'
import { Formik } from 'formik'
import NavButtons from '../../../components/formContainer/NavButtons'
import { AppDispatch, RootState } from '../../../redux/store'

import { connect, useDispatch } from 'react-redux'
import {
  markFishInputCompleted,
  saveFishInput,
} from '../../../redux/reducers/fishInputSlice'

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
  const [tableData, setTableData] = useState(reduxState.values.tableData)
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(
    reduxState.values.speciesCaptured
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
    values.speciesCaptured = checkboxGroupValue
    dispatch(saveFishInput(values))
    dispatch(markFishInputCompleted(true))
    console.log('🚀 ~ Fish Input ~ values', values)
  }

  return (
    <Formik
      // validationSchema={fishInputSchema}
      initialValues={reduxState}
      onSubmit={values => {
        console.log('🚀 ~ values', values)
        handleSubmit(values)
      }}
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
          <Box h='90%' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Which species were captured?</Heading>
              <FormControl w='1/4'>
                <Checkbox.Group
                  colorScheme='green'
                  defaultValue={checkboxGroupValue}
                  accessibilityLabel='pick an item'
                  onChange={values => {
                    setCheckboxGroupValue(values || [])
                  }}
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
              header={'Add Fish'}
              isOpen={addFishModalOpen}
              onClose={() => setAddFishModalOpen(false)}
            >
              <AddFishModalContent />
            </CustomModal>
          </Box>
          <NavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
          />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(FishInput)
