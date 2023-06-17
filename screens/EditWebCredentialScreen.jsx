import React, { useState, useEffect } from 'react';
import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import { Alert, Button } from 'react-native';
import { Formik, useFormikContext } from 'formik';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase("passvault.db");

function EditWebCredentialScreen(props) {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const saveCredential = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO credentials (url, username, password) VALUES (?, ?, ?)',
        [url, username, password],
        (_, { insertId }) => {
          console.log('Credential saved successfully with ID:', insertId);
        },
        error => {
          console.log('Error saving credential:', error);
        }
      );  
    });
  };

  return (
    <Screen>
      <AppTextInput
        placeholder="URL"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={text => setUrl(text)}
        value={url}
      />

      <AppTextInput
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={text => setUsername(text)}
        value={username}
      />

      <AppTextInput
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <Button title="Save" color="grey" onPress={saveCredential} />
    </Screen>
  );
}

export default EditWebCredentialScreen;
