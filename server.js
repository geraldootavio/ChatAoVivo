import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  let username = "";

  socket.on("setUsername", (name) => {
    username = name;
    io.emit("systemMessage", `${username} entrou no chat.`);
  });

  socket.on("sendMessage", ({ username, message }) => {
    socket.broadcast.emit("receiveMessage", { username, message });
  });

  socket.on("disconnect", () => {
    if (username) {
      io.emit("systemMessage", `${username} saiu do chat.`);
      console.log(`Usuário desconectado: ${username}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
