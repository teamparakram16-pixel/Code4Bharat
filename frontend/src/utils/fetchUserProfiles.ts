import axios from "axios";

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/user-profile`,{
     withCredentials : true,
    }
    );


    return response.data.user;
  } catch (error) {
    console.error("Error fetching expert profile:", error);
    throw error; 
  }
};
