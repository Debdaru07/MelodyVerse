import { BASE_URL } from "@/utils";
import { ERROR_MAP } from "@/utils/error_en";
import axios from "axios"
import { toast } from "sonner";


export const resetPasswordApi = async(username: string) => {
    try{
        const response = await axios.post(`${BASE_URL}/reset-email`, {
            email: username
        }, {
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (response?.data?.status !== "Success") {
            const messageKey = response?.data?.message; 
            console.log("messageKey", messageKey)
            const errorMessage = ERROR_MAP[messageKey] || "Something went wrong"; 
            toast.error(errorMessage);
            return null;
        }
        toast.success("Password reset email sent")
        return response?.data?.data
    }catch(err){
        toast.error("Something went wrong")
    }
} 
