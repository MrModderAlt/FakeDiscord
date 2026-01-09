const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

let channels = [
  { id: 1, name: 'general', messages: [] },
  { id: 2, name: 'random', messages: [] },
  { id: 3, name: 'memes', messages: [] },
  { id: 4, name: 'gaming', messages: [] },
  { id: 5, name: 'tech-talk', messages: [] },
];

let members = [];
let playerStats = {};
let achievements = {};
let aiNames = [
  'Luna', 'Pixel', 'Nova', 'Echo', 'Blaze', 'Sage', 'Nexus', 'Aurora',
  'Cyber', 'Storm', 'Phoenix', 'Atlas', 'Quantum', 'Volt', 'Titan',
  'Spirit', 'Orion', 'Zenith', 'Apex', 'Cosmic', 'Void', 'Prism',
  'Spark', 'Tesla', 'Pulse', 'Vortex', 'Nebula', 'Cipher', 'Helix'
];

function generateFakeMembers(count) {
  const names = [
    'Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Cameron', 'Quinn',
    'Avery', 'Blake', 'Drew', 'Jamie', 'Parker', 'Sam', 'Casey', 'Reese',
    'Scout', 'Rowan', 'Bailey', 'Finley', 'Ash', 'River', 'Lou', 'Sage'
  ];
  
  const surnames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Chen', 'Kim'
  ];

  const members = [];
  for (let i = 0; i < count; i++) {
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}`;
    const isAI = i < 50;
    
    const avatarStyles = ['adventurer', 'avataaars', 'bottts', 'pixel-art', 'personas'];
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    
    members.push({
      id: i + 1,
      username: username,
      displayName: `${firstName} ${lastName}`,
      avatar: `https://api.dicebear.com/7.x/${style}/svg?seed=${username}`,
      status: Math.random() > 0.7 ? 'online' : (Math.random() > 0.5 ? 'idle' : 'offline'),
      isAI: isAI,
      points: isAI ? Math.floor(Math.random() * 5000) : 0,
      level: isAI ? Math.floor(Math.random() * 50) + 1 : 1,
      messageCount: isAI ? Math.floor(Math.random() * 200) : 0
    });
    
    playerStats[username] = {
      points: isAI ? Math.floor(Math.random() * 5000) : 0,
      level: isAI ? Math.floor(Math.random() * 50) + 1 : 1,
      messageCount: isAI ? Math.floor(Math.random() * 200) : 0,
      achievements: []
    };
  }
  
  return members;
}

function getRandomAIName() {
  return aiNames[Math.floor(Math.random() * aiNames.length)];
}

function getRandomMessage() {
  const templates = [
    'just hit a clutch 1v5',
    'anyone wanna run ranked?',
    'that was insane',
    'gg ez',
    'nah that lag was bs',
    'can someone explain this meta?',
    'new patch looks fire',
    'skill issue tbh',
    'did you see that play?',
    'chat went crazy',
    'this character is broken',
    'how did that even hit',
    'spamming this strat now',
    'unranked or comp?',
    'lvl 100 vs lvl 1',
    'frame perfect execution',
    'what a tournament run',
    'pro player energy',
    'you guys trying customs?',
    'speedrun strats incoming',
    'that combo was clean',
    'absolutely cracked',
    'tournament winner right here',
    'chat spam this emote',
    'perfect game incoming',
    'high stakes moment',
    'greatest gaming moment',
    'streaming this later',
    'you cannot stop this',
    'legendary gamer move',
    'reading their movements',
    'next level strategy',
    'mechanical outplay',
    'prediction plays',
    'ultimate gaming power',
    'cross map snipe wtf',
    'map control mastery',
    'team fight synergy',
    'flawless rotations',
    'smurf account activated'
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

app.get('/api/channels', (req, res) => {
  res.json(channels);
});

app.get('/api/channel/:id/messages', (req, res) => {
  const channel = channels.find(c => c.id === parseInt(req.params.id));
  if (channel) {
    res.json(channel.messages.slice(-50));
  } else {
    res.status(404).json({ error: 'Channel not found' });
  }
});

app.get('/api/members', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = 50;
  const start = page * limit;
  const end = start + limit;
  
  res.json({
    members: members.slice(start, end),
    total: members.length,
    page: page,
    pages: Math.ceil(members.length / limit)
  });
});

app.post('/api/message', (req, res) => {
  const { channelId, content } = req.body;
  const channel = channels.find(c => c.id === parseInt(channelId));
  
  if (channel) {
    const author = members[0];
    const pointsGained = Math.floor(Math.random() * 50) + 10;
    
    playerStats[author.username].points += pointsGained;
    playerStats[author.username].messageCount += 1;
    author.points = playerStats[author.username].points;
    author.messageCount = playerStats[author.username].messageCount;
    
    const message = {
      id: channel.messages.length + 1,
      author: author,
      content: content,
      timestamp: new Date(),
      reactions: [],
      pointsGained: pointsGained
    };
    channel.messages.push(message);
    io.emit('new_message', { channelId, message });
    res.json(message);
  } else {
    res.status(404).json({ error: 'Channel not found' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const sorted = members
    .filter(m => m.points > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit)
    .map(m => ({
      username: m.username,
      displayName: m.displayName,
      points: m.points,
      level: m.level,
      messageCount: m.messageCount,
      isAI: m.isAI
    }));
  res.json(sorted);
});

app.get('/api/player/:username', (req, res) => {
  const player = members.find(m => m.username === req.params.username);
  if (player) {
    res.json({
      ...player,
      stats: playerStats[player.username]
    });
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

function postAIMessage() {
  const channel = channels[Math.floor(Math.random() * channels.length)];
  const aiPlayers = members.filter(m => m.isAI);
  const randomMember = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
  
  const pointsGained = Math.floor(Math.random() * 100) + 20;
  randomMember.points += pointsGained;
  randomMember.messageCount += 1;
  playerStats[randomMember.username].points += pointsGained;
  playerStats[randomMember.username].messageCount += 1;
  
  const message = {
    id: channel.messages.length + 1,
    author: randomMember,
    content: getRandomMessage(),
    timestamp: new Date(),
    reactions: [],
    pointsGained: pointsGained
  };
  
  channel.messages.push(message);
  io.emit('new_message', { channelId: channel.id, message });
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

members = generateFakeMembers(100000);
console.log(`Generated ${members.length} fake members`);

setInterval(postAIMessage, 2000);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
