# Sửa Lỗi "LOCKET undefined"

## Vấn Đề
Lỗi "LOCKET undefined" xảy ra khi:
1. `orderId` không được truyền đúng cách từ URL parameters
2. API không trả về `orderId` trong response
3. URL parameters bị thiếu hoặc không đúng format

## Các Thay Đổi Đã Thực Hiện

### 1. `locket/vietqr.html`
- Thêm kiểm tra `orderId` không được undefined
- Tạo `orderId` mới nếu không có hoặc bị undefined
- Fallback về `'LOCKET' + Date.now()` nếu cần

### 2. `locket/payment.html`
- Thêm kiểm tra `result.orderId` trước khi redirect
- Fallback về `result.order?.id` hoặc tạo mới
- Đảm bảo `customerName` không bị undefined

### 3. `server/server.js`
- Cập nhật API `/api/orders` để trả về `orderId`
- Thêm fallback cho `orderId` nếu không có

## Cách Test

### Test 1: Kiểm tra URL parameters
```
http://localhost:3000/locket/vietqr.html?orderId=TEST123&amount=30000
```

### Test 2: Test với orderId undefined
```
http://localhost:3000/locket/vietqr.html?orderId=undefined&amount=30000
```

### Test 3: Test không có parameters
```
http://localhost:3000/locket/vietqr.html
```

## Kết Quả Mong Đợi

- **Trước**: "LOCKET undefined"
- **Sau**: "LOCKET LOCKET1234567890" (với timestamp)

## Debug Steps

1. Mở Developer Tools (F12)
2. Kiểm tra Console để xem lỗi
3. Kiểm tra Network tab để xem API calls
4. Kiểm tra URL parameters trong address bar

## Fallback Mechanism

Nếu tất cả fallback đều fail:
1. Tạo `orderId` mới với timestamp
2. Hiển thị thông báo cho user
3. Log lỗi để debug
