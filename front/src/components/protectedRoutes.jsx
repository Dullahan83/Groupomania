import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { userContext } from '../utils/context/userContext'

function ProtectedRoutes() {
  const { isOnline } = useContext(userContext)

  return <>{isOnline === false ? <Navigate to="/" /> : <Outlet />}</>
}

export default ProtectedRoutes
