import { Avatar, Divider, HStack, Popover, Text, VStack } from 'native-base'
import React, { memo } from 'react'

const AddExistingMarkPopoverContent = () => {
  return (
    <Popover.Content accessibilityLabel='Existing Mark  Info' w='600' ml='10'>
      <Popover.Arrow />
      <Popover.CloseButton />
      <Popover.Header>
        Click on one more existing mark buttons to add marks.
      </Popover.Header>
      <Popover.Body p={4}>
        <VStack space={2}>
          <Text fontSize='md'>
            The existing mark buttons display abbreviated versions of marks
            recently used for efficiency trials. If you catch a fish with other
            existing marks, please click on “select another mark type”. This
            will open up a window where you can specify mark type, color,
            position, and code if applicable.
          </Text>
          <Divider />

          <Text fontSize='md'>
            Abbreviations follow a consistent format “mark type abbreviation -
            color abbreviation - position abbreviation”. All of these fields are
            only applicable to some mark types. Any fields that are not
            applicable to a particular mark type are left blank.
          </Text>
          <Text fontSize='md'>Below are some examples of common marks:</Text>
          <HStack space={2} alignItems='flex-start'>
            <Avatar size={'2'} mt={'2'} />
            <Text fontSize='md'>CWT: Coded wire tag</Text>
          </HStack>
          <HStack space={2} alignItems='flex-start'>
            <Avatar size={'2'} mt={'2'} />
            <Text fontSize='md'>Fin Clip</Text>
          </HStack>
        </VStack>
      </Popover.Body>
    </Popover.Content>
  )
}
export default memo(AddExistingMarkPopoverContent)
