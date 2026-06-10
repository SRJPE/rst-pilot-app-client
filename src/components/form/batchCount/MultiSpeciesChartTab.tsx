import { Box, Center, HStack, Text } from 'native-base'
import { useMemo } from 'react'
import { FlatList } from 'react-native'
import { FishDetailPopover } from '@/src/components/form/batchCount/FishDetailPopover'
import { useDispatch } from 'react-redux'
import { removeForkLengthByUID } from '@/src/redux/reducers/formSlices/batchCountSlice'

const DEFAULT_CELL = {
  forkLength: null,
  dead: false,
  existingMark: false,
  fishConditions: [],
  lifeStage: null,
  runDefinition: null,
  species: '',
  taxonCode: null,
  uid: null,
}

const TOTAL_SLOTS = 50

type Props = {
  slots?: Array<{ index: number; cellData: any }> // kept for backward compat
  species: string
  activeTab: string
  combinedFishObj: Record<string, any[]>
  fishMeasureCounts: Record<string, any>
  fishMeasureProtocol: Record<string, any>
  activeRuns: string[]
  // legacy props — no longer used, kept so callers don't break at compile time
  currentSpeciesPlusCount?: string
  currentSpeciesMeasuredCount?: string
}

const MultiSpeciesChartTab = ({
  activeTab,
  species,
  combinedFishObj,
  fishMeasureCounts,
  fishMeasureProtocol,
  activeRuns,
}: Props) => {
  const dispatch = useDispatch()

  const slots = useMemo(() => {
    const isChinook = species.toLowerCase().includes('chinook')
    const allFish = combinedFishObj[species] || []
    const individualFish = allFish.filter((item: any) => !item.plusCount)
    const rows = Math.ceil(individualFish.length / 10) || 1

    let protocolSlots = fishMeasureProtocol[species] || TOTAL_SLOTS
    if (rows * 10 > protocolSlots) {
      protocolSlots = rows * 10
    }

    let fishCellData = individualFish
    if (isChinook) {
      fishCellData =
        individualFish.filter(
          (item: any) =>
            activeRuns.includes(item.runDefinition) ||
            activeRuns.includes(item.run)
        ) || []
    }

    return Array.from({ length: protocolSlots }, (_, i) => ({
      index: i,
      cellData: fishCellData[i] || DEFAULT_CELL,
    }))
  }, [combinedFishObj, species, fishMeasureProtocol, activeRuns])

  const sumForSpecies = (field: 'individualCount' | 'plusCount') =>
    Object.entries(fishMeasureCounts)
      .filter(([key]) => key === species || key.startsWith(species + ' - '))
      .reduce((sum, [, val]) => sum + (Number(val[field]) || 0), 0)

  const measuredCount = String(sumForSpecies('individualCount'))
  const plusCount = String(sumForSpecies('plusCount'))

  return (
    <Box
      flex={1}
      my='4'
      display={'flex'}
      flexDirection={'row'}
      borderWidth={1}
      flexWrap={'wrap'}
      borderRadius={15}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <Box
            key={i}
            width={'10%'}
            flex={1}
            h={41}
            borderWidth={1}
            background='gray.200'
            style={{
              borderTopLeftRadius: i === 0 ? 15 : 0,
              borderTopRightRadius: i === 9 ? 15 : 0,
            }}
          >
            <Center h={'full'} w={'full'}>
              <Text fontSize={18} bold>
                {i + 1}
              </Text>
            </Center>
          </Box>
        )
      })}

      <FlatList
        data={slots}
        keyExtractor={item => item.cellData.uid ?? `slot-${item.index}`}
        numColumns={10}
        scrollEnabled={false}
        style={{ width: '100%' }}
        renderItem={({ item }) => {
          const { cellData, index } = item
          return cellData.forkLength ? (
            <Box width={'10%'} h={50} position='relative'>
              <FishDetailPopover
                cellData={cellData}
                onRemove={
                  cellData.uid
                    ? () => dispatch(removeForkLengthByUID(cellData.uid))
                    : undefined
                }
              />
            </Box>
          ) : (
            <Box width={'10%'} h={50}>
              <Center borderWidth={1} h='full' w='full' background='white'>
                <Text fontSize={18}>{''}</Text>
              </Center>
            </Box>
          )
        }}
      />

      <HStack
        w='full'
        background='gray.200'
        style={{ borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
      >
        <Text fontSize={18} p={3} display='flex'>
          <Text bold>Species:</Text>
          <Text> </Text>
          <Text>{species}</Text>
        </Text>
        <Text fontSize={18} p={3} display='flex'>
          <Text bold>Measured Count:</Text>
          <Text> </Text>
          <Text>{measuredCount}</Text>
        </Text>
        <Text fontSize={18} p={3} display='flex'>
          <Text bold>Plus Count:</Text>
          <Text> </Text>
          <Text>{plusCount}</Text>
        </Text>
      </HStack>
    </Box>
  )
}

export default MultiSpeciesChartTab
