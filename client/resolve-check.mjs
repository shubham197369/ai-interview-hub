import { createRequire } from 'module';
const require = createRequire(import.meta.url);
for (const p of ['express', 'mongoose', 'cors', 'multer', 'dotenv', 'pdf-parse']) {
  try {
    console.log(p, '->', require.resolve(p));
  } catch (e) {
    console.log(p, '-> NOT FOUND');
  }
}
