import React, { useState } from 'react'
import GroupTrapSiteCard from '../form/GroupTrapSiteCard'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'
import { Spacer, Box, Divider, Flex } from 'native-base'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

const GroupTrapSiteRows = ({
  //numberOfTrapSites,
  trappingSitesStore,
  selectedItemState,
}: {
  //numberOfTrapSites: number
  trappingSitesStore: TrappingSitesStoreI
  selectedItemState: any[]
}) => {
  const trappingSites = Object.values(trappingSitesStore)
  const [selectedItems, setSelectedItems] = selectedItemState

  console.log('🚀 ~ selectedItems:', selectedItems)

  const [items, setItems] = useState(
    trappingSites.map(site => ({
      label: site.trapName!,
      value: site.trapName!,
      disabled: false,
    }))
  )
  const {
    values: { numberOfTrapSites },
  } = useFormikContext<GroupTrapSiteValues>()
  let elements = []
  for (let i = 1; i <= numberOfTrapSites; i++) {
    elements.push(
      <>
        <GroupTrapSiteCard
          trappingSitesStore={trappingSitesStore}
          selectedItemsState={[selectedItems, setSelectedItems]}
          cardId={i}
          key={i}
        />
        {i % 2 !== 0 && (
          <Box>
            <Spacer size={4} />
          </Box>
        )}
      </>
    )
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Flex
        flexDirection='row'
        flexWrap='wrap'
        justifyContent='flex-start'
        width='100%'
        h='100%'
      >
        {elements}
      </Flex>
    </TouchableWithoutFeedback>
  )
}

export default GroupTrapSiteRows
