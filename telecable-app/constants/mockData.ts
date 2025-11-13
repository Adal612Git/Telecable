import { Colors } from './Colors';

export const mockUserData = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+52 55 1234 5678',
    address: 'Av. Siempre Viva 123, Springfield',
    plan: 'Combo Fibra 200 + TV',
    status: 'Activo',
    profilePicture: 'https://via.placeholder.com/150/2F81F7/FFFFFF?text=JP',
};

export const mockAccountSummary = {
    currentBalance: 799.00,
    dueDate: '2025-12-01',
    status: 'Al Corriente',
    lastPaymentDate: '2025-11-15',
    lastPaymentAmount: 799.00,
};

export const mockInvoices = [
    {
        id: 'INV-2025-11-001',
        date: '2025-11-01',
        period: 'Noviembre 2025',
        amount: 799.00,
        status: 'Pagada',
        pdfUrl: 'https://example.com/invoice_nov_2025.pdf', // Placeholder
    },
    {
        id: 'INV-2025-10-001',
        date: '2025-10-01',
        period: 'Octubre 2025',
        amount: 799.00,
        status: 'Pagada',
        pdfUrl: 'https://example.com/invoice_oct_2025.pdf', // Placeholder
    },
    {
        id: 'INV-2025-09-001',
        date: '2025-09-01',
        period: 'Septiembre 2025',
        amount: 799.00,
        status: 'Pagada',
        pdfUrl: 'https://example.com/invoice_sep_2025.pdf', // Placeholder
    },
];

export const mockPayments = [
    {
        id: 'PAY-2025-11-001',
        date: '2025-11-15',
        amount: 799.00,
        method: 'Tarjeta de Crédito',
        status: 'Confirmado',
    },
    {
        id: 'PAY-2025-10-001',
        date: '2025-10-16',
        amount: 799.00,
        method: 'SPEI',
        status: 'Confirmado',
    },
    {
        id: 'PAY-2025-09-001',
        date: '2025-09-14',
        amount: 799.00,
        method: 'Tarjeta de Débito',
        status: 'Confirmado',
    },
];

export const mockTickets = [
    {
        id: 'TKT-2025-08-001',
        date: '2025-08-20',
        subject: 'Problemas de conexión intermitente',
        status: 'Cerrado',
        description: 'La conexión a internet se caía cada cierto tiempo, especialmente por las noches. Se realizó una visita técnica y se reemplazó el router.',
        resolution: 'Router reemplazado. Conexión estable.',
    },
    {
        id: 'TKT-2025-10-002',
        date: '2025-10-05',
        subject: 'No se ven algunos canales de TV',
        status: 'En Proceso',
        description: 'Desde ayer, los canales 5, 7 y 9 no tienen señal. El resto de canales funcionan correctamente.',
        resolution: null,
    },
];
