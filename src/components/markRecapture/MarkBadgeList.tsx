import { useEffect } from 'react'
import { Badge, IconButton, ScrollView, Text, VStack } from 'native-base'
import { markBadgeLookup } from '../../utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { removeMarkFromAppliedMarks } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { removeMarkFromBatchCountExistingMarks } from '../../redux/reducers/formSlices/batchCountSlice'

interface markBadgeI {
  markType: string
  markColor: string
  markPosition?: string
  bodyPart?: string
}

const MarkBadgeList = ({
  badgeListContent,
  setFieldValue,
  setFieldTouched,
  field,
  setExistingMarks,
  existingMarks,
  validateField,
  setFieldError,
}: {
  badgeListContent: any
  setFieldValue?: any
  setFieldTouched?: any
  field: string
  setExistingMarks?: any
  existingMarks?: any
  validateField?: any
  setFieldError?: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  //sets the field value to be the current badgeListContent and updates on change
  useEffect(() => {
    if (setFieldValue && setFieldTouched) {
      setFieldValue(field, badgeListContent, true)
      setFieldTouched(field)
    }
    if (badgeListContent.length > 0) {
      validateField(field)
    } else if (!badgeListContent.length) {
      setFieldError(field, 'Please add at least one mark')
    }
  }, [badgeListContent])

  const handleRemoveBadge = (index: number) => {
    //make copy of badge list
    const badgeListCopy = [...badgeListContent]
    //find selected badge in the list and remove it.
    badgeListCopy.splice(index, 1)

    //add removal function for other version of component
    if (setExistingMarks) {
      setExistingMarks({
        ...existingMarks,
        value: badgeListCopy.splice(index, 1),
      })
    } else if (field === 'batchCountExistingMarks') {
      dispatch(removeMarkFromBatchCountExistingMarks(badgeListCopy))
    } else {
      //update store with the spliced copy
      dispatch(removeMarkFromAppliedMarks(badgeListCopy))
    }
  }

  return (
    <>
      <ScrollView maxHeight='220'>
        <VStack space={5}>
          {badgeListContent.length > 0 &&
            badgeListContent.map((badge: markBadgeI, index: number) => {
              const { markType, markColor, markPosition, bodyPart } = badge
              //TO-DO: incorporate the abbreviation lookup table
              return (
                <Badge
                  key={index}
                  bg='primary'
                  shadow='3'
                  borderRadius='5'
                  w='90%'
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
                    {`${markType} - ${markColor} - ${markPosition || bodyPart}`}
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
