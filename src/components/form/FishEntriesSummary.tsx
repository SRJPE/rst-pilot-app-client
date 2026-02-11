import { Box, Text, VStack, Divider } from 'native-base'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from '@/components/ui/accordion'
import { ChevronUpIcon, ChevronDownIcon } from '@/components/ui/icon'
import { useEffect, useState } from 'react'
import { startCase } from 'lodash'
import { sumCountsWithFallback } from '@/src/utils/utils'

const FishEntriesSummary = ({
  lastFishEntry,
  totalCatchCount,
  fishMeasureProtocol,
  fishMeasureCounts,
  showSpeciesCounts = true,
}: {
  lastFishEntry: any
  totalCatchCount: number
  fishMeasureProtocol: Record<any, any>
  fishMeasureCounts: Record<string, any>
  showSpeciesCounts?: boolean
}) => {
  const [protocolCounts, setProtocolCounts] = useState<Record<string, number>>(
    {}
  )

  useEffect(() => {
    if (
      !fishMeasureProtocol ||
      !fishMeasureCounts ||
      !Object.keys(fishMeasureCounts).length ||
      !showSpeciesCounts
    ) {
      return
    }

    const finalSums = sumCountsWithFallback(
      fishMeasureProtocol,
      fishMeasureCounts
    )
    setProtocolCounts(finalSums)
  }, [fishMeasureProtocol, fishMeasureCounts])

  const formatFishMeasureProtocolText = (fishName: string) => {
    return fishName
      .split(' - ')
      .map(part =>
        part
          .split('/')
          .map(sub => startCase(sub.trim()))
          .join(' / ')
      )
      .join(' - ')
  }
  const formatLastEntryText = (lastFishEntry: any) => {
    let entryText = ''

    if (!lastFishEntry || !Object.keys(lastFishEntry).length) {
      return entryText
    }

    entryText += startCase(lastFishEntry.species)

    if (
      lastFishEntry.lifeStage &&
      lastFishEntry.lifeStage.toLowerCase() !== 'not recorded'
    ) {
      entryText += ' - ' + startCase(lastFishEntry.lifeStage)
    }

    if (
      lastFishEntry.runDefinition &&
      lastFishEntry.runDefinition.toLowerCase() !== 'not recorded'
    ) {
      entryText += ' - ' + startCase(lastFishEntry.runDefinition)
    } else if (
      lastFishEntry.run &&
      lastFishEntry.run.toLowerCase() !== 'not recorded'
    ) {
      entryText += ' - ' + startCase(lastFishEntry.run)
    }

    entryText += ` - ${lastFishEntry.forkLength}mm`

    return entryText
  }

  return (
    <Box
      py={3}
      px={5}
      w={'full'}
      borderWidth={1}
      borderColor={'primary'}
      borderRadius={5}
      bg='coolGray.100'
      mt={2}
    >
      <VStack space={1}>
        {lastFishEntry.forkLength && (
          <>
            <Text fontSize={'lg'}>
              <Text bold>Last Entry: </Text>
              {formatLastEntryText(lastFishEntry) || 'No entries recorded yet.'}
            </Text>
          </>
        )}
        <Text fontSize={'lg'}>
          <Text bold>Total Catch Count Entered: </Text>
          {totalCatchCount}
        </Text>
        {fishMeasureCounts && showSpeciesCounts && (
          <>
            <Accordion
              size='lg'
              variant='unfilled'
              type='single'
              isCollapsible={true}
              isDisabled={false}
              defaultValue={['species']}
              style={{
                marginTop: 0,
                paddingTop: 0,
              }}
            >
              <AccordionItem value='species'>
                <AccordionHeader>
                  <AccordionTrigger
                    style={{
                      width: '100%',
                      paddingLeft: 0,
                      paddingTop: 0,
                    }}
                  >
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      return (
                        <>
                          <AccordionTitleText>
                            <Text fontSize={'lg'}>
                              <Text bold>Species Counts: </Text>
                            </Text>
                          </AccordionTitleText>
                          {isExpanded ? (
                            <AccordionIcon
                              as={ChevronUpIcon}
                              className='ml-3'
                              size={'xl'}
                            />
                          ) : (
                            <AccordionIcon
                              as={ChevronDownIcon}
                              className='ml-3'
                              size={'xl'}
                            />
                          )}
                        </>
                      )
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <AccordionContentText>
                    <VStack space={0.5}>
                      {Object.entries(
                        protocolCounts ||
                          ({} as Record<string, { individualCount?: number }>)
                      )
                        .sort(([a], [b]) => {
                          // Sort 'Chinook' first, 'Steelhead' second, then alphabetical
                          const getPriority = (name: string) => {
                            if (fishMeasureProtocol[name]) {
                              return 0
                            } else if (name.includes('Chinook')) return 1
                            if (name.includes('Steelhead')) return 2
                            return 3
                          }
                          const priorityA = getPriority(a)
                          const priorityB = getPriority(b)
                          if (priorityA !== priorityB) {
                            return priorityA - priorityB
                          }
                          return a.localeCompare(b)
                        })
                        .map(([fishName, countObj]: [string, any]) => (
                          <Text
                            key={fishName}
                            fontSize={'lg'}
                            bold={
                              countObj?.individualCount >=
                              fishMeasureProtocol[fishName]
                            }
                          >
                            {formatFishMeasureProtocolText(fishName)}:{' '}
                            {String(
                              (countObj as { individualCount?: number })
                                ?.individualCount
                            )}
                            {fishMeasureProtocol[fishName]
                              ? `/${fishMeasureProtocol[fishName]} `
                              : ' '}
                            (Plus Count:{' '}
                            {(countObj as { plusCount?: number }).plusCount ||
                              0}
                            )
                          </Text>
                        ))}
                    </VStack>
                  </AccordionContentText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default FishEntriesSummary
