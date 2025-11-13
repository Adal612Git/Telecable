import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { mockInvoices, mockUserData } from '../constants/mockData';
import { Ionicons } from '@expo/vector-icons';

type InvoiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Invoice'>;

interface InvoiceScreenProps {
    navigation: InvoiceScreenNavigationProp;
}

const InvoiceScreen: React.FC<InvoiceScreenProps> = ({ navigation }) => {
    const currentInvoice = mockInvoices[0]; // Usamos la factura más reciente como ejemplo

    if (!currentInvoice) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Factura</Text>
                <Card>
                    <Text style={styles.noInvoiceText}>No hay facturas disponibles.</Text>
                </Card>
            </View>
        );
    }

    const handleDownload = () => {
        alert(`Descargando factura ${currentInvoice.id} de ${currentInvoice.pdfUrl}`);
        // En una app real, aquí se implementaría la lógica de descarga
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.headerTitle}>Detalle de Factura</Text>

            <Card>
                <View style={styles.invoiceHeader}>
                    <Text style={styles.invoiceId}>Factura #{currentInvoice.id}</Text>
                    <Text style={styles.invoiceDate}>{currentInvoice.date}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cliente</Text>
                    <Text style={styles.detailText}>{mockUserData.name}</Text>
                    <Text style={styles.detailText}>{mockUserData.address}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Periodo</Text>
                    <Text style={styles.detailText}>{currentInvoice.period}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalle del Servicio</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.itemDescription}>{mockUserData.plan}</Text>
                        <Text style={styles.itemAmount}>${currentInvoice.amount.toFixed(2)}</Text>
                    </View>
                    {/* Aquí se podrían añadir más detalles si los hubiera */}
                </View>

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total a Pagar</Text>
                    <Text style={styles.totalAmount}>${currentInvoice.amount.toFixed(2)}</Text>
                </View>

                <View style={styles.buttonGroup}>
                    <Button title="Descargar PDF" onPress={handleDownload} variant="outline" style={styles.actionButton} />
                    <Button title="Pagar Factura" onPress={() => alert('Navegar a pantalla de pago')} style={styles.actionButton} />
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 15,
    },
    noInvoiceText: {
        color: Colors.muted,
        textAlign: 'center',
        paddingVertical: 20,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: 10,
    },
    invoiceId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    invoiceDate: {
        fontSize: 16,
        color: Colors.muted,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 5,
    },
    detailText: {
        fontSize: 14,
        color: Colors.muted,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: Colors.text,
    },
    itemAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 15,
        marginTop: 20,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default InvoiceScreen;
