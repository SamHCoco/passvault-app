import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, View, ScrollView, Platform, StatusBar, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

function Screen(props) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.view}>{props.children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: windowHeight * 0.02,
  },
  view: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: windowWidth * 0.05,
  },
});

export default Screen;
