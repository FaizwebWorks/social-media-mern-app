import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import FollowButton from './ui/FollowButton'

const SuggestedUser = () => {

    const { suggestedUsers } = useSelector(store => store.auth)

    return (
        <div className='my-10'>
            <div className='flex items-baseline justify-between gap-2'>
                <h1 className='font-semibold text-lg'>Suggested For You</h1>
                <span className='cursor-pointer font-medium text-slate-500'>See All</span>
            </div>
            <div className='flex flex-col gap-3 my-5'>
                {
                    suggestedUsers.map((user) => {
                        return (
                            <div key={user._id} className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <Link to={`/profile/${user?._id}`}>
                                        <Avatar>
                                            <AvatarImage className="w-full h-full object-cover" src={user?.profilePicture} alt="profile_img" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='flex flex-col -gap-1'>
                                        <p className='font-medium text-sm'> <Link to={`/profile/${user?._id}`}>{user?.username}</Link></p>
                                        {/* <span className='text-sm text-gray-500'>{user?.bio || 'Bio here...'}</span> */}
                                    </div>
                                </div>
                                {/* <button className='text-sm'>Follow</button> */}
                                <FollowButton />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SuggestedUser