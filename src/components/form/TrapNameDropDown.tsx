import { useEffect, useState } from 'react'
import { View, Text } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { useFormikContext } from 'formik'

export default function TrapNameDropDown({
  open,
  onOpen,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  visitSetupState,
  tabSlice,
}: {
  open: boolean
  onOpen: any
  setOpen: any
  list: any
  setList: any
  setFieldValue: any
  setFieldTouched: any
  visitSetupState: any
  tabSlice: TabStateI
}) {
  const [value, setValue] = useState([] as Array<any>)
  const [marginBottom, setMarginBottom] = useState(0 as number)
  const formikProps = useFormikContext<{ trapName: string[] }>()

  const trapNameError = formikProps.errors.trapName
  const trapNameTouched = formikProps.touched.trapName
  const trapNameDropdownHasError = trapNameError && trapNameTouched

  useEffect(() => {
    if (
      tabSlice?.activeTabId &&
      visitSetupState[tabSlice.activeTabId]?.values?.trapName
    ) {
      const trapNameOrNames =
        visitSetupState[tabSlice.activeTabId]?.values?.trapName
      if (Array.isArray(trapNameOrNames)) {
        setValue([...trapNameOrNames])
      } else {
        setValue([trapNameOrNames])
      }
    }
  }, [tabSlice.activeTabId])

  useEffect(() => {
    setFieldValue('trapName', [...value])
    setFieldTouched('trapName', true)
  }, [value])

  const generateMarginBottom = () => {
    if (list.length === 2) {
      return 70
    } else if (list.length === 3) {
      return 100
    } else if (list.length === 4) {
      return 150
    } else if (list.length > 4) {
      return 200
    } else {
      return 50
    }
  }
  useEffect(() => {
    setMarginBottom(generateMarginBottom())
  }, [list])

  return (
    <View>
      <Text
        color={trapNameDropdownHasError ? 'red.700' : 'black'}
        fontSize='md'
      >
        Trap Name
      </Text>
      <DropDownPicker
        open={open}
        onOpen={onOpen}
        onClose={() => {
          console.log('touched should be true')
          setFieldTouched('trapName', true)
        }}
        value={value}
        items={list}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setList}
        multiple={true}
        mode='BADGE'
        listMode='SCROLLVIEW'
        badgeDotColors={['#007C7C']}
        placeholder='Select trap names'
        searchPlaceholder='Search...'
        maxHeight={275}
        zIndex={2000}
        style={{
          marginTop: 4,
          borderColor: trapNameDropdownHasError ? 'darkred' : '#d4d4d4d4',
          borderRadius: 4,
          height: 50,
          backgroundColor: '#fff',
          marginBottom: open ? marginBottom : 0,
        }}
        arrowIconStyle={{
          width: 30,
          height: 30,
        }}
        dropDownContainerStyle={{
          backgroundColor: '#fff',
          borderColor: '#d4d4d4d4',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
        textStyle={{
          fontSize: 16,
        }}
      />
      {trapNameDropdownHasError && (
        <Text style={{ color: 'darkred', marginTop: 5 }}>
          {trapNameError as string}
        </Text>
      )}
    </View>
  )
}
