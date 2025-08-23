import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(null);
  const seekBg = useRef(null);
  const seekBar = useRef(null);
  const url = "http://localhost:4000"; // Backend API URL

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null); // ✅ Fixed: Start with null instead of undefined array access
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // ✅ Play audio
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  // ✅ Pause audio
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  // ✅ Play song by ID
  const playWithId = async (id) => {
    const foundSong = songsData.find(item => item._id === id);
    if (foundSong) {
      setTrack(foundSong);
      if (audioRef.current) {
        await audioRef.current.play();
        setPlayStatus(true);
      }
    }
  };

  // ✅ Play previous song
  const previous = async () => {
    if (!track || songsData.length === 0) return;
    
    const currentIndex = songsData.findIndex(item => item._id === track._id);
    if (currentIndex > 0) {
      setTrack(songsData[currentIndex - 1]);
      if (audioRef.current) {
        await audioRef.current.play();
        setPlayStatus(true);
      }
    }
  };

  // ✅ Play next song
  const next = async () => {
    if (!track || songsData.length === 0) return;
    
    const currentIndex = songsData.findIndex(item => item._id === track._id);
    if (currentIndex < songsData.length - 1) {
      setTrack(songsData[currentIndex + 1]);
      if (audioRef.current) {
        await audioRef.current.play();
        setPlayStatus(true);
      }
    }
  };

  // ✅ Seek song
  const seekSong = (e) => {
    if (audioRef.current && seekBg.current) {
      const newTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  // ✅ Fetch songs from API
  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      console.log("Songs API Response:", response.data);
      
      if (response.data && response.data.success === false) {
        console.error("Backend returned error:", response.data.message || "Unknown error");
        setSongsData([]);
        return;
      }
      
      if (response.data && response.data.songs && Array.isArray(response.data.songs)) {
        setSongsData(response.data.songs);
        if (response.data.songs.length > 0) {
          setTrack(response.data.songs[0]);
        }
      } else {
        console.error("Invalid API response structure:", response.data);
        setSongsData([]);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      setSongsData([]);
    }
  };

  // ✅ Fetch albums from API
  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      console.log("Albums API Response:", response.data);
      
      if (response.data && response.data.success === false) {
        console.error("Backend returned error:", response.data.message || "Unknown error");
        setAlbumsData([]);
        return;
      }
      
      if (response.data && response.data.albums && Array.isArray(response.data.albums)) {
        setAlbumsData(response.data.albums);
      } else {
        console.error("Invalid albums API response:", response.data);
        setAlbumsData([]);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      setAlbumsData([]);
    }
  };

  // ✅ Update seekbar and time while playing
  useEffect(() => {
    if (!audioRef.current) return;

    const updateTime = () => {
      if (audioRef.current && seekBar.current && !isNaN(audioRef.current.duration)) {
        seekBar.current.style.width =
          Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      }
    };

    audioRef.current.ontimeupdate = updateTime;
    return () => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = null;
      }
    };
  }, [track]);

  // ✅ Fetch songs and albums on mount
  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  // ✅ Provide context to components
  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;