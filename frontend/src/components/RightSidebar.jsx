import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUser from './SuggestedUser'

const Rightsidebar = () => {
  const { user } = useSelector(store => store.auth)
  return (
    <div className='my-10 w-[30%] pr-32'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage className="w-full h-full object-cover" src={user?.profilePicture} alt="profile_img" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Link>
        <div className='flex flex-col -gap-1'>
          <p className='font-medium text-sm'> <Link to={`/profile/${user?._id}`}>{user?.username}</Link></p>
          <span className='text-sm text-gray-500'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <SuggestedUser />
    </div>
  )
}

export default Rightsidebar