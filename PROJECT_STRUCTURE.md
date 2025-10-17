# 🏗️ LocketWeb Project Structure

## 📁 Cấu trúc thư mục

```
locketweb/
├── 📁 admin/                    # Admin Panel
│   ├── admin.html              # Admin panel chính
│   ├── admin-secure.html       # Admin với Google 2FA
│   └── admin.css               # CSS cho admin
├── 📁 locket/                  # Locket Gold Services
│   ├── locket.html             # Trang chính Locket
│   ├── vietqr.html             # Thanh toán VietQR
│   ├── payment.html            # Trang thanh toán
│   └── download.html           # Trang tải xuống
├── 📁 download/                # Files tải xuống
│   └── LocketGoldDNS.mobileconfig
├── 📁 server/                  # Backend Server
│   └── server.js               # Node.js server
├── 📄 index.html               # Trang chủ MMO Store
├── 📄 database.json            # Database JSON
├── 📄 package.json             # Dependencies
└── 📄 README.md                # Documentation
```

## 🚀 URLs và Routes

### 🌐 Frontend Routes
- **`/`** → `index.html` (MMO Services Store)
- **`/locket`** → `locket/locket.html` (Locket Gold)
- **`/locket/vietqr`** → `locket/vietqr.html` (VietQR Payment)
- **`/locket/payment`** → `locket/payment.html` (Payment Page)
- **`/locket/download`** → `locket/download.html` (Download Page)
- **`/admin`** → `admin/admin.html` (Admin Panel)
- **`/admin/secure`** → `admin/admin-secure.html` (Admin với 2FA)
- **`/download`** → `download/LocketGoldDNS.mobileconfig`

### 🔧 Backend APIs
- **`GET /api/database`** → Lấy database
- **`POST /api/database`** → Cập nhật database
- **`POST /api/orders`** → Tạo đơn hàng mới
- **`GET /api/payment-config`** → Cấu hình thanh toán
- **`POST /api/telegram/send`** → Gửi thông báo Telegram

## 🎯 Tính năng chính

### 🛒 MMO Services Store (`/`)
- Trang chủ với danh mục sản phẩm
- Giao diện TNETZ VPN style
- Responsive design

### 🔐 Locket Gold Services (`/locket`)
- Kích hoạt Locket Gold
- Mua Key mới
- Thanh toán VietQR
- Tải xuống config

### 👨‍💼 Admin Panel (`/admin`)
- Dashboard với thống kê
- Quản lý sản phẩm & đơn hàng
- Cấu hình thanh toán
- Cấu hình Telegram
- Google 2FA authentication

## 🔧 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy server
```bash
node server/server.js
```

### 3. Truy cập ứng dụng
- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Admin Secure:** http://localhost:3000/admin/secure
- **Locket:** http://localhost:3000/locket

## 🔐 Authentication

### Admin Credentials (Demo)
- **Username:** `admin`
- **Password:** `admin123`
- **2FA Code:** `123456`

### Google 2FA Setup
1. Tải Google Authenticator
2. Quét QR code
3. Nhập mã 6 số

## 📊 Database Structure

```json
{
  "categories": [...],      // Danh mục sản phẩm
  "products": [...],       // Sản phẩm MMO
  "orders": [...],         // Đơn hàng
  "locket_packages": [...], // Gói Locket Gold
  "settings": {
    "site_name": "...",
    "payment_config": {...},
    "telegram_config": {...}
  }
}
```

## 🎨 UI/UX Features

### ✨ Animations
- Number counting animations
- Floating icons
- Shimmer effects
- Smooth transitions

### 🎯 Responsive Design
- Mobile-first approach
- Glassmorphism effects
- Dark theme
- Professional styling

### 🔒 Security
- Google 2FA authentication
- Session management
- Protected routes
- Token-based auth

## 🚀 Production Deployment

### Environment Variables
```bash
GOOGLE_CLIENT_ID=your_google_client_id
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Security Checklist
- [ ] Thay đổi admin credentials
- [ ] Setup Google OAuth
- [ ] Configure Telegram bot
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Database encryption

## 📱 Mobile Support

- Responsive design cho tất cả devices
- Touch-friendly interface
- Mobile-optimized forms
- Fast loading times

## 🔧 Development

### File Organization
- **Frontend:** HTML/CSS/JS trong thư mục riêng
- **Backend:** Node.js server trong `server/`
- **Assets:** Static files trong `download/`
- **Database:** JSON file ở root

### Code Structure
- Modular design
- Separation of concerns
- Clean code practices
- Documentation included
