import React from 'react';
import { Button, Text } from 'react-native';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('passvault.db');

const validationSchema = Yup.object().shape({
  url: Yup.string().url('Invalid URL').required('URL is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function EditWebCredentialScreen(props) {
  const saveCredential = (values) => {
    const { url, username, password } = values;
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO credentials (url, username, password) VALUES (?, ?, ?)',
        [url, username, password],
        (_, { insertId }) => {
          console.log('Credential saved successfully with ID:', insertId);
        },
        (error) => {
          console.log('Error saving credential:', error);
        }
      );
    });
  };

  return (
    <Screen>
      <Formik
        initialValues={{ url: '', username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={values => saveCredential(values)}
      >
        {({ handleChange, handleSubmit, errors, touched }) => (
          <>
            <Field
              component={AppTextInput}
              name="url"
              placeholder="URL"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChange('url')}
            />
            <ErrorMessage name="url" component={Text} style={styles.errorText} />

            <Field
              component={AppTextInput}
              name="username"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChange('username')}
            />
            <ErrorMessage name="username" component={Text} style={styles.errorText} />

            <Field
              component={AppTextInput}
              name="password"
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              onChangeText={handleChange('password')}
            />
            <ErrorMessage name="password" component={Text} style={styles.errorText} />

            <Button title="Save" color="grey" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </Screen>
  );
}

const styles = {
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
};

export default EditWebCredentialScreen;
