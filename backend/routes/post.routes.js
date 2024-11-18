import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, disLikePost, getAllPosts, getParticularPostComments, getUserPosts, likePost } from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post( isAuthenticated, upload.single("image"), addNewPost);
router.route("/allposts").get( isAuthenticated, getAllPosts);
router.route("/userposts/all").get( isAuthenticated, getUserPosts);
router.route("/:id/like").get( isAuthenticated, likePost);
router.route("/:id/dislike").get( isAuthenticated, disLikePost);
router.route("/:id/addcomment").post( isAuthenticated, addComment);
router.route("/:id/get-particular-post-comments").get( isAuthenticated, getParticularPostComments);
router.route("/deletepost/:id").delete( isAuthenticated, deletePost);
router.route("/:id/bookmark").get( isAuthenticated, bookmarkPost);

export default router;


// router.post("/", async (req, res, next) => {
//     try {
//         let {username, email, password} = req.body
        
//     } catch (error) {
//      console.log(error)   
//     }
// })