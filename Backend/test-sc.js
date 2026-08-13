import { getSoundCloudDiscovery, resolveStreamUrl } from './src/utils/soundcloud.js';

async function test() {
  console.log("Testing SoundCloud Discovery...");
  const tracks = await getSoundCloudDiscovery(5);
  console.log("Returned tracks count:", tracks.length);
  if (tracks.length > 0) {
    console.log("First track:", JSON.stringify(tracks[0], null, 2));
    
    console.log("Resolving transcoding URL to playable stream...");
    const playableUrl = await resolveStreamUrl(tracks[0].transcodingUrl);
    console.log("Resolved playableUrl:", playableUrl);
    if (playableUrl) {
      console.log("✅ Playback stream resolved successfully!");
    } else {
      console.log("❌ Failed to resolve playback stream.");
    }
  } else {
    console.log("No tracks returned.");
  }
}

test().catch(console.error);
