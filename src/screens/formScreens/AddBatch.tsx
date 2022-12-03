import { Formik } from 'formik'
import { Box, Center, Divider, Text, View, VStack } from 'native-base'
import { Keyboard, Pressable } from 'react-native'
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
                paddingX='10'
                paddingBottom='3'
                space={3}
                alignItems='center'
              >
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
