import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("")
    const { toast } = useToast()
    const dispatch = useDispatch()
    const { selectedPost, posts } = useSelector(store => store.post)
    const [comment, setComment] = useState([])

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments)
        }
    }, [selectedPost])


    const changeEventHandler = (e) => {
        const inputText = e.target.value
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const addCommentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/post/${selectedPost?._id}/addcomment`, { text }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            if (res.data.success) {
                const updatedCommentdata = [...comment, res.data.comment]
                setComment(updatedCommentdata)

                const updatedPostData = posts.map(p =>
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentdata } : p
                )

                dispatch(setPosts(updatedPostData))
                setText("")

                toast({
                    description: res.data.message
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <div className='flex flex-1 max-h-[40rem]'>
                    <div className='w-1/2'>
                        <img
                            src={selectedPost?.image}
                            alt="post_img"
                            className='w-full h-full object-cover rounded-l-lg '
                        />
                    </div>
                    <div className='flex w-1/2 flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex items-center gap-3'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage className="h-full w-full object-cover" src={selectedPost?.author?.profilePicture} alt="post_img" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link><span className='font-semibold text-sm'>{selectedPost?.author?.username}</span></Link>
                                </div>
                                {/* <span className='text-slate-400 text-sm'>Caption here...</span> */}
                            </div>

                            {/*  Start from here  -------------  One more Dialog here  */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="flex items-center flex-col">
                                    <Button variant="ghost" className="w-fit text-red-500 font-semibold hover:text-red-500">Unfollow</Button>
                                    <Button variant="ghost" className="w-fit">Add to Favourite</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto h-full p-4'>
                            {
                                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }
                        </div>
                        <div className='p-4 flex items-center justify-between gap-4'>
                            <Input type="text" value={text} onChange={changeEventHandler} onKeyDown={(e) => {
                                if (e.key === "Enter" && text.trim()) {
                                    addCommentHandler()
                                    setText("")
                                }
                            }} placeholder="Add a Comment..." className="" />
                            <Button variant="oultine" disabled={!text.trim()} onClick={addCommentHandler} className="border border-blue-500 px-5 text-blue-500 font-semibold">Add Comment</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog


