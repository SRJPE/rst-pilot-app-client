import { Button, Text, Box } from 'native-base'

const ReviewValuesButton = ({
  handleOpenReviewValuesModal,
}: {
  handleOpenReviewValuesModal: () => void
}) => {
  return (
    <Box height={'10%'} width={'100%'} padding={0}>
      <Button
        rounded='xs'
        alignSelf='center'
        w='104%'
        h='100%'
        borderRadius='5'
        variant={'outline'}
        bg='#FFC5B6'
        // marginBottom={100}
        // justifyContent='space-between'
        onPress={handleOpenReviewValuesModal}
        textAlign={'center'}
        marginBottom={100}
      >
        <Text
          fontSize='xl'
          fontWeight='bold'
          color={'black'}
          // ml='10'
          alignContent={'center'}
          width={'100%'}
          textAlign={'center'}
        >
          Review Trap Visit Values
        </Text>
      </Button>
    </Box>
  )
}

export default ReviewValuesButton
