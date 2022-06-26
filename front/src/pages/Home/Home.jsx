import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Main from '../../components/Main/Main'
import ParticlesBackground from '../../components/ParticlesBackground'
import { userContext } from '../../utils/context/userContext'
import './Home.scss'

function Home() {
  const { setIsOnline, isOnline, refreshPubli } = useContext(userContext)
  const navigate = useNavigate()

  useEffect(() => {
    !isOnline && navigate('/')
  }, [refreshPubli])
  return (
    <div>
      <Header />
      <ParticlesBackground />
      <Main />
    </div>
  )
}

export default Home
