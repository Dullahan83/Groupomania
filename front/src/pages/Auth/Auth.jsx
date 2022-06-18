import styles from './Auth.scss'
import LogoAlone from '../../assets/icon.png'
import picture from '../../assets/Home-site-1-1024x488.png'
import Signup from '../../components/Signup/Signup'
import Login from '../../components/Login/Login'
import { useState, useContext, useEffect } from 'react'
import { userContext } from '../../utils/context/userContext'
import { useNavigate } from 'react-router-dom'

function Auth() {
  const [toggle, setToggle] = useState(false)
  const { isOnline } = useContext(userContext)
  const navigate = useNavigate()

  function handleClick() {
    setToggle(!toggle)
  }
  useEffect(() => {
    if (isOnline) {
      navigate('/home')
    }
  })

  return (
    <div className="wrapper">
      <img src={picture} alt="groupomania" />
      <div className="rightsideContainer">
        <img src={LogoAlone} alt="logo" />
        <h1>Groupomania</h1>
        {toggle ? <Signup toggle={handleClick} /> : <Login />}
        {!toggle ? (
          <p>
            Pas encore membre ?
            <button onClick={handleClick} id="toggleButton">
              Inscris-toi
            </button>
            !
          </p>
        ) : (
          <p>
            Déjà inscris ? Connecte toi
            <button onClick={handleClick} id="toggleButton">
              ICI
            </button>
            !
          </p>
        )}
      </div>
    </div>
  )
}

export default Auth
