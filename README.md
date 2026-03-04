# W3eklyBots Creator BETA v1.0.0
### by W3eklyStudios

A full-stack web application for generating Discord bots in Python — with a login system, bot management dashboard, command builder with drag & drop, embed preview, auto-role configuration, and more.

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up MongoDB

**Option A — Local MongoDB:**
```bash
# Install MongoDB Community Edition and start it
mongod --dbpath /data/db
```

**Option B — MongoDB Atlas (Cloud, recommended):**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free cluster
2. Get your connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/w3eklybots`)

### 3. Configure environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/w3eklybots   # or your Atlas URI
SESSION_SECRET=some_very_long_random_secret_string
PORT=3000
```

### 4. Add a favicon and logo (optional)
Place your images in `public/img/`:
- `public/img/favicon.png` — Browser favicon
- You can also upload logo/favicon from the Dashboard UI (stored in browser localStorage)

### 5. Start the server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
w3eklybots/
├── server.js              # Express server entry point
├── .env.example           # Environment variables template
├── models/
│   ├── User.js            # MongoDB User model
│   └── Bot.js             # MongoDB Bot model
├── routes/
│   ├── auth.js            # Login / Register / Logout
│   └── bots.js            # CRUD + code generator
├── middleware/
│   └── auth.js            # requireAuth / requireGuest
└── public/
    ├── css/
    │   └── main.css        # Shared styles
    ├── img/               # Put favicon.png here
    └── pages/
        ├── index.html     # Landing page
        ├── login.html     # Login
        ├── register.html  # Register
        ├── dashboard.html # Bot management
        ├── creator.html   # Bot builder
        ├── tos.html       # Terms of Service
        ├── privacy.html   # Privacy Policy
        └── legal.html     # Legal notices
```

---

## 🤖 Generated Bot Features

The creator generates `bot.py` with:
- **Slash commands** (`/ping`, `/help`, `/serverinfo`, `/userinfo`, `/avatar`, `/say`)
- **Prefix commands** (`!ping`, `!help` + custom)
- **Custom command maker** with drag & drop ordering
- **Embed builder** with live preview
- **Auto-role** by Role ID on member join
- **Welcome messages** with channel ID targeting
- **Event logging** (join/leave/message delete/edit) to channel by ID
- **Moderation** (kick, ban, mute, warn, clear, unban)
- **Reaction roles**
- **DM on join**
- **Global error handler**

---

## 🔧 Requirements.txt for generated bots

```
discord.py>=2.3.0
```

Run the bot:
```bash
pip install discord.py
python bot.py
```

---

W3eklyStudios © 2025 — W3eklyBots Creator BETA v1.0.0
