import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  HStack,
  VStack,
  Flex,
  Text,
  View,
  useDisclose,
  Center,
  Box,
  Stagger,
  IconButton,
  Icon,
  Badge,
} from 'native-base'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 150,
    borderRadius: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    marginTop: 10,
  },
  centeredColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staggerBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: -89,
  },

  buttonBackground: {
    backgroundColor: '#263238',
    width: 75,
    height: 75,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function BottomNavigation({
  navigation,
  setStaggerOpen,
  staggerOpen,
}: {
  navigation: any
  setStaggerOpen?: any
  staggerOpen?: boolean
}) {
  const { isOpen, onToggle, onClose } = useDisclose()

  const [staggerTranslateXValue, setstaggerTranslateXValue] = useState(
    // -173 as number
    -105.5 as number
  )

  const { height: screenHeight, width: screenWidth } = useWindowDimensions()

  // useEffect(() => {
  //   if (screenHeight > 1193) {
  //     console.log('🚀 ~ useEffect ~ greater:')
  //     setTopStaggerTranslateXValue(-133.5)
  //     setBottomStaggerTranslateXValue(-133.5)
  //   } else {
  //     console.log('🚀 ~ useEffect ~ lower:')
  //   }
  // }, [screenHeight])

  const handlePressQCData = useCallback(() => {
    navigation.navigate('Quality Control')
    onClose()
  }, [navigation])
  const handlePressTrapVisit = useCallback(() => {
    navigation.navigate('Trap Visit Form')
    setStaggerOpen(false)
    onClose()
  }, [navigation])
  const handlePressMarkRecapture = useCallback(() => {
    navigation.navigate('Mark Recapture')
    setStaggerOpen(false)
    onClose()
  }, [navigation])
  const handlePressGenerateReport = useCallback(() => {
    navigation.navigate('Generate Report')
    onClose()
  }, [navigation])
  const handlePressStagger = () => {
    onToggle()
    setStaggerOpen(!staggerOpen)
  }

  return (
    <Flex align='center'>
      <HStack space={0.5}>
        <Button
          variant='solid'
          bg='primary'
          onPress={handlePressQCData}
          style={styles.button}
        >
          <View style={styles.centeredColumn}>
            <View style={styles.buttonBackground}>
              <MaterialIcons name='timeline' size={50} color='white' />
            </View>
            <Text style={styles.buttonText}>QC Data</Text>
          </View>
        </Button>
        <Center bg='primary' style={styles.button}>
          <Box style={styles.staggerBox}>
            <Stagger
              visible={isOpen}
              initial={{
                opacity: 0,
                scale: 0,
                translateY: 64,
              }}
              animate={{
                translateY: -120,
                scale: 1,
                opacity: 1,
                transition: {
                  type: 'spring',
                  mass: 0.8,
                  stagger: {
                    offset: 30,
                    reverse: true,
                  },
                },
              }}
              exit={{
                translateY: 34,
                scale: 0.5,
                opacity: 0,
                transition: {
                  duration: 100,
                  stagger: {
                    offset: 30,
                    reverse: true,
                  },
                },
              }}
            >
              <VStack space={2} alignItems='flex-end'>
                <HStack
                  space={2}
                  justifyContent='flex-start'
                  alignItems='center'
                  style={[
                    {
                      transform: [{ translateX: staggerTranslateXValue }],
                    },
                  ]}
                >
                  <Badge
                    alignSelf='center'
                    variant={'solid'}
                    bg='secondary'
                    opacity='0.8'
                    borderRadius='5'
                  >
                    <Text fontSize={23} fontWeight='400'>
                      Standard Trap Visit
                    </Text>
                  </Badge>
                  <IconButton
                    mb='4'
                    variant='solid'
                    bg='primary'
                    colorScheme='primary'
                    borderRadius='full'
                    size='lg'
                    onPress={handlePressTrapVisit}
                    icon={
                      <Icon
                        as={Entypo}
                        size='12'
                        name='plus'
                        color='warmGray.50'
                      />
                    }
                  />
                </HStack>
                <HStack
                  space={2}
                  alignItems='center'
                  justifyContent='flex-start'
                  style={[
                    {
                      transform: [{ translateX: staggerTranslateXValue }],
                    },
                  ]}
                >
                  <Badge
                    alignSelf='center'
                    variant='solid'
                    bg='secondary'
                    opacity='0.8'
                    borderRadius='5'
                  >
                    <Text fontSize={23} fontWeight='400'>
                      Mark Recapture Release
                    </Text>
                  </Badge>
                  <IconButton
                    mb='4'
                    variant='solid'
                    bg='primary'
                    colorScheme='primary'
                    borderRadius='full'
                    size='lg'
                    onPress={handlePressMarkRecapture}
                    icon={
                      <Icon
                        as={Entypo}
                        size='12'
                        name='plus'
                        color='warmGray.50'
                      />
                    }
                  />
                </HStack>
              </VStack>
            </Stagger>
          </Box>
          <HStack alignItems='center'>
            <IconButton
              variant='solid'
              bg='#263238'
              colorScheme='primary'
              borderRadius='full'
              size='lg'
              onPress={handlePressStagger}
              icon={
                <Icon
                  as={isOpen ? Feather : Entypo}
                  size='12'
                  name={isOpen ? 'x' : 'plus'}
                  color='warmGray.50'
                />
              }
            />
          </HStack>
          <Text mb='20' style={styles.buttonText}>
            Collect Data
          </Text>
        </Center>

        <Button
          variant='solid'
          bg='primary'
          onPress={handlePressGenerateReport}
          style={styles.button}
        >
          <View style={styles.centeredColumn}>
            <View style={styles.buttonBackground}>
              <MaterialCommunityIcons
                name='clipboard-text'
                size={50}
                color='white'
              />
            </View>
            <Text style={styles.buttonText}>Generate Report</Text>
          </View>
        </Button>
      </HStack>
    </Flex>
  )
}
