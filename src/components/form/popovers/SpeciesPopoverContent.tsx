import { Image, Popover } from 'native-base'
import React, { memo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const SpeciesPopoverContent = () => {
  return (
    <Popover.Content
      mx='10'
      mb='10'
      accessibilityLabel='Species Lookup'
      minW='720'
      minH='300'
      backgroundColor='light.100'
    >
      <Popover.Arrow />
      <Popover.CloseButton />
      <Popover.Body p={0}>
        <ScrollView>
          <Image
            source={require('../../../../assets/speciesID/Species_ID_Sheet_1-1.jpg')}
            alt='Species ID'
            size='1000px'
          />
          <Image
            source={require('../../../../assets/speciesID/Species_ID_Sheet_2-2.jpg')}
            alt='Species ID'
            size='1000px'
          />
          <Image
            source={require('../../../../assets/speciesID/Species_ID_Sheet_3-3.jpg')}
            alt='Species ID'
            size='1000px'
          />
          <Image
            source={require('../../../../assets/speciesID/Species_ID_Sheet_4-end.jpg')}
            alt='Species ID'
            size='1000px'
          />
        </ScrollView>
      </Popover.Body>
    </Popover.Content>
  )
}
export default memo(SpeciesPopoverContent)
