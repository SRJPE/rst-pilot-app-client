import { Image, Popover } from 'native-base'
import React, { memo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const LifeStagePopoverContent = () => {
  return (
    <Popover.Content
      ml='10'
      accessibilityLabel='Existing Mark Info'
      w='720'
      h='600'
    >
      <Popover.Arrow />
      <Popover.CloseButton />
      <Popover.Body p={0}>
        <ScrollView>
          <Image
            source={require('../../../../assets/life_stage_image.png')}
            alt='Life Stage Image'
            width='720'
          />
          <Image
            source={require('../../../../assets/life_stage_table.png')}
            alt='Life Stage Image'
          />
        </ScrollView>
      </Popover.Body>
    </Popover.Content>
  )
}
export default memo(LifeStagePopoverContent)
