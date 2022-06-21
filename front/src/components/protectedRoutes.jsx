import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { userContext } from '../utils/context/userContext'
import Cookies from 'js-cookie'
function ProtectedRoutes() {
  const { isOnline, setIsOnline } = useContext(userContext)
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOnline(false)
      Cookies.remove('token')
      !isOnline && navigate('/')
    }, 1000 * 60 * 60 * 2)
    return () => clearTimeout(timer)
  }, [])

  return <>{isOnline === false ? <Navigate to="/" /> : <Outlet />}</>
}

export default ProtectedRoutes
