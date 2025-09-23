export interface Message {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    _id: string;
    profile: {
      fullName: string;
      profileImage: string;
      // Add more profile fields if needed
    };
  };
}
