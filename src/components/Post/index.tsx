import jwt_decode from "jwt-decode";
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import { CustomButton } from 'components/Buttons';
import { ICastVote, IPost } from 'components/Post/types';
import { ThemeContext } from 'themeContext';
import { useMutation } from '@apollo/client';
import { CAST_VOTE_MUTATION } from 'components/Post/queries';
import { ToastMsg } from 'components/ToastMsg';
import { IUserInfo } from 'components/Navbar/types';

const Post: React.FC<IPost> = (props: IPost): JSX.Element => {
  const token = localStorage.getItem("token") ?? "";
  const userInfo: IUserInfo = token ? jwt_decode(token)
  : { username: "", exp: 0 };

  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  const serverTotalVotes = props.upvoteSet.length - props.downvoteSet.length;
  const [totalVotes, setTotalVotes] = useState(serverTotalVotes);
  const [upvotes, setUpvotes] = useState(props.upvoteSet)
  const [downvotes, setDownvotes] = useState(props.downvoteSet)

  const userUpvote = upvotes.findIndex(
    vote => vote.userId === userInfo.username
  );
  const userDownvote = downvotes.findIndex(
    vote => vote.userId === userInfo.username
  );
  const [isUpvoted, setIsUpvoted] = useState(userUpvote)
  const [isDownvoted, setIsDownvoted] = useState(userDownvote)

  const handleMutationResult = (result: ICastVote): void => {
    if (!result.castVote.success) {
      ToastMsg("Something went wrong, are you logged in?");
    }
  };

  const handleMutationError = (): void => {
    ToastMsg("There was an error, try again");
  };

  const [castVote] = useMutation<ICastVote>(CAST_VOTE_MUTATION,
    {
      onCompleted: handleMutationResult,
      onError: handleMutationError,
    }
  );

  const handleVote = (voteType: string) => {
    if (token) {
      switch (voteType) {
        case "upvote":
          setUpvotes(
            prevUpvotes => prevUpvotes.concat({ userId: userInfo.username })
          );
          if (userDownvote !== -1) {
            setDownvotes(
              prevDownvotes => {
                const newDownvotes = [...prevDownvotes];
                newDownvotes.splice(userUpvote, 1);
                return newDownvotes
              }
            );
          }
          setIsUpvoted(1);
          setIsDownvoted(-1);
          break;
        case "unupvote":
          if (userUpvote !== -1) {
            setUpvotes(
              prevUpvotes => {
                const newUpvotes = [...prevUpvotes]
                newUpvotes.splice(userUpvote, 1)
                return newUpvotes
              }
            );
          }
          setIsUpvoted(-1);
          break;
        case "downvote":
          setDownvotes(
            prevDownvotes => prevDownvotes.concat({ userId: userInfo.username })
          );
          if (userUpvote > -1) {
            setUpvotes(
              prevUpvotes => {
                const newUpvotes = [...prevUpvotes]
                newUpvotes.splice(userUpvote, 1)
                return newUpvotes
              }
            );
          }
          setIsDownvoted(1);
          setIsUpvoted(-1);
          break;
        case "undownvote":
          if (userDownvote !== -1) {
            setDownvotes(
              prevDownvotes => {
                const newDownvotes = [...prevDownvotes];
                newDownvotes.splice(userUpvote, 1);
                return newDownvotes
              }
            );
          }
          setIsDownvoted(-1);
          break;
      }
      castVote({
        variables: {
          parentPostId: props.id,
          voteType: voteType,
        },
      });
    } else {
      ToastMsg("To vote you have to log in")
    }
  };
  useEffect(() => {
    setTotalVotes(upvotes.length - downvotes.length);
  }, [setTotalVotes, upvotes.length, downvotes.length]);

  return (
    <React.Fragment>
      <div className={`post-parent-container-${theme}`}>
        <div className="votes-container">
          {isUpvoted !== -1 ?
            <CustomButton
              customStyle="arrow"
              onClick={() => handleVote("unupvote")}
            >
              <img
                src="/arrow-up-voted.svg"
                width="20"
                height="20"
                alt="Arrow Up Icon"
              />
            </CustomButton> :
            <CustomButton
              customStyle="arrow"
              onClick={() => handleVote("upvote")}
            >
              <img
                src="/arrow-up-unvoted.svg"
                width="20"
                height="20"
                alt="Arrow Up Icon"
              />
            </CustomButton>}
          <div className="votes-number">
            {totalVotes}
          </div>
          {isDownvoted !== -1 ?
            <CustomButton
              customStyle="arrow"
              onClick={() => handleVote("undownvote")}
            >
              <img
                src="/arrow-down-voted.svg"
                width="20"
                height="20"
                alt="Arrow Up Icon"
              />
            </CustomButton> :
            <CustomButton
              customStyle="arrow"
              onClick={() => handleVote("downvote")}
            >
              <img
                src="/arrow-down-unvoted.svg"
                width="20"
                height="20"
                alt="Arrow Up Icon"
              />
            </CustomButton>}
        </div>
        <Link className="post-container" to={`/post/${props.id}`}>
          <div className="post-header">
            {`Topic: ${props.parentTopic.name} | Author: ${props.author}`}
          </div>
          <div className="post-title">
            {props.title}
          </div>
          <h5 className="post-content">
            {props.content}
          </h5>
        </Link>
      </div>
    </React.Fragment>
  )
}

export { Post }
