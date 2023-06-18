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
  const saveCredential = async (values) => {
    const { url, username, password } = values;
  
    // Extract domain from URL and lowercase it
    const domain = url.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?([^/.]+).*$/, '$1');

    // Search for a match in the web(name) table
    const existingWeb = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT id FROM web WHERE LOWER(name) = ? LIMIT 1',
          [domain],
          (_, { rows }) => {
            resolve(rows.item(0));
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  
    // Insert into web_credential table
    const insertWebCredential = async (webId) => {
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO web_credential (web_id, username, password) VALUES (?, ?, ?)',
            [webId, username, password],
            (_, { insertId }) => {
              resolve(insertId);
              console.log("New Web Credentials added with web_id ", webId);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });
    };
  
    // Handle the found or new web record
    if (existingWeb) {
      // Use the existing web_id
      const webId = existingWeb.id;
      const insertId = await insertWebCredential(webId);
      console.log('Credential saved successfully with ID:', insertId);
    } else {
      // Insert a new record into web table
      const insertWeb = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO web (name) VALUES (?)',
            [domain],
            (_, { insertId }) => {
              resolve(insertId);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });
  
      // Use the new web_id
      const webId = insertWeb;
      const insertId = await insertWebCredential(webId);
      console.log('Credential saved successfully with ID:', insertId);
    }
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
