import { Box, Center, HStack, Text } from 'native-base'
import { useMemo } from 'react'
import { FlatList } from 'react-native'
import { FishDetailPopover } from '@/src/components/form/batchCount/FishDetailPopover'
import { useDispatch } from 'react-redux'
import { removeForkLengthByUID } from '@/src/redux/reducers/formSlices/batchCountSlice'

type Props = {
  slots: Array<{ index: number; cellData: any }>
  species: string
  activeTab: string
  combinedFishObj: Record<string, any[]>
  currentSpeciesPlusCount: string
  currentSpeciesMeasuredCount: string
}

const MultiSpeciesChartTab = ({
  slots,
  activeTab,
  species,
  combinedFishObj,
  currentSpeciesPlusCount,
  currentSpeciesMeasuredCount,
}: Props) => {
  const dispatch = useDispatch()

  console.log('slots', slots)
  return (
    <Box
      flex={1}
      my='4'
      display={'flex'}
      flexDirection={'row'}
      borderWidth={1}
      flexWrap={'wrap'}
      borderRadius={15}
      // overflow='hidden'
    >
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <Box
            key={i}
            width={'10%'}
            flex={1}
            // flexBasis={'9.5%'}
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
        numColumns={10} // ✅ each row 10 cells (adjust flexBasis to match)
        scrollEnabled={false} // ✅ let parent container scroll
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
          <Text>{currentSpeciesMeasuredCount}</Text>
        </Text>
        <Text fontSize={18} p={3} display='flex'>
          <Text bold>Plus Count:</Text>
          <Text> </Text>
          <Text>{currentSpeciesPlusCount}</Text>
        </Text>
      </HStack>
    </Box>
  )
}

export default MultiSpeciesChartTab
