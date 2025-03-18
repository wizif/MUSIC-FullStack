import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../App";
import { toast } from "react-toastify";

const ListSong = () => {
  const [data, setData] = useState([]);
  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (error) {
      toast.error("Error occured while fetching songs");
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, { id });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs();
      }
    } catch (error) {
      toast.error("Error occured while removing song");
    }
  };
  

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <p className="font-semibold text-2xl text-neutral-300">All Songs List</p>
      <br />
      <div>
        <div className="rounded-md sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b className="text-center">Name</b>
          <b className="text-center">Album</b>
          <b className="text-center">Duration</b>
          <b className="text-center">Action</b>
        </div>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="rounded-md mt-1 grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-400 text-sm mr-5"
            >
              <img className="w-12" src={item.image} alt="" />
              <p className="text-green-500 text-center">{item.name}</p>
              <p className="text-green-500 text-center">{item.album}</p>
              <p className="text-green-500 text-center">{item.duration}</p>
              <p
                onClick={() => removeSong(item._id)}
                className="text-center text-slate-300 cursor-pointer hover:bg-slate-700 hover:text-green-300 hover:rounded-lg"
              >
                x
              </p>
            </div>
          ))
        ) : (
          <p className="pl-3 pt-2 text-neutral-400">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ListSong;