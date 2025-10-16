const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Get real IP address
app.use((req, res, next) => {
    req.ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
             '127.0.0.1';
    next();
});

// Serve .mobileconfig files with correct MIME type
app.get('*.mobileconfig', (req, res) => {
    res.setHeader('Content-Type', 'application/x-apple-aspen-config');
    res.setHeader('Content-Disposition', 'attachment; filename="LocketGoldDNS.mobileconfig"');
    res.sendFile(path.join(__dirname, req.path));
});

// Routes without .html extension
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'));
});

app.get('/vietqr', (req, res) => {
    res.sendFile(path.join(__dirname, 'vietqr.html'));
});

// Database (JSON file - for simple implementation)
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database
async function initDatabase() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({
            orders: [],
            downloads: [],
            keys: [
                // Demo keys
                { key: 'DEMO-2024-GOLD', used: false, createdAt: new Date().toISOString() },
                { key: 'TEST-KEY-12345', used: false, createdAt: new Date().toISOString() }
            ],
            deviceDownloads: []
        }, null, 2));
    }
}

// Read database
async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write database
async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

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
    if (adminKey === process.env.ADMIN_KEY) return true;
    
    return false;
}

// Email configuration
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
};

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig);

// Send Telegram notification function
async function sendTelegramNotification(customerName, activationKey, orderId, total) {
    try {
        const db = await readDB();
        const telegramConfig = db.telegramConfig;
        
        if (!telegramConfig || !telegramConfig.botToken || !telegramConfig.chatId) {
            console.log('Telegram config not found, skipping notification');
            return;
        }

        const message = `🎉 *THANH TOÁN THÀNH CÔNG*

👤 *Khách hàng:* ${customerName}
🆔 *Mã đơn hàng:* \`${orderId}\`
💰 *Số tiền:* ${new Intl.NumberFormat('vi-VN').format(total)}₫
🔑 *Key kích hoạt:* \`${activationKey}\`

⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}

✅ Đơn hàng đã được xác nhận thanh toán thành công!`;

        const telegramUrl = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramConfig.chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            console.log(`✅ Telegram notification sent for order ${orderId}`);
        } else {
            console.error('❌ Failed to send Telegram notification:', await response.text());
        }
    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error);
    }
}

// Send Telegram notification for new order
async function sendNewOrderNotification(customerName, orderId, total, paymentMethod, customerInfo, clientIP) {
    try {
        const db = await readDB();
        const telegramConfig = db.telegramConfig;
        
        if (!telegramConfig || !telegramConfig.botToken || !telegramConfig.chatId) {
            console.log('Telegram config not found, skipping new order notification');
            return;
        }

        const message = `🛒 *ĐƠN HÀNG MỚI*

👤 *Khách hàng:* ${customerName}
🆔 *Mã đơn hàng:* \`${orderId}\`
💰 *Số tiền:* ${new Intl.NumberFormat('vi-VN').format(total)}₫
💳 *Phương thức:* ${paymentMethod === 'vietqr' ? 'Chuyển khoản' : paymentMethod.toUpperCase()}

📧 *Email:* \`${customerInfo.email}\`
📱 *Số điện thoại:* \`${customerInfo.phone}\`
🌐 *IP Address:* \`${clientIP || 'Unknown'}\`

⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}

🔔 Nhấn nút bên dưới để xác nhận thanh toán!`;

        const telegramUrl = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramConfig.chatId,
                text: message,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "✅ Xác nhận thanh toán",
                                callback_data: `confirm_${orderId}`
                            }
                        ],
                        [
                            {
                                text: "❌ Từ chối đơn hàng",
                                callback_data: `reject_${orderId}`
                            }
                        ]
                    ]
                }
            })
        });

        if (response.ok) {
            console.log(`✅ New order notification sent for order ${orderId}`);
        } else {
            console.error('❌ Failed to send new order notification:', await response.text());
        }
    } catch (error) {
        console.error('❌ Error sending new order notification:', error);
    }
}

// Send email function
async function sendActivationKey(customerEmail, customerName, activationKey, orderId) {
    try {
        // Get email config from database
        const db = await readDB();
        const emailConfig = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: db.paymentConfig?.emailUser || 'your-email@gmail.com',
                pass: db.paymentConfig?.emailPass || 'your-app-password'
            }
        };

        // Create new transporter with updated config
        const transporter = nodemailer.createTransport(emailConfig);

        const mailOptions = {
            from: emailConfig.auth.user,
            to: customerEmail,
            subject: '🔑 Key Kích Hoạt Locket Gold - Đơn Hàng ' + orderId,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1>🔑 Key Kích Hoạt Locket Gold</h1>
                        <p>Cảm ơn bạn đã mua hàng!</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border: 1px solid #eee;">
                        <h2>Xin chào ${customerName}!</h2>
                        <p>Đơn hàng <strong>${orderId}</strong> của bạn đã được xác nhận thanh toán thành công.</p>
                        
                        <div style="background: #f5f7fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                            <h3>🔑 Key Kích Hoạt Của Bạn:</h3>
                            <div style="background: #667eea; color: white; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; margin: 10px 0;">
                                ${activationKey}
                            </div>
                        </div>
                        
                        <h3>📋 Hướng Dẫn Sử Dụng:</h3>
                        <ol style="line-height: 1.8;">
                            <li>Truy cập trang web của bạn</li>
                            <li>Nhập key kích hoạt ở trên</li>
                            <li>Tải xuống Shadowrocket + Config Gold + DNS</li>
                            <li>Làm theo hướng dẫn cài đặt</li>
                            <li>Tận hưởng Locket Gold Premium!</li>
                        </ol>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <strong>⚠️ Lưu ý:</strong> Key này chỉ có thể sử dụng 1 lần trên mỗi thiết bị. Vui lòng lưu file sau khi tải xuống.
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666;">
                        <p>Nếu có thắc mắc, vui lòng liên hệ: support@locketgold.com</p>
                        <p>© 2024 Locket Gold. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${customerEmail} with key: ${activationKey}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
}

// API: Verify Key (for main page)
app.post('/api/verify-key', async (req, res) => {
    try {
        const { key, deviceFingerprint } = req.body;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: 'Key không được để trống'
            });
        }

        const db = await readDB();

        // Check if key exists
        const keyData = db.keys.find(k => k.key === key);
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
        const deviceDownload = db.deviceDownloads.find(
            d => d.deviceFingerprint === deviceFingerprint
        );
        
        if (deviceDownload) {
            return res.json({
                success: false,
                message: 'Thiết bị này đã tải xuống rồi. Mỗi thiết bị chỉ được tải 1 lần.'
            });
        }

        // Mark key as used
        keyData.used = true;
        keyData.usedAt = new Date().toISOString();
        keyData.deviceFingerprint = deviceFingerprint;

        // Add device download record
        db.deviceDownloads.push({
            key,
            deviceFingerprint,
            ip: req.ip,
            timestamp: new Date().toISOString()
        });

        await writeDB(db);

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

// API: Track Download
app.post('/api/track-download', async (req, res) => {
    try {
        const { key, type, deviceFingerprint } = req.body;

        const db = await readDB();
        
        db.downloads.push({
            key,
            type,
            deviceFingerprint,
            ip: req.ip,
            timestamp: new Date().toISOString()
        });

        await writeDB(db);

        res.json({ success: true });

    } catch (error) {
        console.error('Error tracking download:', error);
        res.status(500).json({ success: false });
    }
});

// API: Generate Keys (Admin)
app.post('/api/admin/generate-keys', async (req, res) => {
    try {
        const { adminKey, count = 1, prefix = 'LOCKET' } = req.body;

        // Check admin key
        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        const newKeys = [];

        for (let i = 0; i < count; i++) {
            const key = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
            newKeys.push({
                key,
                used: false,
                createdAt: new Date().toISOString(),
                createdBy: 'admin'
            });
        }

        db.keys.push(...newKeys);
        await writeDB(db);

        res.json({
            success: true,
            keys: newKeys,
            message: `Đã tạo ${count} key thành công`
        });

    } catch (error) {
        console.error('Error generating keys:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Get All Keys (Admin)
app.get('/api/admin/keys', async (req, res) => {
    try {
        const { adminKey } = req.query;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();

        res.json({
            success: true,
            keys: db.keys,
            stats: {
                total: db.keys.length,
                used: db.keys.filter(k => k.used).length,
                unused: db.keys.filter(k => !k.used).length
            }
        });

    } catch (error) {
        console.error('Error getting keys:', error);
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

        const db = await readDB();
        const orderId = generateOrderId();
        const downloadToken = generateDownloadToken();

        // Create order
        const order = {
            orderId,
            customer,
            items,
            paymentMethod,
            total,
            status: 'pending',
            downloadToken,
            downloadLimit: items.reduce((sum, item) => sum + (item.downloads || 0), 0),
            downloadCount: 0,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        };

        db.orders.push(order);
        await writeDB(db);

        // Send new order notification to Telegram
        console.log(`📤 Sending Telegram notification for order ${orderId}`);
        await sendNewOrderNotification(
            customer.fullName,
            orderId,
            total,
            paymentMethod,
            customer,
            req.ip
        );

        // Generate payment URL based on payment method
        let paymentUrl = '';
        if (paymentMethod === 'bank') {
            paymentUrl = `/payment/bank/${orderId}`;
        }

        res.json({
            success: true,
            orderId,
            paymentUrl,
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

// API: Check Order Status
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const db = await readDB();
        const order = db.orders.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.json({
            success: true,
            order: {
                orderId: order.orderId,
                status: order.status,
                items: order.items,
                total: order.total,
                downloadToken: order.status === 'paid' ? order.downloadToken : null,
                downloadLimit: order.downloadLimit,
                downloadCount: order.downloadCount,
                createdAt: order.createdAt,
                expiresAt: order.expiresAt
            }
        });
    } catch (error) {
        console.error('Error checking order:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Download File (with token and limit check)
app.get('/api/download/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const db = await readDB();
        const order = db.orders.find(o => o.downloadToken === token);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }

        // Check if order is paid
        if (order.status !== 'paid' && order.status !== 'completed') {
            return res.status(403).json({
                success: false,
                message: 'Đơn hàng chưa được thanh toán'
            });
        }

        // Check download limit
        if (order.downloadLimit !== 999 && order.downloadCount >= order.downloadLimit) {
            return res.status(403).json({
                success: false,
                message: 'Đã hết lượt tải. Liên hệ hỗ trợ để gia hạn.'
            });
        }

        // Check expiry
        if (new Date() > new Date(order.expiresAt)) {
            return res.status(403).json({
                success: false,
                message: 'Link tải đã hết hạn'
            });
        }

        // Increment download count
        order.downloadCount++;
        if (order.downloadCount >= order.downloadLimit && order.downloadLimit !== 999) {
            order.status = 'completed';
        }
        await writeDB(db);

        // Log download
        db.downloads.push({
            orderId: order.orderId,
            token,
            downloadedAt: new Date().toISOString(),
            ip: req.ip
        });
        await writeDB(db);

        // Return download links
        res.json({
            success: true,
            downloads: {
                shadowrocket: 'itms-services://?action=download-manifest&url=https%3A%2F%2Fdl.3u.com%2Fplist%2F2025%2F09%2F28%2F1759023053857_696086.plist',
                config: 'https://raw.githubusercontent.com/vuong2023/shad/main/modules/Locket_ohb.sgmodule'
            },
            remainingDownloads: order.downloadLimit === 999 ? 'Không giới hạn' : order.downloadLimit - order.downloadCount,
            message: 'Tải xuống thành công!'
        });

    } catch (error) {
        console.error('Error downloading:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Manual Payment Confirmation (Bank Transfer)
app.post('/api/payment/bank/confirm', async (req, res) => {
    try {
        const { orderId, adminKey } = req.body;

        // Check admin key for security
        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        const order = db.orders.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        if (order.status === 'paid') {
            return res.json({
                success: true,
                message: 'Đơn hàng đã được thanh toán rồi'
            });
        }

        // Mark as paid
        order.status = 'paid';
        order.paidAt = new Date().toISOString();
        await writeDB(db);

        // Generate new activation key
        try {
            const newKey = generateActivationKey();
            
            // Create new key record
            const keyRecord = {
                key: newKey,
                used: true,
                createdAt: new Date().toISOString(),
                usedAt: new Date().toISOString(),
                usedBy: order.customer.email,
                deviceFingerprint: 'manual-confirmation',
                orderId: orderId
            };
            
            db.keys.push(keyRecord);
            await writeDB(db);
            
            // Send email
            await sendActivationKey(
                order.customer.email,
                order.customer.fullName,
                newKey,
                orderId
            );
            
            console.log(`Order ${orderId} confirmed and new key ${newKey} sent to ${order.customer.email}`);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        res.json({
            success: true,
            message: 'Đơn hàng đã được xác nhận thanh toán thành công'
        });

    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Get Payment Config (Public)
app.get('/api/payment-config', async (req, res) => {
    try {
        const db = await readDB();
        const config = db.paymentConfig || {
            bankName: 'MBBank',
            accountNumber: '1613072005',
            accountHolder: 'NGUYEN HUYNH TUONG AN',
            productPrice: 30000,
            emailUser: 'your-email@gmail.com',
            emailPass: 'your-app-password'
        };

        // Only return public info (no email credentials)
        res.json({
            success: true,
            config: {
                bankName: config.bankName,
                accountNumber: config.accountNumber,
                accountHolder: config.accountHolder,
                productPrice: config.productPrice || 30000
            }
        });
    } catch (error) {
        console.error('Error getting payment config:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Get Payment Config (Admin)
app.get('/api/admin/payment-config', async (req, res) => {
    try {
        const { adminKey } = req.query;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        const config = db.paymentConfig || {
            bankName: 'VietinBank',
            accountNumber: '113366668888',
            accountHolder: 'NGUYEN VAN A',
            productPrice: 30000,
            emailUser: 'your-email@gmail.com',
            emailPass: 'your-app-password'
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

// API: Get Telegram Config (Admin)
app.get('/api/admin/telegram-config', async (req, res) => {
    try {
        const { adminKey } = req.query;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        const config = db.telegramConfig || {
            botToken: '',
            chatId: ''
        };

        res.json({
            success: true,
            config: config
        });
    } catch (error) {
        console.error('Error getting telegram config:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Update Telegram Config (Admin)
app.post('/api/admin/telegram-config', async (req, res) => {
    try {
        const { adminKey, botToken, chatId } = req.body;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        db.telegramConfig = {
            botToken: botToken || '',
            chatId: chatId || ''
        };

        await writeDB(db);

        // Start Telegram polling if bot token is provided
        if (botToken) {
            startTelegramPolling(botToken);
        }

        // Test Telegram connection
        if (botToken && chatId) {
            try {
                const testMessage = `🤖 *Test Message từ Locket Gold*
                
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
✅ Bot đã được cấu hình thành công!

Bạn sẽ nhận được thông báo khi có đơn hàng mới.`;

                const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
                
                const response = await fetch(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: testMessage,
                        parse_mode: 'Markdown'
                    })
                });

                if (response.ok) {
                    console.log('✅ Test message sent to Telegram successfully');
                } else {
                    console.error('❌ Failed to send test message to Telegram:', await response.text());
                }
            } catch (telegramError) {
                console.error('❌ Error testing Telegram connection:', telegramError);
            }
        }

        res.json({
            success: true,
            message: 'Cấu hình Telegram đã được lưu thành công'
        });
    } catch (error) {
        console.error('Error updating telegram config:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Update Payment Config (Admin)
app.post('/api/admin/payment-config', async (req, res) => {
    try {
        const { adminKey, bankName, accountNumber, accountHolder, productPrice, emailUser, emailPass } = req.body;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        db.paymentConfig = {
            bankName: bankName || 'VietinBank',
            accountNumber: accountNumber || '113366668888',
            accountHolder: accountHolder || 'NGUYEN VAN A',
            productPrice: productPrice || 30000,
            emailUser: emailUser || 'your-email@gmail.com',
            emailPass: emailPass || 'your-app-password'
        };

        await writeDB(db);

        res.json({
            success: true,
            message: 'Cấu hình thanh toán đã được cập nhật'
        });

    } catch (error) {
        console.error('Error updating payment config:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Test Telegram (Admin)
app.post('/api/admin/test-telegram', async (req, res) => {
    try {
        const { adminKey } = req.body;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        const telegramConfig = db.telegramConfig;
        
        if (!telegramConfig || !telegramConfig.botToken || !telegramConfig.chatId) {
            return res.json({
                success: false,
                message: 'Chưa cấu hình Telegram'
            });
        }

        const testMessage = `🧪 *TEST MESSAGE*

⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
✅ Bot Telegram hoạt động bình thường!

Bạn sẽ nhận được thông báo khi có đơn hàng mới.`;

        const telegramUrl = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramConfig.chatId,
                text: testMessage,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            res.json({
                success: true,
                message: 'Test message đã được gửi thành công!'
            });
        } else {
            const errorText = await response.text();
            res.json({
                success: false,
                message: 'Lỗi gửi message: ' + errorText
            });
        }
    } catch (error) {
        console.error('Error testing Telegram:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Handle Telegram Callback
app.post('/api/telegram/callback', async (req, res) => {
    try {
        console.log('📱 Received Telegram callback:', JSON.stringify(req.body, null, 2));
        
        const { callback_query } = req.body;
        
        if (!callback_query) {
            console.log('❌ No callback_query in request');
            return res.status(400).json({ success: false });
        }

        const { data, message, from, id: callbackId } = callback_query;
        const chatId = message.chat.id;
        const messageId = message.message_id;

        // Answer callback query to stop loading
        await answerCallbackQuery(callbackId, "Đang xử lý...");

        // Check if it's a confirm or reject action
        console.log(`🔍 Processing callback data: ${data}`);
        
        if (data.startsWith('confirm_')) {
            const orderId = data.replace('confirm_', '');
            console.log(`✅ Processing confirm for order: ${orderId}`);
            
            // Confirm payment
            const db = await readDB();
            const order = db.orders.find(o => o.orderId === orderId);
            
            if (!order) {
                await sendTelegramMessage(chatId, `❌ Không tìm thấy đơn hàng ${orderId}`, messageId);
                return res.json({ success: true });
            }

            if (order.status === 'paid') {
                await sendTelegramMessage(chatId, `⚠️ Đơn hàng ${orderId} đã được xác nhận rồi!`, messageId);
                return res.json({ success: true });
            }

            // Mark as paid
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            await writeDB(db);

            // Generate new activation key
            try {
                const newKey = generateActivationKey();
                
                // Create new key record
                const keyRecord = {
                    key: newKey,
                    used: true,
                    createdAt: new Date().toISOString(),
                    usedAt: new Date().toISOString(),
                    usedBy: order.customer.email,
                    deviceFingerprint: 'telegram-confirmation',
                    orderId: orderId
                };
                
                db.keys.push(keyRecord);
                await writeDB(db);
                
                // Send email
                await sendActivationKey(
                    order.customer.email,
                    order.customer.fullName,
                    newKey,
                    orderId
                );
                
                // Send success notification
                await sendTelegramMessage(chatId, 
                    `✅ *Đã xác nhận thanh toán thành công!*\n\n` +
                    `🆔 Đơn hàng: \`${orderId}\`\n` +
                    `👤 Khách hàng: ${order.customer.fullName}\n` +
                    `📧 Email: \`${order.customer.email}\`\n` +
                    `📱 SĐT: \`${order.customer.phone}\`\n` +
                    `🔑 Key kích hoạt: \`${newKey}\`\n` +
                    `📧 Email đã gửi: ${order.customer.email}`, 
                    messageId
                );

                // Answer callback with success
                await answerCallbackQuery(callbackId, "✅ Đã xác nhận thanh toán thành công!", true);
                
                console.log(`Order ${orderId} confirmed via Telegram and new key ${newKey} sent to ${order.customer.email}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                await sendTelegramMessage(chatId, `⚠️ Đã xác nhận nhưng lỗi gửi email. Key: \`${newKey}\``, messageId);
            }

        } else if (data.startsWith('reject_')) {
            const orderId = data.replace('reject_', '');
            console.log(`❌ Processing reject for order: ${orderId}`);
            
            // Reject order
            const db = await readDB();
            const order = db.orders.find(o => o.orderId === orderId);
            
            if (order) {
                order.status = 'cancelled';
                order.cancelledAt = new Date().toISOString();
                await writeDB(db);
                
                await sendTelegramMessage(chatId, `❌ Đã từ chối đơn hàng ${orderId}`, messageId);
                
                // Answer callback with rejection
                await answerCallbackQuery(callbackId, "❌ Đã từ chối đơn hàng", true);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error handling Telegram callback:', error);
        res.status(500).json({ success: false });
    }
});

// Helper function to answer callback query
async function answerCallbackQuery(callbackId, text = null, showAlert = false) {
    try {
        const db = await readDB();
        const telegramConfig = db.telegramConfig;
        
        if (!telegramConfig || !telegramConfig.botToken) {
            return;
        }

        const telegramUrl = `https://api.telegram.org/bot${telegramConfig.botToken}/answerCallbackQuery`;
        
        await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                callback_query_id: callbackId,
                text: text,
                show_alert: showAlert
            })
        });
    } catch (error) {
        console.error('Error answering callback query:', error);
    }
}

// Helper function to send Telegram message
async function sendTelegramMessage(chatId, text, replyToMessageId = null) {
    try {
        const db = await readDB();
        const telegramConfig = db.telegramConfig;
        
        if (!telegramConfig || !telegramConfig.botToken) {
            return;
        }

        const telegramUrl = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
        
        const payload = {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        };

        if (replyToMessageId) {
            payload.reply_to_message_id = replyToMessageId;
        }
        
        await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}

// API: Confirm Order (Admin)
app.post('/api/admin/confirm-order', async (req, res) => {
    try {
        const { adminKey, orderId } = req.body;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        const order = db.orders.find(o => o.orderId === orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        if (order.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng đã được xác nhận rồi'
            });
        }

        // Mark as paid
        order.status = 'paid';
        order.paidAt = new Date().toISOString();
        await writeDB(db);

        // Generate new activation key
        const newKey = generateActivationKey();
        
        // Create new key record
        const keyRecord = {
            key: newKey,
            used: true,
            createdAt: new Date().toISOString(),
            usedAt: new Date().toISOString(),
            usedBy: order.customer.email,
            deviceFingerprint: 'admin-confirmation',
            orderId: orderId
        };
        
        db.keys.push(keyRecord);
        await writeDB(db);
        
        // Send email
        try {
            await sendActivationKey(
                order.customer.email,
                order.customer.fullName,
                newKey,
                orderId
            );
            
            // Send Telegram notification
            await sendTelegramNotification(
                order.customer.fullName,
                newKey,
                orderId,
                order.total
            );
            
            res.json({
                success: true,
                message: 'Đã xác nhận đơn hàng và gửi key qua email',
                key: newKey
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            res.json({
                success: true,
                message: 'Đã xác nhận đơn hàng nhưng lỗi gửi email',
                key: newKey,
                emailError: emailError.message
            });
        }
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API: Get All Orders (Admin)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const { adminKey } = req.query;

        if (!isValidAdminKey(adminKey)) {
            return res.status(403).json({
                success: false,
                message: 'Admin key không hợp lệ'
            });
        }

        const db = await readDB();
        res.json({
            success: true,
            orders: db.orders,
            stats: {
                total: db.orders.length,
                pending: db.orders.filter(o => o.status === 'pending').length,
                paid: db.orders.filter(o => o.status === 'paid').length,
                completed: db.orders.filter(o => o.status === 'completed').length,
                totalRevenue: db.orders
                    .filter(o => o.status === 'paid' || o.status === 'completed')
                    .reduce((sum, o) => sum + o.total, 0)
            }
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Telegram polling function
let telegramPollingInterval = null;

function startTelegramPolling(botToken) {
    // Clear existing polling
    if (telegramPollingInterval) {
        clearInterval(telegramPollingInterval);
    }
    
    let lastUpdateId = 0;
    
    telegramPollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=10`);
            const data = await response.json();
            
            if (data.ok && data.result.length > 0) {
                for (const update of data.result) {
                    lastUpdateId = update.update_id;
                    
                    if (update.callback_query) {
                        // Handle callback query
                        await handleTelegramCallback(update.callback_query);
                    }
                }
            }
        } catch (error) {
            console.error('Error polling Telegram updates:', error);
        }
    }, 1000); // Poll every 1 second
    
    console.log('✅ Telegram polling started');
}

// Handle Telegram callback
async function handleTelegramCallback(callback_query) {
    try {
        const { data, message, from, id: callbackId } = callback_query;
        const chatId = message.chat.id;
        const messageId = message.message_id;

        console.log(`📱 Processing Telegram callback: ${data}`);

        // Answer callback query to stop loading
        await answerCallbackQuery(callbackId, "Đang xử lý...");

        // Check if it's a confirm or reject action
        if (data.startsWith('confirm_')) {
            const orderId = data.replace('confirm_', '');
            console.log(`✅ Processing confirm for order: ${orderId}`);
            
            // Confirm payment
            const db = await readDB();
            const order = db.orders.find(o => o.orderId === orderId);
            
            if (!order) {
                await sendTelegramMessage(chatId, `❌ Không tìm thấy đơn hàng ${orderId}`, messageId);
                return;
            }

            if (order.status === 'paid') {
                await sendTelegramMessage(chatId, `⚠️ Đơn hàng ${orderId} đã được xác nhận rồi!`, messageId);
                return;
            }

            // Mark as paid
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            await writeDB(db);

            // Generate new activation key
            try {
                const newKey = generateActivationKey();
                
                // Create new key record
                const keyRecord = {
                    key: newKey,
                    used: true,
                    createdAt: new Date().toISOString(),
                    usedAt: new Date().toISOString(),
                    usedBy: order.customer.email,
                    deviceFingerprint: 'telegram-confirmation',
                    orderId: orderId
                };
                
                db.keys.push(keyRecord);
                await writeDB(db);
                
                // Send email
                await sendActivationKey(
                    order.customer.email,
                    order.customer.fullName,
                    newKey,
                    orderId
                );
                
                // Send success notification
                await sendTelegramMessage(chatId, 
                    `✅ *Đã xác nhận thanh toán thành công!*\n\n` +
                    `🆔 Đơn hàng: \`${orderId}\`\n` +
                    `👤 Khách hàng: ${order.customer.fullName}\n` +
                    `📧 Email: \`${order.customer.email}\`\n` +
                    `📱 SĐT: \`${order.customer.phone}\`\n` +
                    `🔑 Key kích hoạt: \`${newKey}\`\n` +
                    `📧 Email đã gửi: ${order.customer.email}`, 
                    messageId
                );

                // Answer callback with success
                await answerCallbackQuery(callbackId, "✅ Đã xác nhận thanh toán thành công!", true);
                
                console.log(`Order ${orderId} confirmed via Telegram and new key ${newKey} sent to ${order.customer.email}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                await sendTelegramMessage(chatId, `⚠️ Đã xác nhận nhưng lỗi gửi email. Key: \`${newKey}\``, messageId);
            }

        } else if (data.startsWith('reject_')) {
            const orderId = data.replace('reject_', '');
            console.log(`❌ Processing reject for order: ${orderId}`);
            
            // Reject order
            const db = await readDB();
            const order = db.orders.find(o => o.orderId === orderId);
            
            if (order) {
                order.status = 'cancelled';
                order.cancelledAt = new Date().toISOString();
                await writeDB(db);
                
                await sendTelegramMessage(chatId, `❌ Đã từ chối đơn hàng ${orderId}`, messageId);
                
                // Answer callback with rejection
                await answerCallbackQuery(callbackId, "❌ Đã từ chối đơn hàng", true);
            }
        }
    } catch (error) {
        console.error('Error handling Telegram callback:', error);
    }
}

// Start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║     🚀 Locket Gold Server Started                         ║
║                                                            ║
║     🏠 Home:         http://localhost:${PORT}/              ║
║     👨‍💼 Admin:       http://localhost:${PORT}/admin.html   ║
║                                                            ║
║     💾 Database: database.json                            ║
║     🔐 Admin Key: admin123                                ║
║     🎁 Demo Keys: DEMO-2024-GOLD, TEST-KEY-12345          ║
╚════════════════════════════════════════════════════════════╝
        `);
    });
});