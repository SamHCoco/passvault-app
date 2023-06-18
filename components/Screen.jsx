import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';

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
        paddingTop: Constants.statusBarHeight
    },
    view: {
        backgroundColor: "white"
    }
})

export default Screen;