import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { fileToDataUrl } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef()
    const [file, setFile] = useState("")
    const [caption, setCaption] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch()


    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file)
            const dataUrl = await fileToDataUrl(file)
            setImagePreview(dataUrl)
        }
    } 

    const createPostHandler = async (e) => {
        const formData = new FormData()
        formData.append("caption", caption)
        if (file) formData.append("image", file)
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:3000/post/addpost", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]))
                toast({
                    title: res.data.message,
                })
                setLoading(false)
                setFile('')
                setCaption('')
                setImagePreview('')
                setOpen(false)
            }
        } catch (error) {
            toast({
                title: error.response.data.message,
            })
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className="text-center font-medium">Create Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage className="h-full w-full object-cover" src={user?.profilePicture} alt="" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='text-xs font-medium'>{user?.username}</h1>
                    </div>
                </div>
                <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
                {
                    imagePreview && (
                        <div className='aspect-square rounded-2xl overflow-hidden'>
                            <img className='h-full w-full object-cover' src={imagePreview} alt="preview_img" />
                        </div>
                    )
                }
                <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                {
                    !imagePreview && (
                        <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto">Select Image</Button>
                    )
                }
                {
                    imagePreview && (
                        loading ? (
                            <Button className="w-full font-medium create-post-btn">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={createPostHandler} type="submit" className="w-full font-medium create-post-btn">Create Post</Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost