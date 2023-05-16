import { useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import { FormControl, Text, VStack, Input, Checkbox, Flex } from 'native-base'
import { TrappingSitesStoreI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { GroupTrapKey, GroupTrapSiteValues } from '../multipleTraps/interfaces'
import { cloneDeep } from 'lodash'

const GroupTrapSiteCard = ({
  trappingSitesStore,
  selectedItemsState,
  cardId,
}: {
  selectedItemsState: any[]
  trappingSitesStore: TrappingSitesStoreI
  cardId: number
}) => {
  const [selectedItems, setSelectedItems] = selectedItemsState
  const [dropdownValue, setDropdownValue] = useState([])
  const trappingSites = Object.values(trappingSitesStore)

  const { setFieldValue, values } = useFormikContext<GroupTrapSiteValues>()

  console.log('🚀 ~ values:', values)
  const cardIdentifier: GroupTrapKey = `trapSiteGroup-${cardId}`

  useEffect(() => {
    setFieldValue(cardIdentifier, {
      ...cloneDeep(values[cardIdentifier]),
      groupItems: [...dropdownValue],
    })
    const formattedSelected = dropdownValue.map(value => ({
      value,
      assignedTo: values[cardIdentifier].trapSiteName,
    }))
    setSelectedItems((prevSelected: any) => {
      const filteredArray = prevSelected.filter(
        (item: any) => item.assignedTo !== values[cardIdentifier].trapSiteName
      )
      return [...filteredArray, ...formattedSelected]
    })
  }, [dropdownValue])

  return (
    <>
      <VStack
        space={5}
        marginTop={cardId > 2 ? 5 : 0}
        borderWidth={1}
        padding={5}
        borderRadius={5}
        flexBasis='48%'
        h='2xs'
        maxH='sm'
      >
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl' mb={2}>
              Name of Trapping Site
            </Text>
          </FormControl.Label>
          <Input
            placeholder='Enter trap site name to make selections'
            height='50px'
            fontSize='16'
            onChangeText={text => {
              const currentKey = Object.keys(values).find(key =>
                key.includes(cardIdentifier)
              )

              setSelectedItems((prevSelected: any) => {
                const stateCopy = cloneDeep(prevSelected)
                console.log('🚀 ~ setSelectedItems ~ stateCopy:', stateCopy)

                const renamedArray = stateCopy.reduce((acc: any, cur: any) => {
                  if (cur.assignedTo === values[cardIdentifier].trapSiteName) {
                    cur.assignedTo = text
                  }
                  acc.push(cur)
                  return acc
                }, [])
                return renamedArray
              })
              setFieldValue(cardIdentifier, {
                ...values[cardIdentifier],
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
            <Flex direction='row' wrap='wrap'>
              {trappingSites.map(site => {
                const alreadySelected = selectedItems.find(
                  (selectedItem: any) =>
                    selectedItem.value === site.trapName &&
                    selectedItem.assignedTo !==
                      values[cardIdentifier].trapSiteName
                )
                const emptyInputValue =
                  values[cardIdentifier].trapSiteName === ''
                return (
                  <Checkbox
                    key={site.trapName!}
                    value={site.trapName!}
                    mb={3}
                    mr={5}
                    _checked={{ bg: 'primary', borderColor: 'primary' }}
                    isDisabled={alreadySelected || emptyInputValue}
                  >
                    <Text
                      color={
                        alreadySelected || emptyInputValue
                          ? 'gray.400'
                          : 'black'
                      }
                    >
                      {!alreadySelected
                        ? site.trapName
                        : `${site.trapName} (Currently assigned to ${alreadySelected.assignedTo})`}
                    </Text>
                  </Checkbox>
                )
              })}
            </Flex>
          </Checkbox.Group>
        </FormControl>
      </VStack>
    </>
  )
}

export default GroupTrapSiteCard

interface DropdownValues {
  value: string
  label: string
}
