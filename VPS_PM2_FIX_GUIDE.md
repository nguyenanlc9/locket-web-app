# Hướng Dẫn Sửa Lỗi PM2 trên VPS

## Vấn Đề
PM2 đang cố gắng chạy server từ đường dẫn cũ:
- **Đường dẫn cũ (sai)**: `C:\actions-runner\_work\locket-web-app\locket-web-app\server`
- **Đường dẫn mới (đúng)**: `C:\Users\Admin\OneDrive\Máy tính\locketweb\server\server.js`

## Giải Pháp

### Cách 1: Sử dụng Batch Script (Đơn giản nhất)
```cmd
# Chạy file fix-vps-pm2.bat
fix-vps-pm2.bat
```

### Cách 2: Sử dụng PowerShell Script
```powershell
# Chạy file fix-vps-pm2.ps1
.\fix-vps-pm2.ps1
```

### Cách 3: Thực hiện thủ công
```cmd
# 1. Dừng tất cả PM2 processes
pm2 delete all

# 2. Chuyển đến thư mục đúng
cd "C:\Users\Admin\OneDrive\Máy tính\locketweb"

# 3. Khởi động server với đường dẫn đúng
pm2 start server/server.js --name "locketweb-server" --cwd "C:\Users\Admin\OneDrive\Máy tính\locketweb"

# 4. Lưu cấu hình PM2
pm2 save

# 5. Kiểm tra trạng thái
pm2 list
```

## Kiểm Tra Kết Quả

Sau khi chạy script, bạn sẽ thấy:
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

## Lưu Ý

1. **Chạy với quyền Administrator** để đảm bảo PM2 có thể lưu cấu hình
2. **Kiểm tra firewall** nếu không thể truy cập từ bên ngoài
3. **Backup database** trước khi thực hiện thay đổi

## Troubleshooting

### Nếu vẫn gặp lỗi:
```cmd
# Kiểm tra PM2 version
pm2 --version

# Kiểm tra Node.js version
node --version

# Kiểm tra file server.js có tồn tại
dir "C:\Users\Admin\OneDrive\Máy tính\locketweb\server\server.js"
```

### Nếu cần cài đặt lại PM2:
```cmd
npm install -g pm2
pm2 install pm2-logrotate
```
