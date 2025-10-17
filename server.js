const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Load database
let database = {};
try {
    const data = fs.readFileSync('database.json', 'utf8');
    database = JSON.parse(data);
} catch (error) {
    console.log('Creating new database...');
    database = {
        categories: [],
        products: [],
            orders: [],
        settings: {
            site_name: "MMO Services Store",
            site_description: "Cửa hàng dịch vụ MMO uy tín",
            contact_email: "admin@andev.site",
            contact_phone: "0123456789",
            payment_config: {
                bank_name: "VietinBank",
                account_number: "113366668888",
                account_holder: "NGUYEN VAN A"
            }
        }
    };
    saveDatabase();
}

// Save database
function saveDatabase() {
    try {
        fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
        console.log('Database saved successfully');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/locket', (req, res) => {
    res.sendFile(path.join(__dirname, 'locket.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

app.get('/vietqr', (req, res) => {
    res.sendFile(path.join(__dirname, 'vietqr.html'));
});

app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'));
});

// API Routes
app.get('/api/database', (req, res) => {
    res.json(database);
});

app.post('/api/database', (req, res) => {
    try {
        database = req.body;
        saveDatabase();
        res.json({ success: true, message: 'Database updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = database.orders?.find(o => o.id === orderId);
    
    if (order) {
        res.json({
            success: true,
            order: order
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }
});

app.get('/api/payment-config', (req, res) => {
    const config = database.settings?.payment_config || {
            bankName: 'VietinBank',
            accountNumber: '113366668888',
        accountHolder: 'NGUYEN VAN A'
        };

        res.json({
            success: true,
            config: config
        });
});

// Update order status
app.post('/api/orders/:orderId/status', (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    
    const order = database.orders?.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        saveDatabase();
        res.json({ success: true, order: order });
                } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
    console.log(`Locket: http://localhost:${PORT}/locket`);
});