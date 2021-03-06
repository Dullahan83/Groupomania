import React, { useContext } from 'react'
import './Signup.scss'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { userContext } from '../../utils/context/userContext'

function Signup(props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { host } = useContext(userContext)
  function handleForm(e) {
    if (password === confirmPassword) {
      axios
        .post(`${host}api/auth/signup`, {
          username: username,
          email: email,
          password: password,
        })
        .then((res) => {
          toast.success(`Plus qu'à vous connecter maintenant`)
          props.toggle(true)
        })
        .catch((err) => {
          if (typeof err.response.data.message === 'string') {
            toast.error(err.response.data.message)
          } else {
            toast.error(err.response.data.message[0])
          }
        })
    } else {
      toast.error('Vous avez pas entré le même mot de passe')
    }
    e.preventDefault()
  }

  return (
    <form className="formContainer">
      <input
        onChange={(e) => setUsername(e.target.value)}
        className="username"
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email"
        value={email}
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Mot de passe"
        value={password}
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Mot de passe"
        value={confirmPassword}
      />
      <button onClick={handleForm} className="signupButton">
        S'inscrire
      </button>
    </form>
  )
}
export default Signup
