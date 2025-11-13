import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { mockAccountSummary, mockUserData } from '../constants/mockData';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeTab'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const isAccountCurrent = mockAccountSummary.status === 'Al Corriente';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.welcomeText}>Hola, {mockUserData.name.split(' ')[0]}!</Text>

            <Card style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                    <Text style={styles.cardTitle}>Estado de tu Cuenta</Text>
                    <View style={[styles.statusBadge, isAccountCurrent ? styles.statusCurrent : styles.statusOverdue]}>
                        <Text style={styles.statusText}>{mockAccountSummary.status}</Text>
                    </View>
                </View>
                <Text style={styles.balanceText}>${mockAccountSummary.currentBalance.toFixed(2)}</Text>
                <Text style={styles.dueDateText}>Fecha límite: {mockAccountSummary.dueDate}</Text>

                <View style={styles.buttonGroup}>
                    <Button
                        title="Pagar Ahora"
                        onPress={() => alert('Navegar a pantalla de pago')}
                        style={styles.actionButton}
                        disabled={isAccountCurrent}
                    />
                    <Button
                        title="Ver Factura"
                        onPress={() => navigation.navigate('Invoice')}
                        variant="outline"
                        style={styles.actionButton}
                    />
                </View>
            </Card>

            <Card style={styles.quickActionsCard}>
                <Text style={styles.cardTitle}>Acciones Rápidas</Text>
                <View style={styles.quickActionsGrid}>
                    <Button
                        title="Reportar Problema"
                        onPress={() => navigation.navigate('SupportTab', { screen: 'NewTicket' })}
                        variant="secondary"
                        style={styles.quickActionButton}
                        textStyle={styles.quickActionButtonText}
                    />
                    <Button
                        title="Historial de Pagos"
                        onPress={() => navigation.navigate('PaymentsTab')}
                        variant="secondary"
                        style={styles.quickActionButton}
                        textStyle={styles.quickActionButtonText}
                    />
                    <Button
                        title="Mi Perfil"
                        onPress={() => navigation.navigate('ProfileTab')}
                        variant="secondary"
                        style={styles.quickActionButton}
                        textStyle={styles.quickActionButtonText}
                    />
                    <Button
                        title="Cambiar Plan"
                        onPress={() => alert('Navegar a pantalla de cambio de plan')}
                        variant="secondary"
                        style={styles.quickActionButton}
                        textStyle={styles.quickActionButtonText}
                    />
                </View>
            </Card>

            <Card>
                <Text style={styles.cardTitle}>Último Pago</Text>
                <View style={styles.lastPaymentInfo}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    <View style={styles.lastPaymentDetails}>
                        <Text style={styles.lastPaymentText}>Pagado: ${mockAccountSummary.lastPaymentAmount.toFixed(2)}</Text>
                        <Text style={styles.lastPaymentDate}>El {mockAccountSummary.lastPaymentDate}</Text>
                    </View>
                </View>
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
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 20,
    },
    summaryCard: {
        marginBottom: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    statusCurrent: {
        backgroundColor: Colors.success,
    },
    statusOverdue: {
        backgroundColor: Colors.danger,
    },
    statusText: {
        color: Colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    balanceText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 5,
    },
    dueDateText: {
        fontSize: 14,
        color: Colors.muted,
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    quickActionsCard: {
        marginBottom: 20,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    quickActionButton: {
        width: '48%', // Approx half width with gap
        marginBottom: 10,
        backgroundColor: Colors.card,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    quickActionButtonText: {
        color: Colors.primary,
        fontSize: 14,
    },
    lastPaymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    lastPaymentDetails: {
        marginLeft: 10,
    },
    lastPaymentText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    lastPaymentDate: {
        fontSize: 13,
        color: Colors.muted,
    },
});

export default HomeScreen;
