import { useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import { AllTopics } from 'components/AllTopics';
import { Navbar } from 'components/Navbar';
import { PostFeed } from 'components/PostFeed';
import { ToastMsg } from 'components/ToastMsg';
import { AccountVerification } from 'scenes/AccountVerification';
import {
  GET_ALL_POSTS,
  GET_PAG_TOPIC_NAMES
} from 'scenes/Home/queries';
import { PostScene } from 'scenes/Post';
import { TopicScene } from 'scenes/Topic';
import { UserScene } from 'scenes/User';
import { ThemeContext } from 'themeContext';

const Home: React.FC = (): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  const [offcanvasShow, setOffcanvasShow] = useState(false);

  const handleOffcanvasClose = () => setOffcanvasShow(false);
  const handleOffcanvasShow = () => setOffcanvasShow(true);

  const handleQueryTopicsError = (): void => {
    ToastMsg("Error getting topics");
  };

  const [topicPagination, setTopicPagination] = useState(10);

  const { data: topicData, loading: topicLoading } = useQuery(
    GET_PAG_TOPIC_NAMES,
    {
      onError: handleQueryTopicsError,
      variables: {
        first: topicPagination,
      },
    },
  );

  const moreTopics = () => {
    if (topicData.topics.length < topicPagination) {
      ToastMsg("There are no more topics")
    } else {
      setTopicPagination(topicPagination + 10);
    }
  };

  if (topicLoading) return (
    <div className="base-container">
      <div className="home-content">
        <p className={`default-post-container-${theme}`}>
          {"Loading..."}
        </p>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className={`navbar-container-${theme}`}>
        <Link to="/">
          <img
            className="logo"
            src={`/logo-${theme}.svg`}
            width="170"
            height="50"
            alt="Clone Logo"
          />
        </Link>
        <Navbar mobile={false} offcanvasClose={handleOffcanvasClose} />
        <div className="burger" onClick={handleOffcanvasShow}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <ToastContainer />
      <Offcanvas
        show={offcanvasShow}
        onHide={handleOffcanvasClose}
        className={`offcanvas-${theme}`}
        scroll={true}
      >
        <Offcanvas.Header />
        <Navbar mobile={true} offcanvasClose={handleOffcanvasClose} />
        <AllTopics
          moreTopics={moreTopics}
          allTopics={topicData.topics}
          offcanvasClose={handleOffcanvasClose}
        />
      </Offcanvas>
      <Routes>
        <Route
          path={"/"}
          element={
            <Main
              topicData={topicData}
              topicLoading={topicLoading}
              moreTopics={moreTopics}
              offcanvasClose={handleOffcanvasClose}
            />
          }
        />
        <Route path={"/verify/:token"} element={<AccountVerification />} />
        <Route path={"/topic/:topicId"} element={<TopicScene />} />
        <Route path={"/user"} element={<UserScene />} />
        <Route path={"/post/:postId"} element={<PostScene />} />
      </Routes>
    </React.Fragment>
  )
};

interface IMain {
  topicData: {
    topics: {
      id: string,
      name: string,
    }[]
  };
  topicLoading: boolean;
  moreTopics: () => void;
  offcanvasClose: () => void;
}

const Main: React.FC<IMain> = (props: IMain): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  const handleQueryPostsError = (): void => {
    ToastMsg("Error getting posts");
  };

  const [postPagination, setPostPagination] = useState(10);

  const {
    data: postsData,
    loading: postsLoading,
  } = useQuery(GET_ALL_POSTS, {
    onError: handleQueryPostsError,
    variables: {
      first: postPagination,
    },
  });

  const morePosts = () => {
    if (postsData.posts.length < postPagination) {
      ToastMsg("There are no more posts")
    } else {
      setPostPagination(postPagination + 10);
    }
  };

  if (postsLoading || props.topicLoading) return (
    <div className="base-container">
      <div className="home-content">
        <p className={`default-post-container-${theme}`}>
          {"Loading..."}
        </p>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="base-container">
        <div className="post-feed">
          <PostFeed morePosts={morePosts} posts={postsData.posts} />
        </div>
        <div className="all-topics">
          <AllTopics
            moreTopics={props.moreTopics}
            allTopics={props.topicData.topics}
            offcanvasClose={props.offcanvasClose}
          />
        </div>
      </div>
    </React.Fragment>
  )
};

export { Home };
