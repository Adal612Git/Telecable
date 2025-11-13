import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importación de pantallas
import HomeScreen from '../screens/HomeScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InvoiceScreen from '../screens/InvoiceScreen'; // Pantalla de detalle de factura

// Importación de constantes
import { Colors } from '../constants/Colors';

// Definición de tipos para la navegación
export type RootStackParamList = {
    HomeTab: undefined;
    PaymentsTab: undefined;
    SupportTab: { screen?: string }; // Permite navegar a una sub-pantalla dentro del tab
    ProfileTab: undefined;
    Invoice: undefined; // Pantalla de factura que se puede abrir desde Home
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const PaymentsStack = createNativeStackNavigator<RootStackParamList>();
const SupportStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();

// Stack Navigator para la pestaña de Inicio (Home)
const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Home" component={HomeScreen} />
        <HomeStack.Screen name="Invoice" component={InvoiceScreen} options={{ headerShown: true, title: 'Factura' }} />
        {/* Aquí se podrían añadir otras pantallas que se abran desde Home, como una de pago */}
    </HomeStack.Navigator>
);

// Stack Navigator para la pestaña de Pagos
const PaymentsStackScreen = () => (
    <PaymentsStack.Navigator screenOptions={{ headerShown: false }}>
        <PaymentsStack.Screen name="Payments" component={PaymentsScreen} />
        {/* Aquí se podrían añadir pantallas de detalle de pago */}
    </PaymentsStack.Navigator>
);

// Stack Navigator para la pestaña de Soporte
const SupportStackScreen = () => (
    <SupportStack.Navigator screenOptions={{ headerShown: false }}>
        <SupportStack.Screen name="Support" component={SupportScreen} />
        {/* Aquí se podría añadir una pantalla para crear un nuevo ticket */}
    </SupportStack.Navigator>
);

// Stack Navigator para la pestaña de Perfil
const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
);


const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'PaymentsTab') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'SupportTab') {
                        iconName = focused ? 'help-circle' : 'help-circle-outline';
                    } else if (route.name === 'ProfileTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'alert-circle-outline'; // Fallback icon
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.muted,
                tabBarStyle: {
                    backgroundColor: Colors.card,
                    borderTopColor: Colors.border,
                    paddingBottom: 5,
                    height: 60,
                },
                headerShown: false, // Oculta el header por defecto en las pestañas
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStackScreen}
                options={{ title: 'Inicio' }}
            />
            <Tab.Screen
                name="PaymentsTab"
                component={PaymentsStackScreen}
                options={{ title: 'Pagos' }}
            />
            <Tab.Screen
                name="SupportTab"
                component={SupportStackScreen}
                options={{ title: 'Soporte' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStackScreen}
                options={{ title: 'Perfil' }}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;
