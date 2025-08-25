import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("✅ Connected to MongoDB");
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Disconnected from MongoDB");
    });

    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("Database URL:", process.env.MONGODB_URI ? "✅ Set" : "❌ Not set");
    
    // ✅ FIXED: Use the URI directly without appending /spotify
    // Since your MONGODB_URI already includes the database name
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🎉 MongoDB connection established successfully");
    
    // Test the connection by listing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📁 Available collections:", collections.map(c => c.name));
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1); // Exit the process if database connection fails
  }
};

export default connectDB;