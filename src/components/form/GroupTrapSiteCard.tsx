import { useEffect, useState } from 'react'
import { View } from 'native-base'
import { useFormikContext } from 'formik'
import {
  Box,
  FormControl,
  Text,
  VStack,
  Input,
  Spacer,
  Checkbox,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { GroupTrapSiteValues } from '../multipleTraps/interfaces'

import { current } from '@reduxjs/toolkit'
import { TouchableWithoutFeedback } from 'react-native'

const GroupTrapSiteCard = ({
  trappingSitesStore,
  dropdownItems,
  cardId,
}: {
  dropdownItems: any[]
  trappingSitesStore: TrappingSitesStoreI
  cardId: number
}) => {
  const [selectedItems, setSelectedItems] = dropdownItems
  const [dropdownValue, setDropdownValue] = useState([])
  const [open, setOpen] = useState(false)
  const trappingSites = Object.values(trappingSitesStore)

  const { setFieldValue, values, touched } =
    useFormikContext<GroupTrapSiteValues>()

  useEffect(() => {
    setFieldValue(`trapSiteGroup-${cardId}`, {
      ...values[`trapSiteGroup-${cardId}`],
      groupItems: [...dropdownValue],
    })
    const formattedSelected = dropdownValue.map(value => ({
      value,
      assignedTo: values[`trapSiteGroup-${cardId}`].trapSiteName,
    }))
    setSelectedItems((prevSelected: any) => {
      const filteredArray = prevSelected.filter(
        (item: any) =>
          item.assignedTo !== values[`trapSiteGroup-${cardId}`].trapSiteName
      )
      console.log('🚀 ~ setSelectedItems ~ filteredArray:', filteredArray)

      return [...filteredArray, ...formattedSelected]
    })
  }, [dropdownValue])

  return (
    <>
      <VStack
        w='100%'
        space={5}
        marginTop={cardId > 3 ? 5 : 0}
        borderWidth={1}
        padding={5}
        borderRadius={5}
      >
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Name of Trapping Site
            </Text>
          </FormControl.Label>
          <Input
            placeholder='Enter trap site name to make group selections'
            height='50px'
            fontSize='16'
            onChangeText={text => {
              const currentKey = Object.keys(values).find(key =>
                key.includes(`trapSiteGroup-${cardId}`)
              )

              setSelectedItems((prevSelected: any) => {
                const renamedArray = prevSelected.reduce(
                  (acc: any, cur: any) => {
                    if (
                      cur.assignedTo ===
                      values[`trapSiteGroup-${cardId}`].trapSiteName
                    ) {
                      cur.assignedTo = text
                    }
                    acc.push(cur)
                    return acc
                  },
                  []
                )
                return renamedArray
              })
              setFieldValue(`trapSiteGroup-${cardId}`, {
                ...values[`trapSiteGroup-${cardId}`],
                trapSiteName: text,
              })
            }}
          />
        </FormControl>
        <FormControl>
          <Checkbox.Group
            value={dropdownValue}
            onChange={values => {
              setDropdownValue(values)
            }}
          >
            {trappingSites.map(site => {
              const alreadySelected = selectedItems.find(
                (selectedItem: any) =>
                  selectedItem.value === site.trapName &&
                  selectedItem.assignedTo !==
                    values[`trapSiteGroup-${cardId}`].trapSiteName
              )
              const emptyInputValue =
                values[`trapSiteGroup-${cardId}`].trapSiteName === ''
              return (
                <Checkbox
                  key={site.trapName!}
                  value={site.trapName!}
                  mb={3}
                  isDisabled={alreadySelected || emptyInputValue}
                >
                  <Text
                    color={
                      alreadySelected || emptyInputValue ? 'gray.400' : 'black'
                    }
                  >
                    {!alreadySelected
                      ? site.trapName
                      : `${site.trapName} (Currently assigned to ${alreadySelected.assignedTo})`}
                  </Text>
                </Checkbox>
              )
            })}
          </Checkbox.Group>
        </FormControl>
      </VStack>

      <Box>
        <Spacer size={4} />
      </Box>
    </>
  )
}

export default GroupTrapSiteCard

interface DropdownValues {
  value: string
  label: string
}
