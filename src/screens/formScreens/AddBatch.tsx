import { Formik } from 'formik'
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Text,
  View,
  VStack,
  Pressable,
} from 'native-base'
import { Keyboard } from 'react-native'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'

const AddBatch = ({
  closeModal,
  navigation,
}: {
  closeModal: any
  navigation: any
}) => {
  return (
    <Formik
      validationSchema={{}}
      initialValues={{}}
      onSubmit={(values) => {
        // handleFormSubmit(values)
        // showSlideAlert(dispatch, 'Fish')
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        resetForm,
        touched,
        errors,
        values,
      }) => (
        <>
          <View
            flex={1}
            bg='#fff'
            borderWidth='10'
            borderBottomWidth='0'
            borderColor='themeGrey'
          >
            <Pressable onPress={Keyboard.dismiss}>
              <CustomModalHeader
                headerText={'Add Batch'}
                showHeaderButton={true}
                closeModal={closeModal}
                navigateBack={true}
                headerButton={null}
              />
              <Divider mb='1' />
              <VStack
                // paddingX='5'
                paddingBottom='3'
                space={3}
                // alignItems='center'
              >
                <Box>
                  <VStack m='5' space={3}>
                    <HStack space={4} alignSelf='flex-start'>
                      <Text fontSize='18' fontWeight='600'>
                        Selected Batch Characteristics:
                      </Text>
                      <Text fontSize='16'>{`Life Stage: ${'fry'}`}</Text>
                      <Text fontSize='16'>{`Adipose Clipped: ${'Yes'}`}</Text>
                      <Text fontSize='16'>{`Dead: ${'No'}`}</Text>
                      <Text fontSize='16'>{`Mark: ${'None'}`}</Text>
                    </HStack>
                    <Button bg='primary' w='1/3'>
                      <Text fontSize='xl' color='white'>
                        Change Characteristics
                      </Text>
                    </Button>
                  </VStack>
                  <Divider />
                </Box>
                <Box m='5' w='600' h='400' bg='primary'>
                  <Center alignItems='center'>
                    <Text fontSize='20' color='white'>
                      Graph Placeholder
                    </Text>
                  </Center>
                </Box>
              </VStack>
            </Pressable>
          </View>
        </>
      )}
    </Formik>
  )
}

export default AddBatch
