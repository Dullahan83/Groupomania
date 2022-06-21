import React, { useContext, useEffect, useState } from 'react'
import '../Post/Post.scss'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/EditOutlined'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { userContext } from '../../../utils/context/userContext'
import CreateComment from '../CreateComments/CreateComment'
import CommentsContainer from './CommentsContainer/CommentsContainer'
import { useNavigate } from 'react-router-dom'
import FileUploader from '../../FileUploader'

function Post(props) {
  const navigate = useNavigate()
  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisliked, setHasDisliked] = useState(false)
  const [deployComments, setDeployComments] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentList, setCommentList] = useState([])
  const [edit, setEdit] = useState(false)
  const [title, setTitle] = useState(props.publi.title)
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const {
    refreshPubli,
    setRefreshPubli,
    userId,
    hasPerm,
    host,
    setIsHome,
    isHome,
  } = useContext(userContext)
  let valueLike = hasLiked ? -1 : 1
  let valueDislike = !hasDisliked ? 0 : -1

  const imgUrl = `${host}${props.publi.image}`

  const formData = new FormData()
  formData.append('title', title ? title : props.publi.title)
  formData.append('image', image ? image : props.publi.image)
  formData.append('content', content ? content : props.publi.content)
  formData.append('userId', userId)
  function handleSubmit(e) {
    if (title !== '') {
      axios
        .post(
          `${host}api/publications`,

          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setTitle('')
          setImage('')
          setContent('')
          toast.success('Nouvelle publication postée')
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
      toast.error(`Manquerait pas un titre, là ?!`)
    }

    e.preventDefault()
  }

  const token = Cookies.get('token')
  function handleLike(e) {
    setHasLiked(!hasLiked)
    if (hasDisliked) {
      setHasDisliked(!hasDisliked)
    }
    axios
      .post(
        `${host}api/publications/${props.publi.id}`,
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
        `${host}api/publications/${props.publi.id}`,
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
      .delete(`${host}api/publications/${props.publi.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success('Publication supprimée')
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
        `${host}api/publications/${props.publi.id}/bookmark`,
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
    if (userId != null) {
      axios
        .get(`${host}api/publications/${props.publi.id}/comments/getAll`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCommentList(res.data)
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
  function handleIsCommenting() {
    setIsCommenting(!isCommenting)
  }
  function handleClick() {
    setDeployComments(!deployComments)
  }

  function handleEdit() {
    setEdit(!edit)
  }
  function handleModifs() {
    if (title !== '') {
      axios
        .put(`${host}api/publications/${props.publi.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success('Modifié !')
          setEdit(false)
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
      toast.error(`N'oubliez pas le titre !`)
    }
  }
  function removeFav() {
    axios
      .delete(`${host}api/publications/${props.publi.id}/bookmark`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success('Supprimé des favoris')
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
  function handleRedirect() {
    setIsHome(false)
    navigate(`/profile/${props.publi.username}`)
  }
  useEffect(() => {
    getComments()
  }, [refreshPubli])
  useEffect(() => {
    if (props.publi.value == 1) {
      setHasLiked(true)
      setHasDisliked(false)
    } else if (props.publi.value == 0) {
      setHasDisliked(true)
      setHasLiked(false)
    }
  }, [])
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
              Posté par{' '}
              <span className="usernameLink" onClick={handleRedirect}>
                {props.publi.username}
              </span>
            </p>
            <button className="invisibleButton">
              {isHome ? (
                <BookmarkAddOutlinedIcon className="favIcon" onClick={addFav} />
              ) : (
                <BookmarkRemoveOutlinedIcon
                  onClick={removeFav}
                  className="favIcon"
                />
              )}
            </button>
          </div>
          <div className="publi">
            {edit ? (
              <input
                type="text"
                defaultValue={props.publi.title}
                className="inputPubliTitle"
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <h3 className="publiTitle">{props.publi.title}</h3>
            )}
            {edit ? (
              <>
                <img src={imgUrl} alt="" className="imgPubli" />
                <FileUploader
                  handleFile={setImage}
                  classname="fileButtonInput"
                />
              </>
            ) : (
              <img src={imgUrl} alt="" className="imgPubli" />
            )}
            {edit ? (
              <textarea
                rows="5"
                defaultValue={props.publi.content}
                className="editPubliContent"
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <p className="publiContent">{props.publi.content}</p>
            )}
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
          {(userId == props.publi.users_id || hasPerm == 1) &&
            (edit ? (
              <SendIcon onClick={handleModifs} className="sendIcon" />
            ) : (
              <EditIcon className="editIcon" onClick={handleEdit} />
            ))}
          {(userId == props.publi.users_id || hasPerm == 1) && (
            <DeleteIcon className="deleteIcon" onClick={handleDelete} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Post
