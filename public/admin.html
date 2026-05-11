require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const contactLimit = rateLimit({ windowMs: 15*60*1000, max: 5, message: { error: 'Muitas tentativas.' } });
const adminLimit = rateLimit({ windowMs: 15*60*1000, max: 10, message: { error: 'Muitas tentativas de login.' } });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `photo_${Date.now()}_${Math.random().toString(36).slice(2,7)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /jpeg|jpg|png|webp/.test(file.mimetype))
});

const DATA_PATH = path.join(__dirname, 'data/site.json');
function readData() { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
function writeData(data) { fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2)); }

function adminAuth(req, res, next) {
  if (req.headers['x-admin-token'] === process.env.ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Não autorizado' });
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));
app.get('/api/site', (req, res) => res.json(readData()));

app.post('/api/contact', contactLimit, async (req, res) => {
  const { nome, noivo, tel, data, pacote, msg } = req.body;
  if (!nome || !tel) return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0806;color:#f5f0e8;padding:40px">
      <h1 style="font-size:26px;letter-spacing:8px;color:#c9a96e;font-weight:300;margin-bottom:8px">MV FOTOGRAFIA</h1>
      <p style="font-size:10px;letter-spacing:3px;color:#8a7d6a;text-transform:uppercase;margin-bottom:28px">Nova solicitação de orçamento</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#8a7d6a;font-size:11px;letter-spacing:2px;text-transform:uppercase;width:130px">Nome</td><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#f5f0e8;font-size:14px">${nome}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#8a7d6a;font-size:11px;letter-spacing:2px;text-transform:uppercase">Noivo(a)</td><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#f5f0e8;font-size:14px">${noivo||'—'}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#8a7d6a;font-size:11px;letter-spacing:2px;text-transform:uppercase">WhatsApp</td><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#c9a96e;font-size:14px">${tel}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#8a7d6a;font-size:11px;letter-spacing:2px;text-transform:uppercase">Data</td><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#f5f0e8;font-size:14px">${data||'—'}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#8a7d6a;font-size:11px;letter-spacing:2px;text-transform:uppercase">Pacote</td><td style="padding:10px 0;border-bottom:.5px solid rgba(255,255,255,.08);color:#c9a96e;font-size:14px">${pacote||'—'}</td></tr>
      </table>
      ${msg?`<div style="margin-top:20px"><p style="color:#8a7d6a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Mensagem</p><p style="color:#ede6d8;font-size:14px;line-height:1.8;white-space:pre-line">${msg}</p></div>`:''}
      <div style="margin-top:28px;text-align:center">
        <a href="https://wa.me/55${tel.replace(/\D/g,'')}" style="display:inline-block;background:#25D366;color:white;padding:14px 28px;text-decoration:none;font-size:11px;letter-spacing:2px;text-transform:uppercase">Responder no WhatsApp</a>
      </div>
    </div>`;
    await transporter.sendMail({
      from: `"MV Fotografia - Site" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `💍 Novo orçamento: ${nome} — ${pacote||'Pacote não informado'}`,
      html,
      replyTo: tel
    });
    res.json({ ok: true, message: 'Mensagem enviada! Retorno em até 24 horas.' });
  } catch (err) {
    console.error('Email error:', err);
    res.json({ ok: true, message: 'Mensagem recebida! Retorno em até 24 horas.' });
  }
});

app.post('/api/admin/login', adminLimit, (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    res.json({ ok: true, token: process.env.ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Senha incorreta.' });
  }
});

app.post('/api/admin/save', adminAuth, (req, res) => {
  try {
    const current = readData();
    const updated = { ...current, ...req.body };
    if (updated.heroPhotos?.length) {
      updated.hero.bg_image = updated.heroPhotos[0];
    }
    writeData(updated);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao salvar.' });
  }
});

app.post('/api/admin/upload', adminAuth, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  res.json({ ok: true, url: `/uploads/${req.file.filename}` });
});

app.delete('/api/admin/photo', adminAuth, (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('/uploads/')) return res.status(400).json({ error: 'URL inválida.' });
  const filePath = path.join(__dirname, 'public', url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\n🎯 MV Fotografia rodando em http://localhost:${PORT}`);
  console.log(`📸 Admin em http://localhost:${PORT}/admin\n`);
});
