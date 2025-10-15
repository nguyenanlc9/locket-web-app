const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDatabase() {
    try {
        // Create tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) UNIQUE NOT NULL,
                customer_name VARCHAR(100) NOT NULL,
                customer_email VARCHAR(100) NOT NULL,
                customer_phone VARCHAR(20) NOT NULL,
                items JSONB NOT NULL,
                payment_method VARCHAR(20) NOT NULL,
                total INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                download_token VARCHAR(100),
                download_limit INTEGER DEFAULT 1,
                download_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                paid_at TIMESTAMP,
                expires_at TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS keys (
                id SERIAL PRIMARY KEY,
                key_value VARCHAR(50) UNIQUE NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                used_at TIMESTAMP,
                used_by VARCHAR(100),
                device_fingerprint VARCHAR(100),
                order_id VARCHAR(50)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS downloads (
                id SERIAL PRIMARY KEY,
                key_value VARCHAR(50),
                type VARCHAR(20),
                device_fingerprint VARCHAR(100),
                ip_address VARCHAR(45),
                downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS device_downloads (
                id SERIAL PRIMARY KEY,
                key_value VARCHAR(50),
                device_fingerprint VARCHAR(100),
                ip_address VARCHAR(45),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS config (
                id SERIAL PRIMARY KEY,
                config_type VARCHAR(50) UNIQUE NOT NULL,
                config_data JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database tables created successfully');
    } catch (error) {
        console.error('❌ Error creating database tables:', error);
        throw error;
    }
}

// Database operations
const db = {
    // Orders
    async createOrder(orderData) {
        const query = `
            INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, 
                              items, payment_method, total, download_token, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            orderData.orderId,
            orderData.customer.fullName,
            orderData.customer.email,
            orderData.customer.phone,
            JSON.stringify(orderData.items),
            orderData.paymentMethod,
            orderData.total,
            orderData.downloadToken,
            orderData.expiresAt
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getOrder(orderId) {
        const query = 'SELECT * FROM orders WHERE order_id = $1';
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    },

    async updateOrderStatus(orderId, status) {
        const query = `
            UPDATE orders 
            SET status = $1, paid_at = CASE WHEN $1 = 'paid' THEN CURRENT_TIMESTAMP ELSE paid_at END
            WHERE order_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [status, orderId]);
        return result.rows[0];
    },

    async getAllOrders() {
        const query = 'SELECT * FROM orders ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    // Keys
    async createKey(keyData) {
        const query = `
            INSERT INTO keys (key_value, created_at)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await pool.query(query, [keyData.key, keyData.createdAt]);
        return result.rows[0];
    },

    async getKey(keyValue) {
        const query = 'SELECT * FROM keys WHERE key_value = $1';
        const result = await pool.query(query, [keyValue]);
        return result.rows[0];
    },

    async updateKey(keyValue, updateData) {
        const query = `
            UPDATE keys 
            SET used = $1, used_at = $2, used_by = $3, device_fingerprint = $4, order_id = $5
            WHERE key_value = $6
            RETURNING *
        `;
        const values = [
            updateData.used,
            updateData.usedAt,
            updateData.usedBy,
            updateData.deviceFingerprint,
            updateData.orderId,
            keyValue
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getAllKeys() {
        const query = 'SELECT * FROM keys ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    // Downloads
    async trackDownload(downloadData) {
        const query = `
            INSERT INTO downloads (key_value, type, device_fingerprint, ip_address)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(query, [
            downloadData.key,
            downloadData.type,
            downloadData.deviceFingerprint,
            downloadData.ip
        ]);
        return result.rows[0];
    },

    async trackDeviceDownload(deviceData) {
        const query = `
            INSERT INTO device_downloads (key_value, device_fingerprint, ip_address)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [
            deviceData.key,
            deviceData.deviceFingerprint,
            deviceData.ip
        ]);
        return result.rows[0];
    },

    async getDeviceDownload(deviceFingerprint) {
        const query = 'SELECT * FROM device_downloads WHERE device_fingerprint = $1';
        const result = await pool.query(query, [deviceFingerprint]);
        return result.rows[0];
    },

    // Config
    async getConfig(configType) {
        const query = 'SELECT * FROM config WHERE config_type = $1';
        const result = await pool.query(query, [configType]);
        return result.rows[0]?.config_data || null;
    },

    async setConfig(configType, configData) {
        const query = `
            INSERT INTO config (config_type, config_data)
            VALUES ($1, $2)
            ON CONFLICT (config_type)
            DO UPDATE SET config_data = $2, updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        const result = await pool.query(query, [configType, JSON.stringify(configData)]);
        return result.rows[0];
    }
};

module.exports = { initDatabase, db, pool };
