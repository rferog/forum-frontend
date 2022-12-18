import { useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';

import './index.css'
import { TopicDescription } from 'components/Description';
import { PostFeed } from 'components/PostFeed';
import { ToastMsg } from 'components/ToastMsg';
import { GET_TOPIC_INFO } from 'scenes/Topic/queries';
import { IPost } from 'components/Post/types';
import { ThemeContext } from 'themeContext';

const TopicScene: React.FC = (): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  const { topicId } = useParams();

  const handleQueryError = (): void => {
    ToastMsg("Error getting posts");
  };

  const [ postPagination, setPostPagination] = useState(10);

  const { data, loading } = useQuery(GET_TOPIC_INFO, {
    onError: handleQueryError,
    variables: {
      topicId,
      first: postPagination,
    },
  });

  const morePosts = () => {
    if (postSet.length < postPagination) {
      ToastMsg("There are no more posts")
    } else {
      setPostPagination(postPagination + 10);
    }
  };

  if (loading) return (
    <div className="base-container">
      <div className="post-feed">
        <p className={`default-post-container-${theme}`}>
          {"Loading..."}
        </p>
      </div>
    </div>
  );

  const postSet = data.topic.postSet.edges.map(
    (item: { node: IPost }) => item.node
  );

  return(
    <React.Fragment>
      <div className="base-container">
        <div className="post-feed">
          <PostFeed morePosts={morePosts} posts={postSet} />
        </div>
        <div className="topic-description">
          {data ? <TopicDescription
                    name={data.topic.name}
                    description={data.topic.description}
                  />
          : undefined}
        </div>
      </div>
    </React.Fragment>
  )
}

export { TopicScene };
