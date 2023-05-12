import React from 'react'
import GroupTrapSiteCard from '../form/GroupTrapSiteCard'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'

const GroupTrapSiteRows = ({
  //numberOfTrapSites,
  trappingSites,
}: {
  //numberOfTrapSites: number
  trappingSites: IndividualTrappingSiteValuesI[]
}) => {
  const {
    values: { numberOfTrapSites },
  } = useFormikContext<GroupTrapSiteValues>()
  let elements = []
  for (let i = 1; i <= numberOfTrapSites; i++) {
    elements.push(
      <GroupTrapSiteCard trappingSites={trappingSites} cardId={i} key={i} />
    )
  }
  return <>{elements}</>
}

export default GroupTrapSiteRows
