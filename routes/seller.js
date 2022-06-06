const express = require("express");
const db = require("../services/db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const route = express.Router();

//to get particular seller
route.get("/:id", async (req, res) => {
  const seller = await db.query(
    `SELECT * FROM seller WHERE id = ${req.params.id}`
  );
  res.send(seller);
});

//to get all the sellers
route.get("/", async (req, res) => {
  const sellers = await db.query("SELECT * FROM seller ORDER BY username");
  res.send(sellers);
});

//to delete seller
route.get("/delete/:id", async (req, res) => {
  const MySQLreply = await db.query(
    `DELETE FROM seller WHERE id = ${req.params.id}`
  );
  res.send(MySQLreply);
});

route.post("/", async (req, res) => {
  const seller = await db.query(
    `SELECT * FROM seller WHERE (username="${req.body.emailOrUsername}" OR email="${req.body.emailOrUsername}") AND password="${req.body.password}"`
  );
  res.send({ ...seller[0], type: "seller" });
});

//to update a seller
route.post("/update", async (req, res) => {
  const { id, username, email, password, description, address } = req.body;
  const MySQLreply = await db.query(
    `UPDATE seller SET username="${username}", email="${email}", password="${password}", description="${description}", address="${address}" WHERE id = ${id}`
  );
  res.send(req.body);
});

//to accept dp photo of a seller
route.post("/dpUpload", upload.single("dp"), async (req, res) => {
  res.send(
    `<img width="200px" height="200px" src="http://localhost:8000/uploads/${req.file.originalname}"/>`
  );
});

//to add a seller
route.post("/add", async (req, res) => {
  const { username, email, password, address, description, img_url } = req.body;
  const MySQLreply = await db.query(
    `INSERT INTO seller(username, email, password, address, description, img_url) VALUES("${username}", "${email}", "${password}", "${address}", "${description}", "${img_url}")`
  );
  res.send(MySQLreply);
});

module.exports = route;
