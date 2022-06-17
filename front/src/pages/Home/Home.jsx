import Cookies from 'js-cookie'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Main from '../../components/Main/Main'
import ParticlesBackground from '../../components/ParticlesBackground'
import { userContext } from '../../utils/context/userContext'
import styles from './Home.scss'

function Home() {
  const { setIsOnline } = useContext(userContext)
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      navigate('/')
      setIsOnline(false)
      Cookies.remove('token')
    }, 1000 * 60 * 60 * 2)
  }, [])

  return (
    <div>
      <Header />
      <ParticlesBackground />
      <Main />
    </div>
  )
}

export default Home
