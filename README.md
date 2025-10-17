# Locket Gold Shop - VPS Version

Hệ thống bán Shadowrocket Premium + Config Gold với tính năng thanh toán và giới hạn download.

## Cài đặt trên VPS

### 1. Cài đặt Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 2. Cài đặt PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Cài đặt dependencies
```bash
npm install
```

### 4. Cấu hình biến môi trường (tùy chọn)
```bash
export ADMIN_KEY="your-secure-admin-key"
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
export PORT=3000
```

### 5. Chạy ứng dụng

#### Chạy trực tiếp:
```bash
npm start
```

#### Chạy với PM2 (khuyến nghị):
```bash
npm run pm2
```

#### Quản lý với PM2:
```bash
npm run pm2:stop      # Dừng
npm run pm2:restart   # Khởi động lại
npm run pm2:logs      # Xem logs
```

## URL Structure

- **Trang chủ:** `http://your-vps-ip:3000/`
- **Admin:** `http://your-vps-ip:3000/admin`
- **Thanh toán:** `http://your-vps-ip:3000/payment`
- **Download:** `http://your-vps-ip:3000/download`
- **VietQR:** `http://your-vps-ip:3000/vietqr`

## Cấu trúc dự án

```
locketweb/
├── server.js              # Server chính
├── package.json           # Dependencies
├── database.json          # Database (tự động tạo)
├── index.html             # Trang chủ
├── admin.html             # Trang admin
├── payment.html           # Trang thanh toán
├── download.html          # Trang download
├── vietqr.html            # Trang VietQR
└── LocketGoldDNS.mobileconfig  # File cấu hình DNS
```

## Tính năng

- ✅ Hệ thống key kích hoạt
- ✅ Quản lý đơn hàng
- ✅ Thanh toán chuyển khoản
- ✅ Gửi email tự động
- ✅ Giới hạn download
- ✅ Admin panel
- ✅ Database JSON đơn giản

## API Endpoints

### Public
- `POST /api/verify-key` - Xác thực key
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/:orderId` - Kiểm tra đơn hàng
- `GET /api/payment-config` - Cấu hình thanh toán

### Admin (cần adminKey)
- `GET /api/admin/keys` - Xem tất cả keys
- `POST /api/admin/generate-keys` - Tạo keys mới
- `GET /api/admin/orders` - Xem tất cả đơn hàng
- `POST /api/admin/payment-config` - Cập nhật cấu hình

## Bảo mật

- Admin key mặc định: `admin123`
- Thay đổi admin key trong biến môi trường `ADMIN_KEY`
- Cấu hình email trong admin panel

## Hỗ trợ

Nếu có vấn đề, vui lòng kiểm tra logs:
```bash
npm run pm2:logs
```

Test auto deploy 16/10
aaaa