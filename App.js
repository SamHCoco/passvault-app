import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import VaultScreen from './screens/VaultScreen';
import AppTextInput from './components/AppTextInput';
import EditWebCredentialScreen from './screens/EditWebCredentialScreen';

export default function App() {
  return (
    <VaultScreen />
  );
}
