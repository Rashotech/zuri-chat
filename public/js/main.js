const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
var header = document.getElementById("rooms");
var rooms = header.getElementsByClassName("room");

var username = user.username; 
var userId = user._id;

const socket = io({
    query: {
        "username": username,
        "room": room,
        "userId": userId,
        "roomName": roomName
    }
});

socket.emit('joinRoom', { username });

socket.on('message', message => {
    outputMessage(message)

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message Submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg)

    // clear message input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus(); 
})

// Output Message to the DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message self');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    chatMessages.appendChild(div);
}

window.addEventListener('DOMContentLoaded', (event) => {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].text === roomName) {
            rooms[i].className += " active";
        }
      }
});
