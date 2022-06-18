import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import { useState } from 'react'
import syles from './CreateComment.scss'
import Cookies from 'js-cookie'
import { useContext } from 'react'
import { userContext } from '../../../utils/context/userContext'
import { toast } from 'react-toastify'
function CreateComment(props) {
  const [content, setContent] = useState('')
  const token = Cookies.get('token')
  const { setRefreshPubli, userId } = useContext(userContext)
  function handleSubmit() {
    if (content !== '') {
      axios
        .post(
          `http://localhost:3000/api/publications/${props.publiId}/comments`,
          {
            content: content,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          props.isCommenting(false)
          setContent('')
          setRefreshPubli(true)
          toast.success('Et un commentaire, un !')
        })
        .catch((err) => {
          if (typeof err.response.data.message === 'string') {
            toast.error(err.response.data.message)
          } else {
            toast.error(err.response.data.message[0])
          }
        })
    } else {
      toast.error('Le commentaire ne peux être vide !')
    }
    setRefreshPubli(false)
  }
  return (
    <div className="createComment">
      <div className="createCommentBody">
        <textarea
          className="commentContent"
          rows="3"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="Ecrivez ici ..."
        />
        <div onClick={handleSubmit} className="sendIconContainer">
          <SendIcon className="sendIcon" />
        </div>
      </div>
    </div>
  )
}
export default CreateComment
