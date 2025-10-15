import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'vietqr.html');
    
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(fileContent);
    } catch (error) {
        console.error('Error reading vietqr.html:', error);
        res.status(404).send('File not found');
    }
}
