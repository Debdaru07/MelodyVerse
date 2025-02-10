import { LogOut } from 'lucide-react';
import SignupImage from '../assets/Connect_verse_SVG.svg';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/')
  }
  return (
    <div className='w-full smooth-gradient py-1.5 px'>
      <div className="flex justify-end relative">
        <div className="mx-auto">
          <img src={SignupImage} className='mx-auto text-center' alt="Description" height={40} width={40} />
        </div>
        <div className="bg-red-500 text-right hover:bg-red-600 transition-all duration-300 px-5 py-2 rounded-lg font-semibold font-mono text-white absolute right-4"
        onClick={handleLogout}
        ><LogOut /></div>
      </div>
    </div>
  );
}

export default Navbar;