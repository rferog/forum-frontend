import {
  ApolloError,
  useMutation,
  useQuery
} from "@apollo/client";
import {
  Formik,
  Form,
  Field,
  ErrorMessage
} from "formik";
import React, { useCallback, useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { CustomButton } from "components/Buttons"
import { Login } from "components/Login";
import {
  CREATE_POST_MUTATION,
  CREATE_TOPIC_MUTATION,
  GET_ALL_TOPIC_NAMES
} from "components/Navbar/queries";
import {
  ICreatePostResult,
  ICreateTopicResult,
  IGetAllTopicNamesResult,
} from "components/Navbar/types";
import { Signup } from "components/Signup";
import { ToastMsg } from "components/ToastMsg";
import { ThemeContext } from "themeContext";

interface INavbar {
  mobile: boolean;
  offcanvasClose: () => void;
}

const Navbar: React.FC<INavbar> = ({ mobile, offcanvasClose }): JSX.Element => {

  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  const navigate = useNavigate();
  const nPostInitialValues = {
    title: "",
    content: "",
    author: "",
    parentTopic: "",
  };
  const nTopicInitialValues = {
    name: "",
    description: "",
  };

  const handleQueryError = (): void => {
    ToastMsg("Error getting topic names");
  };

  const { data } = useQuery<IGetAllTopicNamesResult>(GET_ALL_TOPIC_NAMES, {
    onError: handleQueryError,
  });

  const handleCreateTopicResult = (result: ICreateTopicResult): void => {
    if (result.createTopic.success) {
      handleClose();
      ToastMsg("Topic created successfully");
      setTimeout(() => { navigate(0) }, 2000);
    };
  };

  const handleCreateTopicError = (error: ApolloError): void => {
    if (error.message.includes("UNIQUE constraint failed")) {
      ToastMsg("There's already a topic with that name, try another one")
    } else {
      ToastMsg("Error creating topic, please try again");
    }
  };

  const [createTopic] = useMutation(CREATE_TOPIC_MUTATION,
    {
      onCompleted: handleCreateTopicResult,
      onError: handleCreateTopicError,
    });

  const handleTopicSubmit = useCallback(
    (values: {
      name: string;
      description: string;
    }): void => {
      void createTopic({
        variables: {
          name: values.name,
          description: values.description,
        },
      });
    },
    [createTopic]
  );

  const handleCreatePostResult = (result: ICreatePostResult): void => {
    if (result.createPost.success) {
      handleClose();
      ToastMsg("Post created successfully");
      setTimeout(() => { navigate(0) }, 2000);
    };
  };

  const handleCreatePostError = (): void => {
    ToastMsg("Error creating post, please try again");
  };

  const [createPost] = useMutation(CREATE_POST_MUTATION,
    {
      onCompleted: handleCreatePostResult,
      onError: handleCreatePostError,
    });

  const handlePostSubmit = useCallback(
    (values: {
      title: string;
      content: string;
      author: string;
      parentTopic: string;
    }): void => {
      const token = localStorage.getItem("token");
      if (token) {
        void createPost({
          variables: {
            title: values.title,
            content: values.content,
            parentTopic: values.parentTopic,
          },
        });
      } else {
        ToastMsg("To create a post you have to log in");
      };
    },
    [createPost]
  );

  const onClickUser = () => {
    navigate("/user");
    offcanvasClose();
  };
  const onClickHome = () => {
    navigate("/");
    offcanvasClose();
  };
  const onClickLogout = () => {
    localStorage.clear();
    navigate(0);
  };

  const [showNPostModal, setShowNPostModal] = useState(false);
  const [showNTopicModal, setShowNTopicModal] = useState(false);

  const handleClose = () => {
    setShowNPostModal(false);
    setShowNTopicModal(false);
  };

  const handleShowNPostModal = () => setShowNPostModal(true);
  const handleShowNTopicModal = () => setShowNTopicModal(true);

  const onChangeTheme = () => {
    themeCtx.changeTheme();
  };

  return (
    <React.Fragment>
      <div className="auth-buttons">
        <div className={mobile ? "mobile-navbar" : "desktop-navbar"}>
          <CustomButton
            onClick={handleShowNPostModal}
            customStyle="generic"
          >
            {"NEW POST"}
          </CustomButton>
        </div>
        <div className={mobile ? "mobile-navbar" : "desktop-navbar"}>
          <CustomButton
            onClick={handleShowNTopicModal}
            customStyle="generic"
          >
            {"NEW TOPIC"}
          </CustomButton>
        </div>
      </div>
      <Modal
        show={showNPostModal}
        onHide={handleClose}
        contentClassName={`navbar-modal-${theme}`}
      >
        <Modal.Header
          closeButton
          closeVariant={theme === "dark" ? "white" : undefined}
        >
          <Modal.Title>{"NEW POST"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={nPostInitialValues}
            onSubmit={handlePostSubmit}
          >
            {({
              dirty,
            }) => (
              <Form>
                <Field
                  as="select"
                  className={`form-input-${theme}`}
                  name="parentTopic"
                >
                  <option>{"Select a topic"}</option>
                  {data?.topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </Field>
                <br />
                <Field
                  className={`form-input-${theme}`}
                  name="title"
                  placeholder="Title"
                />
                <ErrorMessage name="title" component="div" />
                <Field
                  className={`form-input-${theme}`}
                  component="textarea"
                  rows="10"
                  cols="40"
                  name="content"
                  placeholder="Write your post here"
                />
                <ErrorMessage name="content" component="div" />
                <br />
                <CustomButton
                  customStyle="generic"
                  disabled={!dirty}
                  type="submit"
                >
                  {"Submit"}
                </CustomButton>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Modal
        show={showNTopicModal}
        onHide={handleClose}
        contentClassName={`navbar-modal-${theme}`}
      >
        <Modal.Header
          closeButton
          closeVariant={theme === "dark" ? "white" : undefined}
        >
          <Modal.Title>{"NEW TOPIC"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={nTopicInitialValues}
            onSubmit={handleTopicSubmit}
          >
            {({
              dirty,
            }) => (
              <Form>
                <div>
                  <Field
                    className={`form-input-${theme}`}
                    name="name"
                    placeholder="Topic name"
                  />
                  <ErrorMessage name="name" component="div" />
                  <Field
                    className={`form-input-${theme}`}
                    component="textarea"
                    rows="5"
                    cols="40"
                    name="description"
                    placeholder="Describe the topic"
                  />
                  <ErrorMessage name="description" component="div" />
                </div>
                <CustomButton
                  customStyle="generic"
                  disabled={!dirty}
                  type="submit"
                >
                  {"Submit"}
                </CustomButton>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <div
        className={
          mobile ? "mobile-navbar-buttons-container"
          : "desktop-navbar-buttons-container"
        }
      >
        {localStorage.getItem("token") ?
          <React.Fragment>
            <CustomButton
              onClick={onClickHome}
              customStyle="user-buttons"
            >
              <img
                src="/home.svg"
                width="20"
                height="20"
                alt="Home Icon"
              />
            </CustomButton>
            <CustomButton
              onClick={onClickUser}
              customStyle="user-buttons"
            >
              <img
                src="/userpage.svg"
                width="20"
                height="20"
                alt="Home Icon"
              />
            </CustomButton>
            <CustomButton
              onClick={onClickLogout}
              customStyle="user-buttons"
            >
              <img
                src="/settings.svg"
                width="23"
                height="23"
                alt="Home Icon"
              />
            </CustomButton>
          </React.Fragment> :
          <React.Fragment>
            <Login /><Signup />
          </React.Fragment>}
        <CustomButton
          onClick={onChangeTheme}
          customStyle="moon"
        >
          {themeCtx.theme === "light" ?
            <img
              src="/moon.svg"
              width="20"
              height="20"
              alt="Moon Icon"
            /> :
            <img
              src="/sun.svg"
              width="20"
              height="20"
              alt="Moon Icon"
            />}
        </CustomButton>
      </div>
    </React.Fragment>
  )
}

export { Navbar };
