import React from 'react'
import './Login.scss'
import { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { userContext } from '../../utils/context/userContext'
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { isOnline, setIsOnline, username, setHost } = useContext(userContext)
  const navigate = useNavigate()

  function handleForm(e) {
    axios
      .post('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
      })
      .then((res) => {
        setIsOnline(true)
        Cookies.set('token', res.data.token, { expires: 0.5 })
        toast.success(`Bienvenue ${username} !`)
        navigate('/home')
      })
      .catch((err) => {
        if (err.response.request.status == 429) {
          toast.error(`Trop de tentatives, veuillez réessayer d'ici 15 minutes`)
        } else if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else if (err.response.data.error) {
          toast.error(err.response.data.error)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    e.preventDefault()
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
        placeholder="Mot de passe"
        value={password}
      />
      <button
        onClick={handleForm}
        className="loginButton"
        aria-label="connection"
      >
        Connection
      </button>
    </form>
  )
}
export default Login
