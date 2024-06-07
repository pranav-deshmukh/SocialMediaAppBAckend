const express = require("express");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const postRouter = require("./routes/postRoutes");

const app = express();
const cors = require("cors");
// app.use(cors());

const corsOptions = {
  origin: "http://localhost:3001",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

// app.use(morgan("dev"));
app.use(express.json());

// This middleware can be removed as cors middleware handles it.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/post", postRouter);

module.exports = app;
