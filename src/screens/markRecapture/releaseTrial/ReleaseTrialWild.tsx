import {
  Box,
  Center,
  FormControl,
  Input,
  Radio,
  Text,
  VStack,
} from 'native-base'

const ReleaseTrialWild = () => {
  return (
    <Box bg='#FFF'>
      <Center
        bg='primary'
        _text={{
          alignSelf: 'flex-start',
          color: '#FFF',
          fontWeight: '700',
          fontSize: 'xl',
        }}
        // position='absolute'
        bottom='0'
        px='3'
        py='1.5'
      >
        RELEASE TRIAL - WILD
      </Center>
      <VStack py='2%' px='4%' space={4}>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Confirm number of fish used in release trial
            </Text>
          </FormControl.Label>
          <Input
            w='1/2'
            height='50px'
            fontSize='16'
            placeholder='Numeric Value'
            keyboardType='numeric'
            // onChangeText={handleChange('coneDepth')}
            // onBlur={handleBlur('coneDepth')}
            // value={values.coneDepth}
          />
          {/* {touched.coneDepth &&
            errors.coneDepth &&
            renderErrorMessage(errors, 'coneDepth')} */}
        </FormControl>
        <FormControl w='1/2'>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Dead Count (wild)
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Numeric Value'
            keyboardType='numeric'
            // onChangeText={handleChange('coneDepth')}
            // onBlur={handleBlur('coneDepth')}
            // value={values.coneDepth}
          />
          {/* {touched.coneDepth &&
            errors.coneDepth &&
            renderErrorMessage(errors, 'coneDepth')} */}
        </FormControl>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Will you supplement with hatchery fish?{' '}
            </Text>
          </FormControl.Label>
          <Radio.Group
            w='30%'
            name='coneSetting'
            accessibilityLabel='cone setting'
            // value={coneSetting}
            // onChange={(nextValue: any) => {
            //   setConeSetting(nextValue)
            // }} // TODO: change to primary color
          >
            <Radio colorScheme='primary' value='Yes' my={1}>
              Yes
            </Radio>
            <Radio colorScheme='primary' value='No' my={1}>
              No
            </Radio>
          </Radio.Group>
        </FormControl>
      </VStack>
    </Box>
  )
}

export default ReleaseTrialWild
