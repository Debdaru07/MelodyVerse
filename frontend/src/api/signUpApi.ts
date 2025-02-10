import { BASE_URL } from "@/utils";
import axios from "axios"
import { toast } from "sonner";
import { ERROR_MAP } from "../utils/error_en"
export type signUpFormData = {
    name: string;
    username: string;
    email: string;
    password: string;
}

export const signUpApi = async(formData: signUpFormData) => {
    try{
        const response = await axios.post(`${BASE_URL}/signup`, {
            username: formData?.username,
            password: formData?.password,
            email: formData?.email,
            name: formData?.name,
        }, {
            headers: {
                "Content-Type": 'application/json',
            }
        })

        if (response?.data?.status !== "Success") {
            const messageKey = response?.data?.message; 
            const errorMessage = ERROR_MAP[messageKey] || "Something went wrong"; 
            toast(errorMessage);
            return null;
        }
        toast("Sign up successful🚀")
        return response?.data?.data
    }catch(err){
        toast("Something went wrong")
    }
} 