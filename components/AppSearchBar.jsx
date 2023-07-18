import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { BLACK } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const AppSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch(text);
          }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <AntDesign name="search1" size={screenWidth * 0.06083} color={BLACK} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.0292,
    marginVertical: screenWidth * 0.0292,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: screenWidth * 0.0024,
    borderColor: '#999',
    borderRadius: screenWidth * 0.0487,
    paddingLeft: screenWidth * 0.0243,
    paddingRight: screenWidth * 0.0122,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  searchBarInput: {
    flex: 1,
    height: screenWidth * 0.1095,
    fontSize: screenWidth * 0.0388,
    color: BLACK,
    marginRight: screenWidth * 0.0122,
    paddingTop: 0,
    paddingBottom: 0,
  },
  searchButton: {
    padding: screenWidth * 0.0122,
  },
});

export default AppSearchBar;
