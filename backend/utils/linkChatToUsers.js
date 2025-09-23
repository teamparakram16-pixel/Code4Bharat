import Expert from "../models/Expert/Expert.js";
import User from "../models/User/User.js";

// Utility: Link chat to multiple users
const linkChatToUsers = async (chat, users) => {
  for (const u of users) {
    const Model = u.userType === "Expert" ? Expert : User;
    const updatedUser = await Model.findByIdAndUpdate(
      u.user,
      { $addToSet: { chats: chat._id } },
      { new: true }
    );

    if (!updatedUser) {
      throw new ExpressError(
        404,
        `User (${u.user}) not found while linking chat`
      );
    }
  }
};

export default linkChatToUsers;
