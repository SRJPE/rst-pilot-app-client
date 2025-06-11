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

const FishEntriesSummary = ({
  lastFishEntry,
  totalCatchCount,
  fishMeasureProtocol,
  activeTabId,
  fishInputSlice,
}: {
  lastFishEntry: any
  totalCatchCount: number
  fishMeasureProtocol: Record<string, string>
  activeTabId: string | null
  fishInputSlice: Record<string, any> | null | undefined
}) => {
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
        <Text fontSize={'lg'}>
          <Text bold>Last Entry: </Text>
          {`${lastFishEntry.species} ${
            lastFishEntry.lifeStage ? `(${lastFishEntry.lifeStage})` : ''
          } - Fork Length: ${lastFishEntry.forkLength}mm`}
        </Text>
        <Text fontSize={'lg'}>
          <Text bold>Total Catch Count Entered: </Text>
          {totalCatchCount}
        </Text>
        {activeTabId && fishInputSlice && (
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
                        fishInputSlice?.[activeTabId]?.fishMeasureCounts ||
                          ({} as Record<string, { individualCount?: number }>)
                      ).map(([fishName, countObj]) => (
                        <Text key={fishName} fontSize={'lg'}>
                          {fishName}:{' '}
                          {String(
                            (countObj as { individualCount?: number })
                              ?.individualCount
                          )}{' '}
                          / {fishMeasureProtocol[fishName]} (Plus Count:{' '}
                          {(countObj as { plusCount?: number }).plusCount || 0})
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
