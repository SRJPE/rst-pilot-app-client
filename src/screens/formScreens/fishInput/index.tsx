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

const styles = StyleSheet.create({
  tableHead: { height: 40, backgroundColor: '#f1f8ff' },
  tableText: { marginVertical: 6, marginLeft: 3 },
})

const FishInput = () => {
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(['YOY Chinook'])
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
  const [tableData, setTableData] = useState([
    ['Chinook', '100', '10', '', '', '', '', '', ''],
    ['Chinook', '100', '10', '', '', '', '', '', ''],
    ['Chinook', '100', '10', '', '', '', '', '', ''],
    ['Chinook', '100', '10', '', '', '', '', '', ''],
  ])

  return (
    <Box h='full' bg='#fff' p='10%'>
      <VStack space={8}>
        <Heading>Which species were captured?</Heading>
        <FormControl w='1/4'>
          <Checkbox.Group
            colorScheme='green'
            defaultValue={checkboxGroupValue}
            accessibilityLabel='pick an item'
            onChange={(values) => {
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
            onPress={() => {}}
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
      <CustomModal header={'Add Fish'} isOpen={true} onClose={undefined}>
        <AddFishModalContent />
      </CustomModal>
    </Box>
  )
}
export default FishInput
