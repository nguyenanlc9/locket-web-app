# 🔐 Hướng Dẫn Hệ Thống Admin

## 🎯 Tổng Quan

Hệ thống có **3 cấp độ quyền**:

1. **👤 User** - Chỉ có thể nhập key và tải xuống
2. **👨‍💼 Admin** - Quản lý keys và orders (cần admin key)
3. **🔐 Super Admin** - Tạo admin keys (cần super admin key)

---

## 🔐 Super Admin (Cấp Cao Nhất)

### Truy Cập
```
URL: http://localhost:3000/super-admin.html
Super Admin Key: SUPER-ADMIN-2024-LOCKET-GOLD
```

### Quyền Hạn
- ✅ Tạo admin keys mới
- ✅ Xem danh sách tất cả admin keys
- ✅ Thống kê admin keys
- ✅ Copy admin keys

### Cách Sử Dụng
1. Vào `super-admin.html`
2. Nhập Super Admin Key
3. Tạo admin key mới (VD: `my-admin-2024`)
4. Copy admin key và gửi cho admin
5. Admin dùng key này để đăng nhập

### Bảo Mật
- Super Admin Key được hardcode trong server
- Chỉ Super Admin mới có thể tạo admin keys
- Admin keys được lưu trong database
- Có thể tạo nhiều admin keys

---

## 👨‍💼 Admin (Cấp Trung)

### Truy Cập
```
URL: http://localhost:3000/admin.html
Admin Key: [Được tạo bởi Super Admin]
```

### Quyền Hạn
- ✅ Quản lý keys (tạo, xem, copy)
- ✅ Quản lý orders (xem, xác nhận)
- ✅ Thống kê doanh thu
- ✅ Tracking downloads

### Cách Sử Dụng
1. Nhận admin key từ Super Admin
2. Vào `admin.html` hoặc `keys-admin.html`
3. Nhập admin key để đăng nhập
4. Sử dụng các chức năng admin

### Admin Keys Hợp Lệ
- `admin123` (default, fallback)
- Environment variable `ADMIN_KEY`
- Keys được tạo bởi Super Admin

---

## 👤 User (Cấp Thấp)

### Truy Cập
```
URL: http://localhost:3000/
Key: [Được tạo bởi Admin]
```

### Quyền Hạn
- ✅ Nhập key kích hoạt
- ✅ Tải xuống Shadowrocket + Config
- ❌ Không thể truy cập admin pages

### Bảo Mật
- Mỗi key chỉ dùng 1 lần
- Mỗi thiết bị chỉ tải 1 lần
- Device fingerprinting

---

## 🔄 Workflow Hoàn Chỉnh

### 1. Super Admin Setup
```
Super Admin → super-admin.html → Tạo admin key → Gửi cho Admin
```

### 2. Admin Management
```
Admin → admin.html (với admin key) → Tạo user keys → Phát cho users
```

### 3. User Activation
```
User → index.html → Nhập key → Tải xuống
```

---

## 🛡️ Bảo Mật

### Super Admin
- **Key**: `SUPER-ADMIN-2024-LOCKET-GOLD` (hardcoded)
- **Quyền**: Tạo admin keys
- **Truy cập**: Chỉ Super Admin

### Admin
- **Key**: Được tạo bởi Super Admin
- **Quyền**: Quản lý keys và orders
- **Truy cập**: Cần admin key hợp lệ

### User
- **Key**: Được tạo bởi Admin
- **Quyền**: Chỉ tải xuống
- **Truy cập**: Không cần đăng nhập

---

## 📋 Checklist Bảo Mật

### Super Admin
- [ ] Thay đổi Super Admin Key trong production
- [ ] Chỉ Super Admin biết Super Admin Key
- [ ] Backup admin keys list
- [ ] Monitor admin key usage

### Admin
- [ ] Chỉ phát admin key cho người tin tưởng
- [ ] Thay đổi admin key định kỳ
- [ ] Monitor admin activities
- [ ] Backup database

### User
- [ ] Keys có expiry date
- [ ] Device fingerprinting
- [ ] Rate limiting
- [ ] IP tracking

---

## 🚨 Troubleshooting

### "Admin key không hợp lệ"
- Kiểm tra admin key có đúng không
- Xem admin key có trong database không
- Liên hệ Super Admin để tạo key mới

### "Super Admin Key không đúng"
- Super Admin Key: `SUPER-ADMIN-2024-LOCKET-GOLD`
- Case-sensitive
- Không có khoảng trắng

### "Không thể tạo admin key"
- Kiểm tra Super Admin Key
- Admin key phải >= 8 ký tự
- Không trùng với admin key cũ

### "404 Not Found"
- URL không đúng
- Server chưa chạy
- File không tồn tại

---

## 📊 Database Structure

```json
{
  "orders": [...],
  "downloads": [...],
  "keys": [...],
  "deviceDownloads": [...],
  "adminKeys": [
    {
      "key": "my-admin-2024",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "createdBy": "super-admin",
      "active": true
    }
  ]
}
```

---

## 🔧 Customization

### Thay Đổi Super Admin Key
File: `server.js`
```javascript
// Line ~204
if (superAdminKey !== 'YOUR-NEW-SUPER-ADMIN-KEY') {
```

### Thêm Admin Key Validation
```javascript
// Thêm vào isValidAdminKey()
if (adminKey.includes('forbidden')) return false;
```

### Custom Admin Permissions
```javascript
// Thêm vào API endpoints
if (adminKey === 'readonly-admin') {
    // Chỉ cho phép đọc, không cho phép tạo/sửa
}
```

---

## 📞 Support

**Super Admin Issues:**
- Kiểm tra Super Admin Key
- Restart server
- Check database

**Admin Issues:**
- Liên hệ Super Admin
- Tạo admin key mới
- Check permissions

**User Issues:**
- Liên hệ Admin
- Kiểm tra key validity
- Clear localStorage

---

**🔐 Keep your keys secure!**
