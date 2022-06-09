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

route.get("/:type", async (req, res) => {
  let packages = [];
  console.log(req.params.type);
  packages = await db.query(
    `SELECT * FROM package WHERE type="${req.params.type}"`
  );
  res.send(packages);
});

route.get("/getPackage/:id", async (req, res) => {
  let packages = [];
  console.log(req.params.id);
  packages = await db.query(
    `SELECT * FROM package WHERE id="${req.params.id}"`
  );
  res.send(packages);
});

route.get("/", async (_, res) => {
  let packages = [];
  packages = await db.query(`SELECT * FROM package`);
  res.send(packages);
});

route.post("/addPackage", async (req, res) => {
  const { title, description, price, img_url, seller_id, type } = req.body;
  console.log(req.body);
  const MySQLReply = await db.query(
    `INSERT INTO package(title, description, price, imgs_url, seller_id, type) VALUES("${title}", "${description}", ${price}, "${img_url}", ${seller_id}, "${type}")`
  );
  res.send(MySQLReply);
});

route.post("/packageImgUpload", upload.single("pkg-img"), async (req, res) => {
  res.send(
    `<img width="200px" height="200px"  src="http://localhost:8000/uploads/${req.file.originalname}"/>`
  );
});

module.exports = route;
