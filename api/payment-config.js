export default function handler(req, res) {
    res.json({
        success: true,
        config: {
            bankName: 'MBBank',
            accountNumber: '113366668888',
            accountHolder: 'NGUYEN VAN A',
            productPrice: 30000
        }
    });
}
