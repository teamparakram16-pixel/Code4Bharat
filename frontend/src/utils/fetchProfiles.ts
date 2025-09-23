import axios from "axios";

export const getExpertProfile = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/experts/expert-profile`,{
     withCredentials : true,
    }
    );

    return response.data.expert;
  } catch (error) {
    console.error("Error fetching expert profile:", error);
    throw error; 
  }
};
