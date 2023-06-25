import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

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
          placeholder="search"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch(text);
          }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <AntDesign name="search1" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 5,
  },
  searchBarInput: {
    flex: 1,
    height: 30,
    fontSize: 16,
    color: '#333',
    marginRight: 5,
    paddingTop: 0,
    paddingBottom: 0,
  },
  searchButton: {
    padding: 5,
  },
});

export default AppSearchBar;
