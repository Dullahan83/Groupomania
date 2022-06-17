import Auth from './pages/Auth/Auth'
import Home from './pages/Home/Home'
import ProfilePage from './pages/Profile/ProfilePage'
import GlobalStyle from './utils/style/GlobalStyle'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { userContext } from './utils/context/userContext'
import { decodeToken } from 'react-jwt'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import ProtectedRoutes from './components/protectedRoutes'
function App() {
  const token = Cookies.get('token')
  const [host, setHost] = useState('http://localhost:3000/')
  const [userId, setUserId] = useState('')
  const [hasPerm, setHasPerm] = useState('')
  const [username, setUsername] = useState('')
  const [isHome, setIsHome] = useState(true)
  const [isOnline, setIsOnline] = useState(false)
  const [hasComments, setHasComments] = useState(false)
  const [refreshPubli, setRefreshPubli] = useState(false)
  const decodedToken = decodeToken(token)
  function checkToken() {
    if (!decodedToken) {
      Cookies.remove('token')
      setIsOnline(false)
    } else if (decodedToken) {
      setUserId(decodedToken.userId)
      setHasPerm(decodedToken.perm)
      setUsername(decodedToken.username)
      setIsOnline(true)
    }
  }

  useEffect(() => {
    checkToken()
  }, [isOnline])
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
          isOnline,
          setIsOnline,
          username,
          host,
          isHome,
          setIsHome,
          host,
          setHost,
        }}
      >
        <Router>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </userContext.Provider>
      <ToastContainer />
    </div>
  )
}

export default App
