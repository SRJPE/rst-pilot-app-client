import React, { useState } from 'react'
import GroupTrapSiteCard from '../form/GroupTrapSiteCard'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'
import { Spacer, Box, Divider } from 'native-base'

const GroupTrapSiteRows = ({
  //numberOfTrapSites,
  trappingSitesStore,
}: {
  //numberOfTrapSites: number
  trappingSitesStore: TrappingSitesStoreI
}) => {
  const trappingSites = Object.values(trappingSitesStore)
  const [selectedItems, setSelectedItems] = useState([]) as any[]
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
          dropdownItems={[selectedItems, setSelectedItems]}
          cardId={i}
          key={i}
        />
      </>
    )
  }
  return <>{elements}</>
}

export default GroupTrapSiteRows
