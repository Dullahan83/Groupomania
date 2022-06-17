import styles from '../Profile/Profile.scss'
import defaultPp from '../../assets/DefaultProfil.jpg'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SmsIcon from '@mui/icons-material/Sms'
import BookmarksRoundedIcon from '@mui/icons-material/BookmarksRounded'
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import EditIcon from '@mui/icons-material/EditOutlined'
import SendIcon from '@mui/icons-material/Send'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../../utils/context/userContext'
import { toast } from 'react-toastify'
import Post from '../PostsContainer/Post/Post'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
function Profile(props) {
  const url = new URL(window.location.href)
  const {
    token,
    refreshPubli,
    setRefreshPubli,
    username,
    host,
    isHome,
    userId,
    setIsOnline,
    setIsHome,
  } = useContext(userContext)
  const usernameProfile = url.pathname.split('/profile/')[1]
  const [profilePicture, setProfilePicture] = useState(defaultPp)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [quickBio, setQuickBio] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [profileInfos, setProfileInfos] = useState([])
  const [postList, setPostList] = useState([])
  const [bookmarkList, setBookmarkList] = useState([])
  const [revealPostList, setRevealPostList] = useState(false)
  const [revealBookmarks, setRevealBookmarks] = useState(false)
  const [followList, setFollowList] = useState('')
  const [revealFollowList, setRevealFollowList] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const navigate = useNavigate()
  const imgUrl = `${host}${profileInfos.avatar}`
  const formData = new FormData()
  formData.append(
    'image',
    profilePicture ? profilePicture : profileInfos.avatar
  )
  formData.append('firstname', firstName ? firstName : profileInfos.firstname)
  formData.append('lastname', lastName ? lastName : profileInfos.lastname)
  formData.append(
    'presentation',
    quickBio ? quickBio : profileInfos.presentation
  )
  console.log(profileInfos)
  console.log(followList)
  function getUserProfile() {
    axios
      .get(`${host}api/profile/${usernameProfile}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfileInfos(res.data)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    axios
      .get(`${host}api/profile/${usernameProfile}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookmarkList(res.data)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    axios
      .get(`${host}api/profile/${usernameProfile}/publications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPostList(res.data)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
    axios
      .get(`${host}api/profile/${usernameProfile}/followed`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res)
        setFollowList(res.data)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
  }
  function handleEdit() {
    setIsEditing(!isEditing)
  }
  function handleSubmit() {
    axios
      .put(`${host}api/profile/${usernameProfile}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success('Profile edited successfully')
        setIsEditing(false)
        setFirstName('')
        setLastName('')
        setProfilePicture('')
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
    setCanDelete(!canDelete)
  }
  function deleteProfile() {
    axios
      .delete(`${host}api/profile/${usernameProfile}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.info(`C'est triste de vous vour partir`)
        navigate('/')
        Cookies.remove('token')
        setIsOnline(false)
        setIsHome(true)
      })
      .catch((err) => {
        if (typeof err.response.data.message === 'string') {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message[0])
        }
      })
  }
  function handlePosts() {
    setRevealPostList(!revealPostList)
    setRevealBookmarks(false)
    setRevealFollowList(false)
  }
  function handleBookmarks() {
    setRevealBookmarks(!revealBookmarks)
    setRevealPostList(false)
    setRevealFollowList(false)
  }
  function handleFollowList() {
    setRevealFollowList(true)
    setBookmarkList(false)
    setPostList(false)
  }
  function Follow() {
    axios
      .post(
        `${host}api/profile/${usernameProfile}/follow`,
        {},
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res)
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

  useEffect(() => {
    getUserProfile()
  }, [refreshPubli])

  return (
    <div id="profile">
      <div id="profileCard">
        <div className="onglets">
          <AccountCircleIcon className="firstOnglet" />
          <SmsIcon
            className={revealPostList ? 'onglet activated' : 'onglet'}
            onClick={handlePosts}
          />
          <BookmarksRoundedIcon
            className={revealBookmarks ? 'onglet activated' : 'onglet'}
            onClick={handleBookmarks}
          />
          <GroupRoundedIcon className="lastOnglet" />
        </div>
        <div id="profileContainer">
          {userId === profileInfos.id ? (
            <EditIcon className="editProfile" onClick={handleEdit} />
          ) : (
            <AddLinkOutlinedIcon className="editProfile" onClick={Follow} />
          )}
          <div className="imgProfile">
            <img
              src={profileInfos.avatar != undefined ? imgUrl : defaultPp}
              alt=""
            />
            <h2>{usernameProfile}</h2>
          </div>

          <div className="profileFields">
            {isEditing ? (
              <div className="formProfile">
                <div>
                  <label></label>
                  <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    name="image"
                  />
                </div>

                <div className="profileInputs">
                  <label className="inputLabels" htmlFor="firstName">
                    First Name:
                  </label>
                  <input
                    name="firstName"
                    defaultValue={profileInfos.firstname}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                    }}
                  />
                </div>
                <div className="profileInputs">
                  <label className="inputLabels" htmlFor="lastName">
                    Last Name:
                  </label>
                  <input
                    name="lastName"
                    defaultValue={profileInfos.lastname}
                    onChange={(e) => {
                      setLastName(e.target.value)
                    }}
                  />
                </div>
                <div className="profileInputs">
                  <label className="inputLabels" htmlFor="quickBio">
                    Quick Bio:
                  </label>
                  <textarea
                    name="quickBio"
                    rows="5"
                    defaultValue={profileInfos.presentation}
                    onChange={(e) => {
                      setQuickBio(e.target.value)
                    }}
                  />
                </div>
                <button>
                  <SendIcon id="sendIcon" onClick={handleSubmit} />
                </button>
              </div>
            ) : (
              <>
                <div className="labels">
                  <h4>First Name:</h4>
                  <h4>Last Name:</h4>
                  <h4>Quick Bio:</h4>
                </div>
                <div className="userInfos">
                  <p className="firstName">
                    {profileInfos.firstname != 'null'
                      ? profileInfos.firstname
                      : 'Non renseigné'}
                  </p>
                  <p className="lastName">
                    {profileInfos.lastname != 'null'
                      ? profileInfos.lastname
                      : 'Non renseigné'}
                  </p>
                  <p className="quickBio">
                    {profileInfos.presentation
                      ? profileInfos.presentation
                      : `Cet utilisateur ne s'est pas encore presenté`}
                  </p>
                </div>
              </>
            )}
          </div>
          {!isEditing && userId === profileInfos.id && (
            <button id="deleteButton" onClick={handleDelete}>
              Supprimer le profil
            </button>
          )}
          {canDelete && (
            <div id="confirmDelete">
              <p>
                Cette action est irreversible, êtes vous certain de votre choix
                ?
              </p>
              <div id="confirmButton">
                <button id="confirmationButton" onClick={deleteProfile}>
                  <CheckOutlinedIcon />
                </button>
                <button id="backButton" onClick={handleDelete}>
                  <CloseOutlinedIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div id="publications">
        {revealPostList && (
          <h2>
            {usernameProfile != username
              ? `Publications de ${usernameProfile}`
              : 'Vos Publications'}
          </h2>
        )}
        {revealPostList && (
          <div className="postContainer">
            {postList.length > 0 &&
              postList.map((publi) => <Post publi={publi} key={publi.id} />)}
          </div>
        )}
      </div>
      <div id="bookmarks">
        {revealBookmarks && (
          <h2>
            {usernameProfile != username
              ? `Favoris de ${usernameProfile}`
              : 'Vos Favoris'}
          </h2>
        )}
        {revealBookmarks && (
          <div className="bookmarkContainer">
            {bookmarkList.length > 0 &&
              bookmarkList.map((publi) => (
                <Post publi={publi} key={publi.id} bookmark={revealBookmarks} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Profile
