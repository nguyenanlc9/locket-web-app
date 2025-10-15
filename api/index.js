const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve all HTML files
app.get('*.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', req.path));
});

// API endpoints
app.get('/api/payment-config', (req, res) => {
    res.json({
        success: true,
        config: {
            bankName: 'MBBank',
            accountNumber: '113366668888',
            accountHolder: 'NGUYEN VAN A',
            productPrice: 30000
        }
    });
});

app.post('/api/verify-key', (req, res) => {
    res.json({
        success: true,
        message: 'Key hợp lệ'
    });
});

app.post('/api/orders', (req, res) => {
    res.json({
        success: true,
        orderId: 'ORD' + Date.now(),
        message: 'Đơn hàng đã được tạo thành công'
    });
});

app.get('/api/orders/:orderId', (req, res) => {
    res.json({
        success: true,
        order: {
            orderId: req.params.orderId,
            status: 'pending',
            items: [{ name: 'Locket Gold Key', price: 30000 }],
            total: 30000,
            downloadToken: 'demo-token',
            downloadLimit: 1,
            downloadCount: 0,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    });
});

module.exports = app;