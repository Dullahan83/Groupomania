import './Follow.scss'
import React, { useContext } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../../../utils/context/userContext'
import axios from 'axios'
import { toast } from 'react-toastify'
function Follow(props) {
  const navigate = useNavigate()
  const { setRefreshPubli, refreshPubli, host, token, username } =
    useContext(userContext)
  const url = new URL(window.location.href)
  const usernameProfile = url.pathname.split('/profile/')[1]
  function handleClick() {
    navigate(`/profile/${props.username}`)
    setRefreshPubli(!refreshPubli)
    props.profile(true)
  }
  function deleteFollow() {
    axios
      .delete(`${host}api/profile/${props.username}/unfollow`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success('Vous ne stalkez plus cette personne')
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
    <div className="followContainer">
      <p onClick={handleClick}>{props.username}</p>
      {username === usernameProfile && (
        <button className="invisibleButton" aria-label="delete follow">
          <CloseOutlinedIcon className="deleteFollow" onClick={deleteFollow} />
        </button>
      )}
    </div>
  )
}

export default Follow
