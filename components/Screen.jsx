import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, View } from 'react-native';

function Screen(props) {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.view}>{props.children}</View>
        </SafeAreaView>
    );
}

// rnss - shortcut
const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight
    },
    view: {
        backgroundColor: "white"
    }
})

export default Screen;