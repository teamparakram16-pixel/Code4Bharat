import Expert from "../models/Expert/Expert.js";
import ExpressError from "../utils/expressError.js";
import Routine from "../models/Routines/Routines.js";
import Post from "../models/Post/Post.js";
import { successStoryEmail } from "../utils/sendssstorystatus.js";
import Chat from "../models/Chat/Chat.js";

// PATCH /experts/complete-profile
export const completeProfile = async (req, res) => {
  const expertId = req.user._id;
  const { profile, verificationDetails } = req.body;
  const documentUrls = req.documentUrls;

  const expert = await Expert.findById(expertId);
  if (!expert) throw new ExpressError("Expert not found", 404);

  // Update profile
  expert.profile = {
    ...expert.profile,
    ...profile,
  };

  // Update verificationDetails with document URLs
  expert.verificationDetails = {
    ...verificationDetails,
    documents: {
      identityProof: documentUrls.identityProof,
      degreeCertificate: documentUrls.degreeCertificate,
      registrationProof: documentUrls.registrationProof,
      practiceProof: documentUrls.practiceProof, // Required
    },
  };

  // Update verification status
  expert.verifications.completeProfile = true;
  expert.verifications.isDoctor = true;

  await expert.save();

  res
    .status(200)
    .json({ success: true, message: "Profile completed successfully", expert });
};


// GET /experts/doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Expert.find({
      "verifications.isDoctor": true,
    }).select(
      "_id username email profile.fullName profile.expertType profile.contactNo profile.profileImage profile.experience profile.qualifications profile.specialization profile.bio profile.languagesSpoken"
    );

    res.status(200).json({
      success: true,
      message: "All verified doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    // console.error("Error in getAllDoctors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET /experts/search/doctors

export const searchDoctors = async (req, res) => {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const doctors = await Expert.find({
    username: new RegExp(searchQuery, "i"),
    "verifications.isDoctor": true,
    // "profile.expertType": { $in: ["ayurvedic", "naturopathy"] },
  }).select(
    "_id username email profile.fullName profile.expertType profile.contactNo profile.profileImage profile.experience profile.qualifications profile.specialization profile.bio profile.languagesSpoken"
  )




  res.status(200).json({
    message: "Search results",
    success: true,
    doctors: doctors,
    userId: req.user._id,
  });
};

// GET /experts/:id
const getExpertById = async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  if (!expert) throw new ExpressError("Expert not found", 404);

  res.json(expert);
};

// PUT /experts/edit/:id
const editExpert = async (req, res) => {
  const { username, email, role, profile } = req.body;

  const updatedExpert = await Expert.findByIdAndUpdate(
    req.params.id,
    { username, email, role, profile },
    { new: true, runValidators: true }
  );

  if (!updatedExpert) throw new ExpressError("Expert not found", 404);
  res.json(updatedExpert);
};
// export const getExpertProfile = async (req, res) => {
//   const expertId = req.user._id;

//   const expert = await Expert.findById(expertId).select("-password");
//   if (!expert) throw new ExpressError("Expert not found", 404);

//   const {
//     _id,
//     username,
//     email,
//     role,
//     profile,
//     verificationDetails
//   } = expert;

//   // Only select needed data to return
//   const filteredProfile = {
//     fullName: profile.fullName,
//     profileImage: profile.profileImage,
//     bio: profile.bio,
//     expertType: profile.expertType,
//     experience: profile.experience,
//     specialization: profile.specialization,
//     qualifications: profile.qualifications,
//     languagesSpoken: profile.languagesSpoken,
//     address: {
//       city: profile.address?.city,
//       state: profile.address?.state,
//       clinicAddress: profile.address?.clinicAddress
//     }
//   };

//   const filteredVerification = {
//     registrationDetails: verificationDetails.registrationDetails,
//     gender: verificationDetails.gender,
//     dateOfBirth: verificationDetails.dateOfBirth
//   };

//   res.status(200).json({
//     success: true,
//     expert: {
//       _id,
//       username,
//       email,
//       role,
//       profile: filteredProfile,
//       verificationDetails: filteredVerification
//     }
//   });
// };

export const getExpertPosts = async (req, res) => {
  const expertId = req.params.id;
  const filter = req.query.q;

  if (!expertId) throw new ExpressError(401, "Unauthorized access");

  let posts = [];
  let routines = [];

  if (filter === "routines") {
    routines = await Routine.find({ owner: expertId }).sort({ createdAt: -1 });
    return res.status(200).json({ posts: routines });
  }

  if (filter === "general") {
    posts = await Post.find({ owner: expertId }).sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  }

  // If no filter or unknown filter, return both
  posts = await Post.find({ owner: expertId }).sort({ createdAt: -1 });
  routines = await Routine.find({ owner: expertId }).sort({ createdAt: -1 });

  // Combine and sort both by date (optional)
  const combined = [...posts, ...routines].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  return res.status(200).json({ posts: combined });
};



// GET /expert/profile
const getExpertProfile = async (req, res) => {
  try {
    const expertId = req.user?._id;
    if (!expertId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const expert = await Expert.findById(expertId).select("-resetPasswordToken -resetPasswordExpires -__v");
    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      expert,
    });
  } catch (error) {
    console.error("Error in getExpertProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


// PATCH - /experts/edit-profile
const updateProfile = async (req, res) => {
  try {
    const { newfullName, newphoneNumber, newGender, newBio } = req.body;
    const expertId = req.user._id;

    const expert = await Expert.findById(expertId);
    if (!expert)
      return res.status(400).json({ message: "Expert not Found !" });

    if (!newfullName || !newphoneNumber || !newGender || !newBio)
      return res.status(400).json({ message: "Kindly fill all the details correctly" });

    const updatedExpert = await Expert.findByIdAndUpdate(
      expertId,
      {
        "profile.fullName": newfullName,
        "profile.contactNo": newphoneNumber,
        "verificationDetails.gender": newGender,
        "profile.bio": newBio,
      },
      { new: true }
    );

    if (!updatedExpert)
      return res.status(404).json({ message: "Expert not found!" });

    return res.status(200).json({
      message: "Profile updated successfully",
      expert: updatedExpert,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Expert Bookmarked Posts
const getBookmarks = async (req, res) => {
  const expert = await Expert.findById(req.user._id).populate("bookmarks")
  if (!expert)
    return res.status(400).json({
      message: "Expert Not Found !"
    })
  console.log("Expert Bookmarks is : ", expert.bookmarks)
  res.status(200).json({ bookmarks: expert.bookmarks })
}

// Post Expert Bookmark Posts
const addBookmarks = async (req, res) => {
  const { postId } = req.params
  const expertId = req.user._id

  const expert = await Expert.findById(expertId);

  if (!expert)
    return res.status(404).json({
      message: "Expert Not Found !"
    })
  const post = await Post.findById(postId)

  if (!post)
    return res.status(404).json({
      message: "Post Not Found !"
    })

  if (expert.bookmarks.includes(postId))
    return res.status(400).json({ message: "Post already bookmarked" });

  expert.bookmarks.push(postId)
  await expert.save()

  res.status(200).json({
    message: "Post bookmarked successfully",
    bookmarks: expert.bookmarks,
  });
}

// Delete Expert Bookmark Posts
const removeBookmarks = async (req, res) => {
  const { postId } = req.params;
  const expertId = req.user._id;

  const expert = await Expert.findById(expertId);
  if (!expert)
    return res.status(404).json({ message: "Expert not Found !" })

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ message: "Post not Found !" })

  expert.bookmarks = expert.bookmarks.filter(
    (bookmarkId) => bookmarkId.toString() !== postId
  );

  await expert.save();
  res.status(200).json({
    message: "Post bookmark removed successfully",
    bookmarks: expert.bookmarks,
  });
}

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const expertId = req.user._id;

    const expert = await Expert.findById(expertId);
    if (!expert)
      return res.status(400).json({ message: "Expert not Found !" });

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Old and new passwords are required." });

    if (oldPassword === newPassword)
      return res.status(400).json({ message: "New password cannot be same as old password!" });

    expert.changePassword(oldPassword, newPassword, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Old password is incorrect or password update failed.", error: err.message });
      }
      await expert.save();
      res.status(200).json({ message: "Password changed successfully!" });
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error." });
  }

}

const sendsstorystatus = async (req, res) => {
  try {
    const { postId, doctorName, reason, receiverEmail } = req.body;
    if (!postId || !doctorName || !receiverEmail)
      return res.status(400).json({ message: "Fill all details correctly !" });

    const response = await successStoryEmail(postId, doctorName, reason, receiverEmail);

    if (!response)
      return res.status(400).json({ message: "Error sending Email to the user" });

    res.status(200).json({
      success: true,
      message: reason && reason.trim()
        ? "Rejection email sent successfully."
        : "Verification email sent successfully."
    });
  } catch (error) {
    console.log("Error sending email :", error.message)
  }

}

const establishusertoexpertchat = async (req, res) => {
  try {
      const userId = req.user._id;

      const {expertId} = req.params;


      const expert = await Expert.findById(expertId);

      if(!expert)
        return res.status(400).json({
      message:"Expert does not exist !"
    });

    let existingchat = await Chat.findOne({
      groupChat : false,
      participants : {
        $all : [
          {$elemMatch : { user: userId, userType: "User" } },
          {$elemMatch : { user: expertId, userType: "Expert" } }
        ],
      },
    });

    if(existingchat)
      return res.status(200).json({ chat: existingchat, message: "Chat already exists" });

    const newChat = new Chat({
      participants:[
        {user : userId , userType : "User"},
        {user : expertId , userType : "Expert"}
      ],
      groupChat : false,
      ownerType: "User",
      owner : userId
    });

    await newChat.save()
    

    return res.status(201).json({ chat: newChat, message: "Chat established successfully" });


  } catch (error) {
    console.error("Error establishing chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  completeProfile,
  getAllDoctors,
  searchDoctors,
  getExpertById,
  editExpert,
  getExpertProfile,
  getExpertPosts,
  updateProfile,
  getBookmarks,
  addBookmarks,
  removeBookmarks,
  changePassword,
  sendsstorystatus,
  establishusertoexpertchat
};
