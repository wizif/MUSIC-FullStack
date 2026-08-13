import userModel from "../models/userModel.js";

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@test.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin@123#";

    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`👤 Seeding admin user: ${adminEmail}...`);
      await userModel.create({
        name: "System Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log("✅ Admin user seeded successfully!");
    } else {
      // Safely check if the password needs to be updated (matches env password)
      const isMatch = await existingAdmin.comparePassword(adminPassword);
      if (!isMatch) {
        console.log(`👤 Updating admin password to match current environment configuration...`);
        existingAdmin.password = adminPassword; // Pre-save hook will hash it
        await existingAdmin.save();
        console.log("✅ Admin password updated successfully!");
      } else {
        console.log(`ℹ️ Admin user already exists and matches current password configuration`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
  }
};

export default seedAdmin;
