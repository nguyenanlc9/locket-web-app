# ⚙️ Hướng Dẫn Cấu Hình

## 🔐 Biến Môi Trường (Environment Variables)

Tạo file `.env` trong thư mục gốc với nội dung sau:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Admin Configuration
ADMIN_KEY=your_secure_admin_key_here

# Site URL (for email links, payment callbacks)
SITE_URL=https://yourdomain.com

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# MoMo Payment Gateway (Optional)
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/gw_payment/transactionProcessor

# VNPay Payment Gateway (Optional)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://yourdomain.com/api/payment/vnpay/callback

# Download Configuration
SHADOWROCKET_IPA_URL=itms-services://?action=download-manifest&url=https%3A%2F%2Fdl.3u.com%2Fplist%2F2025%2F09%2F28%2F1759023053857_696086.plist
CONFIG_URL=https://raw.githubusercontent.com/vuong2023/shad/main/modules/Locket_ohb.sgmodule

# Security
DOWNLOAD_EXPIRY_DAYS=30
```

## 💳 Tích Hợp Payment Gateway

### 1. MoMo

#### Đăng Ký
1. Truy cập: https://business.momo.vn/
2. Đăng ký tài khoản doanh nghiệp
3. Lấy thông tin:
   - Partner Code
   - Access Key
   - Secret Key

#### Cập Nhật Code
Trong file `server.js`, tìm hàm `generateMoMoPaymentUrl()`:

```javascript
function generateMoMoPaymentUrl(orderId, amount) {
    const crypto = require('crypto');
    
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const redirectUrl = `${process.env.SITE_URL}/api/payment/momo/callback`;
    const ipnUrl = `${process.env.SITE_URL}/api/payment/momo/ipn`;
    const requestId = orderId;
    const orderInfo = `Thanh toán đơn hàng ${orderId}`;
    const requestType = "captureWallet";
    const extraData = "";

    // Create signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    // Create payment URL
    const requestBody = JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        signature
    });

    // Send request to MoMo API
    // Return payment URL
}
```

### 2. VNPay

#### Đăng Ký
1. Truy cập: https://vnpay.vn/
2. Đăng ký tài khoản merchant
3. Lấy thông tin:
   - TMN Code
   - Hash Secret

#### Cập Nhật Code
Trong file `server.js`, tìm hàm `generateVNPayPaymentUrl()`:

```javascript
function generateVNPayPaymentUrl(orderId, amount) {
    const crypto = require('crypto');
    const querystring = require('querystring');
    
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    
    const date = new Date();
    const createDate = date.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    
    let vnpParams = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Amount': amount * 100,
        'vnp_CreateDate': createDate,
        'vnp_CurrCode': 'VND',
        'vnp_IpAddr': '127.0.0.1',
        'vnp_Locale': 'vn',
        'vnp_OrderInfo': `Thanh toán đơn hàng ${orderId}`,
        'vnp_ReturnUrl': returnUrl,
        'vnp_TxnRef': orderId
    };

    // Sort params
    vnpParams = sortObject(vnpParams);
    
    const signData = querystring.stringify(vnpParams);
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams['vnp_SecureHash'] = signed;
    
    return vnpUrl + '?' + querystring.stringify(vnpParams);
}

function sortObject(obj) {
    return Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}
```

### 3. Bank Transfer (Chuyển Khoản Ngân Hàng)

#### Cấu Hình
Cập nhật thông tin ngân hàng trong file `server.js`:

```javascript
const BANK_INFO = {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'NGUYEN VAN A',
    branch: 'Chi nhánh Hà Nội',
    note: 'Ghi chú: [Mã đơn hàng]'
};
```

Tạo trang hiển thị thông tin chuyển khoản: `payment/bank/:orderId`

## 📧 Email Configuration

### Gmail
1. Bật 2FA cho tài khoản Gmail
2. Tạo App Password: https://myaccount.google.com/apppasswords
3. Cập nhật `.env`:
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### SendGrid
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
    const msg = {
        to,
        from: 'noreply@yourdomain.com',
        subject,
        html
    };
    await sgMail.send(msg);
}
```

## 🗄️ Database Migration

### Từ JSON sang MongoDB

1. Cài đặt MongoDB:
```bash
npm install mongodb mongoose
```

2. Tạo models:
```javascript
// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
        fullName: String,
        email: String,
        phone: String
    },
    items: Array,
    status: String,
    downloadToken: String,
    downloadLimit: Number,
    downloadCount: Number,
    createdAt: Date,
    expiresAt: Date
});

module.exports = mongoose.model('Order', OrderSchema);
```

3. Connect:
```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

## 🔒 Security Best Practices

### 1. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Helmet (Security Headers)
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. Input Validation
```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/orders',
    body('customer.email').isEmail(),
    body('customer.phone').isMobilePhone('vi-VN'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Process order...
    }
);
```

## 🚀 Production Deployment

### SSL/HTTPS
Sử dụng Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Ecosystem
Tạo file `ecosystem.config.js`:
```javascript
module.exports = {
    apps: [{
        name: 'locket-shop',
        script: './server.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        }
    }]
};
```

Start:
```bash
pm2 start ecosystem.config.js
```

## 📊 Monitoring & Logging

### Winston Logger
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

---

**Cần hỗ trợ thêm? Liên hệ: support@locketgold.com**

