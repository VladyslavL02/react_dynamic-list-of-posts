import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { deleteComment, getComments } from '../api/comment';
import { Comment } from '../types/Comment';

type Props = {
  postInfo: Post;
};

export const PostDetails: React.FC<Props> = ({ postInfo }) => {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [commentsBeforeDeletion, setCommentsBeforeDeletion] =
    useState(comments);
  const [newCommentSelected, setNewCommentSelected] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    setCommentsLoading(true);
    setNewCommentSelected(false);
    setComments(null);
    setErrorMessage(false);
    getComments(postInfo.id)
      .then(data => setComments(data as Comment[]))
      .catch(() => setErrorMessage(true))
      .finally(() => setCommentsLoading(false));
  }, [postInfo.id]);

  const handleCommentDeletion = (commentId: number) => {
    setCommentsBeforeDeletion(comments);

    setComments(currentComments =>
      currentComments
        ? currentComments.filter(comment => comment.id !== commentId)
        : null,
    );

    deleteComment(commentId).catch(() => {
      setComments(commentsBeforeDeletion);
    });
  };

  const handleNewComment = (data: Comment) => {
    setComments(currentComments => {
      if (currentComments === null) {
        return null;
      }

      return [...currentComments, data];
    });
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">{`#${postInfo.id}: ${postInfo.title}`}</h2>

        <p data-cy="PostBody">{postInfo.body}</p>
      </div>

      <div className="block">
        {commentsLoading && <Loader />}

        <>
          {errorMessage && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {comments !== null && !comments?.length && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {!!comments?.length && (
            <>
              <p className="title is-4">Comments:</p>

              {comments.map(comment => (
                <article
                  className="message is-small"
                  data-cy="Comment"
                  key={comment.id}
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => handleCommentDeletion(comment.id)}
                    ></button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}

          {comments !== null && !newCommentSelected && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setNewCommentSelected(true)}
            >
              Write a comment
            </button>
          )}
        </>
      </div>

      {newCommentSelected && (
        <NewCommentForm postId={postInfo.id} addNewComment={handleNewComment} />
      )}
    </div>
  );
};
