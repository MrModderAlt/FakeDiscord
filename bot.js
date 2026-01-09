const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const API_URL = process.env.API_URL || 'http://localhost:3000';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TARGET_GUILD = process.env.TARGET_GUILD;
const TARGET_CHANNELS = process.env.TARGET_CHANNELS ? process.env.TARGET_CHANNELS.split(',') : [];

const aiNames = [
  'Luna', 'Pixel', 'Nova', 'Echo', 'Blaze', 'Sage', 'Nexus', 'Aurora',
  'Cyber', 'Storm', 'Phoenix', 'Atlas', 'Quantum', 'Volt', 'Titan',
  'Spirit', 'Orion', 'Zenith', 'Apex', 'Cosmic', 'Void', 'Prism',
  'Spark', 'Tesla', 'Pulse', 'Vortex', 'Nebula', 'Cipher', 'Helix'
];

const messageTemplates = [
  'lol thats funny',
  'fr fr no cap',
  'wait what',
  'bruh moment',
  'same',
  'facts',
  'big facts',
  'not me though',
  'im crying',
  'ok but',
  'actually though',
  'no literally',
  'im dead',
  'help',
  'chat what',
  'nah nah nah',
  'yeah yeah yeah',
  'facts facts facts',
  'chat is down bad',
  'this is wild',
  'yo',
  'yo yo',
  'its giving',
  'periodt',
  'omg',
  'ok ok ok',
  'fr',
  'no shot',
  'bet',
  'lowkey',
  'highkey',
  'cappp',
  'slay',
  'ate',
  'bestie',
  'obsessed',
  'nope',
  'literally nobody:',
  'and??? 💀',
  'i have no thoughts head empty',
  'absolutely sent me',
  'this is insane',
  'cannot relate',
  'relate heavily',
  'stop it rn',
  'im sobbing'
];

function getRandomMessage() {
  return messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
}

function getRandomAIName() {
  return aiNames[Math.floor(Math.random() * aiNames.length)];
}

client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`📊 Currently in ${client.guilds.cache.size} server(s)`);
  
  setInterval(postAIMessage, 5000);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  console.log(`💬 ${message.author.username}: ${message.content}`);
  
  if (message.mentions.has(client.user)) {
    try {
      await message.reply({
        content: getRandomMessage(),
        allowedMentions: { repliedUser: false }
      });
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }
});

async function postAIMessage() {
  try {
    const guild = client.guilds.cache.get(TARGET_GUILD);
    if (!guild) {
      console.log('Guild not found. Set TARGET_GUILD in .env');
      return;
    }
    
    const channels = guild.channels.cache.filter(ch => 
      ch.isTextBased() && 
      (TARGET_CHANNELS.length === 0 || TARGET_CHANNELS.includes(ch.id))
    );
    
    if (channels.size === 0) {
      console.log('No target channels found');
      return;
    }
    
    const randomChannel = channels.random();
    const message = getRandomMessage();
    
    try {
      await randomChannel.send(`**[AI Bot - ${getRandomAIName()}]** ${message}`);
      console.log(`✉️ Posted to #${randomChannel.name}: ${message}`);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  } catch (error) {
    console.error('Error in postAIMessage:', error);
  }
}

if (DISCORD_TOKEN) {
  client.login(DISCORD_TOKEN);
} else {
  console.log('⚠️  DISCORD_TOKEN not set. Bot will not connect to Discord.');
  console.log('Set DISCORD_TOKEN in .env file to enable Discord bot.');
}

module.exports = client;
