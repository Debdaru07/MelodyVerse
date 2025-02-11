import ContentComponent from '../components/FormComponent';
import SigninForm from '../components/SignInForm';
import AuthToggle from '../components/SliderComponent';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import StepDividerForm from '../components/StepDividerForm';
import logo from "../assets/connect_verse_slogan_and_logo_SVG.svg"
import musicBG from "../assets/Music_BG.jpg"

function Landing() {
    const [isSignIn, setIsSignIn] = useState(true);
  return (
    <div className='w-full h-screen py-16 md:px-10 lg:p-20 flex items-center justify-center'>
      <div className='md:rounded-3xl shadow-md w-full max-w-4xl bg-white p-4 flex flex-col md:flex-row overflow-hidden h-[80vh]'>
        <div className="rounded-2xl flex-1 min-w-0 hidden lg:block relative flex-col items-center">
          {/* Logo centered */}
          <div className="flex justify-center items-center mt-10">
            <img src={logo} className="w-[100px] h-[100px]" alt="Logo" />
          </div>
          
          {/* Image 20px below the logo */}
          <img src={musicBG} className="w-[400px] h-[300px] rounded-lg object-cover mt-8 ml-8"/>
        </div>

        {/* Button container */}
        <div className='relative flex flex-col md:flex-1 justify-center items-center w-full md:w-auto p-4'>
            <div className='absolute top-0 left-0 right-0 flex justify-center'>
                <AuthToggle setIsSignIn={setIsSignIn} isSignIn={isSignIn}/>
            </div>
            <div className=''>
            <ContentComponent>
                <AnimatePresence mode="wait">
                {isSignIn ? (
                    <motion.div
                    key="signin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <SigninForm />
                    </motion.div>
                ) : (
                    <motion.div
                    key="signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <StepDividerForm />
                    </motion.div>
                )}
                </AnimatePresence>
            </ContentComponent>
            {/* </div> */}
            </div>
            

          </div>
        </div>
      </div>
  );
}

export default Landing;