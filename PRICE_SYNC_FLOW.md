# Luồng Đồng Bộ Giá Locket Gold

## Tổng Quan
Hệ thống đã được cập nhật để đồng bộ giá Locket Gold giữa Admin Panel và trang Locket thông qua API.

## Luồng Hoạt Động

### 1. Admin Cập Nhật Giá
```
Admin Panel → Payment Config → Save Payment Config
    ↓
POST /api/payment-config
    ↓
Server cập nhật database.settings.payment_config.productPrice
    ↓
Database được lưu vào file database.json
```

### 2. Trang Locket Load Giá
```
Locket Page Load → loadDatabase() → loadLocketPrice()
    ↓
GET /api/payment-config
    ↓
Server trả về config từ database.settings.payment_config
    ↓
Cập nhật giá hiển thị: document.getElementById('locket-price')
```

### 3. Khi Mua Key
```
User click "Mua Key Ngay" → buyLocketKey()
    ↓
Sử dụng window.locketPrice (đã load từ API)
    ↓
Tạo order với giá đúng từ server
```

## API Endpoints

### GET /api/payment-config
- **Mục đích**: Lấy cấu hình thanh toán hiện tại
- **Response**: 
```json
{
  "success": true,
  "config": {
    "bankName": "MBBank",
    "accountNumber": "1613072005", 
    "accountHolder": "NGUYEN HUYNH TUONG AN",
    "productPrice": 30000
  }
}
```

### POST /api/payment-config
- **Mục đích**: Cập nhật cấu hình thanh toán
- **Body**:
```json
{
  "bankName": "MBBank",
  "accountNumber": "1613072005",
  "accountHolder": "NGUYEN HUYNH TUONG AN", 
  "productPrice": 35000
}
```

## Files Đã Cập Nhật

### 1. `locket/locket.html`
- Thêm function `loadLocketPrice()` để load giá từ API
- Cập nhật `loadDatabase()` để gọi `loadLocketPrice()`
- Cập nhật `buyLocketKey()` để sử dụng giá từ API
- Thay đổi giá hiển thị từ hardcode "30,000₫" thành "Đang tải..."

### 2. `admin/admin-secure.html`
- Thêm function `loadPaymentConfig()` để load config từ server
- Cập nhật `savePaymentConfig()` để sử dụng API mới
- Tự động load config khi vào Payment Config section

### 3. `server/server.js`
- Thêm POST endpoint `/api/payment-config` để cập nhật config
- Cập nhật GET endpoint `/api/payment-config` để trả về config đúng

## Lợi Ích

1. **Đồng bộ real-time**: Giá được cập nhật ngay lập tức khi admin thay đổi
2. **Centralized management**: Tất cả cấu hình được quản lý tập trung
3. **Fallback mechanism**: Có giá mặc định nếu API lỗi
4. **User experience**: Giá hiển thị chính xác và cập nhật tự động

## Cách Test

1. Mở Admin Panel → Payment Config
2. Thay đổi giá sản phẩm (ví dụ: 35000)
3. Click "Lưu Cấu Hình Thanh Toán"
4. Mở trang Locket → Giá sẽ hiển thị 35,000₫
5. Click "Mua Key Ngay" → Order sẽ có giá 35000
