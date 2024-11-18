import Home from "../assets/icons/Home.jsx";
import Notification from "../assets/icons/Heart.jsx";
import Message from "../assets/icons/Message.jsx";
import Create from "../assets/icons/Plus.jsx";
import Logout from "../assets/icons/Logout.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast.js";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice.js";
import { useState } from "react";
import CreatePost from "./CreatePost.jsx";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx";
import { Button } from "./ui/button.jsx";

const LeftSidebar = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  const { likeNotification } = useSelector(store => store.realTimeNotification)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const logoutHandler = async () => {
    // Implement logout logic here
    try {
      const res = await axios.get("http://localhost:3000/user/logout", { withCredentials: true })
      if (res.data.message) {
        dispatch(setAuthUser(null))
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))
        navigate("/login")
        toast({
          title: res.data.message,
          variant: "success",
          position: "bottom"
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const sidebarHandler = async (nameType) => {
    if (nameType === "Logout") {
      logoutHandler()
    } else if (nameType === "Create") {
      setOpen(true)
    } else if (nameType === user?.username) {
      navigate(`/profile/${user?._id}`)
    } else if (nameType === "Home") {
      navigate("/")
    } else if (nameType === "Messages") {
      navigate("/chat")
    }
  }

  const sidebarItems = [
    {
      name: "Home",
      icon: <Home />,
    },
    // {
    //   name: "Search",
    //   icon: <Search />,
    // },
    // {
    //   name: "Explore",
    //   icon: <Explore />,
    // },
    {
      name: "Notifications",
      icon: <Notification />,
    },
    {
      name: "Messages",
      icon: <Message />,
    },
    {
      name: "Create",
      icon: <Create />,
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage className="h-full w-full object-cover" src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ),
      name: user?.username,
    },
    {
      icon: <Logout />,
      name: "Logout",
    }
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        <div>

          {sidebarItems.map((item) => {
            return (
              <div onClick={() => sidebarHandler(item.name)} key={item.name} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2">
                {item.icon}
                <span>{item.name}</span>
                {
                  item.name === 'Notifications' && likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size='icon' className="rounded-full bg-red-500 text-white font-semibold flex items-center justify-center hover:bg-red-600 h-5 w-5 absolute bottom-6 left-6">{likeNotification.length}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="absolute">
                        <div>
                          {
                            likeNotification.length === 0 ? (<p>No new Notification</p>) : (
                              likeNotification.map((notification) => {
                                return (
                                  <div key={notification.userId} className="flex items-center gap-2 my-3">
                                    <Avatar>
                                      <AvatarImage className="h-full w-full object-cover" src={notification.userDetails?.profilePicture} alt="profile_img" />
                                      <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm"><span className="font-semibold">{notification.userDetails?.username}</span> liked your post</p>
                                  </div>
                                )
                              })
                            )
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                }
              </div>
            )
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
