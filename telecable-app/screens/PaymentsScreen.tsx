import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ListItem from '../components/ListItem';
import { Colors } from '../constants/Colors';
import { mockPayments } from '../constants/mockData';
import { Ionicons } from '@expo/vector-icons';

type PaymentsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentsTab'>;

interface PaymentsScreenProps {
    navigation: PaymentsScreenNavigationProp;
}

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation }) => {
    const renderPaymentItem = ({ item }: { item: typeof mockPayments[0] }) => (
        <ListItem
            title={`Pago de $${item.amount.toFixed(2)}`}
            description={`Realizado el ${item.date} vía ${item.method}`}
            rightContent={
                <View style={styles.statusContainer}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            }
            onPress={() => alert(`Detalles del pago ${item.id}`)}
            style={styles.paymentListItem}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Historial de Pagos</Text>
            <FlatList
                data={mockPayments}
                keyExtractor={(item) => item.id}
                renderItem={renderPaymentItem}
                contentContainerStyle={styles.listContent}
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
    listContent: {
        paddingBottom: 20,
    },
    paymentListItem: {
        backgroundColor: Colors.card,
        marginBottom: 10,
        borderRadius: 8,
        marginHorizontal: 20,
        borderBottomWidth: 0, // Remove default border from ListItem
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        color: Colors.success,
        marginLeft: 5,
        fontWeight: '600',
    },
});

export default PaymentsScreen;
