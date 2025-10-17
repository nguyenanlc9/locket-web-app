const express = require('express');
const path = require('path');
const fs = require('fs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Serve static files from specific directories
app.use('/admin', express.static('../admin'));
app.use('/locket', express.static('../locket'));
app.use('/download', express.static('../download'));
app.use('/images', express.static('../images'));

// Database path
const DB_PATH = path.join(__dirname, '../database.json');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../images', 'uploads');
        console.log('=== UPLOAD DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Type from body:', req.body.type);
        console.log('Upload destination:', uploadPath);
        console.log('Full path:', path.resolve(uploadPath));
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('Created directory:', uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `${req.body.type || 'upload'}-${uniqueSuffix}${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép file ảnh (JPEG, PNG, GIF, WebP)'));
        }
    }
});

// Debug middleware for upload
app.use('/api/upload', (req, res, next) => {
    console.log('=== UPLOAD MIDDLEWARE DEBUG ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body before multer:', req.body);
    next();
});

// Load database
let database = {};
try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    database = JSON.parse(data);
    console.log('Database loaded from:', DB_PATH);
} catch (error) {
    console.log('Creating new database at:', DB_PATH);
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
        fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2));
        console.log('Database saved successfully to:', DB_PATH);
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '../payment.html'));
});

app.get('/vietqr', (req, res) => {
    res.sendFile(path.join(__dirname, '../vietqr.html'));
});

app.get('/locket', (req, res) => {
    res.sendFile(path.join(__dirname, '../locket', 'locket.html'));
});

app.get('/locket/vietqr', (req, res) => {
    res.sendFile(path.join(__dirname, '../locket', 'vietqr.html'));
});

app.get('/locket/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '../locket', 'payment.html'));
});

app.get('/locket/download', (req, res) => {
    res.sendFile(path.join(__dirname, '../locket', 'download.html'));
});

// Routes for Admin files
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin', 'admin.html'));
});

app.get('/admin/secure', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin', 'admin-secure.html'));
});

// Routes for Download files
app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, '../download', 'LocketGoldDNS.mobileconfig'));
});

// Payment route moved to /locket/payment

// VietQR route moved to /locket/vietqr

// Download route moved to /locket/download

// API Routes
app.get('/api/database', (req, res) => {
    res.json({ success: true, database: database });
});

// Image upload API
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        console.log('=== UPLOAD API DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request body type:', typeof req.body);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Type value:', req.body.type);
        console.log('File info:', req.file);
        
        // Parse type from body or use default
        const type = req.body.type || 'uploads';
        console.log('Final type to use:', type);
        
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ 
                success: false, 
                error: 'Không có file được upload' 
            });
        }

        const imageUrl = `/images/uploads/${req.file.filename}`;
        console.log('File saved to:', req.file.path);
        console.log('Image URL:', imageUrl);
        
        res.json({
            success: true,
            imageUrl: imageUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 2FA API endpoints
app.get('/api/2fa/setup', (req, res) => {
    try {
        // Check if 2FA is already set up
        if (database.system_settings && database.system_settings.two_fa_secret) {
            return res.json({
                success: true,
                secret: database.system_settings.two_fa_secret,
                qrCodeUrl: null, // No need to show QR again
                manualEntryKey: database.system_settings.two_fa_secret,
                alreadySetup: true
            });
        }

        // Generate new secret
        const secret = speakeasy.generateSecret({
            name: 'LocketWeb Admin',
            issuer: 'LocketWeb',
            length: 32
        });

        // Generate QR code
        QRCode.toDataURL(secret.otpauth_url, (err, qrCodeUrl) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to generate QR code' });
            }

            res.json({
                success: true,
                secret: secret.base32,
                qrCodeUrl: qrCodeUrl,
                manualEntryKey: secret.base32,
                alreadySetup: false
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/2fa/verify', (req, res) => {
    try {
        const { token, secret, isSetup } = req.body;
        
        // Use stored secret if available, otherwise use provided secret
        const secretToUse = database.system_settings?.two_fa_secret || secret;
        
        const verified = speakeasy.totp.verify({
            secret: secretToUse,
            encoding: 'base32',
            token: token,
            window: 2
        });
        
        // If this is setup verification and token is valid, save secret to database
        if (verified && isSetup && secret) {
            if (!database.system_settings) {
                database.system_settings = {};
            }
            database.system_settings.two_fa_secret = secret;
            
            // Save to database file
            try {
                fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2));
                console.log('2FA secret saved to database');
            } catch (error) {
                console.error('Error saving 2FA secret:', error);
            }
        }
        
        res.json({ success: verified });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
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

// Create new order
app.post('/api/orders', (req, res) => {
    try {
        const order = req.body;
        
        // Add order to database
        if (!database.orders) database.orders = [];
        database.orders.push(order);
        
        // Save database
        saveDatabase();
        
        res.json({ success: true, order: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
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
        bankName: 'MBBank',
        accountNumber: '1613072005',
        accountHolder: 'NGUYEN HUYNH TUONG AN',
        productPrice: 30000
    };
    
    res.json({
        success: true,
        config: config
    });
});

// Update payment config
app.post('/api/payment-config', (req, res) => {
    try {
        const { bankName, accountNumber, accountHolder, productPrice } = req.body;
        
        if (!database.settings) {
            database.settings = {};
        }
        
        database.settings.payment_config = {
            bankName: bankName || 'MBBank',
            accountNumber: accountNumber || '1613072005',
            accountHolder: accountHolder || 'NGUYEN HUYNH TUONG AN',
            productPrice: parseInt(productPrice) || 30000
        };
        
        saveDatabase();
        
        res.json({
            success: true,
            message: 'Payment config updated successfully'
        });
    } catch (error) {
        console.error('Error updating payment config:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Telegram API
app.post('/api/telegram/send', async (req, res) => {
    try {
        const { botToken, chatId, message } = req.body;
        
        if (!botToken || !chatId || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            res.json({
                success: true,
                message: 'Message sent successfully'
            });
        } else {
            res.json({
                success: false,
                message: result.description || 'Failed to send message'
            });
        }
    } catch (error) {
        console.error('Telegram API error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
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