import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";
dotenv.config({ path: "./.env" });
import path from "path";

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Here comes the api
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/message", messageRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

server.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server is running on port ${process.env.PORT}`);
});
