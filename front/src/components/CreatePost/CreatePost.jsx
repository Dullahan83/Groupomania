import styles from './CreatePost.scss'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { userContext } from '../../utils/context/userContext'

function Createpost() {
  const [makeAppear, setMakeAppear] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const token = Cookies.get('token')
  const { setRefreshPubli, userId } = useContext(userContext)

  function handleClick() {
    setMakeAppear(!makeAppear)
    setIsClicked(false)
  }
  function expand() {
    setIsClicked(!isClicked)
  }

  const formData = new FormData()
  formData.append('title', title)
  formData.append('image', image)
  formData.append('content', content)
  formData.append('userId', userId)
  function handleSubmit(e) {
    if (title !== '') {
      axios
        .post(
          'http://localhost:3000/api/publications',

          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setMakeAppear(false)
          setTitle('')
          setImage('')
          setContent('')
          toast.success('New publication posted')
          setRefreshPubli(true)
        })
        .catch((err) => {
          if (typeof err.response.data.message === 'string') {
            toast.error(err.response.data.message)
          } else {
            toast.error(err.response.data.message[0])
          }
        })
      setRefreshPubli(false)
    } else {
      toast.error('This new publication needs a title')
    }

    e.preventDefault()
  }
  return (
    <div className="createPostContainer">
      {!makeAppear && <AddIcon onClick={handleClick} className="addPostIcon" />}

      {makeAppear && (
        <form className="postForm">
          <CloseIcon className="closePostFormIcon" onClick={handleClick} />
          <label htmlFor="postTitle">Title</label>
          <input
            type="text"
            placeholder="Title"
            name="postTitle"
            id="postTitle"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label htmlFor="postImg">
            Image or not Image, that is the question
          </label>
          <input
            type="file"
            name="postImg"
            id="postImg"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="postContent">Share something bro !</label>
          <textarea
            onClick={expand}
            name="postContent"
            id="postContent"
            rows={isClicked ? '5' : '1'}
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <button className="invisibleButton">
            <SendIcon className="sendIcon" onClick={handleSubmit} />
          </button>
        </form>
      )}
    </div>
  )
}
export default Createpost
