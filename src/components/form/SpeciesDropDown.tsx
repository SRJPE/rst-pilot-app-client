import { useFormikContext } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  FormControl,
  HStack,
  Icon,
  IconButton,
  Image,
  Popover,
  Text,
} from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { MaterialIcons } from '@expo/vector-icons'
import { set } from 'lodash'

export default function SpeciesDropDown({
  open,
  onOpen,
  setOpen,
  onClose,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  onChangeValue,
  editModeValue,
  speciesValue,
  onChangeSearchText,
}: {
  open: boolean
  onOpen?: any
  setOpen: any
  onClose?: () => void
  list: any[]
  setList: any
  setFieldValue?: any
  setFieldTouched?: any
  onChangeValue?: any
  editModeValue?: string
  speciesValue?: string
  onChangeSearchText?: (text: string) => void
}) {
  const [value, setValue] = useState(editModeValue || ('' as string))

  const formikProps = useFormikContext<{ species: string[] }>()
  console.log('🚀 ~ SpeciesDropDown.tsx:37 ~ formikProps:', formikProps)

  const speciesError = formikProps?.errors.species

  const speciesTouched = formikProps?.touched.species

  const speciesDropdownHasError = speciesError && speciesTouched

  const handleOnChange = useCallback(
    (itemValue: any) => {
      if (onChangeValue) {
        onChangeValue(itemValue)
      }
    },
    [speciesValue, value]
  )

  useEffect(() => {
    //if using formik
    if (setFieldTouched && setFieldValue) {
      if (value !== '') {
        setFieldTouched('species', true)
      }
      setFieldValue('species', value)
    } else {
      if (value) {
        setFieldTouched()
      }
      if (onChangeValue) {
        onChangeValue(value)
      }
    }
  }, [value])

  useEffect(() => {
    console.log('species valeu changed:', speciesValue)
    if (speciesValue !== value) {
      setValue(speciesValue || '')
    }
  }, [speciesValue])

  return (
    <View>
      <HStack space={1} alignItems='center'>
        <FormControl.Label>
          <Text
            fontSize='md'
            color={speciesDropdownHasError ? 'red.700' : 'black'}
          >
            Species
          </Text>
        </FormControl.Label>
        <Popover
          placement='bottom right'
          trigger={triggerProps => {
            return (
              <IconButton
                {...triggerProps}
                icon={
                  <Icon
                    as={MaterialIcons}
                    color='black'
                    name='info-outline'
                    size='lg'
                  />
                }
              ></IconButton>
            )
          }}
        >
          <Popover.Content
            mx='10'
            mb='10'
            accessibilityLabel='Species Lookup'
            minW='720'
            minH='300'
            backgroundColor='light.100'
          >
            <Popover.Arrow />
            <Popover.CloseButton />
            <Popover.Body p={0}>
              <ScrollView>
                <Image
                  source={require('../../../assets/speciesID/Species_ID_Sheet_1-1.jpg')}
                  alt='Species ID'
                  size='1000px'
                />
                <Image
                  source={require('../../../assets/speciesID/Species_ID_Sheet_2-2.jpg')}
                  alt='Species ID'
                  size='1000px'
                />
                <Image
                  source={require('../../../assets/speciesID/Species_ID_Sheet_3-3.jpg')}
                  alt='Species ID'
                  size='1000px'
                />
                <Image
                  source={require('../../../assets/speciesID/Species_ID_Sheet_4-end.jpg')}
                  alt='Species ID'
                  size='1000px'
                />
              </ScrollView>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </HStack>
      <DropDownPicker
        open={open}
        onOpen={onOpen}
        value={value}
        items={list}
        setOpen={setOpen}
        onClose={() => {
          onClose && onClose()
          setFieldTouched('species', true)
        }}
        onChangeValue={handleOnChange}
        onChangeSearchText={onChangeSearchText}
        setValue={setValue}
        searchable={true}
        searchTextInputProps={{
          autoCorrect: false,
        }}
        setItems={setList}
        disableLocalSearch={true} // required for remote search
        multiple={false}
        placeholder='Select your species'
        searchPlaceholder='Search...'
        listMode='SCROLLVIEW'
        maxHeight={180}
        scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
        closeAfterSelecting={true}
        style={{
          marginTop: 4,
          borderColor: speciesDropdownHasError ? 'darkred' : '#d4d4d4d4',
          borderRadius: 4,
          height: 50,
          backgroundColor: '#fafafa',
        }}
        arrowIconStyle={{
          width: 30,
          height: 30,
        }}
        dropDownContainerStyle={{
          backgroundColor: '#fafafa',
          borderColor: speciesDropdownHasError ? 'darkred' : '#d4d4d4d4',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
        textStyle={{
          fontSize: 16,
        }}
      />
      {speciesDropdownHasError && (
        <Text style={{ color: 'darkred', marginTop: 5 }}>
          {speciesError as string}
        </Text>
      )}
    </View>
  )
}
