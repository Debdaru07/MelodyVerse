import React, { useState } from "react";
import { signInApi } from "@/api/signInApi";
import { toast } from "sonner";
import { validateField } from "@/lib/validateFields";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function SigninForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate on change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const usernameError = validateField("username", formData.username);
    const passwordError = validateField("password", formData.password);

    if (usernameError || passwordError) {
    console.log("passwordError", passwordError)
      setErrors({ username: usernameError, password: passwordError });
      toast.error("Please fix the errors before submitting.");
      return;
    }
    
    try {
      const response = await signInApi(formData);
        if(response!== null){
            console.log(response)
            toast.success("Sign in successful!");
            localStorage.setItem('accesstoken', response?.accessToken)
            localStorage.setItem('isVerified', response?.isVerified)
            navigate('/dashboard')
        }
    } catch (error) {
    //   toast.error("Sign in failed. Please check your credentials and try again.");
    console.log("something went wrong")
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-60 md:mt-0">
        <div>
          <label htmlFor="username" className="block text-lg font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border rounded-lg bg-[#e0f2ca] focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Password
            </label>
            <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg bg-[#e0f2ca] focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="********"
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} {/* Toggle icon */}
            </button>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Sign In
          </button>
        </div>

        <div>
            <p className="hover:underline hover:text-green-600" onClick={()=>navigate('/resetpassword')}>Forgot your password</p>
        </div>
      </form>
    </div>
  );
}

export default SigninForm;