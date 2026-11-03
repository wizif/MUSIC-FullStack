import mongoose from "mongoose";
import seedAdmin from "./seedAdmin.js";

const connectDB = async () => {
  try {
    // Connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("✅ Connected to MongoDB");
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Disconnected from MongoDB");
    });

    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI environment variable is not set in Backend/.env");
      return;
    }

    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("Database URL:", process.env.MONGODB_URI ? "✅ Set" : "❌ Not set");
    
    // Connect with 5-second timeout to avoid 30s buffering hangs
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🎉 MongoDB connection established successfully");
    
    // Seed admin credentials
    await seedAdmin();
    
    // Test the connection by listing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📁 Available collections:", collections.map(c => c.name));
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error message:", error.message);
    if (error.message.includes("ENOTFOUND")) {
      console.error("👉 Reason: The MongoDB cluster domain does not exist or cannot be resolved. Check if your MongoDB Atlas cluster is paused, deleted, or if the connection string in Backend/.env has a typo.");
    }
  }
};

export default connectDB;
