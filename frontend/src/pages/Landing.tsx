import ContentComponent from '../components/FormComponent';
import SigninForm from '../components/SignInForm';
import AuthToggle from '../components/SliderComponent';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import StepDividerForm from '../components/StepDividerForm';
import image from "../assets/premium_photo-1677583195355-6228c24541a1.avif"

function Landing() {
    const [isSignIn, setIsSignIn] = useState(true);
  return (
    <div className='w-full h-screen py-16 md:px-10 lg:p-20 flex items-center justify-center'>
      <div className='md:rounded-3xl shadow-md w-full max-w-4xl bg-white p-4 flex flex-col md:flex-row overflow-hidden h-[80vh]'>
        {/* Image div */}
        <div className='bg-red-50 rounded-2xl flex-1 min-w-0 hidden lg:block p-6'>
          <img src={image} className='w-full h-full rounded-lg'/>
        </div>

        {/* Button container */}
        <div className='relative flex flex-col md:flex-1 justify-center items-center w-full md:w-auto p-4 bg-gray-50'>
            <div className='absolute top-0 left-0 right-0 flex justify-center'>
                <AuthToggle setIsSignIn={setIsSignIn} isSignIn={isSignIn}/>
            </div>
          
            <div className=''>
                {/* <div className="w-full md:w-[250px] flex flex-col space-y-2"> */}
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