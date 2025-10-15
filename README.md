# LocketWeb - Full-Stack App với Supabase

## 🚀 Setup Supabase Backend

### **1. Tạo Supabase Project:**
1. Vào [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy `Project URL` và `Anon Key`

### **2. Setup Database:**
1. Vào SQL Editor trong Supabase Dashboard
2. Chạy file `supabase/schema.sql`
3. Tables sẽ được tạo tự động

### **3. Deploy Edge Functions:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy payment-config
supabase functions deploy verify-key
supabase functions deploy orders
```

### **4. Cập nhật Frontend:**
Thay `your-project-ref` trong các file HTML bằng project ref thực của bạn:

```javascript
// Thay đổi URL này
const response = await fetch('https://your-project-ref.supabase.co/functions/v1/payment-config');
```

## 🎯 Features:
- ✅ **Database**: PostgreSQL với Supabase
- ✅ **API**: Edge Functions (Deno)
- ✅ **Frontend**: HTML/CSS/JS
- ✅ **Authentication**: Supabase Auth
- ✅ **Real-time**: Supabase Realtime
- ✅ **Storage**: Supabase Storage

## 🔧 Environment Variables:
```bash
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

## 📁 Project Structure:
```
├── supabase/
│   ├── functions/
│   │   ├── payment-config/
│   │   ├── verify-key/
│   │   └── orders/
│   ├── schema.sql
│   └── config.toml
├── index.html
├── payment.html
├── admin.html
├── vietqr.html
└── README.md
```

## 🚀 Deploy:
1. **Frontend**: Deploy lên Vercel/Netlify
2. **Backend**: Supabase tự động deploy
3. **Database**: Supabase PostgreSQL
4. **Functions**: Supabase Edge Functions

## 💡 Lợi ích:
- ✅ **Miễn phí**: Supabase free tier
- ✅ **Scalable**: Auto-scaling
- ✅ **Real-time**: WebSocket support
- ✅ **Security**: Built-in auth & RLS
- ✅ **Global**: CDN worldwide