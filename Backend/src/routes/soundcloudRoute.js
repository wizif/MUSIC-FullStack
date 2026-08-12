import express from 'express';
import { 
  searchSoundCloudTracks, 
  getSoundCloudDiscovery, 
  resolveStreamUrl 
} from '../utils/soundcloud.js';

const soundcloudRouter = express.Router();

// Search SoundCloud tracks
soundcloudRouter.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }
    const tracks = await searchSoundCloudTracks(q, 10);
    res.json({ success: true, tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get SoundCloud discovery charts
soundcloudRouter.get('/discovery', async (req, res) => {
  try {
    const tracks = await getSoundCloudDiscovery(12);
    res.json({ success: true, tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Resolve SoundCloud media transcoding to direct playback URL
soundcloudRouter.get('/stream', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Transcoding url is required' });
    }
    const playableUrl = await resolveStreamUrl(url);
    if (!playableUrl) {
      return res.status(404).json({ success: false, message: 'Could not resolve stream URL' });
    }
    res.json({ success: true, playableUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default soundcloudRouter;
