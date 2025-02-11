import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { signUpApi } from "@/api/signUpApi";
import { validateField } from "@/lib/validateFields";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from a library like Lucide
import { getPasswordStrength } from "@/utils/passwordStrength";
import { useNavigate } from "react-router-dom";

export default function StepDividerForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate()

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validate Step 1
  const handleNext = () => {
    const nameError = validateField("name", formData.name);
    const usernameError = validateField("username", formData.username);

    if (nameError || usernameError) {
      setErrors({ name: nameError, username: usernameError });
      toast.error("Please fix the errors before proceeding.");
    } else {
      setStep(2);
    }
  };

  // Handle Final Submit
  const handleSubmit = async () => {
    if (!agreed) {
      toast.error("Cannot proceed without agreeing to the Privacy & Policy.");
      return;
    }

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const res = await signUpApi(formData);
      toast.success("Sign up successful!");
      if(res!==null){
        // localStorage.setItem('accesstoken', res?.accessToken)
        navigate('/signin')
      }
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
    }
  };



  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 -mt-6 md:mt-0">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between mb-6">
          <div
            className={`w-1/2 h-2 rounded-full ${
              step === 1 ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-1/2 h-2 rounded-full ${
              step === 2 ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Form Steps with Animations */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-2"
            >
              <h2 className="text-xl font-sans font-semibold mb-4 text-center">
                Glad to have you here!
              </h2>

              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg bg-[#e0f2ca] focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

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
                  className="mt-1 block w-full px-4 py-2 border rounded-lg bg-[#e0f2ca] focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="jane123"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Next
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center">Step 2</h2>

              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg bg-[#e0f2ca] focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} 
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
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Password Strength Visualizer */}
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        passwordStrength >= i
                          ? i <= 2
                            ? "bg-red-500"
                            : i <= 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  {passwordStrength === 0
                    ? "Enter a password"
                    : passwordStrength <= 2
                    ? "Weak"
                    : passwordStrength <= 4
                    ? "Moderate"
                    : "Strong"}
                </p>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="h-4 w-4 text-green-500"
                />
                <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-blue-600 cursor-pointer">Privacy & Policy</span>
                </label>
              </div>

              {/* Back and Submit Buttons */}
              <div className="flex justify-between mt-4 rounded-lg space-x-2">
                <button
                  onClick={() => setStep(1)} // Go back to Step 1
                  className="w-1/3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  className="w-2/3 bg-green-500 rounded-lg text-white py-2  hover:bg-green-600 transition"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}