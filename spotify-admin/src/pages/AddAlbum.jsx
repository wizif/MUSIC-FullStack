import React, { useState } from "react";
import { assets } from "../assets/admin-assets/assets";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

const AddAlbum = () => {
  const [image, setImage] = useState(false);
  const [colour, setColour] = useState("#121212");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("bgColour", colour);

      const response = await axios.post(`${url}/api/album/add`, formData);

      if (response.data.success) {
        toast.success("Album Added Successfully");
        setName("");
        setDesc("");
        setColour("#121212");
        setImage(false);
      } else {
        toast.error("Failed to Add Album");
      }
    } catch (error) {
      toast.error("Error occured while adding album");
    }
    setLoading(false);
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  ) : (

    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
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

      <div className="flex flex-col gap-2.5">
        <p className="font-semibold text-neutral-300">Album Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="text-green-400 rounded-md bg-transparent outline-green-600 border-2 border-green-400 p-2.5 w-[40vw]"
          type="text"
          placeholder="Type Here"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="font-semibold text-neutral-300">Album Description</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          className="text-green-400 rounded-md bg-transparent outline-green-600 border-2 border-green-400 p-2.5 w-[40vw]"
          type="text"
          placeholder="Type Here"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-semibold text-neutral-300">
          Choose Background Color
        </p>
        <input
          onChange={(e) => setColour(e.target.value)}
          value={colour}
          type="color"
          className="rounded"
        />
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

export default AddAlbum;