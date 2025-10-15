const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const nodemailer = require('nodemailer');
const { db } = require('../supabase-config');

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

// Serve .mobileconfig files with correct MIME type
app.get('*.mobileconfig', (req, res) => {
    res.setHeader('Content-Type', 'application/x-apple-aspen-config');
    res.setHeader('Content-Disposition', 'attachment; filename="LocketGoldDNS.mobileconfig"');
    res.sendFile(path.join(__dirname, '..', req.path));
});

// Generate unique order ID
function generateOrderId() {
    return 'ORD' + Date.now() + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Generate download token
function generateDownloadToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Generate activation key
function generateActivationKey() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `LOCKET-${timestamp}-${random}`;
}

// Check if admin key is valid
function isValidAdminKey(adminKey) {
    if (!adminKey) return false;
    
    // Check hardcoded admin key
    if (adminKey === 'admin123') return true;
    
    // Check environment variable
    if (adminKey === process.env.adminKey) return true;
    
    return false;
}

// Email configuration
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.emailUser || 'your-email@gmail.com',
        pass: process.env.emailPass || 'your-app-password'
    }
};

// Create email transporter
const transporter = nodemailer.createTransporter(emailConfig);

// API: Verify Key
app.post('/api/verify-key', async (req, res) => {
    try {
        const { key, deviceFingerprint } = req.body;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: 'Key không được để trống'
            });
        }

        // Check if key exists
        const keyData = await db.getKey(key);
        if (!keyData) {
            return res.json({
                success: false,
                message: 'Key không hợp lệ'
            });
        }

        // Check if key is already used
        if (keyData.used) {
            return res.json({
                success: false,
                message: 'Key này đã được sử dụng'
            });
        }

        // Check if device already downloaded
        const deviceDownload = await db.getDeviceDownload(deviceFingerprint);
        
        if (deviceDownload) {
            return res.json({
                success: false,
                message: 'Thiết bị này đã tải xuống rồi. Mỗi thiết bị chỉ được tải 1 lần.'
            });
        }

        // Mark key as used
        await db.updateKey(key, {
            used: true,
            usedAt: new Date().toISOString(),
            deviceFingerprint: deviceFingerprint
        });

        // Add device download record
        await db.trackDeviceDownload({
            key,
            deviceFingerprint,
            ip: req.ip
        });

        res.json({
            success: true,
            message: 'Key hợp lệ'
        });

    } catch (error) {
        console.error('Error verifying key:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, paymentMethod, total } = req.body;

        // Validate
        if (!customer || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Thông tin không hợp lệ'
            });
        }

        const orderId = generateOrderId();
        const downloadToken = generateDownloadToken();

        // Create order
        const orderData = {
            orderId,
            customer,
            items,
            paymentMethod,
            total,
            downloadToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        await db.createOrder(orderData);

        res.json({
            success: true,
            orderId,
            message: 'Đơn hàng đã được tạo thành công'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Get Payment Config
app.get('/api/payment-config', async (req, res) => {
    try {
        const config = await db.getConfig('payment') || {
            bankName: 'MBBank',
            accountNumber: '113366668888',
            accountHolder: 'NGUYEN VAN A',
            productPrice: 30000
        };

        res.json({
            success: true,
            config: config
        });
    } catch (error) {
        console.error('Error getting payment config:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = app;
