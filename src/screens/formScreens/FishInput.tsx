import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Heading,
  HStack,
  VStack,
  Text,
  View,
  Icon,
  ScrollView,
} from 'native-base'
import CustomModal from '../../components/Shared/CustomModal'
import NavButtons from '../../components/formContainer/NavButtons'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch } from 'react-redux'
import {
  markFishInputCompleted,
  markFishInputModalOpen,
  saveFishInput,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { markStepCompleted } from '../../redux/reducers/formSlices/navigationSlice'
import FishInputDataTable from '../../components/form/FishInputDataTable'
import PlusCountModalContent from '../../components/form/PlusCountModalContent'
import { Ionicons } from '@expo/vector-icons'
import { useWindowDimensions } from 'react-native'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'

const mapStateToProps = (state: RootState) => {
  let activeTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.activeTabId]
  ) {
    activeTabId = state.tabSlice.activeTabId
  }
  let speciesCaptured = state.fishInput[activeTabId].speciesCaptured

  return {
    activeTabId,
    speciesCaptured,
    tabSlice: state.tabSlice,
    fishInputSlice: state.fishInput,
  }
}

const FishInput = ({
  navigation,
  activeTabId,
  speciesCaptured,
  tabSlice,
  fishInputSlice,
}: {
  navigation: any
  activeTabId: string
  speciesCaptured: string[]
  tabSlice: TabStateI
  fishInputSlice: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [addPlusCountModalOpen, setAddPlusCountModalOpen] = useState(
    false as boolean
  )
  const [showError, setShowError] = useState(false as boolean)
  const [addFishModalTab, setAddFishModalTab] = useState<
    'Individual' | 'Batch'
  >('Individual')
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(
    speciesCaptured.length > 1
      ? ([...speciesCaptured] as Array<string>)
      : (['YOY Chinook'] as Array<string>)
  )
  const { height: screenHeight } = useWindowDimensions()

  useEffect(() => {
    checkboxGroupValue.length < 1 ? setShowError(true) : setShowError(false)
  }, [checkboxGroupValue])

  const handleSubmit = () => {
    // if (checkboxGroupValue.length < 1) {
    //   setShowError(true)

    // }
    if (activeTabId && activeTabId != 'placeholderId') {
      dispatch(
        saveFishInput({
          tabId: activeTabId,
          speciesCaptured: checkboxGroupValue,
        })
      )
      dispatch(markFishInputCompleted({ tabId: activeTabId, bool: true }))
      let stepCompletedCheck = true

      if (stepCompletedCheck)
        dispatch(markStepCompleted({ propName: 'fishInput' }))
      console.log('🚀 ~ handleSubmit ~ FishInput', checkboxGroupValue)
    }
  }

  return (
    <>
      <ScrollView
        flex={1}
        scrollEnabled={screenHeight < 1180}
        bg='#fff'
        py='0%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <Heading mb={showError ? '0' : '5'} px='5%'>
          Which species were captured?
        </Heading>
        <VStack space={6}>
          <FormControl>
            {showError && (
              <HStack space={1}>
                <Icon
                  marginTop={'.5'}
                  as={Ionicons}
                  name='alert-circle-outline'
                  color='error'
                />
                <Text style={{ fontSize: 14, color: '#b71c1c' }}>
                  {'Species required' as string}
                </Text>
              </HStack>
            )}
            <Checkbox.Group //https://github.com/GeekyAnts/NativeBase/issues/5073
              colorScheme='green'
              px='10%'
              defaultValue={checkboxGroupValue}
              accessibilityLabel='Select the species captured'
              onChange={(values: any) => setCheckboxGroupValue(values)}
            >
              <Checkbox
                value='YOY Chinook'
                my='1'
                _checked={{ bg: 'primary', borderColor: 'primary' }}
              >
                YOY Chinook
              </Checkbox>
              <Checkbox
                value='Yearling Chinook'
                my='1'
                _checked={{ bg: 'primary', borderColor: 'primary' }}
              >
                Yearling Chinook
              </Checkbox>
              <Checkbox
                value='Recaptured Chinook'
                my='1'
                _checked={{ bg: 'primary', borderColor: 'primary' }}
              >
                Recaptured Chinook
              </Checkbox>
              <Checkbox
                value='Steelhead'
                my='1'
                _checked={{ bg: 'primary', borderColor: 'primary' }}
              >
                Steelhead
              </Checkbox>
              <Checkbox
                value='Other'
                my='1'
                _checked={{ bg: 'primary', borderColor: 'primary' }}
              >
                Other
              </Checkbox>
            </Checkbox.Group>
          </FormControl>

          <HStack space={10} px='5%'>
            <Button
              bg='primary'
              p='3'
              borderRadius='5'
              flex='1'
              shadow='3'
              onPress={() => {
                navigation.navigate('Add Fish')
              }}
            >
              <Text fontSize='sm' fontWeight='bold' color='white'>
                Input Fish Measurements
              </Text>
            </Button>
            <Button
              bg='primary'
              p='3'
              borderRadius='5'
              flex='1'
              shadow='3'
              onPress={() => {
                navigation.navigate('Batch Count')
              }}
            >
              <Text fontSize='sm' fontWeight='bold' color='white'>
                Input Batch Count
              </Text>
            </Button>

            <Button
              bg='primary'
              p='3'
              flex='1'
              borderRadius='5'
              shadow='3'
              onPress={() => {
                setAddPlusCountModalOpen(true)
              }}
            >
              <Text fontSize='sm' fontWeight='bold' color='white'>
                Add Plus Counts
              </Text>
            </Button>
          </HStack>

          <Box px='4'>
            <Heading>Catch Table</Heading>
            <FishInputDataTable navigation={navigation} />
          </Box>
        </VStack>
        {/* --------- Modals --------- */}
        <CustomModal
          isOpen={addPlusCountModalOpen}
          closeModal={() => {
            if (activeTabId && activeTabId != 'placeholderId') {
              setAddPlusCountModalOpen(false)
              dispatch(
                markFishInputModalOpen({ tabId: activeTabId, bool: false })
              )
            }
          }}
          height='1/2'
        >
          <PlusCountModalContent
            closeModal={() => {
              setAddPlusCountModalOpen(false)
            }}
          />
        </CustomModal>
      </ScrollView>
      <NavButtons
        navigation={navigation}
        handleSubmit={handleSubmit}
        values={checkboxGroupValue}
      />
    </>
  )
}

export default connect(mapStateToProps)(FishInput)
