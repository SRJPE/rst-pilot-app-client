import { useEffect } from 'react'
import { Badge, IconButton, ScrollView, Text, VStack } from 'native-base'
import { markBadgeLookup } from '../../utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { removeMarkFromAppliedMarks } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'

interface markBadgeI {
  markType: string
  markColor: string
  markPosition: string
}

const MarkBadgeList = ({
  badgeListContent,
  setFieldValue,
  setFieldTouched,
}: {
  badgeListContent: Array<any>
  setFieldValue: any
  setFieldTouched: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  //sets the field value to be the current badgeListContent and updates on change
  useEffect(() => {
    setFieldValue('appliedMarks', badgeListContent)
    setFieldTouched('appliedMarks')
  }, [badgeListContent])

  const handleRemoveBadge = (index: number) => {
    //make copy of badge list
    const badgeListCopy = [...badgeListContent]
    //find selected badge in the list and remove it.
    badgeListCopy.splice(index, 1)
    //update store with the spliced copy
    dispatch(removeMarkFromAppliedMarks(badgeListCopy))
  }

  return (
    <>
      <ScrollView maxHeight='60%'>
        <VStack space={5}>
          {badgeListContent.map((badge: markBadgeI, index: number) => {
            const { markType, markColor, markPosition } = badge
            //TO-DO: incorporate the abbreviation lookup table
            return (
              <Badge
                key={index}
                bg='primary'
                shadow='3'
                borderRadius='5'
                w='60%'
                endIcon={
                  <IconButton
                    onPress={() => {
                      handleRemoveBadge(index)
                    }}
                    size='md'
                    _icon={{
                      color: 'white',
                      as: Ionicons,
                      name: 'close',
                    }}
                  />
                }
              >
                <Text color='white' fontWeight='500' fontSize='md'>
                  {`${markType} - ${markColor} - ${markPosition}`}
                </Text>
              </Badge>
            )
          })}
        </VStack>
      </ScrollView>
    </>
  )
}

export default MarkBadgeList
