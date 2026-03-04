require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/w3eklybots';

// ─── Middleware ───────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'w3eklybots-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ─── MongoDB ──────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[DB] Connected to MongoDB'))
  .catch(err => console.error('[DB] Connection failed:', err));

// ─── API Routes ───────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bots', require('./routes/bots'));

// Session info endpoint
app.get('/api/me', (req, res) => {
  if (req.session?.userId) {
    res.json({ loggedIn: true, username: req.session.username, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

// ─── Page Routes ──────────────────────────────
const { requireAuth, requireGuest } = require('./middleware/auth');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/index.html')));
app.get('/login', requireGuest, (req, res) => res.sendFile(path.join(__dirname, 'public/pages/login.html')));
app.get('/register', requireGuest, (req, res) => res.sendFile(path.join(__dirname, 'public/pages/register.html')));
app.get('/dashboard', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'public/pages/dashboard.html')));
app.get('/creator', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'public/pages/creator.html')));
app.get('/creator/:id', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'public/pages/creator.html')));
app.get('/tos', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/tos.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/privacy.html')));
app.get('/legal', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/legal.html')));

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  W3eklyBots Creator BETA v1.0.0`);
  console.log(`  Running at http://localhost:${PORT}`);
  console.log(`  W3eklyStudios © ${new Date().getFullYear()}`);
  console.log(`${'='.repeat(50)}\n`);
});
