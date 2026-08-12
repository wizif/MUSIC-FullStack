import express from "express";
import cors from "cors";
import "dotenv/config";
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";
import authRouter from "./src/routes/authRoute.js";
import superadminRouter from "./src/routes/superadminRoute.js";
import adminRouter from "./src/routes/adminRoute.js";
import soundcloudRouter from "./src/routes/soundcloudRoute.js";
import playlistRouter from "./src/routes/playlistRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(cors({
  origin: ["https://music-on-wisemen.vercel.app", "http://localhost:3000", "http://localhost:5173"], // frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// middleware
app.use(express.json());

// initializing the routes
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/auth", authRouter);
app.use("/api/sa-7f3k2x", superadminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/soundcloud", soundcloudRouter);
app.use("/api/playlist", playlistRouter);

app.listen(port, () => console.log(`Server started on ${port}`));