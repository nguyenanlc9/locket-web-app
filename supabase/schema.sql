-- Create tables in Supabase
CREATE TABLE IF NOT EXISTS payment_config (
    id SERIAL PRIMARY KEY,
    bank_name TEXT DEFAULT 'MBBank',
    account_number TEXT DEFAULT '113366668888',
    account_holder TEXT DEFAULT 'NGUYEN VAN A',
    product_price INTEGER DEFAULT 30000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keys (
    id SERIAL PRIMARY KEY,
    key_value TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    items JSONB,
    total INTEGER,
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment config
INSERT INTO payment_config (bank_name, account_number, account_holder, product_price) 
VALUES ('MBBank', '113366668888', 'NGUYEN VAN A', 30000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample keys
INSERT INTO keys (key_value, status, expires_at) VALUES 
('DEMO123', 'active', NOW() + INTERVAL '30 days'),
('TEST456', 'active', NOW() + INTERVAL '30 days')
ON CONFLICT (key_value) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE payment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to payment_config" ON payment_config FOR SELECT USING (true);
CREATE POLICY "Allow public read access to keys" ON keys FOR SELECT USING (true);
CREATE POLICY "Allow public insert to orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to orders" ON orders FOR SELECT USING (true);
