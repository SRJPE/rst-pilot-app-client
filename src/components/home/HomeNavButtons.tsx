import React, { useCallback } from 'react'
import {
  Button,
  HStack,
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
import { StyleSheet } from 'react-native'
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

export default function BottomNavigation({ navigation }: { navigation: any }) {
  const { isOpen, onToggle, onClose } = useDisclose()

  const handlePressQCData = useCallback(() => {
    navigation.navigate('Data Quality Control')
    onClose()
  }, [navigation])
  const handlePressTrapVisit = useCallback(() => {
    navigation.navigate('Trap Visit Form')
    onClose()
  }, [navigation])
  const handlePressMarkRecapture = useCallback(() => {
    navigation.navigate('Mark Recapture')
    onClose()
  }, [navigation])
  const handlePressGenerateReport = useCallback(() => {
    navigation.navigate('Generate Report')
    onClose()
  }, [navigation])

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
              <HStack
                space={2}
                justifyContent='flex-end'
                style={[{ transform: [{ translateX: -94.5 }] }]}
              >
                <Badge alignSelf='center' variant={'solid'} bg='themeGrey'>
                  <Text fontSize={23}>Standard Trap Visit</Text>
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
                style={[{ transform: [{ translateX: -173 }] }]}
              >
                <Badge alignSelf='center' variant='solid' bg='themeGrey'>
                  <Text fontSize={23}>Mark Recapture Release</Text>
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
            </Stagger>
          </Box>
          <HStack alignItems='center'>
            <IconButton
              variant='solid'
              bg='#263238'
              colorScheme='primary'
              borderRadius='full'
              size='lg'
              onPress={onToggle}
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
