import useGetUserProfile from "@/hooks/useGetUserProfile"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "./ui/button"
import { useState } from "react"
import { Heart, MessageCircle } from "lucide-react"

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')

  const { userProfile, user } = useSelector(store => store.auth)

  const isLoggedInUserProfile = user?._id === userProfile?._id
  const isFollowing = false

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks


  return (
    <div className="max-w-5xl px-20 h-screen pl-24 pt-10 justify-center mx-auto">
      <div className="flex justify-between">
        <section>
          <Avatar className="h-32 w-32">
            <AvatarImage className="h-full w-full object-cover" src={userProfile?.profilePicture} alt="profile_img" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </section>
        <section className="flex items-center gap-4">
          <span className="font-medium text-3xl">{userProfile?.username}</span>
          {
            isLoggedInUserProfile ? (
              <>
                <Link to="/account/edit">
                  <Button className="bg-blue-500 font-semibold hover:bg-blue-600">Edit Profile</Button>
                </Link>
              </>
            ) : (
              isFollowing ? (
                <div className="flex items-center gap-4">
                  <Button className="bg-transparent border border-zinc-800 hover:bg-slate-50 text-red-500 font-semibold">Unfollow</Button>
                  <button class="message">
                    <svg
                      style={{ color: "white" }}
                      class="message-svg"
                      viewBox="0,0,256,256"
                      y="0px"
                      x="0px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        style={{ mixBlendMode: "normal" }}
                        text-anchor="none"
                        font-size="none"
                        font-weight="none"
                        font-family="none"
                        stroke-dashoffset="0"
                        stroke-dasharray=""
                        stroke-miterlimit="10"
                        stroke-linejoin="miter"
                        stroke-linecap="butt"
                        stroke-width="1"
                        stroke="none"
                        fill-rule="nonzero"
                        fill="#ffffff"
                      >
                        <g transform="scale(5.12,5.12)">
                          <path
                            d="M46.137,6.552c-0.75,-0.636 -1.928,-0.727 -3.146,-0.238h-0.002c-1.281,0.514 -36.261,15.518 -37.685,16.131c-0.259,0.09 -2.521,0.934 -2.288,2.814c0.208,1.695 2.026,2.397 2.248,2.478l8.893,3.045c0.59,1.964 2.765,9.21 3.246,10.758c0.3,0.965 0.789,2.233 1.646,2.494c0.752,0.29 1.5,0.025 1.984,-0.355l5.437,-5.043l8.777,6.845l0.209,0.125c0.596,0.264 1.167,0.396 1.712,0.396c0.421,0 0.825,-0.079 1.211,-0.237c1.315,-0.54 1.841,-1.793 1.896,-1.935l6.556,-34.077c0.4,-1.82 -0.156,-2.746 -0.694,-3.201zM22,32l-3,8l-3,-10l23,-17z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                    <span class="message-text">Message</span>
                  </button>
                </div>
              ) : (
                <Button className="bg-blue-500 font-semibold hover:bg-blue-600">Follow</Button>
              )
            )
          }
        </section>
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium">{userProfile?.posts.length}</p>
            <p className="font-medium">Posts</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium">{userProfile?.followers.length}</p>
            <p className="font-medium">Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium">{userProfile?.following.length}</p>
            <p className="font-medium">Following</p>
          </div>
        </div>
      </div >
      <div className="h-24 flex flex-col gap-2 w-full py-5">
        <p className="text-xl font-medium">{userProfile?.username}</p>
        <p className="w-[35%] min-h-32">
          {
            userProfile.bio ? (
              <p>{userProfile.bio}</p>
            ) : (
              <p className="text-slate-500">Bio...</p>
            )
          }
        </p>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center w-full">
            <div onClick={() => handleTabChange('posts')} className={`w-1/2 py-3 flex items-center justify-center cursor-pointer rounded-xl mt-3 ${activeTab === 'posts' ? 'font-medium bg-blue-50' : ''}`}>POSTS</div>
            <div onClick={() => handleTabChange('saved')} className={`w-1/2 py-3 flex items-center justify-center cursor-pointer rounded-xl mt-3 ${activeTab === 'saved' ? 'font-medium bg-blue-50' : ''}`}>SAVED</div>
          </div>
          <div className="grid grid-cols-3 gap-4 my-4">
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className="relative group cursor-pointer rounded-3xl overflow-hidden aspect-square">
                    <img className="h-full w-full object-cover" src={post.image} alt="post_img" />
                    <div className="absolute inset-0 flex items-center gap-6 justify-center bg-transparent opacity-0 group-hover:opacity-100 group-hover:bg-zinc-900 group-hover:bg-opacity-50 group-hover:transition-all group-hover:duration-200">
                      <div className="flex text-white items-center gap-2 ">
                        <Heart />
                        <span className="text-lg font-semibold">{post?.likes.length}</span>
                      </div>
                      <div className="flex text-white items-center gap-2 ">
                        <MessageCircle />
                        <span className="text-lg font-semibold">{post?.comments.length}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default Profile
