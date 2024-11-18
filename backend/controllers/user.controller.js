import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Email already exists, Try different email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log("Error while registering", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY); By default, the token will not expire.
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    }); // Token that has an expiration time of 1 day (24 hours).

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Error while Login", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks");
    return res.status(201).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error while fetching profile", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      if (!profilePicture.buffer) {
        return res.status(400).json({
          message: "Invalid profile picture",
          success: false,
        });
      }
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated Successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    // if (!suggestedUsers.length) {
    //   return res.status(400).json({
    //     message: "Currently no suggested users",
    //     success: false,
    //   });
    // }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const userWhoFollows = req.id;
    const toFollow = req.params.id;
    if (userWhoFollows === toFollow) {
      return res.status(400).json({
        message: "You cannot Follow/Unfollow Yourself",
        success: false,
      });
    }

    const user = await User.findById(userWhoFollows);
    const targetedUser = await User.findById(toFollow);

    if (!user || !targetedUser) {
      return res.status(400).json({
        message: "User not found!",
        success: false,
      });
    }

    // now will check user has to follow or unfollow
    const isFollowing = user.following && user.following.includes(toFollow);

    if (isFollowing) {
      // unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: userWhoFollows },
          { $pull: { following: toFollow } }
        ),
        User.updateOne(
          { _id: toFollow },
          { $pull: { followers: userWhoFollows } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed Successfully", success: true });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: userWhoFollows },
          { $push: { following: toFollow } }
        ),
        User.updateOne(
          { _id: toFollow },
          { $push: { followers: userWhoFollows } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed Successfully", success: true });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
