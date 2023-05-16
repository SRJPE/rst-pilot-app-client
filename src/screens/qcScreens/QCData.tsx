import { useEffect, useState } from 'react'
import { Box, Button, Center, Icon, Text, View, VStack } from 'native-base'
import { LayoutAnimation, TouchableOpacity } from 'react-native'

export default function DataQualityControl({
  navigation,
}: {
  navigation: any
}) {
  const [activeButton, setActiveButton] = useState<
    'trapBtn' | 'catchBtn' | 'efficiencyBtn' | ''
  >('')
  const [activeCatchOption, setActiveCatchOption] = useState<
    | 'Measured Variables and Associated Categories'
    | 'Categorical Observations'
    | 'Total Fish Counts'
    | 'Partial Records'
    | ''
  >('')

  return (
    <VStack alignItems={'center'} marginTop={100} flex={1}>
      <Button
        w='4/5'
        bg={activeButton === 'trapBtn' ? 'themeOrange' : 'primary'}
        onPress={() => {
          setActiveButton(activeButton != 'trapBtn' ? 'trapBtn' : '')
          navigation.navigate('Trap QC')
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Environment & Trap Operations
        </Text>
      </Button>
      {/* ------------------------------------------------------------------------------------ */}
      <Accordion
      activeButton={activeButton}
        headerComponent={
          <View
            marginTop={25}
            w='4/5'
            bg={activeButton === 'catchBtn' ? 'themeOrange' : 'primary'}
            py={3}
          >
            <Center>
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Catch
              </Text>
            </Center>
          </View>
        }
        headerOnPress={() => {
          setActiveButton(activeButton != 'catchBtn' ? 'catchBtn' : '')
        }}
      >
        <>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption ===
              'Measured Variables and Associated Categories'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption(
                activeCatchOption !=
                  'Measured Variables and Associated Categories'
                  ? 'Measured Variables and Associated Categories'
                  : ''
              )
              navigation.navigate('CatchMeasureQC')
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Measured Variables and Associated Categories
            </Text>
          </Button>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption === 'Categorical Observations'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption(
                activeCatchOption != 'Categorical Observations'
                  ? 'Categorical Observations'
                  : ''
              )
              navigation.navigate('CatchCategoricalQC')
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Categorical Observations
            </Text>
          </Button>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption === 'Total Fish Counts'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption(
                activeCatchOption != 'Total Fish Counts'
                  ? 'Total Fish Counts'
                  : ''
              )
              navigation.navigate('CatchFishCountQC')
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Total Fish Counts
            </Text>
          </Button>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption === 'Partial Records'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption(
                activeCatchOption != 'Partial Records'
                  ? 'Partial Records'
                  : ''
              )
              navigation.navigate('PartialRecordsQC')
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Partial Records
            </Text>
          </Button>
        </>
      </Accordion>
      {/* ------------------------------------------------------------------------------------ */}
      <Button
        marginTop={25}
        w='4/5'
        bg={activeButton === 'efficiencyBtn' ? 'themeOrange' : 'primary'}
        onPress={() => {
          setActiveButton(
            activeButton != 'efficiencyBtn' ? 'efficiencyBtn' : ''
          )
          navigation.navigate('EfficiencyQC')
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Efficiency
        </Text>
      </Button>
      <View flex={1}></View>
      <Button
        marginBottom={5}
        w='90%'
        bg='primary'
        onPress={() => {
          navigation.navigate('Home')
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Back
        </Text>
      </Button>
    </VStack>
  )
}

const Accordion = ({
  headerComponent,
  headerOnPress,
  children,
  activeButton
}: {
  headerComponent: JSX.Element
  headerOnPress: () => void
  children?: JSX.Element
  activeButton: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (activeButton != 'catchBtn' && isOpen) {
      toggleOpen()
    }
  }, [activeButton])

  const toggleOpen = () => {
    setIsOpen((value) => !value)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          headerOnPress()
          toggleOpen()
        }}
        style={{
          flexDirection: 'row',
        }}
        activeOpacity={0.6}
      >
        {headerComponent}
      </TouchableOpacity>
      <View
        style={[
          {
            overflow: 'hidden',
          },
          !isOpen
            ? {
                height: 0,
              }
            : undefined,
        ]}
      >
        {children ? children : <></>}
      </View>
    </>
  )
}
