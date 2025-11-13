import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ListItem from '../components/ListItem';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { mockTickets } from '../constants/mockData';
import { Ionicons } from '@expo/vector-icons';

type SupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SupportTab'>;

interface SupportScreenProps {
    navigation: SupportScreenNavigationProp;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ navigation }) => {
    const renderTicketItem = ({ item }: { item: typeof mockTickets[0] }) => (
        <ListItem
            title={item.subject}
            description={`Estado: ${item.status} - ${item.date}`}
            rightContent={
                <Ionicons
                    name={item.status === 'Cerrado' ? 'checkmark-circle' : 'time-outline'}
                    size={24}
                    color={item.status === 'Cerrado' ? Colors.success : Colors.warning}
                />
            }
            onPress={() => alert(`Detalles del ticket ${item.id}: ${item.description}`)}
            style={styles.ticketListItem}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Soporte Técnico</Text>

            <Button
                title="Reportar Nuevo Problema"
                onPress={() => alert('Navegar a formulario de nuevo ticket')}
                style={styles.newTicketButton}
            />

            <Text style={styles.sectionTitle}>Mis Tickets Anteriores</Text>
            <FlatList
                data={mockTickets}
                keyExtractor={(item) => item.id}
                renderItem={renderTicketItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyListText}>No tienes tickets anteriores.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    newTicketButton: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    listContent: {
        paddingBottom: 20,
    },
    ticketListItem: {
        backgroundColor: Colors.card,
        marginBottom: 10,
        borderRadius: 8,
        marginHorizontal: 20,
        borderBottomWidth: 0,
    },
    emptyListText: {
        color: Colors.muted,
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
    },
});

export default SupportScreen;
