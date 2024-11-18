import sharp from "sharp";
import cloudinary from "cloudinary";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    // Validate required fields
    if (!image) return res.status(400).json({ message: "Image required" });
    // if (!caption) return res.status(400).json({ message: "Caption required" });

    // Optimize the image using Sharp
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Upload image to Cloudinary
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    // Create new post in the database
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    // update the user's post array
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured! Please try again after sometime.",
      success: false,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      posts: allPosts,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;

    const Posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
      });

    res.status(200).json({
      message: "User's Post fetched successfully",
      success: true,
      Posts,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const likePost = async (req, res) => {
  try {
    const userLikedId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Logic to like the post
    await post.updateOne({ $addToSet: { likes: userLikedId } });
    await post.save();

    // Implement socket.io for real time notification
    const user = await User.findById(userLikedId).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();
    if (postOwnerId !== userLikedId) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: userLikedId,
        userDetails: user,
        postId,
        message: "Your post has been liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const disLikePost = async (req, res) => {
  try {
    const userDisLikedId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Logic to dislike the post
    await post.updateOne({ $pull: { likes: userDisLikedId } });
    await post.save();

    // Implement socket.io for real time notification
    const user = await User.findById(userDisLikedId).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();
    if (postOwnerId !== userDisLikedId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: userDisLikedId,
        userDetails: user,
        postId,
        message: "Your post has been liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({
      message: "Post disliked successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userCommentedId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text) {
      return res.status(404).json({
        message: "Comment is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      author: userCommentedId,
      text,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    // Implement socket.io for real time notification

    return res.status(200).json({
      message: "Comment added successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const getParticularPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments) {
      return res.status(404).json({
        message: "No comments found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    // Check if the post is owned by the user
    if (post.author.toString() !== authorId) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    await Post.findByIdAndDelete(postId);

    // remove the post from the user's posts array
    await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });

    // remove the post from the comments array of the post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error => ", error.message);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post bookmarked successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error => ", error.message);
  }
};
