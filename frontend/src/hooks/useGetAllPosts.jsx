import { setPosts } from "@/redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllPosts = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get("http://localhost:3000/post/allposts", { withCredentials: true })
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPost()
    }, [])
}

export default useGetAllPosts