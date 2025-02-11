import Navbar from '@/components/Navbar'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const isVerified = localStorage.getItem('isVerified') || false;
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    useEffect(()=>{
      if(!accessToken) navigate('/')  
    }, [])
  return (
    <div className='h-screen'>
        <Navbar />


        {isVerified && (
            <div className='bg-gray-50 mt-60 mx-40 p-4'>
            Verification Email has been sent. Please check your email to verify email.
            </div>
            )
        }
    </div>
  )
}

export default Dashboard