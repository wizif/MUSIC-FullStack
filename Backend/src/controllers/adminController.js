import userModel from "../models/userModel.js";
import songModel from "../models/songModel.js";

// @desc    List all users with their songs for admin monitoring
// @route   GET /api/admin/users
// @access  Private/Admin or Superadmin
const listUsersForAdmin = async (req, res) => {
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
          songs: {
            _id: 1,
            name: 1,
            desc: 1,
            image: 1,
            duration: 1,
          }
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
    console.error("❌ Error listing users for admin:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { listUsersForAdmin };
