import { registerUser, loginUser, getMe } from "./src/controllers/authController.js";
import userModel from "./src/models/userModel.js";
import jwt from "jsonwebtoken";

// Simple test runner
async function runTests() {
  console.log("🧪 Starting Backend Auth Controller Unit Tests...");
  process.env.JWT_SECRET = "test_jwt_secret_123456";

  let mockDb = [];

  // Mock userModel methods
  userModel.findOne = async ({ email }) => {
    return mockDb.find((u) => u.email === email) || null;
  };

  userModel.create = async ({ name, email, password, role }) => {
    const newUser = {
      _id: "mock_id_" + Date.now(),
      name,
      email,
      password, // in real it hashes, we mock compare
      role,
      createdAt: new Date(),
      comparePassword: async (pass) => pass === password,
    };
    mockDb.push(newUser);
    return newUser;
  };

  userModel.findById = (id) => {
    const u = mockDb.find((user) => user._id === id);
    return {
      select: (str) => {
        if (str === "-password") {
          const { password, ...withoutPassword } = u || {};
          return withoutPassword;
        }
        return u;
      },
    };
  };

  // Test 1: Register User
  console.log("\n--- Test 1: Register User ---");
  const reqRegister = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "securepassword",
      role: "admin", // testing role override
    },
  };
  let resStatus, resJson;
  const resRegister = {
    status: (code) => {
      resStatus = code;
      return resRegister;
    },
    json: (data) => {
      resJson = data;
      return resRegister;
    },
  };

  await registerUser(reqRegister, resRegister);
  console.log("Response JSON:", resJson);
  if (resJson.success && resJson.user.role === "user") {
    console.log("✅ Register user test passed! Role correctly forced to 'user'.");
  } else {
    console.error("❌ Register user test failed!");
  }

  // Test 2: Register Duplicate User
  console.log("\n--- Test 2: Register Duplicate User ---");
  let dupStatus, dupJson;
  const resDup = {
    status: (code) => {
      dupStatus = code;
      return resDup;
    },
    json: (data) => {
      dupJson = data;
      return resDup;
    },
  };
  await registerUser(reqRegister, resDup);
  console.log("Status Code (expected 400):", dupStatus);
  console.log("Response JSON:", dupJson);
  if (dupStatus === 400 && !dupJson.success) {
    console.log("✅ Duplicate register validation passed.");
  } else {
    console.error("❌ Duplicate register validation failed.");
  }

  // Test 3: Login User (Success)
  console.log("\n--- Test 3: Login User (Success) ---");
  const reqLogin = {
    body: {
      email: "john@example.com",
      password: "securepassword",
    },
  };
  let loginJson;
  const resLogin = {
    json: (data) => {
      loginJson = data;
      return resLogin;
    },
  };
  await loginUser(reqLogin, resLogin);
  console.log("Response JSON:", loginJson);
  if (loginJson.success && loginJson.token) {
    console.log("✅ Login user test passed.");
  } else {
    console.error("❌ Login user test failed.");
  }

  // Test 4: Login User (Failure - invalid password)
  console.log("\n--- Test 4: Login User (Failure) ---");
  const reqLoginFail = {
    body: {
      email: "john@example.com",
      password: "wrongpassword",
    },
  };
  let failStatus, failJson;
  const resLoginFail = {
    status: (code) => {
      failStatus = code;
      return resLoginFail;
    },
    json: (data) => {
      failJson = data;
      return resLoginFail;
    },
  };
  await loginUser(reqLoginFail, resLoginFail);
  console.log("Status Code (expected 401):", failStatus);
  console.log("Response JSON:", failJson);
  if (failStatus === 401 && !failJson.success && failJson.message === "Invalid credentials") {
    console.log("✅ Login failure test passed.");
  } else {
    console.error("❌ Login failure test failed.");
  }

  // Test 5: getMe Protected Route
  console.log("\n--- Test 5: getMe Route ---");
  const reqMe = {
    userId: loginJson.user._id,
  };
  let meJson;
  const resMe = {
    json: (data) => {
      meJson = data;
      return resMe;
    },
  };
  await getMe(reqMe, resMe);
  console.log("Response JSON:", meJson);
  if (meJson.success && meJson.user.email === "john@example.com" && meJson.user.password === undefined) {
    console.log("✅ getMe test passed (returned user info, excluded password).");
  } else {
    console.error("❌ getMe test failed.");
  }

  console.log("\n🎉 All auth unit tests completed.");
}

runTests().catch(console.error);
