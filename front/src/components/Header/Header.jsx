import React, { useContext, useState } from 'react'
import logo from '../../assets/icon-left-font-monochrome-white-logo.png'
import styles from '../Header/Header.scss'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { userContext } from '../../utils/context/userContext'

function Header() {
  const { setIsOnline, username, isHome, setIsHome } = useContext(userContext)
  const navigate = useNavigate()
  function LogOut() {
    setIsOnline(false)
    Cookies.remove('token')
    setIsHome(true)
  }
  function Toggle() {
    setIsHome(!isHome)
    navigate(isHome ? `/profile/${username}` : '/home')
  }
  return (
    <header>
      <nav>
        <div className="logoWrapper">
          <img src={logo} alt="white logo" />
          <p className="corpName">Groupomania</p>
        </div>
        <ul>
          <li onClick={Toggle}>{isHome ? 'Profile' : 'News'}</li>
          <li onClick={LogOut}>Log-out</li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
