import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet } from 'react-native';

function Screen(props) {
    return (
        <SafeAreaView style={styles.screen}>
            {props.children}
        </SafeAreaView>
    );
}

// rnss - shortcut
const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight

    }
})

export default Screen;