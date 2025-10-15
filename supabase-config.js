// Supabase configuration
const { createClient } = require('@supabase/supabase-js');

// Supabase URL và Key (sẽ được set từ environment variables)
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseAnonKey;

// Tạo Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations cho Supabase
const db = {
    // Orders
    async createOrder(orderData) {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                order_id: orderData.orderId,
                customer_name: orderData.customer.fullName,
                customer_email: orderData.customer.email,
                customer_phone: orderData.customer.phone,
                items: orderData.items,
                payment_method: orderData.paymentMethod,
                total: orderData.total,
                download_token: orderData.downloadToken,
                expires_at: orderData.expiresAt
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getOrder(orderId) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateOrderStatus(orderId, status) {
        const updateData = { status };
        if (status === 'paid') {
            updateData.paid_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('order_id', orderId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getAllOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Keys
    async createKey(keyData) {
        const { data, error } = await supabase
            .from('keys')
            .insert([{
                key_value: keyData.key,
                created_at: keyData.createdAt
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getKey(keyValue) {
        const { data, error } = await supabase
            .from('keys')
            .select('*')
            .eq('key_value', keyValue)
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateKey(keyValue, updateData) {
        const { data, error } = await supabase
            .from('keys')
            .update({
                used: updateData.used,
                used_at: updateData.usedAt,
                used_by: updateData.usedBy,
                device_fingerprint: updateData.deviceFingerprint,
                order_id: updateData.orderId
            })
            .eq('key_value', keyValue)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getAllKeys() {
        const { data, error } = await supabase
            .from('keys')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Downloads
    async trackDownload(downloadData) {
        const { data, error } = await supabase
            .from('downloads')
            .insert([{
                key_value: downloadData.key,
                type: downloadData.type,
                device_fingerprint: downloadData.deviceFingerprint,
                ip_address: downloadData.ip
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async trackDeviceDownload(deviceData) {
        const { data, error } = await supabase
            .from('device_downloads')
            .insert([{
                key_value: deviceData.key,
                device_fingerprint: deviceData.deviceFingerprint,
                ip_address: deviceData.ip
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getDeviceDownload(deviceFingerprint) {
        const { data, error } = await supabase
            .from('device_downloads')
            .select('*')
            .eq('device_fingerprint', deviceFingerprint)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Config
    async getConfig(configType) {
        const { data, error } = await supabase
            .from('config')
            .select('config_data')
            .eq('config_type', configType)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data?.config_data || null;
    },

    async setConfig(configType, configData) {
        const { data, error } = await supabase
            .from('config')
            .upsert({
                config_type: configType,
                config_data: configData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
};

module.exports = { db, supabase };
