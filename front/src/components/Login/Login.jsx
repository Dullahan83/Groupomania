import React from 'react'
import styles from './Login.scss'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  function handleForm(e) {
    axios
      .post('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
      })
      .then((res) => {
        setIsLoggedIn(true)
        Cookies.set('token', res.data.token, { expires: 0.5 })
        console.log(res.data.token)
        toast.success('Successfully logged-in !')
        navigate('/home')
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    e.preventDefault()
    setIsLoggedIn(false)
  }

  return (
    <form className="formContainer">
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        value={email}
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
        value={password}
      />
      <button onClick={handleForm} className="loginButton">
        Login
      </button>
    </form>
  )
}
export default Login
