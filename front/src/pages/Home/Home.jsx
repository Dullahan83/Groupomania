import React from 'react'
import Header from '../../components/Header/Header'
import Main from '../../components/Main/Main'
function Home(props) {
  return (
    <div>
      <Header />
      <Main isHome={props.isHome} />
    </div>
  )
}

export default Home
