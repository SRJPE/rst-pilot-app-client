import React from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { Formik } from 'formik'

// interface MyFormValues {
//   firstName: string
//   email: string
//   password: string
// }

//Simple formik demo component

const FishInput = () => {
  const initialValues = { firstName: '', email: '', password: '' }

  return (
    <>
      <Text>Sign Up</Text>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        onSubmit={values => {
          console.log(values)
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              placeholder='Name'
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            <TextInput
              placeholder='Email'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            <TextInput
              placeholder='Password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />

            <Button
              /* 
// @ts-ignore */
              onPress={handleSubmit}
              title='Submit'
            />
          </View>
        )}
      </Formik>
    </>
  )
}
export default FishInput
