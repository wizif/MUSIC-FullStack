import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(null);
  const seekBg = useRef(null);
  const seekBar = useRef(null);
  const url = "http://localhost:4000"; // Backend API URL

  const [songsData, setSongsData] = useState([]); // ✅ Fixed: Changed from allSongs to songsData
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(songsData[0]);
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
  const playWithId =async (id) => {
    await songsData.map((item)=>{
      if(id===item._id){
        setTrack(item);
      }
    })
    await audioRef.current.play();
    setPlayStatus(true);
  }
    

  // ✅ Play previous song
  const previous = async() => {
    songsData.map(async(item,index)=>{

      if(track._id===item._id && index>0){
        await setTrack(songsData[index-1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
      
    })
  };

  // ✅ Play next song
  const next = async() => {
    songsData.map(async(item,index)=>{

      if(track._id===item._id && index>0){
        await setTrack(songsData[index+1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
      
    })
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
      setSongsData(response.data.songs); // ✅ Fixed: Changed from setAllSongs to setSongsData
      if (response.data.songs.length > 0) {
        setTrack(response.data.songs[0]);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  // ✅ Fetch albums from API
  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // ✅ Update seekbar and time while playing
  useEffect(() => {
    if (!audioRef.current) return;

    const updateTime = () => {
      if (audioRef.current && seekBar.current) {
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
  }, [track]); // ✅ Dependency: Runs when `track` changes

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
    songsData, // ✅ Fixed: Changed from allSongs to songsData
    albumsData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
