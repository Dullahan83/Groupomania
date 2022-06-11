import Auth from './pages/Auth/Auth'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import GlobalStyle from './utils/style/GlobalStyle'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { userContext } from './utils/context/userContext'
import { isExpired, decodeToken } from 'react-jwt'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'
function App() {
  const [token, setToken] = useState(Cookies.get('token'))
  const decodedToken = decodeToken(token)

  const [userId, setUserId] = useState(decodedToken.userId)
  const [hasPerm, setHasPerm] = useState(decodedToken.perm)
  const [hasComments, setHasComments] = useState(false)
  const [refreshPubli, setRefreshPubli] = useState(false)
  return (
    <div>
      <userContext.Provider
        value={{
          refreshPubli,
          setRefreshPubli,
          userId,
          hasPerm,
          token,
          hasComments,
          setHasComments,
        }}
      >
        <Router>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </userContext.Provider>
      <ToastContainer />
    </div>
  )
}

export default App
