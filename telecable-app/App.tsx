import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { Colors } from './constants/Colors';

// Extender el tema oscuro de React Navigation para usar nuestros colores
const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: Colors.primary,
        background: Colors.dark,
        card: Colors.card,
        text: Colors.text,
        border: Colors.border,
        notification: Colors.primary, // Para badges, etc.
    },
};

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer theme={CustomDarkTheme}>
                <AppNavigator />
                <StatusBar style="light" />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}