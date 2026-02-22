import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, User, Mail } from "lucide-react";
const Profilepage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilepic: base64Image });
    };
  };
  return (
    // Not responsive desktop screen friendly
    <>
      <div className="screen  ">
        <div className="w-1/2 container flex flex-col mt-8 mx-auto bg-slate-400 rounded-lg align-center justify-center">
          <div className="top flex flex-col  ">
            <img
              src={
                selectedImg ||
                authUser.profilepic ||
                "https://images.pexels.com/photos/247478/pexels-photo-247478.jpeg?cs=srgb&dl=clouds-cloudy-conifers-247478.jpg&fm=jpg"
              }
              alt=""
              className="w-48 h-48 mx-auto rounded-full my-6 border border-8 border-slate-100"
            />
            <label
              htmlFor="avatar-upload"
              className={!isUpdatingProfile ? "mx-96 -my-9" : ""}
            >
              <Camera className="" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <div className="bottom flex flex-col">
            <p className=" mt-16 mb-6 px-5 py-3 text-left  mx-6 h-12 bg-white rounded-md border-3 border-e-slate-950">
              {authUser.fullname}
            </p>
            <p className=" mb-6 px-5 py-3 text-left  mx-6 h-12 bg-white rounded-md border-3 border-e-slate-950">
              {authUser.email}
            </p>
          </div>
          <div className="last flex flex-col">
            {" "}
            <span className="mt-9 mx-6">timestamps</span>
            <hr className="mx-6 mt-3 mb-3" />
            <span className="mb-6 mx-6 ">Status</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profilepage;
