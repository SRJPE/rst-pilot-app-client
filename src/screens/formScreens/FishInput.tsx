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
import { Formik } from 'formik'
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

const mapStateToProps = (state: RootState) => {
  return {
    fishInputSliceState: state.fishInput,
  }
}

const FishInput = ({
  navigation,
  fishInputSliceState,
}: {
  navigation: any
  fishInputSliceState: any
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
    fishInputSliceState.speciesCaptured.length > 1
      ? ([...fishInputSliceState.speciesCaptured] as Array<string>)
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
    dispatch(saveFishInput(checkboxGroupValue))
    dispatch(markFishInputCompleted(true))
    dispatch(markStepCompleted([true, 'fishInput']))
    console.log('🚀 ~ handleSubmit ~ FishInput', checkboxGroupValue)
  }

  return (
    <>
      <ScrollView
        flex={1}
        scrollEnabled={screenHeight < 1180}
        bg='#fff'
        py='10%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <Heading mb={showError ? '3' : '8'} px='10%'>
          Which species were captured?
        </Heading>
        <VStack space={8}>
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

          <HStack space={10} px='10%'>
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
            <Heading pb='4'>Catch Table</Heading>
            <FishInputDataTable navigation={navigation} />
          </Box>
        </VStack>
        {/* --------- Modals --------- */}
        <CustomModal
          isOpen={addPlusCountModalOpen}
          closeModal={() => {
            setAddPlusCountModalOpen(false)
            dispatch(markFishInputModalOpen(false))
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
