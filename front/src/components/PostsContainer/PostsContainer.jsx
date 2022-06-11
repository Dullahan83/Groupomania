import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Post from '../PostsContainer/Post/Post'
import Cookies from 'js-cookie'
import { userContext } from '../../utils/context/userContext'
function PostsContainer() {
  const [publiList, setPubliList] = useState([])
  const token = Cookies.get('token')
  const headers = { Authorization: `Bearer ${token}` }
  const { refreshPubli } = useContext(userContext)
  const getPosts = () => {
    axios
      .get('http://localhost:3000/api/publications/getAll', {
        headers,
      })
      .then((res) => {
        setPubliList(res.data)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    getPosts()
  }, [refreshPubli])

  return (
    <div>
      {publiList.length > 0 &&
        publiList.map((publi) => <Post publi={publi} key={publi.id} />)}
    </div>
  )
}

export default PostsContainer
