import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Post from '../PostsContainer/Post/Post'
import Cookies from 'js-cookie'
import { userContext } from '../../utils/context/userContext'
import { toast } from 'react-toastify'
function PostsContainer() {
  const [publiList, setPubliList] = useState([])
  const token = Cookies.get('token')
  const headers = { Authorization: `Bearer ${token}` }

  const { refreshPubli, userId, setHost, host } = useContext(userContext)
  const getPosts = () => {
    if (userId != null) {
      axios
        .get(`${host}api/publications/getAll`, {
          headers,
        })
        .then((res) => {
          setPubliList(res.data.results)
          setHost(res.data.host)
        })
        .catch((err) => {
          if (typeof err.response.data.message === 'string') {
            toast.error(err.response.data.message)
          } else {
            toast.error(err.response.data.message[0])
          }
        })
    }
  }
  useEffect(() => {
    getPosts()
  }, [refreshPubli])

  return (
    <div>
      {publiList.length > 0 &&
        publiList
          .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
          .map((publi) => (
            <Post publi={publi} key={publi.id} className="index" />
          ))}
    </div>
  )
}

export default PostsContainer
