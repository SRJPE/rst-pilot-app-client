import { useEffect, useState } from 'react'
import { View } from 'native-base'
import { useFormikContext } from 'formik'
import DropDownPicker from 'react-native-dropdown-picker'
import { Box, FormControl, Text, VStack, Input, Spacer } from 'native-base'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const GroupTrapSiteCard = ({
  trappingSites,
  cardId,
}: {
  trappingSites: IndividualTrappingSiteValuesI[]
  cardId: number
}) => {
  const { setValues } = useFormikContext()
  const [dropdownValue, setDropdownValue] = useState([])

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(
    trappingSites.map(site => ({
      label: site.trapName!,
      value: site.trapName!,
    }))
  )
  return (
    <>
      <VStack w='230' space={5} marginTop={cardId > 2 ? 5 : 0}>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Name of Trapping Site
            </Text>
          </FormControl.Label>
          <Input height='50px' fontSize='16' />
        </FormControl>
        <Box h='2xs' bg='secondary' borderRadius={10}>
          <DropDownPicker
            open={open}
            value={dropdownValue}
            items={items}
            setOpen={setOpen}
            setValue={setDropdownValue}
            setItems={setItems}
            multiple={true}
            mode='BADGE'
            badgeDotColors={['#007C7C']}
            placeholder='Select Traps'
            searchPlaceholder='Search...'
            maxHeight={275}
            // renderListItem={props => <CrewListItem {...props} />}
          />
        </Box>
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
