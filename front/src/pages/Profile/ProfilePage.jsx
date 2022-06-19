import Header from '../../components/Header/Header'
import ParticlesBackground from '../../components/ParticlesBackground'
import Profile from '../../components/Profile/Profile'
function ProfilePage() {
  return (
    <div>
      <Header />
      <ParticlesBackground />
      <div className="mainWrapper">
        <div className="welcomeMsg">
          <h1>Bienvenue sur notre nouveau réseau social</h1>
        </div>
        <div className="panels">
          <div className="leftPanel"></div>
          <div className="centralPanel">
            <Profile />
          </div>
          <div className="rightPanel"></div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
