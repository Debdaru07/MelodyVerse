import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing'
import { Toaster } from "@/components/ui/sonner"
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
function App() {

  return (
   <div>
    <Router>
      <Toaster />
      <Routes>
        <Route path='/' element={<Landing />}/>
        {/* <Route path='/signup' element={<Signup />}/> */}
        <Route path='/resetpassword' element={<ResetPassword />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </Router>
   </div>
  )
}

export default App
