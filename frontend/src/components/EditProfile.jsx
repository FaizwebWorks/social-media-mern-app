import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef();
  const { toast } = useToast();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const genderChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast({
          title: res.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto h-full max-w-4xl flex items-center pl-16 py-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="text-2xl font-medium">Edit Profile</h1>
        <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                className="w-full h-full object-cover"
                src={user?.profilePicture}
                alt="profile_img"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col -gap-1">
              <p className="font-medium text-sm">{user?.username}</p>
              <span className="text-sm text-gray-500">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            className="hidden"
            type="file"
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className="rounded-md bg-blue-500 hover:bg-blue-600 font-semibold"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-medium mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-medium mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={genderChangeHandler}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="rounded-md bg-blue-500 hover:bg-blue-600 font-semibold">
              {" "}
              <Loader2 className="mr-2 animate-spin" />
              Updating...
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="rounded-md bg-blue-500 hover:bg-blue-600 font-semibold"
            >
              Update Profile
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
