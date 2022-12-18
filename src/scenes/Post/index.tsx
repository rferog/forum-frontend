import {
  useMutation,
  useQuery
} from '@apollo/client';
import {
  ErrorMessage,
  Field,
  Form,
  Formik
} from 'formik';
import React, { useCallback, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './index.css';
import { CustomButton } from 'components/Buttons';
import { TopicDescription } from 'components/Description';
import { Post } from 'components/Post';
import { IComment } from 'components/Post/types';
import { ToastMsg } from 'components/ToastMsg';
import {
  CREATE_COMMENT,
  GET_POST_INFO
} from 'scenes/Post/queries';
import { ICommentBox } from 'scenes/Post/types';
import { ThemeContext } from 'themeContext';

const PostScene: React.FC = (): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  const { postId } = useParams();

  const handleQueryError = (): void => {
    ToastMsg("Error getting post");
  };

  const { data, loading } = useQuery(GET_POST_INFO, {
    onError: handleQueryError,
    variables: {
      postId,
    },
  });

  const nest = (
    items: IComment[] | undefined,
    id: string | null = null
  ): IComment[] => {
    return (items ? items
      .filter(item => item.parentCommentId === id)
      .map(item => ({ ...item, children: nest(items, item.id) })) :
      [])
  };

  if (loading) return (
    <div className="container">
      <div className="home-content">
        <p className={`default-post-container-${theme}`}>
          {"Loading..."}
        </p>
      </div>
    </div>
  );

  const nestedComments = nest(data.post.commentSet);

  return (
    <React.Fragment>
      <div className="base-container">
        <div className="scene-post-content">
          <Post {...data.post} />
          <div className={`comments-container-${theme}`}>
            <h4>{"Comments"}</h4>
            <CommentBox parentPost={data.post.id} />
            <hr />
            {nestedComments.length ?
              <ul className="pa-5">
                {nestedComments.map(comment => (
                  <Comment key={comment.id} {...comment} />
                ))}
              </ul> :
              <div>
                {"No comments yet"}
              </div>}
          </div>
        </div>
        <div className="scene-topic-description">
          <TopicDescription
            name={data.post.parentTopic.name}
            description={data.post.parentTopic.description}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

const Comment: React.FC<IComment> = (props: IComment): JSX.Element => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const handleShowCommentBox = () => setShowCommentBox(!showCommentBox);

  return (
    <React.Fragment>
      <strong>{`Author: ${props.author}`}</strong>
      <div className={props.parentCommentId ? "comment" : "flex-column"}>
        {props.content}
        {showCommentBox ?
          <CommentBox
            onCancel={handleShowCommentBox}
            parentComment={props}
            parentPost={props.parentPost.id}
          /> :
          <span
            className="comment-reply-button"
            onClick={handleShowCommentBox}
          >
            {"Reply"}
          </span>
        }
        <ul>
          {props.children?.map(child => <Comment key={child.id} {...child} />)}
        </ul>
      </div>
    </React.Fragment>
  )
};

const CommentBox: React.FC<ICommentBox> = (props: ICommentBox): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  const navigate = useNavigate();
  const commentInitialValue = {
    content: "",
  };

  const handleCreateCommentResult = (result: number): void => {
    if (result) {
      ToastMsg("Comment posted successfully");
    };
  };

  const handleCreateCommentError = (): void => {
    ToastMsg("Error posting comment, please try again");
  };

  const [createComment] = useMutation(CREATE_COMMENT,
    {
      onCompleted: handleCreateCommentResult,
      onError: handleCreateCommentError,
    });

  const handleCommentSubmit = useCallback(
    (values: {
      content: string;
    }): void => {
      const token = localStorage.getItem("token");
      if (token) {
        void createComment({
          variables: {
            content: values.content,
            parentCommentId: props.parentComment ?
            props.parentComment.id : undefined,
            parentPost: props.parentPost,
          },
        });
        setTimeout(() => { navigate(0) }, 2000);
      } else {
        ToastMsg("To comment you have to log in");
      };
    },
    [createComment, navigate, props]
  );

  return (
    <React.Fragment>
      <Formik
        initialValues={commentInitialValue}
        onSubmit={handleCommentSubmit}
      >
        {({
          dirty,
        }) => (
          <Form>
            <Field
              component="textarea"
              className={`form-input-${theme}`}
              rows="5"
              cols="50"
              name="content"
              placeholder="Write a comment"
            />
            <ErrorMessage name="content" component="div" />
            <div className="comment-buttons-container">
              <CustomButton
                customStyle="generic"
                disabled={!dirty}
                type="submit"
              >
                {"Comment"}
              </CustomButton>
              {props.parentComment ?
                <CustomButton
                  onClick={props.onCancel}
                  customStyle="generic"
                >
                  {"Cancel"}
                </CustomButton> :
                undefined
              }
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export { PostScene };
