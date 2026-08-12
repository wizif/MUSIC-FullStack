import { addSong, getMySongs, removeSong } from "./src/controllers/songController.js";
import songModel from "./src/models/songModel.js";

async function runTests() {
  console.log("🧪 Starting Backend Song Controller Unit Tests...");

  let mockDb = [
    { _id: "song_1", name: "Song 1", uploader: "user_abc", album: "" },
    { _id: "song_2", name: "Song 2", uploader: "user_xyz", album: "" },
  ];

  // Mock songModel countDocuments
  songModel.countDocuments = async (query) => {
    return mockDb.filter(s => s.uploader === query.uploader).length;
  };

  // Mock songModel find
  songModel.find = async (query) => {
    if (query && query.uploader) {
      return mockDb.filter(s => s.uploader === query.uploader);
    }
    return mockDb;
  };

  // Mock songModel findById
  songModel.findById = async (id) => {
    return mockDb.find(s => s._id === id) || null;
  };

  // Mock songModel findByIdAndDelete
  songModel.findByIdAndDelete = async (id) => {
    mockDb = mockDb.filter(s => s._id !== id);
    return true;
  };

  // Test 1: getMySongs
  console.log("\n--- Test 1: getMySongs ---");
  const req1 = { user: { _id: "user_abc" } };
  let json1;
  const res1 = {
    json: (data) => {
      json1 = data;
      return res1;
    },
  };
  await getMySongs(req1, res1);
  console.log("Response JSON:", json1);
  if (json1.success && json1.songs.length === 1 && json1.songs[0]._id === "song_1") {
    console.log("✅ Passed");
  } else {
    console.error("❌ Failed");
  }

  // Test 2: addSong - limit reached
  console.log("\n--- Test 2: addSong - limit reached ---");
  // Fill user_abc's limit to 10
  for (let i = 0; i < 9; i++) {
    mockDb.push({ _id: `song_abc_${i}`, name: `Song abc ${i}`, uploader: "user_abc" });
  }
  const req2 = { user: { _id: "user_abc" }, body: { name: "Extra Song", desc: "limit test" } };
  let json2;
  const res2 = {
    json: (data) => {
      json2 = data;
      return res2;
    },
  };
  await addSong(req2, res2);
  console.log("Response JSON:", json2);
  if (!json2.success && json2.message.includes("Upload limit reached")) {
    console.log("✅ Passed (blocked upload before Cloudinary call)");
  } else {
    console.error("❌ Failed");
  }

  // Test 3: removeSong - unauthorized
  console.log("\n--- Test 3: removeSong - unauthorized ---");
  const req3 = { user: { _id: "user_abc", role: "user" }, body: { id: "song_2" } }; // song_2 belongs to user_xyz
  let status3, json3;
  const res3 = {
    status: (code) => {
      status3 = code;
      return res3;
    },
    json: (data) => {
      json3 = data;
      return res3;
    },
  };
  await removeSong(req3, res3);
  console.log("Status Code (expected 403):", status3);
  console.log("Response JSON:", json3);
  if (status3 === 403 && !json3.success) {
    console.log("✅ Passed (correctly blocked unauthorized delete)");
  } else {
    console.error("❌ Failed");
  }

  // Test 4: removeSong - authorized (owner)
  console.log("\n--- Test 4: removeSong - authorized (owner) ---");
  const req4 = { user: { _id: "user_abc", role: "user" }, body: { id: "song_1" } }; // song_1 belongs to user_abc
  let json4;
  const res4 = {
    json: (data) => {
      json4 = data;
      return res4;
    },
  };
  await removeSong(req4, res4);
  console.log("Response JSON:", json4);
  const foundInDb = mockDb.some(s => s._id === "song_1");
  console.log("Song exists in DB (expected false):", foundInDb);
  if (json4.success && !foundInDb) {
    console.log("✅ Passed");
  } else {
    console.error("❌ Failed");
  }

  // Test 5: removeSong - authorized (admin role)
  console.log("\n--- Test 5: removeSong - authorized (admin) ---");
  const req5 = { user: { _id: "admin_user", role: "admin" }, body: { id: "song_2" } }; // song_2 belongs to user_xyz
  let json5;
  const res5 = {
    json: (data) => {
      json5 = data;
      return res5;
    },
  };
  await removeSong(req5, res5);
  console.log("Response JSON:", json5);
  const foundInDb2 = mockDb.some(s => s._id === "song_2");
  console.log("Song exists in DB (expected false):", foundInDb2);
  if (json5.success && !foundInDb2) {
    console.log("✅ Passed");
  } else {
    console.error("❌ Failed");
  }

  console.log("\n🎉 All song controller tests completed.");
}

runTests().catch(console.error);
