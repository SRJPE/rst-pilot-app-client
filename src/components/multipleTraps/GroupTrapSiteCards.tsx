import React, { useState } from 'react'
import GroupTrapSiteCard from '../form/GroupTrapSiteCard'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'
import { Spacer, Box, Divider, Flex, Text } from 'native-base'
import { TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import {
  GroupTrapSiteValuesI,
  MultipleTrapsInitialStateI,
} from '../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'

const GroupTrapSiteCards = ({
  trappingSitesStore,
  selectedItemState,
  multipleTrapSitesStore,
}: {
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
          px={6}
        >
          <Text mb={1} fontSize={15}>
            To assign a trap to a site, select the trap token within the site
            card you would like for it to be assigned to.
          </Text>
          <Text textAlign='justify' mb={5} fontSize={15}>
            Assigned traps will be indicated by a green check. Any assigned trap
            will be removed from view on the other site cards. To reassign a
            trap, first uncheck it from the currently assigned site, before
            selecting it within the new site you would like it to be assigned
            to.
          </Text>
          {elements}
        </Flex>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default GroupTrapSiteCards
