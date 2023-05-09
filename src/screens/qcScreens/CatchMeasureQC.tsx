import { useState } from "react";
import { Button, HStack, View, VStack, Text } from "native-base";
import CustomModalHeader from "../../components/Shared/CustomModalHeader";


export default function CatchMeasureQC({ navigation }: { navigation: any }) {
  const [activeButton, setActiveButton] = useState<
    'Fork Length' | 'Weight' | ''
  >('')

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName: 'Fork Length' | 'Weight'
  }) => {
    return (
      <Button
        bg={activeButton === buttonName ? 'primary' : 'secondary'}
        marginX={0.5}
        flex={1}
        onPress={() => {
          setActiveButton(activeButton != buttonName ? buttonName : '')
        }}
      >
        <Text
          fontSize='lg'
          color={activeButton === buttonName ? 'secondary' : 'primary'}
          fontWeight={'bold'}
        >
          {buttonName}
        </Text>
      </Button>
    )
  }

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        px='5%'
        py='3%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack alignItems={'center'} flex={1}>
          <CustomModalHeader
            headerText={'Fork Length, Weight, Lifestage, Run'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on the plot below. Grey density
            lines show historic fork length distribution
          </Text>

          <HStack>
            <GraphMenuButton buttonName={"Fork Length"} />
            <GraphMenuButton buttonName={"Weight"} />
            <View flex={3}></View>
          </HStack>

          <View flex={1}></View>

          <HStack width={'full'} justifyContent={'space-between'}>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='secondary'
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text fontSize='xl' color='primary' fontWeight={'bold'}>
                Back
              </Text>
            </Button>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='primary'
              onPress={() => {
                console.log('approve')
              }}
            >
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Approve
              </Text>
            </Button>
          </HStack>
        </VStack>
      </View>
    </>
  )
}
