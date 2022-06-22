import './CreatePost.scss'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { userContext } from '../../utils/context/userContext'
import FileUploader from '../FileUploader'

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
          toast.success('Publication postée')
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
      toast.error('Un titre est obligatoire')
    }

    e.preventDefault()
  }
  return (
    <div className="createPostContainer">
      {!makeAppear && (
        <button className="invisibleButton" aria-label="Open new post form">
          <AddIcon onClick={handleClick} className="addPostIcon" />
        </button>
      )}

      {makeAppear && (
        <form className="postForm">
          <button
            className="invisibleButtonSmall"
            aria-label="Close new post form"
          >
            <CloseIcon className="closePostFormIcon" onClick={handleClick} />
          </button>
          <label htmlFor="postTitle">Titre</label>
          <input
            type="text"
            placeholder="Title"
            name="postTitle"
            id="postTitle"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <div className="inputImgContainer">
            <label htmlFor="postImg">
              Image ou pas Image, telle est la question
            </label>
            <FileUploader
              handleFile={setImage}
              classname="fileButtonInputSmall"
            />
          </div>
          <label htmlFor="postContent">Racontez nous une histoire</label>
          <textarea
            onClick={expand}
            name="postContent"
            id="postContent"
            rows={isClicked ? '5' : '1'}
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <button className="invisibleButton" aria-label="submit new post">
            <SendIcon className="sendIcon" onClick={handleSubmit} />
          </button>
        </form>
      )}
    </div>
  )
}
export default Createpost
