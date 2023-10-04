const socket = io();

const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('message-input');
const chatContainer = document.getElementById('chatContainer');
const userList = document.getElementById('user-list');

let userName = prompt('Enter User Name');
if (!userName) {
  userName = `User${Math.floor(Math.random() * 1000 + 11)}`;
}
appendMessage('You Joined the chat', null);
socket.emit('new-user', userName);

socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`, false);
});

socket.on('user-connected', (name) => {
  appendMessage(`${name} joined the chat`, null);
});

socket.on('user-typing', (data) => {
  appendMessage(data.message, null, true);
});

socket.on('update list', (data) => {
  userList.innerHTML = '';
  data.map(function (user) {
    return addToUsersList(user);
  });
});

socket.on('user-disconnected', (data) => {
  userList.innerHTML = '';
  data.users.map(function (user) {
    return addToUsersList(user);
  });
  appendMessage(`${data.name} left the chat`, null);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!messageInput.value) {
    return;
  }
  const message = messageInput.value;
  messageInput.value = '';
  socket.emit('send-message', message);
  appendMessage(`You: ${message}`, true);
});

messageInput.addEventListener('input', handleTypeEvent);

function appendMessage(message, status, typing = false) {
  //Status: True for Send and False for Receive, null for notification broadcast
  if (typing) {
    const html = `
    <div id="hideAfterSeconds" class="broadcast">
        ${message}        
    </div>
    `;

    chatContainer.insertAdjacentHTML('beforeend', html);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return;
  }
  if (status === null) {
    const html = `
    <div class="broadcast">
        ${message}        
    </div>
    `;

    chatContainer.insertAdjacentHTML('beforeend', html);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    //window.scrollTo(0, chatContainer.scrollHeight);
    return;
  }

  const time = new Date();
  const formattedTime = time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  const html = `
    <div class="chat ${status ? 'send' : 'receive'}">
        ${message}
        <sub class="magic" style="font-size:0.8rem;">${formattedTime}</sub>
    </div>
    `;

  chatContainer.insertAdjacentHTML('beforeend', html);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addToUsersList(userName) {
  const html = `
    <li class="ms-auto me-auto mb-2 fs-5">${userName}</li>
  `;

  userList.insertAdjacentHTML('beforeend', html);
}

function handleTypeEvent() {
  socket.emit('user-typing');
  messageInput.removeEventListener('input', handleTypeEvent);
  setTimeout(() => {
    messageInput.addEventListener('input', handleTypeEvent);
  }, 10000);
}
