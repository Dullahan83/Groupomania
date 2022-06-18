import styles from './Comment.scss'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../../../utils/context/userContext'

function Comment(props) {
  const token = Cookies.get('token')
  const { setRefreshPubli, hasPerm, userId, host } = useContext(userContext)
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')
  const formData = new FormData()
  formData.append('content', content ? content : props.comment.content)
  function handleDelete() {
    axios
      .delete(
        `${host}api/publications/${props.publiId}/comments/${props.comment.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.success('Commentaire supprimé !')
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
  }
  function handleEditMode() {
    setIsEditing(!isEditing)
  }
  function handleEdit() {
    axios
      .put(
        `${host}api/publications/${props.publiId}/comments/${props.comment.id}`,
        { content: content ? content : props.comment.content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.success('Commentaire modifié !')
        setRefreshPubli(true)
        setIsEditing(false)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    setRefreshPubli(false)
  }

  return (
    <div>
      <div>
        <div className="commentContainer">
          <div className="infoIcons">
            <p className="infoCommentPoster">
              Posté par{' '}
              <span className="usernameLink">
                {' ' + props.comment.username}
              </span>
            </p>
            <div className="commentIcons">
              {(userId == props.comment.users_id || hasPerm == 1) &&
                (isEditing ? (
                  <SendIcon className="sendIcon" onClick={handleEdit} />
                ) : (
                  <EditIcon
                    className="commentEditIcon"
                    onClick={handleEditMode}
                  />
                ))}
              {userId == props.comment.users_id && (
                <DeleteIcon
                  className="commentDeleteIcon"
                  onClick={handleDelete}
                />
              )}
            </div>
          </div>
          {isEditing ? (
            <textarea
              rows="3"
              defaultValue={props.comment.content}
              onChange={(e) => setContent(e.target.value)}
              className="editContent"
            />
          ) : (
            <p className="commentContent">{props.comment.content}</p>
          )}
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Comment
