const express = require("express");
const db = require("../services/db");

const route = express.Router();

//to get particular client
route.get("/:id", async (req, res) => {
  const client = await db.query(
    `SELECT * FROM client WHERE id = ${req.params.id}`
  );
  res.send(client);
});

//to get all the clients
route.get("/", async (req, res) => {
  const clients = await db.query("SELECT * FROM client ORDER BY username");
  res.send(clients);
});

//to delete client
route.get("/delete/:id", async (req, res) => {
  const MySQLreply = await db.query(
    `DELETE FROM client WHERE id = ${req.params.id}`
  );
  res.send(MySQLreply);
});

route.post("/", async (req, res) => {
  console.log(req.body);
  const clientOrSeller = await db.query(
    `SELECT * FROM client WHERE (username = "${req.body.emailOrUsername}" OR email = "${req.body.usernameOrEmail}") AND password="${req.body.password}"`
  );
  res.send({ ...clientOrSeller[0], type: "client" });
});

//to update a client
route.post("/update", async (req, res) => {
  const { id, username, email, password } = req.body;
  const MySQLreply = await db.query(
    `UPDATE client SET username="${username}", email="${email}", password="${password}" WHERE id = ${id}`
  );
  res.send(req.body);
});

//to add a client
route.post("/add", async (req, res) => {
  const { username, email, password } = req.body;
  const MySQLreply = await db.query(
    `INSERT INTO client(username, email, password) VALUES("${username}", "${email}", "${password}")`
  );
  res.send(MySQLreply);
});

module.exports = route;
