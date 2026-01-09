const socket = io();

let currentChannelId = 1;
let channels = [];
let members = [];
let currentMemberPage = 0;

async function loadChannels() {
  try {
    const response = await fetch('/api/channels');
    channels = await response.json();
    renderChannels();
    loadMessages(currentChannelId);
  } catch (error) {
    console.error('Error loading channels:', error);
  }
}

function renderChannels() {
  const channelsList = document.getElementById('channels-list');
  channelsList.innerHTML = '';
  
  channels.forEach(channel => {
    const button = document.createElement('button');
    button.className = `channel-button ${channel.id === currentChannelId ? 'active' : ''}`;
    button.textContent = '#';
    button.title = channel.name;
    button.onclick = () => selectChannel(channel.id);
    channelsList.appendChild(button);
  });
}

function selectChannel(channelId) {
  currentChannelId = channelId;
  const input = document.getElementById('message-input');
  const channel = channels.find(c => c.id === channelId);
  input.placeholder = `Message #${channel.name}`;
  document.getElementById('channel-name').textContent = channel.name;
  
  document.querySelectorAll('.channel-button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelectorAll('.channel-button')[channelId - 1];
  if (activeBtn) activeBtn.classList.add('active');
  
  loadMessages(channelId);
}

async function loadMessages(channelId) {
  try {
    const response = await fetch(`/api/channel/${channelId}/messages`);
    const messages = await response.json();
    renderMessages(messages);
    scrollToBottom();
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function renderMessages(messages) {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';
  
  messages.forEach(msg => {
    const messageEl = createMessageElement(msg);
    messagesContainer.appendChild(messageEl);
  });
}

function createMessageElement(msg) {
  const div = document.createElement('div');
  div.className = 'message';
  
  const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  const pointsHtml = msg.pointsGained ? `<span class="message-points">+${msg.pointsGained} pts</span>` : '';
  
  div.innerHTML = `
    <img src="${msg.author.avatar}" alt="avatar" class="message-avatar">
    <div class="message-content">
      <div>
        <span class="message-author ${msg.author.isAI ? 'ai' : ''}">
          ${msg.author.displayName}
        </span>
        <span class="message-timestamp">${time}</span>
        ${pointsHtml}
      </div>
      <div class="message-text">${escapeHtml(msg.content)}</div>
    </div>
  `;
  
  return div;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function scrollToBottom() {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function loadMembers(page = 0) {
  try {
    const response = await fetch(`/api/members?page=${page}`);
    const data = await response.json();
    members = data.members;
    renderMembers(members);
  } catch (error) {
    console.error('Error loading members:', error);
  }
}

function renderMembers(membersList) {
  const membersContainer = document.getElementById('members-list');
  membersContainer.innerHTML = '';
  
  const onlineCount = membersList.filter(m => m.status === 'online').length;
  document.getElementById('online-count').textContent = `${onlineCount} Online`;
  
  membersList.forEach(member => {
    const memberEl = document.createElement('div');
    memberEl.className = `member-item ${member.isAI ? 'ai' : ''}`;
    
    memberEl.innerHTML = `
      <img src="${member.avatar}" alt="avatar" class="member-item-avatar">
      <span class="member-item-name">${member.displayName}</span>
      <div class="member-status ${member.status}"></div>
    `;
    
    memberEl.onclick = () => {
      const input = document.getElementById('message-input');
      input.value = `@${member.username} `;
      input.focus();
    };
    
    membersContainer.appendChild(memberEl);
  });
}

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const input = document.getElementById('message-input');
  const content = input.value.trim();
  
  if (!content) return;
  
  try {
    await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: currentChannelId, content })
    });
    input.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

socket.on('new_message', (data) => {
  if (data.channelId === currentChannelId) {
    const messagesContainer = document.getElementById('messages');
    const messageEl = createMessageElement(data.message);
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }
});

async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard?limit=100');
    const leaderboard = await response.json();
    renderLeaderboard(leaderboard);
  } catch (error) {
    console.error('Error loading leaderboard:', error);
  }
}

function renderLeaderboard(leaderboard) {
  const leaderboardContainer = document.getElementById('leaderboard');
  leaderboardContainer.innerHTML = '';
  
  leaderboard.forEach((player, index) => {
    const div = document.createElement('div');
    div.className = 'leaderboard-item';
    div.innerHTML = `
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-name ${player.isAI ? 'ai' : ''}">${player.displayName}</span>
      <span class="leaderboard-points">${player.points.toLocaleString()}</span>
    `;
    leaderboardContainer.appendChild(div);
  });
}

async function updatePlayerStats() {
  const playerStats = document.getElementById('player-stats');
  const member = members[0];
  
  if (member) {
    playerStats.innerHTML = `
      <div class="stat-box">
        <div class="stat-label">Total Points</div>
        <div class="stat-value">${(member.points || 0).toLocaleString()}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Level</div>
        <div class="stat-value">${member.level || 1}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Messages Sent</div>
        <div class="stat-value">${member.messageCount || 0}</div>
      </div>
    `;
  }
}

document.querySelectorAll('.panel-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    const tabName = e.target.dataset.tab;
    
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel-tab-content').forEach(c => c.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'leaderboard') {
      loadLeaderboard();
    } else if (tabName === 'stats') {
      updatePlayerStats();
    }
  });
});

loadChannels();
loadMembers(0);

setTimeout(() => loadMembers(Math.floor(Math.random() * 100)), 5000);
setInterval(() => {
  currentMemberPage = Math.floor(Math.random() * 100);
  loadMembers(currentMemberPage);
}, 15000);

setInterval(loadLeaderboard, 5000);
setInterval(updatePlayerStats, 3000);
