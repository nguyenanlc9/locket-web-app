# Hướng Dẫn Chuyển Server về VPS Path

## Mục Tiêu
Chuyển server từ đường dẫn hiện tại sang đường dẫn VPS:
- **Từ**: `C:\Users\Admin\OneDrive\Máy tính\locketweb`
- **Đến**: `C:\actions-runner\_work\locket-web-app\locket-web-app`

## Cách Thực Hiện

### Cách 1: Script Tự Động (Khuyến nghị)
```cmd
# Chạy script để copy tất cả files và khởi động server
move-to-vps-path.bat
```

### Cách 2: Script Nhanh (Nếu files đã có sẵn)
```cmd
# Chỉ cập nhật đường dẫn PM2
update-pm2-path.bat
```

### Cách 3: Thực hiện thủ công
```cmd
# 1. Dừng PM2
pm2 delete all

# 2. Chuyển đến thư mục VPS
cd "C:\actions-runner\_work\locket-web-app\locket-web-app"

# 3. Khởi động server
pm2 start server/server.js --name "locketweb-server"

# 4. Lưu cấu hình
pm2 save
```

## Kiểm Tra Kết Quả

Sau khi chạy script, kiểm tra:
```cmd
pm2 list
```

Bạn sẽ thấy:
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ locketweb-server   │ fork     │ 0    │ online    │ 0%       │ 50.2mb  │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

## Truy Cập Ứng Dụng

- **Trang chủ**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Locket Page**: http://localhost:3000/locket

## Lưu Ý Quan Trọng

1. **Backup dữ liệu** trước khi thực hiện
2. **Chạy với quyền Administrator**
3. **Kiểm tra firewall** nếu cần truy cập từ bên ngoài
4. **Đảm bảo Node.js và PM2** đã được cài đặt

## Troubleshooting

### Nếu gặp lỗi "Cannot find module":
```cmd
# Kiểm tra file server.js có tồn tại
dir "C:\actions-runner\_work\locket-web-app\locket-web-app\server\server.js"

# Cài đặt dependencies
cd "C:\actions-runner\_work\locket-web-app\locket-web-app"
npm install
```

### Nếu PM2 không khởi động:
```cmd
# Kiểm tra PM2 version
pm2 --version

# Cài đặt lại PM2 nếu cần
npm install -g pm2
```

## Cấu Trúc Thư Mục VPS

Sau khi chuyển, thư mục VPS sẽ có cấu trúc:
```
C:\actions-runner\_work\locket-web-app\locket-web-app\
├── server/
│   └── server.js
├── admin/
├── locket/
├── images/
├── download/
├── *.html
├── *.json
└── package.json
```
