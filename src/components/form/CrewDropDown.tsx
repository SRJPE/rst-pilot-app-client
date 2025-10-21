import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { useFormikContext } from 'formik'
import { PersonnelObject } from '../../screens/accountScreens/createNewProgram/CrewMembers'

export default function CrewDropDown({
  open,
  onOpen,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  visitSetupState,
  stream,
  tabId,
  fieldName,
  label,
}: {
  open: boolean
  onOpen: any
  setOpen: any
  list: any
  setList: any
  setFieldValue: any
  setFieldTouched: any
  visitSetupState: any
  stream: string
  tabId: any
  fieldName: string
  label: string
}) {
  const formikProps = useFormikContext<{ crew: PersonnelObject[] }>()
  const crewError = formikProps.errors.crew
  const crewTouched = formikProps.touched.crew
  const crewDropdownHasError = crewError && crewTouched
  const [value, setValue] = useState([] as Array<any>)
  const [selectedStream, setSelectedStream] = useState('' as string)

  useEffect(() => {
    if (visitSetupState[tabId]?.values?.crew) {
      setValue(visitSetupState[tabId]?.values?.crew)
    }
    if (visitSetupState[tabId]?.values?.stream) {
      setSelectedStream(visitSetupState[tabId]?.values?.stream)
    }
  }, [tabId])

  useEffect(() => {
    setFieldValue(fieldName, [...value])
    if (value.length) setFieldTouched(fieldName, true)
  }, [value])

  useEffect(() => {
    if (selectedStream && stream !== selectedStream) {
      clearSelectedValues()
    }
    setSelectedStream(stream)
  }, [stream])

  const clearSelectedValues = () => {
    setValue([])
    setFieldValue(fieldName, [])
    setFieldTouched(fieldName, false)
  }

  return (
    <View style={{ zIndex: 10000, marginBottom: 10 }}>
      <Text color={crewDropdownHasError ? 'red.700' : 'black'} fontSize='md'>
        {label}
      </Text>
      <DropDownPicker
        onClose={() => {
          setFieldTouched(fieldName, true)
        }}
        zIndex={3000}
        zIndexInverse={3000}
        open={open}
        onOpen={onOpen}
        value={value}
        items={list}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setList}
        searchable
        multiple={true}
        dropDownDirection='TOP'
        mode='BADGE'
        listMode='SCROLLVIEW'
        badgeDotColors={['#007C7C']}
        placeholder='Select your crew'
        searchPlaceholder='Search...'
        maxHeight={275}
        style={{
          marginTop: 8,
          borderColor: crewDropdownHasError ? 'darkred' : '#d4d4d4d4',
          borderRadius: 4,
          height: 50,
          backgroundColor: '#fff',
        }}
        arrowIconStyle={{
          width: 30,
          height: 30,
        }}
        dropDownContainerStyle={{
          backgroundColor: 'white',
          borderColor: '#d4d4d4d4',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
        textStyle={{
          fontSize: 16,
        }}
        containerProps={{
          style: {
            backgroundColor: '#fff',
          },
        }}
        // renderListItem={props => <CrewListItem {...props} />}
      />
      {crewDropdownHasError && (
        <Text style={{ color: 'darkred', marginTop: 5 }}>
          {crewError as string}
        </Text>
      )}
    </View>
  )
}
