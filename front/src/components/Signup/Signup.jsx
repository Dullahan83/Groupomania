import React from 'react'
import styles from './Signup.scss'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function Signup(props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleForm(e) {
    axios
      .post('http://localhost:3000/api/auth/signup', {
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        toast.success('Here you go, just Sign-In now :)')
        props.toggle(true)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    e.preventDefault()
  }

  return (
    <form className="formContainer">
      <input
        onChange={(e) => setUsername(e.target.value)}
        className="username"
        type="text"
        placeholder="Username"
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
        placeholder="password"
        value={password}
      />
      <button onClick={handleForm} className="signupButton">
        Signup
      </button>
    </form>
  )
}
export default Signup
