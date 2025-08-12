const socket = io();

function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('username') || '';
}

let username = getUsernameFromURL();

if (!username) {
  alert("Nome de usuário não fornecido. Voltando para página inicial.");
  window.location.href = "index.html";
} else {
  socket.emit("setUsername", username);
  document.querySelector(".container").style.display = "block";
  const linhaVertical = document.querySelector(".linha-vertical");
  if (linhaVertical) linhaVertical.style.display = "block";
}

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(senderName, messageText, senderClass) {
  const msg = document.createElement("div");
  msg.classList.add("message", senderClass);

  const nameSpan = document.createElement("strong");
  nameSpan.textContent = senderName + ": ";
  msg.appendChild(nameSpan);

  msg.appendChild(document.createTextNode(messageText));

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addSystemMessage(text) {
  const msg = document.createElement("div");
  msg.classList.add("system-message");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("Você", message, "user");
  socket.emit("sendMessage", { username, message });
  userInput.value = "";
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

socket.on("receiveMessage", ({ username: senderName, message }) => {
  addMessage(senderName, message, "bot");
});

socket.on("systemMessage", (text) => {
  addSystemMessage(text);
});
