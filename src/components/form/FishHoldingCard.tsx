import { Ionicons } from '@expo/vector-icons'
import { Badge, Box, VStack, Center, Icon } from 'native-base'

const FishHoldingCard = ({
  cardContent,
  cardTitle,
  handlePressRemoveBadge,
}: {
  cardContent: Array<any>
  cardTitle: string
  handlePressRemoveBadge: any
}) => {
  console.log('🚀 ~ cardContent', cardContent)

  const renderFishHoldingCardContent = () => {
    return cardContent?.map((item, idx) => {
      console.log('🚀 ~ cardContent?.map ~ item', item)
      return (
        <Badge
          key={idx}
          bg='themeOrange'
          alignSelf='center'
          justifyContent='space-between'
          width='70%'
          variant='solid'
          shadow='3'
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
    })
  }

  return (
    <Box w='40%' rounded='xl' overflow='hidden'>
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
        space={4}
        overflow='hidden'
        height={'60%'}
        bg='secondary'
        roundedBottom='xl'
      >
        {renderFishHoldingCardContent()}
      </VStack>
    </Box>
  )
}

export default FishHoldingCard
