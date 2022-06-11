import styles from './Comment.scss'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../../../utils/context/userContext'

function Comment(props) {
  const token = Cookies.get('token')
  const { setRefreshPubli, hasPerm, userId } = useContext(userContext)

  function handleDelete() {
    axios
      .delete(
        `http://localhost:3000/api/publications/${props.publiId}/comments/${props.comment.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.success('Comment successfully deleted')
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

  return (
    <div>
      <div>
        <div className="commentContainer">
          <div className="infoIcons">
            <p className="infoCommentPoster">
              Posted by{' '}
              <span className="usernameLink">
                {' ' + props.comment.username}
              </span>
            </p>
            <div className="commentIcons">
              {(userId == props.comment.users_id || hasPerm == 1) && (
                <EditIcon className="commentEditIcon" />
              )}
              {userId == props.comment.users_id && (
                <DeleteIcon
                  className="commentDeleteIcon"
                  onClick={handleDelete}
                />
              )}
            </div>
          </div>
          <p className="commentContent">{props.comment.content}</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Comment
