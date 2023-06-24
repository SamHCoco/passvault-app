import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, View, ScrollView, Platform, StatusBar, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function Screen(props) {
  return (
    <SafeAreaView style={styles.screen}>
        <View style={styles.view}>{props.children}</View>
      {/* <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
      </ScrollView> */}
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
