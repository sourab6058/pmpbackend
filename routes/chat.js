const express = require("express");
const db = require("../services/db");

const route = express.Router();

//o get chats bw two users
route.post("/", async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  const chats = await db.query(
    `SELECT * FROM chats WHERE from = ${sender_id} and receiver_id=${receiver_id}`
  );
  res.send(chats);
});
route.post("/chat", async (req, res) => {
  const { sender, receiver, message } = req.body;
  const MySQLResponse = await db.query(
    `INSERT INTO chat(sender, receiver, message) VALUES(${sender}, ${receiver}, "${message}") `
  );
  res.send(req.body);
});
module.exports = route;
