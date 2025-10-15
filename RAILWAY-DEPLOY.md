# 🚀 Deploy to Railway

## Step 1: Setup Railway Account
1. Truy cập: https://railway.app
2. Đăng ký bằng GitHub account
3. Verify email

## Step 2: Create Project
1. Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Connect repo `locketweb`
4. Railway sẽ tự động detect Node.js

## Step 3: Add PostgreSQL Database
1. Trong project dashboard, click "New"
2. Chọn "Database" → "PostgreSQL"
3. Railway sẽ tạo database và cung cấp `DATABASE_URL`

## Step 4: Environment Variables
Railway sẽ tự động set:
- `DATABASE_URL` (từ PostgreSQL service)
- `PORT` (tự động)

Bạn cần set thêm:
- `ADMIN_KEY` = `admin123` (hoặc key bạn muốn)
- `EMAIL_USER` = email Gmail của bạn
- `EMAIL_PASS` = App Password của Gmail

## Step 5: Deploy
1. Railway sẽ tự động deploy khi push code
2. Hoặc click "Deploy" trong dashboard

## Step 6: Setup Domain (Optional)
1. Trong project settings
2. Add custom domain
3. Update DNS records

## Step 7: Test
1. Truy cập URL Railway cung cấp
2. Test tạo đơn hàng
3. Check admin panel
4. Verify database persistence

## 🔧 Database Migration
Khi deploy lần đầu, database sẽ tự động tạo tables.
Không cần migration script.

## 📊 Monitoring
- Railway dashboard: View logs, metrics
- Database: Query data trực tiếp
- Uptime: 99.9% guaranteed

## 💰 Pricing
- **Free tier**: $5 credit/tháng
- **Usage**: ~$1-2/tháng cho app nhỏ
- **Database**: Included trong free tier
- **Bandwidth**: Unlimited

## 🆘 Troubleshooting
1. **Database connection error**: Check `DATABASE_URL`
2. **Build failed**: Check Node.js version
3. **App crash**: Check logs trong Railway dashboard
4. **Email not working**: Check `EMAIL_USER` và `EMAIL_PASS`

## 📝 Notes
- Database data sẽ được lưu trữ persistent
- Không bị mất data khi restart
- Auto-scaling khi có traffic
- SSL certificate tự động
