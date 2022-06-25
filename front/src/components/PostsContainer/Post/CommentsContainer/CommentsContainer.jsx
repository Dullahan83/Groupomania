import axios from 'axios'
import Cookies from 'js-cookie'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../../utils/context/userContext'
import Comment from './Comment/Comment'
import './CommentsContainer.scss'

function CommentsContainer(props) {
  const token = Cookies.get('token')

  return (
    <div>
      {props.commentList.length > 0 && <h3 className="commTitle">Comments</h3>}

      {props.commentList.length > 0 &&
        props.commentList
          .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
          .map((comment) => (
            <Comment
              comment={comment}
              key={comment.id}
              publiId={props.publiId}
            />
          ))}
    </div>
  )
}
export default CommentsContainer
