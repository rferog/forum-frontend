import React, { useContext } from 'react';

import { Post } from 'components/Post';
import { IPostFeed } from 'components/PostFeed/types';
import { CustomButton } from 'components/Buttons';
import { ThemeContext } from 'themeContext';

const PostFeed: React.FC<
  IPostFeed
> = (props: IPostFeed): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  return (
    <React.Fragment>
      {props.posts.length ? props.posts.map(item =>
        <Post key={item.id} {...item} />
      ) :
        <div className={`default-post-container-${theme}`}>
          {"There are no posts here yet"}
        </div>}
      <CustomButton
        onClick={props.morePosts}
        customStyle="pagination-button"
      >
        {"More posts"}
      </CustomButton>
    </React.Fragment>
  )
}

export { PostFeed };
