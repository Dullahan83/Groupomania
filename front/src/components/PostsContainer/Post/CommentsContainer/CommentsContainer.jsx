import Comment from './Comment/Comment'
import './CommentsContainer.scss'

function CommentsContainer(props) {
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
