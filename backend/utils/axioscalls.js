import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

const subscriptionKey = process.env.SUBSCRIPTION_KEY;
const endpoint = process.env.END_POINT;


const axiosInstance = axios.create({
    baseURL : endpoint,
    headers:{
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "Application/json",
    },
});


export default axiosInstance;