import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM()
    useGetAllMessage()
    const { messages } = useSelector(store => store.chat)
    const { user } = useSelector(store => store.auth)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20">
                        <AvatarImage className="h-full w-full object-cover" src={selectedUser?.profilePicture} alt="profile_img" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className='mt-2 text-lg font-medium'>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant="secondary">View profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg px-4 py-2 max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

export default Messages