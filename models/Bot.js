const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: { type: String, enum: ['slash', 'prefix'], default: 'slash' },
  response: String,
  embedResponse: { type: Boolean, default: false },
  embedColor: { type: String, default: '#5865F2' },
  embedTitle: String,
  ephemeral: { type: Boolean, default: false }
});

const botSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  token: { type: String, required: true },
  prefix: { type: String, default: '!' },
  statusMessage: { type: String, default: 'Powered by W3eklyBots' },
  statusType: { type: String, default: 'playing' },

  // Features toggles
  features: {
    slashCommands: { type: Boolean, default: true },
    prefixCommands: { type: Boolean, default: true },
    embedBuilder: { type: Boolean, default: true },
    autoRole: { type: Boolean, default: false },
    welcomeMessage: { type: Boolean, default: false },
    logging: { type: Boolean, default: false },
    moderation: { type: Boolean, default: false },
    reactionRoles: { type: Boolean, default: false },
    dmOnJoin: { type: Boolean, default: false },
    errorHandler: { type: Boolean, default: true }
  },

  // Slash command toggles
  slashBuiltins: {
    ping: { type: Boolean, default: true },
    help: { type: Boolean, default: true },
    serverinfo: { type: Boolean, default: false },
    userinfo: { type: Boolean, default: false },
    avatar: { type: Boolean, default: false },
    say: { type: Boolean, default: false }
  },

  // Custom commands
  commands: [commandSchema],

  // Embed config
  embed: {
    title: { type: String, default: 'Bot Announcement' },
    description: { type: String, default: 'Welcome! Use /help to get started.' },
    color: { type: String, default: '#5865F2' },
    footer: { type: String, default: 'W3eklyBots • v1.0.0' },
    author: { type: String, default: 'W3eklyBots' },
    imageUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' }
  },

  // Auto role config — uses channel/role IDs
  autoRole: {
    roleIds: [String],
    welcomeChannelId: { type: String, default: '' },
    welcomeMessage: { type: String, default: 'Welcome {member.mention}!' },
    logChannelId: { type: String, default: '' }
  },

  // Moderation
  modCommands: {
    kick: { type: Boolean, default: true },
    ban: { type: Boolean, default: true },
    mute: { type: Boolean, default: true },
    warn: { type: Boolean, default: false },
    clear: { type: Boolean, default: false },
    unban: { type: Boolean, default: false }
  },

  // Logging events
  logEvents: {
    memberJoin: { type: Boolean, default: true },
    memberLeave: { type: Boolean, default: true },
    messageDelete: { type: Boolean, default: false },
    messageEdit: { type: Boolean, default: false }
  },

  generatedCode: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

botSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Bot', botSchema);
