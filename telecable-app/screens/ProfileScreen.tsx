import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { mockUserData } from '../constants/mockData';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileTab'>;

interface ProfileScreenProps {
    navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    // En una app real, estos estados manejarían los valores del formulario
    const [name, setName] = React.useState(mockUserData.name);
    const [email, setEmail] = React.useState(mockUserData.email);
    const [phone, setPhone] = React.useState(mockUserData.phone);
    const [address, setAddress] = React.useState(mockUserData.address);

    const handleSaveChanges = () => {
        // Lógica para guardar cambios (en este prototipo, solo un alert)
        alert('Cambios guardados (simulado)!');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.headerTitle}>Mi Perfil</Text>

            <Card style={styles.profileHeaderCard}>
                <Image source={{ uri: mockUserData.profilePicture }} style={styles.profileImage} />
                <Text style={styles.profileName}>{mockUserData.name}</Text>
                <Text style={styles.profilePlan}>{mockUserData.plan}</Text>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre Completo</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={Colors.muted}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor={Colors.muted}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor={Colors.muted}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        placeholderTextColor={Colors.muted}
                    />
                </View>
                <Button title="Guardar Cambios" onPress={handleSaveChanges} style={styles.saveButton} />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 15,
    },
    profileHeaderCard: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    profilePlan: {
        fontSize: 16,
        color: Colors.muted,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: Colors.muted,
        marginBottom: 5,
    },
    input: {
        backgroundColor: Colors.dark,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: Colors.text,
    },
    saveButton: {
        marginTop: 20,
    },
});

export default ProfileScreen;
