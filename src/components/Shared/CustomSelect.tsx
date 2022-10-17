import React from "react"
import { CheckIcon, Select } from "native-base"

interface CustomSelectI {
  selectedValue: string
  placeholder: string
  onValueChange: any
  selectOptions: any[]
}

const CustomSelect: React.FC<CustomSelectI> = (props) => {
  return (
    <Select
      selectedValue={props.selectedValue}
      minWidth='100'
      accessibilityLabel={props.placeholder}
      placeholder={props.placeholder}
      _selectedItem={{
        bg: 'primary',
        endIcon: <CheckIcon size='5' />,
      }}
      mt={1}
      onValueChange={(itemValue) => props.onValueChange(itemValue)}
    >
      {props.selectOptions.map((item, idx) => (
        <Select.Item key={idx} label={item.label} value={item.value} />
      ))}
    </Select>
  )
}

export default CustomSelect
