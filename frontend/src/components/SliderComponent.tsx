export default function AuthToggle({isSignIn, setIsSignIn}: {
    isSignIn: boolean;
    setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
}) {
  

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative space-x-4 flex bg-white border border-gray-300 rounded-full p-1 shadow-md">
        <button
          className={`px-6 py-2 text-lg font-semibold transition-all duration-300 rounded-full ${
            isSignIn
              ? "bg-green-500 text-white shadow-md"
              : "text-black hover:bg-gray-200"
          }`}
          onClick={() => setIsSignIn(true)}
        >
          Sign In
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold transition-all duration-300 rounded-full ${
            !isSignIn
              ? "bg-green-500 text-white shadow-md"
              : "text-black hover:bg-gray-200"
          }`}
          onClick={() => setIsSignIn(false)}
        >
          Sign Up
        </button>
      </div>

      <div className="mt-6 text-xl font-semibold text-black">
        {isSignIn ? "Welcome Back!" : "Join Us!"}
      </div>
    </div>
  );
}