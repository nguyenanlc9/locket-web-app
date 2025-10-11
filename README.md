# 🔐 Locket Gold Shop - Hệ Thống Bán Shadowrocket Premium

Hệ thống bán hàng trực tuyến hoàn chỉnh với tính năng thanh toán, giỏ hàng, và giới hạn lượt tải xuống.

## ✨ Tính Năng

### 🛍️ **Shop (Khách Hàng)**
- ✅ Giao diện hiện đại, responsive
- ✅ Giỏ hàng thông minh
- ✅ 3 gói sản phẩm: Basic, Pro, Lifetime
- ✅ Thanh toán qua MoMo, VNPay, Bank Transfer
- ✅ Tự động gửi link tải sau thanh toán
- ✅ Giới hạn lượt tải theo gói
- ✅ Link có thời hạn 30 ngày

### 👨‍💼 **Admin Dashboard**
- ✅ Quản lý đơn hàng real-time
- ✅ Thống kê doanh thu
- ✅ Xác nhận thanh toán thủ công
- ✅ Theo dõi lượt download
- ✅ Filter theo trạng thái
- ✅ Chi tiết từng đơn hàng

### 🔒 **Bảo Mật**
- ✅ Token download độc nhất
- ✅ Giới hạn lượt tải
- ✅ Link tự động hết hạn
- ✅ Admin authentication
- ✅ Tracking IP download

## 📁 Cấu Trúc Project

```
LOCKET/
├── server.js              # Backend API (Express.js)
├── index.html             # 🔑 Trang chủ - Nhập key kích hoạt
├── payment.html           # 💳 Trang thanh toán
├── vietqr.html            # 🏦 Trang VietQR
├── admin.html             # 👨‍💼 Admin - Quản lý đơn hàng
├── LocketGoldDNS.mobileconfig # 🛡️ DNS config chặn quảng cáo
├── package.json           # Dependencies
├── database.json          # Database JSON (tự động tạo)
├── README.md              # Hướng dẫn chính
├── CONFIG.md              # Hướng dẫn cấu hình
├── ADMIN-GUIDE.md         # Hướng dẫn admin system
├── USAGE.md               # Hướng dẫn sử dụng chi tiết
├── QUICKSTART.md          # Quick start guide
└── .gitignore             # Git ignore
```

### Giải Thích Các Trang

1. **`index.html`** - Trang chủ chính:
   - **Tab Kích Hoạt**: Nhập key kích hoạt
   - **Tab Mua Key**: Mua key mới (30,000₫)
   - Tải 3 files: Shadowrocket + Config + DNS
   - Giới hạn 1 lượt tải / thiết bị
   - Device fingerprinting

2. **`payment.html`** - Trang thanh toán:
   - Form thông tin khách hàng
   - Chọn phương thức thanh toán
   - Tóm tắt đơn hàng

3. **`vietqr.html`** - Trang VietQR:
   - Hiển thị mã QR thanh toán
   - Thông tin chuyển khoản
   - Hướng dẫn thanh toán
   - Auto-check trạng thái

4. **`admin.html`** - Quản lý đơn hàng & keys:
   - Dashboard thống kê
   - Quản lý orders (xác nhận thanh toán)
   - Quản lý keys (tạo, xem, copy)
   - Cấu hình thanh toán
   - Tracking downloads

## 🚀 Cài Đặt

### 1. Yêu Cầu
- Node.js >= 14.0.0
- NPM hoặc Yarn

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Chạy Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📱 Sử Dụng

### 🔑 Trang Chủ (Nhập Key)
1. Truy cập: `http://localhost:3000/` hoặc `index.html`
2. Nhập key kích hoạt
3. Tải xuống 3 files:
   - **Shadowrocket** (.ipa) - App chính
   - **Config Gold** (.sgmodule) - Config VPN
   - **DNS Config** (.mobileconfig) - Chặn quảng cáo
4. **Giới hạn**: 1 lượt tải / 1 thiết bị

**Demo Keys:**
- `DEMO-2024-GOLD`
- `TEST-KEY-12345`

### 💰 Mua Key (Tích Hợp)
1. Truy cập: `http://localhost:3000/`
2. Chuyển sang tab "Mua Key Mới"
3. Nhấn "Mua Key Ngay" (30,000₫)
4. Điền thông tin và chọn phương thức thanh toán:
   - **VietQR**: Quét mã QR hoặc chuyển khoản
   - **MoMo**: Thanh toán qua ví MoMo
   - **VNPay**: Thanh toán qua VNPay
5. Nhận key kích hoạt qua email sau khi xác nhận

### 👨‍💼 Admin - Quản Lý Tất Cả
1. Truy cập: `http://localhost:3000/admin.html`
2. Đăng nhập với Admin Key: `admin123`
3. **Tab Đơn Hàng**: Quản lý orders, xác nhận thanh toán
4. **Tab Keys**: Tạo keys mới, xem danh sách, copy keys
5. **Tab Cấu Hình**: Tùy chỉnh thông tin thanh toán và email

## 🎨 Gói Sản Phẩm

| Gói | Giá | Lượt Tải | Hỗ Trợ |
|-----|-----|----------|--------|
| **Locket Gold Key** | 30,000₫ | 1 lượt/thiết bị | 30 ngày |

## 💳 Hệ Thống Thanh Toán

### VietQR Integration
- **API**: Sử dụng [VietQR.io](https://www.vietqr.io/) để tạo mã QR
- **Ngân hàng**: VietinBank - STK: 113366668888
- **Chủ TK**: NGUYEN VAN A
- **Tính năng**: 
  - Tự động tạo mã QR với số tiền và nội dung
  - Hiển thị thông tin chuyển khoản chi tiết
  - Copy thông tin chuyển khoản
  - Hướng dẫn thanh toán

### Phương Thức Thanh Toán
1. **VietQR** (Chuyển khoản ngân hàng)
2. **MoMo** (Ví điện tử)
3. **VNPay** (Cổng thanh toán)

## 📧 Hệ Thống Email

### Tự Động Gửi Key
- **Khi nào**: Sau khi admin xác nhận thanh toán
- **Nội dung**: Key kích hoạt + hướng dẫn sử dụng
- **Template**: Email HTML đẹp với thông tin đầy đủ

### Cấu Hình Email
- **SMTP**: Gmail (smtp.gmail.com:587)
- **Auth**: Email + App Password
- **Tùy chỉnh**: Admin có thể thay đổi email gửi

## 🔑 Hệ Thống Key

### Tính Năng Key
- **Tạo keys** tự động hoặc thủ công
- **Giới hạn 1 lượt tải / 1 thiết bị** (dựa vào device fingerprint)
- **Tracking** chi tiết: IP, thời gian, device
- **Admin dashboard** để quản lý keys

### Cách Hoạt Động
1. Admin tạo keys qua `keys-admin.html`
2. Phát keys cho khách hàng
3. Khách hàng nhập key tại trang chủ `index.html`
4. Hệ thống kiểm tra:
   - Key có tồn tại không?
   - Key đã được sử dụng chưa?
   - Thiết bị này đã tải chưa? (dựa vào device fingerprint)
5. Nếu hợp lệ → Cho phép tải xuống
6. Lưu lại thông tin để ngăn tải lại

### Device Fingerprint
Sử dụng kỹ thuật fingerprinting đơn giản:
- Canvas fingerprint
- User Agent
- Screen resolution
- Language
- Lưu vào `localStorage` và server

## 🔌 API Endpoints

### Public APIs

#### Xác Thực Key
```http
POST /api/verify-key
Content-Type: application/json

{
  "key": "DEMO-2024-GOLD",
  "deviceFingerprint": "abc123..."
}
```

#### Track Download
```http
POST /api/track-download
Content-Type: application/json

{
  "key": "DEMO-2024-GOLD",
  "type": "shadowrocket|config",
  "deviceFingerprint": "abc123..."
}
```

### Public APIs (Shop)

#### Tạo Đơn Hàng
```http
POST /api/orders
Content-Type: application/json

{
  "customer": {
    "fullName": "Nguyễn Văn A",
    "email": "example@gmail.com",
    "phone": "0901234567"
  },
  "items": [...],
  "paymentMethod": "momo",
  "total": 50000
}
```

#### Kiểm Tra Đơn Hàng
```http
GET /api/orders/:orderId
```

#### Tải Xuống (với token)
```http
GET /api/download/:token
```

### Admin APIs

#### Tạo Keys
```http
POST /api/admin/generate-keys
Content-Type: application/json

{
  "adminKey": "admin123",
  "count": 10,
  "prefix": "LOCKET"
}
```

#### Lấy Tất Cả Keys
```http
GET /api/admin/keys?adminKey=admin123
```

#### Lấy Tất Cả Đơn Hàng
```http
GET /api/admin/orders?adminKey=admin123
```

#### Xác Nhận Thanh Toán
```http
POST /api/orders/:orderId/confirm
Content-Type: application/json

{
  "adminKey": "admin123"
}
```

## 💳 Tích Hợp Payment Gateway

### MoMo
Cập nhật hàm `generateMoMoPaymentUrl()` trong `server.js` với thông tin API của bạn:
- Partner Code
- Access Key
- Secret Key

### VNPay
Cập nhật hàm `generateVNPayPaymentUrl()` với:
- TMN Code
- Hash Secret
- Return URL

### Bank Transfer
Hiện tại sử dụng xác nhận thủ công qua Admin Dashboard.

## 🗄️ Database

Sử dụng `database.json` (file JSON) để lưu trữ đơn giản.

**Cấu trúc:**
```json
{
  "orders": [
    {
      "orderId": "ORD...",
      "customer": {...},
      "items": [...],
      "status": "pending|paid|completed|cancelled",
      "downloadToken": "...",
      "downloadLimit": 5,
      "downloadCount": 0,
      "createdAt": "...",
      "expiresAt": "..."
    }
  ],
  "downloads": [...]
}
```

### Nâng Cấp Database
Để scale up, chuyển sang:
- MongoDB
- PostgreSQL
- MySQL

## 🔐 Bảo Mật

### Admin Key
Mặc định: `admin123`

**Thay đổi:**
1. Set biến môi trường: `ADMIN_KEY=your_secret_key`
2. Hoặc sửa trực tiếp trong `server.js`

### Production Checklist
- [ ] Thay đổi Admin Key
- [ ] Setup HTTPS
- [ ] Giới hạn rate limiting
- [ ] Setup real payment gateway
- [ ] Email service (SendGrid, Mailgun)
- [ ] Backup database định kỳ
- [ ] Setup monitoring (PM2, logs)

## 📧 Email Integration

Hiện tại chưa tích hợp email tự động. Để thêm:

1. Cài đặt nodemailer:
```bash
npm install nodemailer
```

2. Thêm vào `server.js`:
```javascript
const nodemailer = require('nodemailer');

async function sendDownloadEmail(email, orderId, downloadToken) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your@gmail.com',
      pass: 'your-password'
    }
  });

  const downloadUrl = `${process.env.SITE_URL}/download.html?token=${downloadToken}`;
  
  await transporter.sendMail({
    from: 'Locket Gold Shop',
    to: email,
    subject: 'Link tải xuống Shadowrocket Premium',
    html: `
      <h2>Cảm ơn bạn đã mua hàng!</h2>
      <p>Mã đơn hàng: <strong>${orderId}</strong></p>
      <p><a href="${downloadUrl}">Click để tải xuống</a></p>
    `
  });
}
```

## 🚀 Deploy

### Heroku
```bash
heroku create locket-gold-shop
git push heroku main
```

### Vercel/Netlify
Chỉ deploy frontend, backend cần deploy riêng.

### VPS/Server
```bash
# Clone project
git clone <repo-url>
cd locket-gold-shop

# Install
npm install

# Setup PM2
npm install -g pm2
pm2 start server.js --name locket-shop
pm2 save
pm2 startup
```

## 📊 Monitoring

### PM2 (Production)
```bash
pm2 start server.js --name locket-shop
pm2 monit
pm2 logs locket-shop
```

### Logs
Server tự động log:
- Đơn hàng mới
- Thanh toán thành công
- Download events

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port
PORT=3001 npm start
```

### Database bị lỗi
```bash
# Xóa và tạo lại
rm database.json
# Server sẽ tự động tạo file mới khi khởi động
```

### CORS Error
Đã config CORS trong `server.js`. Nếu vẫn lỗi, kiểm tra origin.

## 📝 TODO / Roadmap

- [ ] Tích hợp email tự động
- [ ] Setup real payment gateway
- [ ] Thêm webhook cho MoMo/VNPay
- [ ] Dashboard analytics
- [ ] Export orders to CSV
- [ ] Refund system
- [ ] Coupon/Discount codes
- [ ] Customer portal
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh!

## 📄 License

MIT License - Free to use

## 🆘 Hỗ Trợ

- Email: support@locketgold.com
- Issues: GitHub Issues
- Documentation: README.md

---

**Made with ❤️ for Locket Users**

## 🎯 Quick Start

```bash
# 1. Clone & Install
git clone <repo>
cd LOCKET
npm install

# 2. Start Server
npm start

# 3. Open Browser
# Trang chủ (Key system): http://localhost:3000/
# Admin (Tất cả): http://localhost:3000/admin.html (Key: admin123)
```

### 🧪 Test Key System

1. Mở `http://localhost:3000/admin.html`
2. Đăng nhập: `admin123`
3. Vào tab "Quản Lý Keys" → Tạo keys mới (hoặc dùng demo keys)
4. Mở `http://localhost:3000/` ở tab mới
5. Nhập key: `DEMO-2024-GOLD`
6. Tải xuống Shadowrocket + Config + DNS!

**Demo Keys có sẵn:**
- `DEMO-2024-GOLD`
- `TEST-KEY-12345`

🎉 **Enjoy!**
