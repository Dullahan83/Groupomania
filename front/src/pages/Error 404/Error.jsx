import { Fragment } from 'react'
import yoda from '../../assets/yoda.webp'
import icon from '../../assets/DeathStar.png'
import './Error.scss'
import { useNavigate } from 'react-router-dom'

function Error() {
  const navigate = useNavigate()
  function handleRedirect() {
    navigate('/home')
  }
  return (
    <div id="errorContainer">
      <img src={yoda} alt="yoda" id="yodaImg" />
      <div id="errorTxt">
        <h1>Erreur 404</h1>
        <h2>Inexistante est cette page</h2>
        <h2>Sur tes pas, retourner tu dois</h2>
        <button id="errorButton">
          <img src={icon} alt="deathStar" id="dsImg" onClick={handleRedirect} />
        </button>
      </div>
    </div>
  )
}
export default Error
