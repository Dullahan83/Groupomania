import React, { useContext, useState } from 'react'
import logo from '../../assets/icon-left-font-monochrome-white-logo.png'
import styles from '../Header/Header.scss'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Header() {
  const [isHome, setIsHome] = useState(true)
  const navigate = useNavigate()
  function LogOut() {
    Cookies.remove('token')
    navigate('/')
  }
  function Toggle() {
    setIsHome(!isHome)
    navigate(/* isHome ? '/home' :  */ '/profile')
  }
  return (
    <header isHome={isHome}>
      <nav>
        <div className="logoWrapper">
          <img src={logo} alt="white logo" />
          <p className="corpName">Groupomania</p>
        </div>
        <ul>
          <li onClick={Toggle}>{isHome ? 'Profile' : 'Home'}</li>
          <li onClick={LogOut}>Log-out</li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
