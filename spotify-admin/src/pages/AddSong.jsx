import React, { useEffect, useState } from "react";
import { assets } from "../assets/admin-assets/assets";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

const AddSong = () => {
  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);

      const response = await axios.post(`${url}/api/song/add`, formData);

      if (response.data.success) {
        toast.success("Song Added Successfully");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
      } else {
        toast.error("Failed to Add Song");
      }
    } catch (error) {
      toast.error("Error occured while adding song");
    }
    setLoading(false);
  };

  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setAlbumData(response.data.albums);
      } else {
        toast.error("Unable to load album data");
      }
    } catch (error) {
      toast.error("Error occured while fetching album data");
    }
  };

  useEffect(() => {
    loadAlbumData();
  }, []);

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-neutral-300">Upload Song</p>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              className="w-24 cursor-pointer"
              src={song ? assets.upload_added : assets.upload_song}
              alt=""
            />
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-neutral-300">Upload Image</p>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              className="w-24 cursor-pointer"
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="font-semibold text-neutral-300">Song Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="text-green-400 rounded-md bg-transparent outline-green-600 border-2 border-green-400 p-2.5 w-[40vw]"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="font-semibold text-neutral-300">Song Description</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          className="text-green-400 rounded-md bg-transparent outline-green-600 border-2 border-green-400 p-2.5 w-[40vw]"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="font-semibold text-neutral-300">Album</p>
        <select
          onChange={(e) => setAlbum(e.target.value)}
          defaultValue={album}
          className="text-green-400 rounded-md bg-transparent outline-gray-600 border-2 border-green-400 p-2.5 w-[150px]"
        >
          <option className="text-green-400 bg-[#141b2a]" value="none">
            None
          </option>
          {albumData.map((item, index) => (
            <option
              key={index}
              className="text-green-400 bg-[#141b2a]"
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="font-semibold text-[18px] bg-gradient-to-r from-green-200 via-green-300 to-blue-500 text-neutral-900 py-2.5 px-12 cursor-pointer rounded-md"
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default AddSong;
