import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { BookMarked, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import Comment from '@/assets/svg/comment.svg'
import Share from '@/assets/svg/share.svg'
import Bookmark from '@/assets/svg/bookmark.svg'
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'


const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { toast } = useToast()
  const { posts } = useSelector(store => store.post)
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
  const [postLike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  const dispatch = useDispatch()


  const changeEventhandler = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText("")
    }
  }

  const likeDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:3000/post/${post._id}/${action}`, { withCredentials: true })
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(updatedLikes)
        setLiked(!liked)

        // update post array
        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        )
        dispatch(setPosts(updatedPostData))
        toast({
          variant: success,
          description: res.data.message
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/post/${post._id}/addcomment`, { text }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
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

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/post/deletepost/${post?._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
        dispatch(setPosts(updatedPostData))
        toast({
          title: res.data.message
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: error.response.data.message
      })
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/post/${post._id}/bookmark`, { withCredentials: true })
      if (res.data.success) {
        toast({
          title: res.data.message
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage className="h-full w-full object-cover" src={post.author?.profilePicture} alt='User Avatar' />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className='flex gap-2 items-center'>
            <p>{post.author?.username}</p>
            {user?._id === post.author._id && <Badge variant="secondary" className="text-[10px]">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className="flex items-center flex-col text-center">
            {
              post?.author._id !== user?._id && <Button variant="ghost" className="w-fit text-red-500 hover:text-red-500 font-semibold">Unfollow</Button>
            }
            <Button onClick={bookmarkHandler} variant="ghost" className="w-fit">Add to Favourite</Button>
            {
              user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant="ghost" className="w-fit">Delete</Button>
            }
          </DialogContent>
        </Dialog>
      </div>
      <img
        className='my-3 rounded-2xl w-full aspect-square object-cover'
        src={post.image}
        alt="post_img" />

      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className="con-like">
            <input
              className="like"
              type="checkbox"
              checked={liked}
              onChange={likeDislikeHandler}
              title="like"
            />
            <div className="checkmark">
              <svg xmlns="http://www.w3.org/2000/svg" className="none" viewBox="0 0 24 24">
                <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="filled" viewBox="0 0 24 24">
                <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" className="celebrate">
                <polygon className="poly" points="10,10 20,20"></polygon>
                <polygon className="poly" points="10,50 20,50"></polygon>
                <polygon className="poly" points="20,80 30,70"></polygon>
                <polygon className="poly" points="90,10 80,20"></polygon>
                <polygon className="poly" points="90,50 80,50"></polygon>
                <polygon className="poly" points="80,80 70,70"></polygon>
              </svg>
            </div>

          </div>
          <img onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }} src={Comment} alt="comment" className='cursor-pointer' />
          <img src={Share} alt="share" className='cursor-pointer' />
        </div>
        {/* render bookmark icon conditionally */}
        <img onClick={bookmarkHandler} src={Bookmark} alt="bookmark" className='cursor-pointer' />
      </div>
      <span className='text-sm font-medium'>{postLike} likes</span>
      <p className='text-sm'>
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>
      {
        comment.length > 0 && (
          <span onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }} className='text-sm cursor-pointer text-slate-500'>View all {comment.length} comments</span>
        )
      }
      <CommentDialog open={open} setOpen={setOpen} />
      <div className='flex items-center my-1 justify-between'>
        <Input
          className="border-zinc-300"
          type="text"
          placeholder="Add a Comment..."
          value={text}
          onChange={changeEventhandler}
          // On pressing enter Comment should be posted
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              commentHandler()
              setText("")
            }
          }}

        />
        {
          text && (
            <span onClick={commentHandler} className='text-blue-500 font-medium ml-2 cursor-pointer'>Post</span>
          )
        }
      </div>
    </div>
  )
}

export default Post