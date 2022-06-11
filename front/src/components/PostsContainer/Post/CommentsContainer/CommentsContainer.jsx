import axios from 'axios'
import Cookies from 'js-cookie'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../../utils/context/userContext'
import Comment from './Comment/Comment'
import styles from './CommentsContainer.scss'

function CommentsContainer(props) {
  /* const [commentList, setCommentList] = useState([])
  const { refreshPubli } = useContext(userContext) */
  const token = Cookies.get('token')
  /* function getComments() {
    axios
      .get(
        `http://localhost:3000/api/publications/${props.publiId}/comments/getAll`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data)
        setCommentList(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getComments()
  }, [refreshPubli]) */
  return (
    <div>
      <p className="center">Comments</p>

      {props.commentList.length > 0 &&
        props.commentList.map((comment) => (
          <Comment comment={comment} key={comment.id} publiId={props.publiId} />
        ))}
    </div>
  )
}
export default CommentsContainer
