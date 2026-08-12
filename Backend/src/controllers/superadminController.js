import userModel from "../models/userModel.js";

// @desc    List all users with their song count
// @route   GET /api/sa-7f3k2x/users
// @access  Private/Superadmin
const listUsers = async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $lookup: {
          from: "songs",
          localField: "_id",
          foreignField: "uploader",
          as: "songs",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          songCount: { $size: "$songs" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ Error listing users:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change user role (user or admin only)
// @route   POST /api/sa-7f3k2x/set-role
// @access  Private/Superadmin
const setUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID and role are required",
      });
    }

    // Role validation: must be 'user' or 'admin' only
    if (role !== "user" && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only 'user' or 'admin' can be assigned via this API.",
      });
    }

    // Prevent superadmin from modifying/demoting themselves
    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Safety Guard: You cannot demote or change your own role.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error setting user role:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { listUsers, setUserRole };
