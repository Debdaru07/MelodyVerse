import Navbar from '@/components/Navbar'

function Dashboard() {
    const isVerified = localStorage.getItem('isVerified') || false;
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