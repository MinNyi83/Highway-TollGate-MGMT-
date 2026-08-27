import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB

// Ensure upload directories exist
const dirs = ['vehicles', 'anpr', 'profiles', 'documents'];
dirs.forEach((dir) => {
  const fullPath = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const subDir = file.fieldname === 'anpr' ? 'anpr' : 
                   file.fieldname === 'profile' ? 'profiles' : 
                   file.fieldname === 'document' ? 'documents' : 'vehicles';
    cb(null, path.join(UPLOAD_DIR, subDir));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', server: 'storage', timestamp: new Date().toISOString() });
});

// Upload vehicle photo
app.post('/api/upload/vehicle', upload.single('photo'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const url = `/files/vehicles/${req.file.filename}`;
  res.json({
    url,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Upload ANPR capture
app.post('/api/upload/anpr', upload.single('photo'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const url = `/files/anpr/${req.file.filename}`;
  res.json({
    url,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    plateNumber: req.body.plateNumber,
    confidence: req.body.confidence,
  });
});

// Upload multiple photos
app.post('/api/upload/vehicle-photos', upload.array('photos', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  const urls = files.map((f) => ({
    url: `/files/vehicles/${f.filename}`,
    filename: f.filename,
    size: f.size,
  }));

  res.json(urls);
});

// Serve files
app.use('/files', express.static(UPLOAD_DIR));

// Get file info
app.get('/api/files/:type/:filename', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.type, req.params.filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  const stat = fs.statSync(filePath);
  res.json({
    filename: req.params.filename,
    type: req.params.type,
    size: stat.size,
    created: stat.birthtime,
  });
});

// Delete file
app.delete('/api/files/:type/:filename', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.type, req.params.filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  fs.unlinkSync(filePath);
  res.json({ message: 'File deleted' });
});

// Storage stats
app.get('/api/stats', (_req, res) => {
  const stats: Record<string, number> = {};
  let totalSize = 0;

  dirs.forEach((dir) => {
    const dirPath = path.join(UPLOAD_DIR, dir);
    const files = fs.readdirSync(dirPath);
    stats[dir] = files.length;
    files.forEach((f) => {
      const stat = fs.statSync(path.join(dirPath, f));
      totalSize += stat.size;
    });
  });

  res.json({
    files: stats,
    totalFiles: Object.values(stats).reduce((a, b) => a + b, 0),
    totalSizeMB: Math.round(totalSize / 1024 / 1024),
  });
});

const PORT = parseInt(process.env.PORT || '5000');
app.listen(PORT, () => {
  console.log(`Storage server running on port ${PORT}`);
  console.log(`Upload directory: ${path.resolve(UPLOAD_DIR)}`);
});
