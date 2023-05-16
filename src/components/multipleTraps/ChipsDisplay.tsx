import React from 'react'
import { HStack, Box, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import { TrappingSitesStoreI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'
import { cloneDeep } from 'lodash'

const ChipsDisplay = ({
  trappingSitesStore,
}: {
  trappingSitesStore: TrappingSitesStoreI
}) => {
  const { values } = useFormikContext<GroupTrapSiteValues>()
  const selectedTraps = Object.values(cloneDeep(values)).reduce(
    (acc, currentValue) => {
      if (currentValue.groupItems) {
        acc = [...acc, currentValue.groupItems].flat()
      }
      return acc
    },
    []
  )

  return (
    <HStack space={5}>
      {Object.values(trappingSitesStore).map((site: any) => {
        return (
          <Box
            style={
              !selectedTraps.includes(site.trapName)
                ? styles.badge
                : [styles.badge, styles.selected]
            }
            key={site.trapName}
          >
            <Text
              style={
                !selectedTraps.includes(site.trapName)
                  ? styles.badgeText
                  : [styles.badgeText, styles.selected]
              }
            >
              {site.trapName}
            </Text>
          </Box>
        )
      })}
    </HStack>
  )
}

export default ChipsDisplay

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'hsl(15, 75%, 78%)',
    padding: 10,
    minWidth: 100,
    borderRadius: 50,
  },
  selected: {
    backgroundColor: 'hsl(0, 0%, 80%)',
    color: 'hsl(0, 0%, 50%)',
  },
  badgeText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: 'hsl(0, 0%, 100%)',
  },
})
