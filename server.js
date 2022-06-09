const express = require("express");
const db = require("./services/db");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

const clientRoutes = require("./routes/client");
const sellerRoutes = require("./routes/seller");
const packageRoutes = require("./routes/package");
const chatRoutes = require("./routes/chat");

const PORT = process.env.PORT || 8000;

app.use("/api/clients", clientRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/chats", chatRoutes);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`User joined ${socket.id}`);
  //Sellers chats
  let chatroom;
  socket.on("join", async ({ sender, receiver, room }, callback) => {
    console.log(room, sender, receiver);
    chatroom = room;
    socket.join(room);
    const chats = await db.query(`SELECT * FROM chat WHERE room="${room}"`);
    console.log(chats.length);
    if (chats.length === 0) {
      socket.emit("messages", [
        {
          message: "Namaste Priya Grahak",
          sender,
          receiver,
          room,
          time: new Date(),
        },
      ]);
      await db.query(
        `INSERT INTO chat(sender, receiver, message, room) VALUES(${sender}, ${receiver}, "Namaste Priya Garahk", "${room}")`
      );
    } else {
      socket.emit("messages", chats);
    }
  });
  socket.on("new-message", async (message) => {
    console.log(message, "to", message.room);
    await db.query(
      `INSERT INTO chat(sender, receiver, message, room) VALUES(${message.sender}, ${message.receiver}, "${message.message}", "${message.room}")`
    );
    let chats = await db.query(
      `SELECT * FROM chat WHERE room="${message.room}"`
    );
    console.log(message.room);
    const newMessage = { ...message, time: new Date() };
    // chats = [...chats, newMessage];
    io.to(message.room).emit("messages", chats);
  });
});
