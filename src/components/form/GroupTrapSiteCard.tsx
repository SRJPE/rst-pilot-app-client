import { useEffect, useState } from 'react'
import { View } from 'native-base'
import { useFormikContext } from 'formik'
import DropDownPicker from 'react-native-dropdown-picker'
import { Box, FormControl, Text, VStack, Input, Spacer } from 'native-base'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { GroupTrapSiteValues } from '../multipleTraps/interfaces'

import { current } from '@reduxjs/toolkit'
import { TouchableWithoutFeedback } from 'react-native'

const GroupTrapSiteCard = ({
  trappingSites,
  cardId,
}: {
  trappingSites: IndividualTrappingSiteValuesI[]
  cardId: number
}) => {
  const [dropdownValue, setDropdownValue] = useState([])

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(
    trappingSites.map(site => ({
      label: site.trapName!,
      value: site.trapName!,
      disabled: false,
    }))
  )

  const { setFieldValue, values, touched } =
    useFormikContext<GroupTrapSiteValues>()
  console.log('🚀 ~ touched:', touched)

  console.log('🚀 ~ values:', values)

  useEffect(() => {
    setFieldValue(`trapSiteGroup-${cardId}`, {
      ...values[`trapSiteGroup-${cardId}`],
      groupItems: [...dropdownValue],
    })
  }, [dropdownValue])

  useEffect(() => {
    console.log('Array', Object.values(values))
  }, [values])

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          console.log('hit')
          setOpen(false)
        }}
      >
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
              height='50px'
              fontSize='16'
              onChangeText={text => {
                const currentKey = Object.keys(values).find(key =>
                  key.includes(`trapSiteGroup-${cardId}`)
                )

                setFieldValue(`trapSiteGroup-${cardId}`, {
                  ...values[`trapSiteGroup-${cardId}`],
                  trapSiteName: text,
                })
              }}
            />
          </FormControl>
          <Box borderRadius={10}>
            <DropDownPicker
              open={open}
              value={dropdownValue}
              items={items}
              setOpen={setOpen}
              setValue={setDropdownValue}
              setItems={setItems}
              multiple={true}
              mode='SIMPLE'
              badgeDotColors={['#007C7C']}
              placeholder='Select Traps'
              searchPlaceholder='Search...'
              // maxHeight={275}

              // renderListItem={props => <CrewListItem {...props} />}
            />
            <VStack m={5}>
              {values[`trapSiteGroup-${cardId}`].groupItems.map(item => (
                <Text fontSize={16}>• {item}</Text>
              ))}
            </VStack>
          </Box>
        </VStack>
      </TouchableWithoutFeedback>
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
