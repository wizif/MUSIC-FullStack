import { getSoundCloudDiscovery } from './src/utils/soundcloud.js';

async function test() {
  console.log("Testing SoundCloud Discovery...");
  const tracks = await getSoundCloudDiscovery(5);
  console.log("Returned tracks count:", tracks.length);
  if (tracks.length > 0) {
    console.log("First track:", JSON.stringify(tracks[0], null, 2));
  } else {
    console.log("No tracks returned. There might be an issue with client_id or rate limiting.");
  }
}

test().catch(console.error);
