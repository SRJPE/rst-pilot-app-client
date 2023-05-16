import { HStack, Button, Text, Input } from 'native-base'
import { cloneDeep } from 'lodash'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'
import { MaterialIcons } from '@expo/vector-icons'

const NumberInput = ({ trappingSites, setSelectedItems }: any) => {
  const trappingSitesArray = Object.values(trappingSites)

  const { values, setFieldValue, setValues } =
    useFormikContext<GroupTrapSiteValues>()
  return (
    <HStack space={5}>
      <Button
        size='sm'
        bg='primary'
        w={50}
        h={50}
        onPress={() => {
          if (values.numberOfTrapSites > 0) {
            const valuesCopy = cloneDeep(values)
            setSelectedItems((prevState: any[]) => {
              const stateCopy = cloneDeep(prevState)
              const filteredItems = stateCopy.filter(
                item =>
                  item.assignedTo !==
                  valuesCopy[`trapSiteGroup-${values.numberOfTrapSites}`]
                    .trapSiteName
              )
              return filteredItems
            })
            delete valuesCopy[`trapSiteGroup-${values.numberOfTrapSites}`]
            valuesCopy.numberOfTrapSites = values.numberOfTrapSites - 1
            setValues(valuesCopy)
          }
        }}
      >
        <Text color='white' fontSize={28} paddingBottom={10}>
          -
        </Text>
      </Button>
      <Input
        height='50px'
        fontSize='16'
        width={50}
        keyboardType='numeric'
        value={`${values.numberOfTrapSites}`}
        isDisabled
        _disabled={{
          color: 'black',
          opacity: '100%',
          textAlign: 'center',
        }}
      />
      <Button
        size='sm'
        bg='primary'
        w={50}
        h={50}
        onPress={() => {
          if (values.numberOfTrapSites < trappingSitesArray.length + 3) {
            setFieldValue('numberOfTrapSites', values.numberOfTrapSites + 1)
            setFieldValue(`trapSiteGroup-${values.numberOfTrapSites + 1}`, {
              trapSiteName: '',
              groupItems: [],
            })
          }
        }}
      >
        <Text color='white' fontSize={24} paddingBottom={10}>
          +
        </Text>
      </Button>
    </HStack>
  )
}

export default NumberInput
