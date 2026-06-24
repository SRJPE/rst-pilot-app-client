import React from 'react'
import {
  Box,
  Button,
  Divider,
  HStack,
  VStack,
  Text,
  Popover,
} from 'native-base'
import { startCase } from 'lodash'

interface FishDetailPopoverProps {
  cellData: {
    forkLength: number | null
    dead: boolean
    existingMark: boolean
    fishConditions: string[]
    lifeStage: string | null
    runDefinition?: string | null
    run?: string | null
    species: string
    eggs?: boolean
    milting?: boolean
    taxonCode: string | null
    uid: string | null
    adiposeClipped?: boolean
    weight?: number | null
    willBeUsedInRecapture?: boolean
  }
  onRemove?: () => void
}

const generateCellStyles = ({
  dead,
  existingMark,
  fishConditions,
}: {
  dead: boolean
  existingMark: boolean
  fishConditions: string[]
}) => {
  let deadStyle = {}
  let existingMarkStyle = {}
  let fishConditionsStyle = {}

  if (dead) {
    deadStyle = {
      borderWidth: 2,
      borderRadius: '50%',
      borderColor: 'black',
      // px: 3,
    }
  }
  return {
    ...deadStyle,
    ...existingMarkStyle,
    ...fishConditionsStyle,

    w: 70,
    h: 10,
  }
}

export const FishDetailPopover: React.FC<FishDetailPopoverProps> = ({
  cellData,
  onRemove,
}) => {
  const {
    forkLength,
    dead,
    existingMark,
    fishConditions,
    lifeStage,
    runDefinition,
    run,
    species,
    adiposeClipped,
    weight,
    willBeUsedInRecapture,
    eggs,
    milting,
  } = cellData

  const runValue = runDefinition || run || ''

  const formattedSpecies =
    species === 'Chinook salmon'
      ? `${species}${lifeStage ? ` - ${startCase(lifeStage)}` : ''} (${runValue ?? ''})`
      : species || 'N/A'

  return (
    <Popover
      shouldFlip
      placement='bottom'
      trigger={triggerProps => {
        return (
          <Button
            borderWidth={1}
            {...triggerProps}
            h={'full'}
            w={'full'}
            background={'white'}
            borderRadius={0}
            display={'flex'}
          >
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              {...generateCellStyles(cellData)}
            >
              <Text fontSize={18}>{forkLength || ''}</Text>
              {eggs && (
                <Text fontSize={12} color='black' mb='auto' ml={1} mt={1}>
                  E
                </Text>
              )}
              {milting && (
                <Text fontSize={12} color='black' mb='auto' ml={1} mt={1}>
                  M
                </Text>
              )}
            </Box>
          </Button>
        )
      }}
    >
      <Box
        accessibilityLabel='Fish Detail'
        style={{
          transform: 'translate(-50%, -50%)',
          width: 600,
          margin: 'auto',
          left: '50%',
          top: '50%',
          position: 'absolute',
          backgroundColor: 'white',
          borderWidth: 1,
          padding: 20,
          borderRadius: 20,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <HStack justifyContent='space-between' alignItems='center'>
          <Text fontSize={20} pt={4} bold>
            Fish Input Details
          </Text>
          <Popover.CloseButton display='block' />
        </HStack>

        <Divider my={2} />

        <HStack space={5}>
          <VStack flex={1}>
            {[
              'Species',
              'Fork Length',
              'Dead',
              'Existing Mark',
              'Fish Conditions',
              'Adipose Clipped',
              species.toLocaleLowerCase().includes('shrimp')
                ? 'Eggs'
                : 'Milting',
            ].map(label => (
              <Text key={label} bold fontSize={18} mb={2}>
                {label}:
              </Text>
            ))}
          </VStack>

          <VStack flex={2}>
            <Text fontSize={18} mb={2}>
              {formattedSpecies}
            </Text>
            <Text fontSize={18} mb={2}>
              {forkLength ?? 'N/A'}
            </Text>
            <Text fontSize={18} mb={2}>
              {dead ? 'Yes' : 'No'}
            </Text>
            <Text fontSize={18} mb={2}>
              {existingMark ? 'Yes' : 'No'}
            </Text>
            <Text fontSize={18} mb={2}>
              {fishConditions?.length > 0 ? fishConditions.join(', ') : 'None'}
            </Text>
            <Text fontSize={18} mb={2}>
              {adiposeClipped ? 'Yes' : 'No'}
            </Text>
            <Text fontSize={18} mb={2}>
              {species.toLocaleLowerCase().includes('shrimp')
                ? eggs
                  ? 'Yes'
                  : 'No'
                : milting
                  ? 'Yes'
                  : 'No'}
            </Text>
          </VStack>
        </HStack>

        {onRemove ? (
          <Button mt={5} colorScheme='danger' onPress={onRemove} maxW={200}>
            <Text fontSize={18} color='white'>
              Remove Fish
            </Text>
          </Button>
        ) : (
          <Text bold fontSize={16} mt={5} color='gray.500'>
            Note: Fish was entered in previous batch. Entry can be
            edited/removed from fish input screen
          </Text>
        )}
      </Box>
    </Popover>
  )
}
