import { useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import {
  FormControl,
  Text,
  VStack,
  Input,
  Checkbox,
  Flex,
  Box,
} from 'native-base'
import { TrappingSitesStoreI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { GroupTrapKey, GroupTrapSiteValues } from '../multipleTraps/interfaces'
import { cloneDeep } from 'lodash'
import { GroupTrapSiteValuesI } from '../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'

const GroupTrapSiteCard = ({
  trappingSitesStore,
  selectedItemsState,
  cardId,
  multipleTrapSitesStore,
}: {
  selectedItemsState: any[]
  trappingSitesStore: TrappingSitesStoreI
  multipleTrapSitesStore: GroupTrapSiteValuesI
  cardId: number
}) => {
  const [selectedItems, setSelectedItems] = selectedItemsState
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([])

  const trappingSites = Object.values(trappingSitesStore)

  const { setFieldValue, values } = useFormikContext<GroupTrapSiteValues>()

  const cardIdentifier: GroupTrapKey = `trapSiteGroup-${cardId}`

  useEffect(() => {
    const cardValues = values[cardIdentifier]

    setSelectedCheckboxes(cardValues.groupItems)
  }, [cardIdentifier])

  useEffect(() => {
    setFieldValue(cardIdentifier, {
      ...cloneDeep(values[cardIdentifier]),
      groupItems: [...selectedCheckboxes],
    })
    const formattedSelected = selectedCheckboxes.map(value => ({
      value,
      assignedTo: values[cardIdentifier].trapSiteName,
    }))
    setSelectedItems((prevSelected: any) => {
      const filteredArray = prevSelected.filter(
        (item: any) => item.assignedTo !== values[cardIdentifier].trapSiteName
      )

      return [...filteredArray, ...formattedSelected]
    })
  }, [selectedCheckboxes])

  return (
    <>
      <VStack
        space={5}
        bgColor={'secondary'}
        marginTop={cardId > 2 ? 5 : 0}
        shadow={5}
        padding={5}
        borderRadius={20}
        flexBasis='48.5%'
        minH='2xs'
        //height='md'
        //maxH='md'
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
            bg='white'
            borderColor='hsla(0,0%,0%,.55)'
            _input={{
              borderColor: 'black',
            }}
            defaultValue={values[cardIdentifier].trapSiteName}
            onChangeText={text => {
              const currentKey = Object.keys(values).find(key =>
                key.includes(cardIdentifier)
              )

              setSelectedItems((prevSelected: any) => {
                const stateCopy = cloneDeep(prevSelected)

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
          <FormControl.Label marginBottom={2}>Traps:</FormControl.Label>
          <Checkbox.Group
            value={selectedCheckboxes}
            onChange={values => {
              setSelectedCheckboxes(values)
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
                  <Box
                    bg='hsl(13, 80%, 86%)'
                    mb={3}
                    mr={2}
                    p={3}
                    borderRadius={50}
                    display={alreadySelected ? 'none' : 'default'}
                  >
                    <Checkbox
                      key={site.trapName!}
                      value={site.trapName!}
                      _checked={{ bg: 'primary', borderColor: 'primary' }}
                      isDisabled={alreadySelected || emptyInputValue}
                      style={{
                        borderRadius: 50,
                        borderColor: 'hsla(0,0%,0%,.6)',
                        borderWidth: 1,
                      }}
                    >
                      <Text color={'white'} fontSize={16} fontWeight={700}>
                        {site.trapName}
                      </Text>
                    </Checkbox>
                  </Box>
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
