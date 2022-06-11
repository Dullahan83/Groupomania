import React, { useContext, useEffect, useState } from 'react'
import styles from '../Post/Post.scss'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { userContext } from '../../../utils/context/userContext'
import CreateComment from '../CreateComments/CreateComment'
import CommentsContainer from './CommentsContainer/CommentsContainer'

function Post(props) {
  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisliked, setHasDisliked] = useState(false)
  const [deployComments, setDeployComments] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentList, setCommentList] = useState([])

  const { refreshPubli, setRefreshPubli, userId, hasPerm } =
    useContext(userContext)
  let valueLike = hasLiked ? -1 : 1
  let valueDislike = !hasDisliked ? 0 : -1
  const token = Cookies.get('token')
  function handleLike(e) {
    setHasLiked(!hasLiked)
    if (hasDisliked) {
      setHasDisliked(!hasDisliked)
    }
    axios
      .post(
        `http://localhost:3000/api/publications/${props.publi.id}`,
        {
          value: valueLike,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
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
  function handleDislike() {
    setHasDisliked(!hasDisliked)
    if (hasLiked) {
      setHasLiked(!hasLiked)
    }
    axios
      .post(
        `http://localhost:3000/api/publications/${props.publi.id}`,
        {
          value: valueDislike,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
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
  function handleDelete() {
    axios
      .delete(`http://localhost:3000/api/publications/${props.publi.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success('Publication successfully deleted')
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
  function addFav() {
    axios
      .post(
        `http://localhost:3000/api/publications/${props.publi.id}/bookmark`,
        {
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success(res.data.message)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
  }
  function getComments() {
    axios
      .get(
        `http://localhost:3000/api/publications/${props.publi.id}/comments/getAll`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setCommentList(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  function handleIsCommenting() {
    setIsCommenting(!isCommenting)
  }
  function handleClick() {
    setDeployComments(!deployComments)
  }
  useEffect(() => {
    getComments()
  }, [refreshPubli])
  return (
    <div>
      <div className="publiWrapper">
        <div className="voteContainer">
          <button onClick={handleLike} className="invisibleButton">
            <ThumbUpIcon
              className={hasLiked ? 'likeIcon greenThumb' : 'likeIcon'}
            />
          </button>
          <p>{props.publi.upvote}</p>
          <p>{props.publi.downvote}</p>
          <button onClick={handleDislike} className="invisibleButton">
            <ThumbDownIcon
              className={hasDisliked ? 'dislikeIcon redThumb' : 'dislikeIcon'}
            />
          </button>
        </div>
        <div className="publiContainer">
          <div className="infoPoster">
            <p>
              Posted by{' '}
              <span className="usernameLink">{props.publi.username}</span>
            </p>
            <StarOutlineIcon className="favIcon" onClick={addFav} />
          </div>
          <div className="publi">
            <h3 className="publiTitle">{props.publi.title}</h3>
            <img src={props.publi.image} alt="" className="imgPubli" />
            <p className="publiContent">{props.publi.content}</p>
          </div>
          <div>
            <div className="bottomPart">
              <AddCommentOutlinedIcon
                className="addComment"
                onClick={handleIsCommenting}
              />
              {commentList.length > 0 ? (
                <CommentOutlinedIcon
                  className="hasCommentIcon"
                  onClick={handleClick}
                />
              ) : (
                <ModeCommentOutlinedIcon className="commentIcon" />
              )}
            </div>
            {isCommenting && (
              <CreateComment
                isCommenting={setIsCommenting}
                publiId={props.publi.id}
              />
            )}
            {deployComments && (
              <CommentsContainer
                publiId={props.publi.id}
                commentList={commentList}
              />
            )}
          </div>
        </div>
        <div className="rightBorder">
          {(userId == props.publi.users_id || hasPerm == 1) && (
            <EditIcon className="editIcon" />
          )}
          {(userId == props.publi.users_id || hasPerm == 1) && (
            <DeleteIcon className="deleteIcon" onClick={handleDelete} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Post
