import { useEffect } from 'react'
import { Badge, IconButton, ScrollView, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateMarkOrTagData } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { capitalize } from 'lodash'

interface markBadgeI {
  markType: string
  markColor: string
  markPosition?: string
  markCode?: string
  bodyPart?: string
}

const TagBadgeList = ({
  badgeListContent,
  setAppliedMarks,
  appliedMarks,
}: {
  badgeListContent: any
  setAppliedMarks: any
  appliedMarks: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  //sets the field value to be the current badgeListContent and updates on change
  // useEffect(() => {
  //   if (setFieldValue && setFieldTouched) {
  //     setFieldValue(field, badgeListContent, true)
  //     setFieldTouched(field)
  //   }
  // }, [badgeListContent])

  const handleRemoveBadge = (index: number) => {
    //make copy of badge list
    const badgeListCopy = [...badgeListContent]
    //find selected badge in the list and remove it.
    badgeListCopy.splice(index, 1)

    setAppliedMarks({
      ...appliedMarks,
      value: badgeListCopy.splice(index, 1),
    })
  }

  return (
    <>
      <ScrollView maxHeight='220'>
        <VStack space={5}>
          {badgeListContent.length > 0 &&
            badgeListContent.map((badge: markBadgeI, index: number) => {
              const { markType, markCode } = badge
              //TO-DO: incorporate the abbreviation lookup table
              return (
                <Badge
                  key={index}
                  bg='primary'
                  shadow='3'
                  borderRadius='5'
                  w='70%'
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
                    {`${markType.replace(/\w+/g, capitalize)} - ${markCode}`}
                  </Text>
                </Badge>
              )
            })}
        </VStack>
      </ScrollView>
    </>
  )
}

export default TagBadgeList
