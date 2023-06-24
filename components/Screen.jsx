import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, View, ScrollView, Platform, StatusBar } from 'react-native';

function Screen(props) {
    return (
        <SafeAreaView style={styles.screen}>
            {/* <ScrollView>{props.children} */}
            <View style={styles.view}>{props.children}</View>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

// rnss - shortcut
const styles = StyleSheet.create({
    screen: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    view: {
        backgroundColor: "white"
    }
})

export default Screen;