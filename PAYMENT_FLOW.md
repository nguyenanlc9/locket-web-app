# 🛒 Payment Flow - LocketWeb

## 📱 User Journey

### 1. **Index.html** (Trang chủ MMO Store)
```
User clicks "Mua Ngay" → buyProduct() function
↓
Redirect to: /locket/payment.html?orderId=ORD123&amount=30000&customer=Khách hàng
```

### 2. **Payment.html** (Checkout page)
```
User fills customer info:
- Họ và tên: [input]
- Email: [input] 
- Số điện thoại: [input]

User selects payment method:
- 🏦 VietQR (default selected)
- 💰 MoMo
- 💳 VNPay

User clicks "💳 Thanh Toán" → processPayment() function
↓
If VietQR selected → Redirect to: vietqr.html?orderId=ORD123&amount=30000&customer=Khách hàng
If other method → Show success message
```

### 3. **VietQR.html** (QR Code payment)
```
Display:
- 📦 Order info (ID, amount, content)
- 📱 QR Code (VietQR.io generated)
- 🏦 Bank info (from database)
- 📋 Instructions

User actions:
- "📋 Copy Thông Tin" → Copy bank details
- "🔄 Kiểm Tra Thanh Toán" → Check payment status
- Auto-check every 30 seconds

When payment confirmed:
- Show success section
- "🚀 Kích Hoạt Ngay" → Go to locket.html
- "📥 Tải Key" → Download keys
- "📱 Cài Đặt Shadowrocket" → Install module
```

## 🔄 Complete Flow

```
Index.html (MMO Store)
    ↓ [Mua Ngay]
Payment.html (Checkout)
    ↓ [Thanh Toán - VietQR]
VietQR.html (QR Payment)
    ↓ [Payment Confirmed]
Locket.html (Activation)
```

## 🛠️ Technical Details

### **URL Parameters:**
- `orderId`: Unique order identifier
- `amount`: Product price in VND
- `customer`: Customer name (URL encoded)

### **API Calls:**
- `POST /api/orders` → Create new order
- `GET /api/payment-config` → Get bank info
- `GET /api/orders/{orderId}` → Check payment status

### **Database Updates:**
- Add new order to `database.orders`
- Decrease product stock
- Update order status to 'paid' when confirmed

## 🎯 Features

### **Payment Methods:**
- **VietQR**: QR code + bank transfer
- **MoMo**: E-wallet (placeholder)
- **VNPay**: Payment gateway (placeholder)

### **Auto Features:**
- **Auto-check payment** every 30 seconds
- **Timer countdown** for payment deadline
- **QR code generation** with VietQR.io
- **Bank info loading** from database

### **Success Actions:**
- **Activation**: Go to Locket Gold page
- **Download**: Get activation keys
- **Install**: Shadowrocket module setup

## 🔧 Configuration

### **Payment Config** (in database):
```json
{
  "payment_config": {
    "bank_name": "MBBank",
    "account_number": "1613072005", 
    "account_holder": "NGUYEN HUYNH TUONG AN"
  }
}
```

### **VietQR Integration:**
- Uses VietQR.io API for QR generation
- Supports all major Vietnamese banks
- Auto-generates QR with amount and content

## 📱 Mobile Support

- **Responsive design** for all screens
- **Touch-friendly** buttons and forms
- **Mobile-optimized** QR code display
- **Copy-to-clipboard** functionality

## 🚀 Performance

- **Fast redirects** between pages
- **Efficient API calls** with error handling
- **Auto-save** order data
- **Real-time** payment checking
