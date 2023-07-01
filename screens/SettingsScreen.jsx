import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import AppIcon from '../components/AppIcon';
import { BLACK, LIGHT_GREEN, WHITE } from '../constants/colors';
import AppSetting from '../components/AppSetting';

const SettingsScreen = () => {
    return (
      <View style={styles.container}>
        <View style={styles.icon}>
            <AppIcon name="cog-outline" size={95} color={LIGHT_GREEN} />
        </View>
        <Section title="Security">
          <Option title="Change Pin" onPress={() => handlePress('Change Password')} />
        </Section>
        <Section title="Info">
          <Option title="About" onPress={() => handlePress('About')} />
        </Section>
      </View>
    );
  };

  const Section = ({ title, children }) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    );
  };
  
  const Option = ({ title, onPress }) => {
    return (
      <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
        <Text style={styles.optionTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };
  
  const handlePress = (option) => {
    // Handle the option press event
    console.log('Selected option:', option);
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 32,
      backgroundColor: WHITE
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    optionContainer: {
      backgroundColor: '#EAEAEA',
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
    },
    optionTitle: {
      fontSize: 16,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

export default SettingsScreen;