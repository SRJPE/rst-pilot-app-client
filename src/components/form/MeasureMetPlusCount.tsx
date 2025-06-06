import React, { useEffect } from 'react'
import { Formik, useFormikContext } from 'formik'
import {
  // FormControl,
  View,
  VStack,
  Text,
  Button,
  Divider,
  Box,
  ScrollView,
} from 'native-base'
import { Input, InputField } from '@/components/ui/input'

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from '@/components/ui/form-control'
import { HStack } from '@/components/ui/hstack'

import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { ReleaseMarkI } from '../../redux/reducers/addAnotherMarkSlice'

const mapStateToProps = (state: RootState) => {
  return {
    addAnotherMarkValues: state.addAnotherMark.values,
  }
}
/*
Make sure to take BisMark Brown into account 
  => {values.markType !== 'Bismark Brown' && ( <render other dropdowns> )
*/
const MeasureMetPlusCount = ({
  species,
  closeModal,
}: {
  species: any
  closeModal: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [inputValue, setInputValue] = React.useState('')

  const handleSubmit = () => {
    const plusCount = parseInt(inputValue, 10)
    console.log('plusCount:', plusCount)
  }

  return (
    <>
      <CustomModalHeader
        headerText={`Enter Plus Count for ${species.value}`}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <ScrollView>
        <Box paddingX='10' paddingTop='7' paddingBottom='3'>
          <Text fontSize='xl' color='black'>
            You have met the fish measure count requirement for {species.value}.
            You may now enter plus counts for all remaining {species.value}.
          </Text>
          <VStack space={4} mt={5}>
            <FormControl
              size='lg'
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText>Plus Count</FormControlLabelText>
              </FormControlLabel>
              <Input
                className='my-1'
                size={'lg'}
                style={{ height: 60, width: '100%' }}
              >
                <InputField
                  keyboardType='number-pad'
                  placeholder='Plus Count'
                  value={inputValue}
                  onChangeText={text => {
                    // Only allow numeric input
                    const numericText = text.replace(/[^0-9]/g, '')
                    setInputValue(numericText)
                  }}
                />
              </Input>
            </FormControl>
            <Box
              // flexDirection='row'
              justifyContent='space-between'
              width={'100%'}
              my={5}
            >
              <HStack>
                <Button
                  mx='auto'
                  minWidth={250}
                  bgColor='gray.400'
                  onPress={closeModal}
                >
                  <Text fontSize='xl' color='white'>
                    Close
                  </Text>
                </Button>
                <Button
                  mx='auto'
                  minWidth={250}
                  bgColor='primary'
                  colorScheme='coolGray'
                  onPress={handleSubmit}
                >
                  <Text fontSize='xl' color='white'>
                    Save Plus Count
                  </Text>
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </>
  )
}

export default connect(mapStateToProps)(MeasureMetPlusCount)
