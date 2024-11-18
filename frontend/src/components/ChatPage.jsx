import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setselectedUser } from '@/redux/authSlice'
import { Button } from './ui/button'
import { MessageCircleCode, Send, Share } from 'lucide-react'
import Messages from './Messages'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice'

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("")
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth)
    const { onlineUsers, messages } = useSelector(store => store.chat)
    const dispatch = useDispatch()

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:3000/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]))
                setTextMessage("")
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setselectedUser(null))
        }
    }, [])

    return (
        <div className='flex ml-[16%] h-screen'>
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-semibold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id)
                            return (
                                <div key={suggestedUser.username} onClick={() => dispatch(setselectedUser(suggestedUser))} className='flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer'>
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage className="h-full w-full object-cover" src={suggestedUser.profilePicture} alt="profile_img" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-3 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage className="h-full w-full object-cover" src={selectedUser?.profilePicture} alt="profile_picture" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && textMessage.trim()) {
                                        sendMessageHandler(selectedUser?._id)
                                    }
                                }}
                                type="text"
                                className='flex-1 mr-2 focus-visible:ring-0 focus:outline-none'
                                placeholder='Enter a message..' />
                            <Button
                                onClick={() => sendMessageHandler(selectedUser?._id)}
                                className="bg-blue-500 flex items-center justify-center gap-1 text-white font-semibold hover:bg-blue-600"
                            >Send<Send size={12} className='rotate-45' /></Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex items-center justify-center flex-col mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4 text-blue-500' />
                        <h1 className='text-3xl font-medium tracking-tight'>Send Message</h1>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage