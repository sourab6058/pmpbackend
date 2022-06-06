const express = require("express");
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

const PORT = process.env.PORT || 8000;

app.use("/api/clients", clientRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/packages", packageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`User joined ${socket.id}`);
});
