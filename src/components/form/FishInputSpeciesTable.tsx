import React from 'react'
import { View, HStack, Text } from 'native-base'
import { List } from 'react-native-paper'

/**
 * Species-grouped fork-length grid, exactly as shown on the Review Trap
 * Visit Values screen's "Fish Input" panel: one block per species, a
 * Species/Measured/Plus Count header, then a numbered grid of individual
 * fish (10 per row) with FL as the primary value and optional sub-rows
 * (Run, Ad +/-, Weight, Stage, Comments, Genetics) only when at least one
 * fish in that species has that data. Shared with ImportPreviewModal.tsx so
 * a crew sees the same layout reviewing an import as reviewing a live
 * submission.
 *
 * Expects the live fishInputState `fishStore` shape (or an equivalent
 * transform of it) - display strings already resolved (e.g. `run`/
 * `lifeStage` as text, not ids), not the post-transformation submission
 * payload shape.
 */
export const FishInputSpeciesTable = ({ fishList }: { fishList: any[] }) => {
  if (!fishList.length) {
    return (
      <List.Item
        title='No Fish Caught'
        titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
        style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
      />
    )
  }

  const bySpecies: Record<
    string,
    { individuals: (any | null)[]; plusCounts: any[] }
  > = {}
  fishList.forEach((fish: any) => {
    const sp = fish.species || 'Unknown'
    if (!bySpecies[sp]) bySpecies[sp] = { individuals: [], plusCounts: [] }
    if (fish.plusCount) bySpecies[sp].plusCounts.push(fish)
    else bySpecies[sp].individuals.push(fish)
  })

  const COLS = 10
  const LABEL_W = 110
  const HEADER_H = 41
  const FL_H = 50
  const SUB_H = 38

  const FLCellContent = ({ fish }: { fish: any }) => {
    const fl = fish.forkLength != null ? String(fish.forkLength) : '-'
    const inner = (
      <HStack alignItems='flex-start' space={0} justifyContent='center'>
        <Text fontSize={18}>{fl}</Text>
        {(fish.eggs || fish.milting) && (
          <Text
            fontSize={11}
            color='gray.600'
            style={{ lineHeight: 14, marginTop: 2 }}
          >
            {[fish.eggs ? 'E' : '', fish.milting ? 'M' : '']
              .filter(Boolean)
              .join('')}
          </Text>
        )}
      </HStack>
    )
    if (fish.dead) {
      return (
        <View
          style={{
            borderWidth: 2,
            borderRadius: 50,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderColor: '#333',
            alignItems: 'center',
          }}
        >
          {inner}
        </View>
      )
    }
    return inner
  }

  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
      {Object.entries(bySpecies).map(
        ([species, { individuals, plusCounts }]) => {
          const has = (fn: (f: any) => boolean) =>
            (individuals.filter(Boolean) as any[]).some(fn)
          const hasRun = has(f => f.run && f.run !== 'not recorded')
          const hasAdipose = has(f => f.adiposeClipped != null)
          const hasGenetics = has(
            f => Array.isArray(f.geneticSamples) && f.geneticSamples.length
          )
          const hasWeight = has(f => f.weight != null)
          const hasStage = has(
            f => f.lifeStage && f.lifeStage !== 'not recorded'
          )
          const hasComments = has(f => f.comments)

          const plusLabel = plusCounts
            .map((f: any) => `+${f.numFishCaught}`)
            .join(', ')
          const totalCount = individuals.filter(Boolean).length

          const chunks: (any | null)[][] = []
          for (let i = 0; i < Math.max(individuals.length, 1); i += COLS) {
            const chunk = (individuals as any[]).slice(i, i + COLS)
            while (chunk.length < COLS) chunk.push(null)
            chunks.push(chunk)
          }
          if (!individuals.length) chunks[0] = Array(COLS).fill(null)

          return (
            <View
              key={species}
              style={{
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 15,
                overflow: 'hidden',
              }}
            >
              {/* Top info bar */}
              <HStack
                style={{
                  backgroundColor: '#e5e7eb',
                  borderBottomWidth: 1,
                  borderBottomColor: '#d1d5db',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <Text fontSize={16}>
                  <Text fontWeight='bold'>Species: </Text>
                  {species}
                </Text>
                <Text fontSize={16}>
                  <Text fontWeight='bold'>Measured: </Text>
                  {totalCount}
                </Text>
                {!!plusLabel && (
                  <Text fontSize={16}>
                    <Text fontWeight='bold'>Plus Count: </Text>
                    {plusLabel}
                  </Text>
                )}
              </HStack>

              {chunks.map((chunk, ci) => (
                <View key={ci}>
                  {/* Number header row - first chunk only */}
                  {ci === 0 && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: HEADER_H,
                          backgroundColor: '#e5e7eb',
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#d1d5db',
                        }}
                      >
                        <Text fontSize={14} fontWeight='bold' color='gray.700'>
                          FL (mm)
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((_, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: HEADER_H,
                              backgroundColor: '#e5e7eb',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#d1d5db',
                            }}
                          >
                            <Text fontSize={18} fontWeight='bold'>
                              {i + 1}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}

                  {/* FL row */}
                  <HStack>
                    <View
                      style={{
                        width: LABEL_W,
                        height: FL_H,
                        backgroundColor: '#f0fffe',
                        justifyContent: 'center',
                        paddingHorizontal: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#d1d5db',
                      }}
                    />
                    <HStack flex={1}>
                      {chunk.map((fish, i) => (
                        <View
                          key={i}
                          style={{
                            flex: 1,
                            height: FL_H,
                            backgroundColor: '#f0fffe',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: '#d1d5db',
                          }}
                        >
                          {fish ? <FLCellContent fish={fish} /> : null}
                        </View>
                      ))}
                    </HStack>
                  </HStack>

                  {/* Sub-rows */}
                  {hasRun && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Run
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish && fish.run && fish.run !== 'not recorded'
                                ? fish.run
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasAdipose && species.toLowerCase().includes('chinook') && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Ad +/-
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish
                                ? fish.adiposeClipped == null
                                  ? ''
                                  : fish.adiposeClipped
                                    ? '+'
                                    : '−'
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasWeight && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Wt. (g)
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish && fish.weight != null
                                ? String(fish.weight)
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasStage && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Stage
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text fontSize={13}>
                              {fish &&
                              fish.lifeStage &&
                              fish.lifeStage !== 'not recorded'
                                ? fish.lifeStage.charAt(0).toUpperCase()
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasComments && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Comments
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text
                              fontSize={10}
                              textAlign='center'
                              numberOfLines={2}
                            >
                              {fish ? fish.comments || '' : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                  {hasGenetics && (
                    <HStack>
                      <View
                        style={{
                          width: LABEL_W,
                          height: SUB_H,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e5e7eb',
                        }}
                      >
                        <Text fontSize={13} italic>
                          Genetics
                        </Text>
                      </View>
                      <HStack flex={1}>
                        {chunk.map((fish, i) => (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              height: SUB_H,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderLeftWidth: 1,
                              borderBottomWidth: 1,
                              borderColor: '#e5e7eb',
                            }}
                          >
                            <Text
                              fontSize={12}
                              textAlign='center'
                              numberOfLines={2}
                            >
                              {fish &&
                              Array.isArray(fish.geneticSamples) &&
                              fish.geneticSamples.length
                                ? fish.geneticSamples
                                    .map((s: any) => s.sampleId || '?')
                                    .join(', ')
                                : ''}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </HStack>
                  )}
                </View>
              ))}
            </View>
          )
        }
      )}
    </View>
  )
}
