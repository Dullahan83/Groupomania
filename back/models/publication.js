

/* publication:
    id
    publisher_id
    title
    image_url
    content
    creation_date
        relations:
            publication_comments
            upvote/downvote
            users_liked
            users_disliked */

/* user:
    id
    username
    email
    password
    avatar_url
    first_name
    last_name
    quickbio
    last_seen 
        relations:
            table like
            table favorites
            table friends
            table publications
            table comments*/

/* comments:
    id
    poster_name/id        
    content
    comment_date
    comment_edit_date
        relations:
            table like
            table publications
            table user
     */

/* favorites:
    user_id
    publication_id
        relation:
            table user
            table publications
             */

/* vote:
     */