import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { colors } from './src/theme/colors';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Toast } from './src/components/Toast';

const navTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
    notification: colors.accent,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}
