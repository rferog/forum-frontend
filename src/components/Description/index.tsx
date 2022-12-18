import React, { useContext } from 'react';
import {
  ITopicDescription,
  IUserDescription
} from 'components/Description/types';
import './index.css';
import { ThemeContext } from 'themeContext';

const TopicDescription: React.FC<ITopicDescription> = (
props: ITopicDescription
): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  return(
    <div className={`topic-description-container-${theme}`}>
      <h4>{props.name}</h4>
      <div>{props.description}</div>
    </div>
  )
}

const UserDescription: React.FC<IUserDescription> = (props): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  const creationDate = props.userDescription.dateJoined.split("T")[0];

  return(
    <div className={`userdescription-container-${theme}`}>
      <h4>{props.userDescription.username}</h4>
      <div>{`Creation Date: ${creationDate}`}</div>
    </div>
  )
}

export {
  TopicDescription,
  UserDescription
}
