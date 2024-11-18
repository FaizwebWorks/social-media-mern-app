import { Outlet } from "react-router-dom"
import Feed from "./Feed"
import Rightsidebar from "./Rightsidebar"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"

const Home = () => {
  useGetAllPosts()
  useGetSuggestedUsers()
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <Rightsidebar />
    </div>
  )
}

export default Home
