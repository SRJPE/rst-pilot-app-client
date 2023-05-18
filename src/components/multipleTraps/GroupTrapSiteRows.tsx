import React, { useState } from 'react'
import GroupTrapSiteCard from '../form/GroupTrapSiteCard'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'
import { Spacer, Box, Divider, Flex } from 'native-base'
import { TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import {
  GroupTrapSiteValuesI,
  MultipleTrapsInitialStateI,
} from '../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'

const GroupTrapSiteRows = ({
  //numberOfTrapSites,
  trappingSitesStore,
  selectedItemState,
  multipleTrapSitesStore,
}: {
  //numberOfTrapSites: number
  trappingSitesStore: TrappingSitesStoreI
  multipleTrapSitesStore: GroupTrapSiteValuesI
  selectedItemState: any[]
}) => {
  const [selectedItems, setSelectedItems] = selectedItemState

  const {
    values: { numberOfTrapSites },
  } = useFormikContext<GroupTrapSiteValues>()
  let elements = []
  for (let i = 1; i <= numberOfTrapSites; i++) {
    elements.push(
      <>
        <GroupTrapSiteCard
          multipleTrapSitesStore={multipleTrapSitesStore}
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
      <ScrollView style={{ width: '100%' }}>
        <Flex
          flexDirection='row'
          flexWrap='wrap'
          justifyContent='flex-start'
          //alignItems=''
          //width='100%'
          h='100%'
        >
          {elements}
        </Flex>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default GroupTrapSiteRows
