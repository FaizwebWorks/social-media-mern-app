import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex items-center gap-3'>
            <Avatar>
                <AvatarImage src={comment.author.profilePicture} alt="user_profile" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <h1 className='text-sm font-semibold'>{comment.author.username}: <span className='font-normal ml-1'>{comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default Comment