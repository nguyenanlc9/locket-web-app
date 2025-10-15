# 📖 Hướng Dẫn Sử Dụng Chi Tiết

## 🎯 Tổng Quan

Hệ thống Locket Gold có **2 chế độ hoạt động**:

1. **🔑 Hệ Thống Key** - Miễn phí/Phát key cho người dùng
2. **🛍️ Hệ Thống Shop** - Bán hàng trực tuyến với thanh toán

---

## 🔑 Hệ Thống Key (Trang Chủ)

### Dành Cho Admin

#### 1. Truy Cập Admin Keys
```
URL: http://localhost:3000/keys-admin.html
Admin Key: admin123
```

#### 2. Tạo Keys Mới
- Nhập số lượng keys cần tạo (1-100)
- Nhập tiền tố (VD: LOCKET, PROMO, VIP)
- Nhấn "Tạo Keys"
- Copy keys và phát cho khách hàng

**Ví dụ key tạo ra:**
```
LOCKET-1696800000000-ABC12345
PROMO-1696800000001-DEF67890
VIP-1696800000002-GHI11121
```

#### 3. Quản Lý Keys
- **Filter**: Xem tất cả / chưa dùng / đã dùng
- **Status**: Kiểm tra key đã được sử dụng chưa
- **Copy**: Copy key để gửi cho khách
- **Device Info**: Xem thiết bị nào đã dùng key

#### 4. Thống Kê
- Tổng số keys đã tạo
- Số keys đã sử dụng
- Số keys còn lại

### Dành Cho Người Dùng

#### 1. Nhận Key
Nhận key từ admin hoặc nguồn phát hành.

**Demo keys có sẵn:**
- `DEMO-2024-GOLD`
- `TEST-KEY-12345`

#### 2. Kích Hoạt
```
1. Truy cập: http://localhost:3000/
2. Nhập key vào ô "Key Kích Hoạt"
3. Nhấn "Kích Hoạt Ngay"
4. Đợi xác thực...
```

#### 3. Tải Xuống
Sau khi key hợp lệ:
- Nhấn "Tải Shadowrocket" → Tự động cài đặt
- Nhấn "Tải Config Gold" → Download file .sgmodule
- Làm theo hướng dẫn cài đặt

#### 4. Lưu Ý Quan Trọng
⚠️ **Mỗi key chỉ dùng 1 lần trên 1 thiết bị**

Hệ thống sẽ chặn nếu:
- Key đã được sử dụng
- Thiết bị này đã tải trước đó
- Key không hợp lệ

### Các Trường Hợp Lỗi

#### "Key không hợp lệ"
- Key không tồn tại trong hệ thống
- Có thể đánh máy sai
- Key đã bị xóa

#### "Key này đã được sử dụng"
- Key đã được kích hoạt bởi thiết bị khác
- Liên hệ admin để lấy key mới

#### "Thiết bị này đã tải xuống rồi"
- Thiết bị này đã sử dụng 1 key khác trước đó
- Mỗi thiết bị chỉ được tải 1 lần
- Xóa cache/localStorage để reset (không khuyến khích)

---

## 🛍️ Hệ Thống Shop (E-commerce)

### Dành Cho Khách Hàng

#### 1. Chọn Sản Phẩm
```
URL: http://localhost:3000/shop.html
```

**3 Gói có sẵn:**

| Gói | Giá | Downloads | Thời Gian |
|-----|-----|-----------|-----------|
| Basic | 50,000₫ | 5 lượt | 7 ngày |
| Pro | 99,000₫ | ∞ không giới hạn | 30 ngày |
| Lifetime | 199,000₫ | ∞ không giới hạn | Trọn đời |

#### 2. Thêm Vào Giỏ
- Nhấn "Thêm Vào Giỏ" trên sản phẩm
- Xem giỏ hàng bằng icon 🛒 góc phải
- Có thể thêm/xóa sản phẩm

#### 3. Thanh Toán
- Nhấn "Thanh Toán Ngay"
- Điền thông tin:
  - Họ và tên
  - Email (nhận link tải)
  - Số điện thoại
- Chọn phương thức thanh toán:
  - 💰 MoMo
  - 💳 VNPay
  - 🏦 Bank Transfer

#### 4. Xác Nhận
- Nhấn "Xác Nhận Thanh Toán"
- Chuyển đến cổng thanh toán
- Hoàn tất thanh toán

#### 5. Tải Xuống
Sau khi thanh toán thành công:
- Tự động redirect đến trang download
- Hoặc check email để nhận link
- Link có hiệu lực 30 ngày
- Giới hạn theo gói đã mua

### Dành Cho Admin

#### 1. Truy Cập Admin Orders
```
URL: http://localhost:3000/admin.html
Admin Key: admin123
```

#### 2. Dashboard
Xem thống kê real-time:
- Tổng đơn hàng
- Đơn chờ thanh toán
- Đơn đã thanh toán
- Tổng doanh thu

#### 3. Quản Lý Đơn Hàng
- **Filter**: All / Pending / Paid / Completed
- **Chi tiết**: Click "Chi Tiết" để xem đầy đủ
- **Xác nhận**: Xác nhận thanh toán thủ công (Bank Transfer)

#### 4. Xác Nhận Thanh Toán (Bank)
Khi khách chuyển khoản:
1. Kiểm tra tài khoản ngân hàng
2. Tìm đơn hàng trong admin
3. Click "Chi Tiết"
4. Click "Xác Nhận Thanh Toán"
5. Link tải sẽ được gửi cho khách

#### 5. Tracking Downloads
- Xem số lượt download của mỗi đơn
- Kiểm tra còn bao nhiêu lượt
- Xem IP và thời gian download

---

## 🔄 Workflow Tổng Quát

### Workflow 1: Hệ Thống Key (Free)

```
Admin                           User
  |                              |
  | 1. Tạo keys                  |
  |----------------------------->|
  |                              | 2. Nhận key
  |                              |
  |                              | 3. Vào trang chủ
  |                              | 4. Nhập key
  | 5. Xác thực key              |
  |<-----------------------------|
  | 6. Check device fingerprint  |
  | 7. Mark key as used          |
  |                              |
  |----------------------------->| 8. Cho phép tải
  |                              | 9. Download files
  |                              | 10. Cài đặt & Enjoy!
```

### Workflow 2: Hệ Thống Shop (Paid)

```
Customer                    System                     Admin
   |                          |                          |
   | 1. Browse shop           |                          |
   | 2. Add to cart           |                          |
   | 3. Checkout              |                          |
   |------------------------->|                          |
   |                          | 4. Create order          |
   |                          | 5. Generate token        |
   |                          |                          |
   | 6. Redirect to payment   |                          |
   |<-------------------------|                          |
   | 7. Complete payment      |                          |
   |------------------------->|                          |
   |                          | 8. Mark as paid          |
   |                          | 9. Send email            |
   |                          |------------------------->|
   |                          |                          | 10. View order
   |                          |                          | 11. Confirm (if Bank)
   | 12. Get download link    |                          |
   |<-------------------------|                          |
   | 13. Download (limited)   |                          |
```

---

## 🎨 Customization

### Thay Đổi Giá Sản Phẩm
File: `shop.html`

```javascript
const products = [
    {
        id: 1,
        name: 'Gói Basic',
        price: 50000,        // ← Đổi giá ở đây
        oldPrice: 100000,
        downloads: 5,        // ← Giới hạn download
        // ...
    }
];
```

### Thay Đổi Download Links
File: `server.js`

```javascript
// Line ~290
downloads: {
    shadowrocket: 'itms-services://...', // ← Đổi link
    config: 'https://...'                // ← Đổi link
}
```

### Thay Đổi Admin Key
File: `server.js`

```javascript
// Line ~159, 201, etc.
if (adminKey !== 'admin123') {  // ← Đổi 'admin123'
```

Hoặc dùng environment variable:
```bash
ADMIN_KEY=your_secret_key npm start
```

### Thay Đổi Thời Hạn Download
File: `server.js`

```javascript
// Line ~250
expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
                                  ^^ ← Đổi số ngày
```

---

## 🐛 Troubleshooting

### Key System

**Q: Key không hoạt động?**
- Kiểm tra key có đúng không (case-sensitive)
- Xem key trong admin xem đã used chưa
- Clear localStorage và thử lại

**Q: Làm sao reset thiết bị đã tải?**
```javascript
// Console browser (F12)
localStorage.removeItem('locket_downloaded');
location.reload();
```

**Q: Tạo nhiều keys một lúc?**
- Vào admin → Nhập số lượng → Tạo
- Tối đa 100 keys / lần

### Shop System

**Q: Thanh toán không hoạt động?**
- Đang dùng demo payment gateway
- Cần config MoMo/VNPay API thật
- Hoặc dùng Bank Transfer + xác nhận thủ công

**Q: Không nhận được email?**
- Chưa config email service
- Xem hướng dẫn trong `CONFIG.md`
- Dùng download link trực tiếp

**Q: Download hết lượt?**
Admin có thể:
- Vào admin.html
- Tìm đơn hàng
- Manually reset downloadCount (edit database.json)

---

## 💡 Best Practices

### Admin

1. **Bảo mật Admin Key**
   - Không share public
   - Đổi định kỳ
   - Dùng environment variable

2. **Quản Lý Keys**
   - Tạo keys theo batch (PROMO-001, PROMO-002...)
   - Track keys đã phát cho ai
   - Set expiry date (feature TODO)

3. **Monitor Orders**
   - Check dashboard hàng ngày
   - Xác nhận Bank Transfer nhanh
   - Backup database.json định kỳ

### Users

1. **Lưu Key**
   - Screenshot key sau khi nhận
   - Lưu vào note app

2. **Download Ngay**
   - Tải về ngay sau khi kích hoạt
   - Lưu file vào cloud backup
   - Không để hết hạn

3. **1 Device Rule**
   - Mỗi thiết bị chỉ 1 lần
   - Chuẩn bị thiết bị trước khi kích hoạt
   - Không clear cache sau khi tải

---

## 📞 Support

Cần hỗ trợ? Liên hệ:
- Email: support@locketgold.com
- GitHub Issues: [Link]
- Documentation: README.md, CONFIG.md

---

**Made with ❤️ for Locket Users**

