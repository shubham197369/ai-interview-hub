import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const uploadDir = 'server/uploads';
const files = fs.readdirSync(uploadDir);
console.log('Testing with file:', files[0]);

const fileBuffer = fs.readFileSync(uploadDir + '/' + files[0]);
const parser = new PDFParse({ data: fileBuffer });
const result = await parser.getText();
console.log('Extracted text length:', result.text.length);
console.log('Extracted text sample:\n', result.text.slice(0, 300));
await parser.destroy();
