import styles from '../Main/Main.scss'
import PostsContainer from '../PostsContainer/PostsContainer'
import Createpost from '../CreatePost/CreatePost'
function Main() {
  return (
    <div className="mainWrapper">
      <div className="welcomeMsg">
        <h1>Bienvenue sur notre nouveau réseau social</h1>
      </div>
      <div className="panels">
        <div className="leftPanel"></div>
        <div className="centralPanel">
          <Createpost />
          <PostsContainer />
        </div>
        <div className="rightPanel"></div>
      </div>
    </div>
  )
}

export default Main
