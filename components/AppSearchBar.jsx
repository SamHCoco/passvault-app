import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { BLACK } from '../constants/colors';

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
          <AntDesign name="search1" size={25} color={BLACK} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: 'white',
    borderWidth: 0
  },
  searchBarInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: BLACK,
    marginRight: 5,
    paddingTop: 0,
    paddingBottom: 0,
  },
  searchButton: {
    padding: 5,
  },
});

export default AppSearchBar;
