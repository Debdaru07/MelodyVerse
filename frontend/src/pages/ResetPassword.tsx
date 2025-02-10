import React, { useState } from 'react'
import SignupImage  from '../assets/Connect_verse_SVG.svg';
import { validateField } from '@/lib/validateFields';
import { resetPasswordApi } from '@/api/resetPasswordApi';
import { toast } from 'sonner';

function ResetPassword() {
    const [username, setUserName] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserName(value);
    
        // Validate on change
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      };

    const handleSubmit = async() =>{
        if(!username){
            toast.error("Enter a valid username")
            return;
        }
        const res = await resetPasswordApi(username)
        if(!res === null) toast.success("If your email is registered with us, You will het an email")
    };
  return (
    <div className='px-20 py-60'>
        <div className='bg-white min-h-[30vh] p-10 rounded-lg space-y-2 px-20'>
            <img src={SignupImage} className='mx-auto text-center' alt="Description" height={40} width={40}/>
            <p className='font-semibold text-center text-3xl'>Reset Your Password</p>
            <p className='text-xl mt-2'>Enter the email address linked to your Spotify account and we'll send you an email.</p>
            <div className='border-gray-100 mt-4 border p-4 rounded-lg'>
                <label htmlFor="username" className="block text-lg font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    className="mt-2 block w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your username"
                />
                <button className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleSubmit}
                >
                    Send Link
                </button>
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>
        </div>
    </div>
  )
}

export default ResetPassword