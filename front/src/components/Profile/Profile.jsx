import '../Profile/Profile.scss'
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
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../../utils/context/userContext'
import { toast } from 'react-toastify'
import Post from '../PostsContainer/Post/Post'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import FollowedPeople from './Follow/Follow'
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
    isOnline,
  } = useContext(userContext)
  const usernameProfile = url.pathname.split('/profile/')[1]
  const [profilePicture, setProfilePicture] = useState(defaultPp)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [quickBio, setQuickBio] = useState('')
  const [followList, setFollowList] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [revealPostList, setRevealPostList] = useState(false)
  const [revealBookmarks, setRevealBookmarks] = useState(false)
  const [revealFollowList, setRevealFollowList] = useState(false)
  const [revealProfile, setRevealProfile] = useState(true)
  const [canDelete, setCanDelete] = useState(false)
  const [profileInfos, setProfileInfos] = useState([])
  const [postList, setPostList] = useState([])
  const [bookmarkList, setBookmarkList] = useState([])

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
  useEffect(() => {
    !isOnline && navigate('/')
  }, [refreshPubli])
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
        toast.success('Profil édité !')
        setIsEditing(false)
        setFirstName('')
        setLastName('')
        setProfilePicture(defaultPp)
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
        toast.info(`C'est triste de vous voir partir`)
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
  function handleProfile() {
    setRevealProfile(true)
    setRevealBookmarks(false)
    setRevealFollowList(false)
    setRevealPostList(false)
  }
  function handlePosts() {
    setRevealPostList(!revealPostList)
    setRevealBookmarks(false)
    setRevealFollowList(false)
    setRevealProfile(true)
  }
  function handleBookmarks() {
    setRevealBookmarks(!revealBookmarks)
    setRevealPostList(false)
    setRevealFollowList(false)
    setRevealProfile(true)
  }
  function handleFollowList() {
    setRevealFollowList(!revealFollowList)
    setRevealBookmarks(false)
    setRevealPostList(false)
    setRevealProfile(!revealProfile)
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
  function handleBactToProfile() {
    navigate(`/profile/${username}`)
    setRevealProfile(true)
    setRefreshPubli(!refreshPubli)
  }
  useEffect(() => {
    getUserProfile()
  }, [refreshPubli])

  return (
    <div id="profile">
      <div id="profileCard">
        <div className="onglets">
          <button className="invisibleButtonSmall">
            <AccountCircleIcon
              className="firstOnglet"
              onClick={handleProfile}
            />
          </button>
          <button className="invisibleButtonSmall">
            <SmsIcon
              className={revealPostList ? 'onglet activated' : 'onglet'}
              onClick={handlePosts}
            />
          </button>
          <button className="invisibleButtonSmall">
            <BookmarksRoundedIcon
              className={revealBookmarks ? 'onglet activated' : 'onglet'}
              onClick={handleBookmarks}
            />
          </button>
          <button className="invisibleButtonSmallLast">
            <GroupRoundedIcon
              className="lastOnglet"
              onClick={handleFollowList}
            />
          </button>
        </div>
        <div id="profileContainer">
          {username != usernameProfile && (
            <button className="invisibleButtonSmall">
              <KeyboardReturnOutlinedIcon
                id="backToProfile"
                onClick={handleBactToProfile}
              />
            </button>
          )}
          {revealProfile ? (
            <>
              {userId === profileInfos.id ? (
                <button className="invisibleButtonSmall">
                  <EditIcon className="editProfile" onClick={handleEdit} />
                </button>
              ) : (
                <button className="invisibleButtonSmall">
                  <AddLinkOutlinedIcon
                    className="editProfile"
                    onClick={Follow}
                  />
                </button>
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
                        Prénom:
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
                        Nom:
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
                        Présentation:
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
                      <div className="userInfos">
                        <h4>Prénom:</h4>
                        <p className="firstName">
                          {profileInfos.firstname &&
                          profileInfos.firstname != 'null'
                            ? profileInfos.firstname
                            : 'Non renseigné'}
                        </p>
                      </div>
                      <div className="userInfos">
                        <h4>Nom:</h4>
                        <p className="lastName">
                          {profileInfos.lastname &&
                          profileInfos.lastname != 'null'
                            ? profileInfos.lastname
                            : 'Non renseigné'}
                        </p>
                      </div>
                      <div className="userInfos">
                        <h4>Bio:</h4>
                        <p className="quickBio">
                          {profileInfos.presentation &&
                          profileInfos.presentation != 'null'
                            ? profileInfos.presentation
                            : `Cet utilisateur ne s'est pas encore presenté`}
                        </p>
                      </div>
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
                    Cette action est irreversible, êtes vous certain de votre
                    choix ?
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
            </>
          ) : (
            <>
              <div className="followListContainer">
                <h3>
                  {username === usernameProfile
                    ? 'Personnes suivies'
                    : `Personnes suivies par ${usernameProfile}`}
                </h3>
                <div className="followList">
                  {followList.length > 0 &&
                    followList.map((follow) => (
                      <FollowedPeople
                        key={follow.id}
                        username={follow.username}
                        profile={setRevealProfile}
                      />
                    ))}
                </div>
              </div>
            </>
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
