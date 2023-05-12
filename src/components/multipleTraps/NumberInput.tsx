import { HStack, Button, Text, Input } from 'native-base'
import { cloneDeep } from 'lodash'
import { useFormikContext } from 'formik'
import { GroupTrapSiteValues } from './interfaces'

const NumberInput = ({ trappingSites }: any) => {
  const trappingSitesArray = Object.values(trappingSites)

  const { values, setFieldValue, setValues } =
    useFormikContext<GroupTrapSiteValues>()
  return (
    <HStack space={5}>
      <Button
        size='sm'
        bg='primary'
        w={50}
        onPress={() => {
          if (values.numberOfTrapSites > 0) {
            const valuesCopy = cloneDeep(values)
            delete valuesCopy[`trapSiteGroup-${values.numberOfTrapSites}`]
            valuesCopy.numberOfTrapSites = values.numberOfTrapSites - 1
            setValues(valuesCopy)
          }
        }}
      >
        <Text color='white'>-</Text>
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
        onPress={() => {
          if (values.numberOfTrapSites < trappingSitesArray.length) {
            setFieldValue('numberOfTrapSites', values.numberOfTrapSites + 1)
            setFieldValue(`trapSiteGroup-${values.numberOfTrapSites + 1}`, {
              trapSiteName: '',
              groupItems: [],
            })
          }
        }}
      >
        <Text color='white'>+</Text>
      </Button>
    </HStack>
  )
}

export default NumberInput
