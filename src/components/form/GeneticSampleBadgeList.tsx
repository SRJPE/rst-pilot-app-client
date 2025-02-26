import React from 'react'
import { Badge, HStack, IconButton, ScrollView, Text } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

const GeneticSampleBadgeList = ({
  badgeListContent,
  setGeneticSamples,
  geneticSamples,
}: {
  badgeListContent: any
  setGeneticSamples: any
  geneticSamples: any
}) => {
  const handleRemoveBadge = (index: number) => {
    //make copy of badge list
    const badgeListCopy = [...badgeListContent]
    //find selected badge in the list and remove it.
    badgeListCopy.splice(index, 1)

    setGeneticSamples({
      ...geneticSamples,
      value: badgeListCopy.splice(index, 1),
    })
  }

  return (
    <>
      <ScrollView maxHeight='220'>
        <HStack space={5} flexWrap={'wrap'}>
          {badgeListContent.length > 0 &&
            badgeListContent.map((badge: any, index: number) => {
              const { sampleId } = badge
              //TO-DO: incorporate the abbreviation lookup table
              return (
                <Badge
                  key={index}
                  bg='primary'
                  shadow='3'
                  borderRadius='5'
                  w='40%'
                  marginBottom={5}
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
                    {sampleId}
                  </Text>
                </Badge>
              )
            })}
        </HStack>
      </ScrollView>
    </>
  )
}

export default GeneticSampleBadgeList
