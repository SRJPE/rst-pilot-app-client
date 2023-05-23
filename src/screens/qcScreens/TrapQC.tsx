import { useState } from 'react'
import { Button, Center, HStack, Text, View, VStack } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { ScrollView } from 'react-native-gesture-handler'

export default function TrapQC({ navigation }: { navigation: any }) {
  const [activeButtons, setActiveButtons] = useState<
    ('Temperature' | 'Turbidity' | 'RPMs' | 'Counter' | 'Debris')[]
  >(['Temperature'])

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName: 'Temperature' | 'Turbidity' | 'RPMs' | 'Counter' | 'Debris'
  }) => {
    return (
      <Button
        bg={activeButtons.includes(buttonName) ? 'primary' : 'secondary'}
        marginX={0.5}
        flex={1}
        onPress={() => {
          let activeButtonsCopy = [...activeButtons]
          if (activeButtons.includes(buttonName)) {
            activeButtonsCopy.splice(activeButtonsCopy.indexOf(buttonName), 1)
            setActiveButtons(activeButtonsCopy)
          } else {
            activeButtonsCopy.unshift(buttonName)
            setActiveButtons(activeButtonsCopy)
          }
        }}
      >
        <Text
          fontSize='lg'
          color={activeButtons.includes(buttonName) ? 'secondary' : 'primary'}
          fontWeight={'bold'}
        >
          {buttonName}
        </Text>
      </Button>
    )
  }

  const data = [
    { label: 'Point 1', x: 1, y: 10, extraInfo: 'woop woop!' },
    { label: 'Point 2', x: 2, y: 20, extraInfo: 'woop woop!' },
    { label: 'Point 3', x: 3, y: 15, extraInfo: 'woop woop!' },
    { label: 'Point 4', x: 4, y: 25, extraInfo: 'woop woop!' },
    { label: 'Point 5', x: 5, y: 12, extraInfo: 'woop woop!' },
  ]

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
            headerText={'QC Environmental & Trap Operations'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on a plot below.
          </Text>

          <HStack w={'full'} justifyContent='space-evenly'>
            <GraphMenuButton buttonName={'Temperature'} />
            <GraphMenuButton buttonName={'Turbidity'} />
            <GraphMenuButton buttonName={'RPMs'} />
            <GraphMenuButton buttonName={'Counter'} />
            <GraphMenuButton buttonName={'Debris'} />
          </HStack>

          <ScrollView>
            {activeButtons.map((buttonName) => {
              return (
                <Graph
                  key={buttonName}
                  chartType='graph'
                  data={data}
                  title={buttonName}
                  barColor='grey'
                  selectedBarColor='green'
                  height={400}
                  width={600}
                />
              )
            })}
          </ScrollView>

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
