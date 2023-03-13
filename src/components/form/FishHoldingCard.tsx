import { Ionicons } from '@expo/vector-icons'
import { Badge, Box, VStack, Center, Icon, ScrollView } from 'native-base'
import { memo } from 'react'

const FishHoldingCard = ({
  cardContent,
  cardTitle,
  handlePressRemoveBadge,
}: {
  cardContent: Array<any>
  cardTitle: string
  handlePressRemoveBadge: any
}) => {
  const renderFishHoldingCardContent = () => {
    return (
      <ScrollView>
        {cardContent?.map((item, idx) => {
          return (
            <Badge
              key={idx}
              bg='themeOrange'
              alignSelf='center'
              justifyContent='space-between'
              width='77%'
              variant='solid'
              shadow='3'
              mb='4'
              _text={{
                color: 'white',
                fontSize: '16',
              }}
              rightIcon={
                <Icon
                  as={Ionicons}
                  name={'close'}
                  size='lg'
                  color='white'
                  onPress={() => handlePressRemoveBadge(item, cardTitle)}
                />
              }
            >
              {item}
            </Badge>
          )
        })}
      </ScrollView>
    )
  }

  return (
    <Box w='45%' rounded='xl' overflow='hidden'>
      <Center
        bg='primary'
        _text={{
          alignSelf: 'center',
          color: '#FFF',
          fontWeight: '700',
          fontSize: 'xl',
        }}
        bottom='0'
        px='6'
        py='1.5'
      >
        {cardTitle}
      </Center>
      <VStack
        py='2%'
        px='4%'
        pt='4'
        overflow='hidden'
        height={'100%'}
        bg='secondary'
        roundedBottom='xl'
      >
        {renderFishHoldingCardContent()}
      </VStack>
    </Box>
  )
}

export default memo(FishHoldingCard)
