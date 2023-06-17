import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppRoundTouchable from './AppRoundTouchable';

function AppWebCredential(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const password = 'password1';

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>samuel.coco@email.co.uk</Text>
        <View style={styles.alignRight}>
          <AppRoundTouchable
            iconName="copy-outline"
            iconLibrary="ion"
            iconSize={25}
            iconColor="black"
            touchableStyle={styles.touchable}
          />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{passwordVisible ? password : '•••••••••••••'}</Text>
        <View style={styles.alignRight}>
          <AppRoundTouchable
            iconName="eye-outline"
            iconLibrary="ion"
            iconSize={25}
            iconColor="black"
            onPress={togglePasswordVisibility}
            touchableStyle={styles.touchable}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    marginRight: 10,
    color: 'black',
  },
  touchable: {
    width: 80,
    height: 25,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 25,
  },
  alignRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default AppWebCredential;
