import React, { useState, useEffect } from 'react';
import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import { Alert, Button } from 'react-native';
import { Formik, useFormikContext } from 'formik';

import { getWebCredentials, saveWebCredential } from '../service/sqlservice';

function EditWebCredentialScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [webCredentials, setWebCredentials] = useState([]);

    useEffect(() => {
        getWebCredentialsList();
      }, []);

    const handleSaveWebCredential = () => {
        // console.log("Save button clicked");
        saveWebCredential(username, password, url)
          .then(() => {
            setUsername('');
            setPassword('');
            setUrl('');
            getWebCredentialsList();
            console.log('Successfully saved credentials: ', username)
          })
          .catch(error => {
            console.error('Failed to save web credential:', error);
          });
      };

      const getWebCredentialsList = () => {
        getWebCredentials()
          .then(credentials => {
            setWebCredentials(credentials);
          })
          .catch(error => {
            console.error('Failed to retrieve web credentials:', error);
          });
      };

    return (
        <Screen>
            <AppTextInput 
                placeholder="URL"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <AppTextInput 
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
            />
            
            <AppTextInput placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                secureTextEntry
            />
            
            <Button  
                title="Save"
                // color="grey"
                onPress={() => handleSaveWebCredential}
            />
        </Screen>
    );
}

export default EditWebCredentialScreen;