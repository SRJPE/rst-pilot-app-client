import React from 'react'
import {
  Text,
  VStack,
  Button,
  HStack,
  Popover,
  FormControl,
  IconButton,
  Icon,
  Divider,
  Avatar,
} from 'native-base'
import { decodedRecentReleaseMarks } from '../../utils/utils'
import { ReleaseMarkI } from '../../utils/interfaces'
import { MaterialIcons } from '@expo/vector-icons'

export default function AddExistingMark({
  dropdownValues,
  activeTabId,
  recentExistingMarks,
  handlePressRecentExistingMarkButton,
  visitSetupState,
}: {
  dropdownValues: any
  activeTabId: string | null
  recentExistingMarks: ReleaseMarkI[]
  handlePressRecentExistingMarkButton: any
  visitSetupState: any
}) {
  console.log('recentExistingMarks', recentExistingMarks)
  return (
    <>
      <HStack space={2} alignItems='center'>
        <FormControl.Label>
          <Text color='black' fontSize='xl'>
            Add Existing Mark
          </Text>
        </FormControl.Label>
        <Popover
          placement='top right'
          trigger={triggerProps => {
            return (
              <IconButton
                {...triggerProps}
                icon={
                  <Icon
                    as={MaterialIcons}
                    color='black'
                    name='info-outline'
                    size='xl'
                  />
                }
              ></IconButton>
            )
          }}
        >
          <Popover.Content
            accessibilityLabel='Existing Mark  Info'
            w='600'
            ml='10'
          >
            <Popover.Arrow />
            <Popover.CloseButton />
            <Popover.Header>
              Click on one more existing mark buttons to add marks.
            </Popover.Header>
            <Popover.Body p={4}>
              <VStack space={2}>
                <Text fontSize='md'>
                  The existing mark buttons display abbreviated versions of
                  marks recently used for efficiency trials. If you catch a fish
                  with other existing marks, please click on “select another
                  mark type”. This will open up a window where you can specify
                  mark type, color, position, and code if applicable.
                </Text>
                <Divider />

                <Text fontSize='md'>
                  Abbreviations follow a consistent format “mark type
                  abbreviation - color abbreviation - position abbreviation”.
                  All of these fields are only applicable to some mark types.
                  Any fields that are not applicable to a particular mark type
                  are left blank.
                </Text>
                <Text fontSize='md'>
                  Below are some examples of common marks:
                </Text>
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
        </Popover>
      </HStack>
      <VStack space={5}>
        {dropdownValues?.releaseMarks?.length > 0 &&
          decodedRecentReleaseMarks(
            dropdownValues,
            activeTabId
              ? visitSetupState?.[activeTabId]?.values?.programId
              : null
          ).map((recentReleaseMark: any, index: number) => {
            const { id, markType, markColor, markPosition, releasedAt } =
              recentReleaseMark
            return (
              <Button
                key={index}
                bg={
                  recentExistingMarks.some(
                    (mark: ReleaseMarkI) => mark.id === id
                  )
                    ? 'primary'
                    : 'secondary'
                }
                shadow='3'
                borderRadius='5'
                w='100%'
                onPress={() => {
                  handlePressRecentExistingMarkButton(recentReleaseMark)
                }}
                justifyContent='flex-start'
              >
                <Text
                  color={
                    recentExistingMarks.some(
                      (mark: ReleaseMarkI) => mark.id === id
                    )
                      ? 'white'
                      : 'primary'
                  }
                  fontWeight='500'
                  fontSize='md'
                >
                  Released On: {new Date(releasedAt).toLocaleDateString()}
                  {` (${markType}${markColor ? `- ${markColor}` : ''} ${
                    markPosition ? `- ${markPosition}` : ''
                  })`}
                </Text>
              </Button>
            )
          })}
      </VStack>
    </>
  )
}
