export default function handler(req, res) {
    if (req.method === 'POST') {
        res.json({
            success: true,
            orderId: 'ORD' + Date.now(),
            message: 'Đơn hàng đã được tạo thành công'
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
