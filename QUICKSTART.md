# ⚡ Quick Start - Locket Gold

## 🚀 Chạy Ngay trong 3 Bước

### Bước 1: Cài Đặt
```bash
npm install
```

### Bước 2: Khởi Động
```bash
npm start
```

### Bước 3: Sử Dụng

#### 🔑 Test Hệ Thống Key (Miễn Phí)

```bash
# 1. Mở admin keys
http://localhost:3000/keys-admin.html
Login: admin123

# 2. Tạo key hoặc dùng demo key
Demo keys: DEMO-2024-GOLD hoặc TEST-KEY-12345

# 3. Mở trang chủ ở tab mới
http://localhost:3000/

# 4. Nhập key và tải xuống!
```

#### 🛍️ Test Hệ Thống Shop (Thanh Toán)

```bash
# 1. Mở shop
http://localhost:3000/shop.html

# 2. Thêm sản phẩm vào giỏ
# 3. Checkout và thanh toán
# 4. Admin xác nhận (nếu Bank Transfer)

http://localhost:3000/admin.html
Login: admin123
```

---

## 📱 URLs Quan Trọng

| Trang | URL | Mô Tả |
|-------|-----|-------|
| 🏠 **Trang Chủ** | `/` hoặc `/index.html` | Nhập key để tải |
| 🔑 **Admin Keys** | `/keys-admin.html` | Tạo & quản lý keys |
| 🛍️ **Shop** | `/shop.html` | Mua hàng online |
| 👨‍💼 **Admin Orders** | `/admin.html` | Quản lý đơn hàng |

**Admin Key:** `admin123`

**Demo Keys:**
- `DEMO-2024-GOLD`
- `TEST-KEY-12345`

---

## 🎯 2 Chế Độ Hoạt Động

### Chế Độ 1: Hệ Thống Key 🔑
**Use Case:** Phát key miễn phí cho users

- Admin tạo keys
- Phát keys cho users  
- Users nhập key → tải xuống
- **Giới hạn: 1 key = 1 thiết bị**

### Chế Độ 2: Hệ Thống Shop 🛍️
**Use Case:** Bán hàng trực tuyến

- Users chọn gói (50K / 99K / 199K)
- Thanh toán (MoMo / VNPay / Bank)
- Nhận link tải qua email
- **Giới hạn theo gói đã mua**

---

## 📋 Checklist Đầy Đủ

- [x] ✅ Trang chủ với key activation
- [x] ✅ Device fingerprint (giới hạn 1 thiết bị)
- [x] ✅ Admin dashboard quản lý keys
- [x] ✅ Shop với giỏ hàng
- [x] ✅ 3 payment methods (MoMo/VNPay/Bank)
- [x] ✅ Admin quản lý orders
- [x] ✅ Download tracking & limits
- [x] ✅ Database JSON
- [x] ✅ API endpoints đầy đủ
- [x] ✅ Documentation chi tiết

---

## 🔥 Demo Flow

### Flow 1: Key System (30 giây)
```
1. Vào http://localhost:3000/
2. Nhập: DEMO-2024-GOLD
3. Tải Shadowrocket + Config
4. Done! ✅
```

### Flow 2: Shop System (2 phút)
```
1. Vào http://localhost:3000/shop.html
2. Chọn gói Pro (99K)
3. Thêm vào giỏ → Checkout
4. Điền info → Chọn Bank Transfer
5. Vào admin → Xác nhận thanh toán
6. Nhận link tải về email
7. Done! ✅
```

---

## 📚 Docs Đầy Đủ

- **README.md** - Overview & API docs
- **USAGE.md** - Hướng dẫn chi tiết
- **CONFIG.md** - Cấu hình production
- **QUICKSTART.md** - File này

---

## 🆘 Cần Giúp?

**Common Issues:**

```bash
# Port 3000 bị chiếm?
PORT=3001 npm start

# Database lỗi?
rm database.json
npm start

# Key không hoạt động?
# → Clear localStorage: F12 → Console
localStorage.clear()
location.reload()
```

**Contact:**
- GitHub Issues
- Email: support@locketgold.com

---

**🎉 Have fun with Locket Gold!**

