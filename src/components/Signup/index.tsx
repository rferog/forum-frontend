import { useMutation } from '@apollo/client';
import {
  Formik,
  Form,
  Field,
  ErrorMessage
} from 'formik';
import React, { useCallback, useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IRegisterResult } from 'components/Signup/types';
import './index.css';
import { CustomButton } from 'components/Buttons';
import { REGISTER_NEW_USER_MUTATION } from 'components/Signup/queries';
import { ToastMsg } from 'components/ToastMsg';
import { ThemeContext } from 'themeContext';

const Signup: React.FC = (): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  const initialValues = {
    username: "",
    email: "",
    password1: "",
    password2: "",
  };

  const handleMutationResult = (result: IRegisterResult): void => {
    if (result.register.success) {
      handleClose();
      ToastMsg("Account created, you can now login");
    } else if (result.register.errors) {
      const [key] = Object.keys(result.register.errors)
      if (key === "username" ||
        key === "email" ||
        key === "password1" ||
        key === "password2") {
        ToastMsg(result.register.errors[key][0].message);
      };
    };
  };

  const handleCreateError = (): void => {
    ToastMsg("Error registering, please try again");
  };

  const [registerUser] = useMutation<IRegisterResult>(REGISTER_NEW_USER_MUTATION,
    {
      onCompleted: handleMutationResult,
      onError: handleCreateError,
    });

  const handleSubmit = useCallback(
    (values: {
      username: string;
      email: string;
      password1: string;
      password2: string;
    }): void => {
      void registerUser({
        variables: {
          username: values.username,
          email: values.email,
          password1: values.password1,
          password2: values.password2,
        },
      });
    },
    [registerUser]
  );

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleShowModal = () => setShowModal(true);

  return (
    <React.Fragment>
      <CustomButton
        onClick={handleShowModal}
        customStyle="generic"
      >
        {"SIGN UP"}
      </CustomButton>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header
          className={`navbar-modal-${theme}`}
          closeButton
          closeVariant="white"
        >
          <Modal.Title>{"SIGN UP"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`navbar-modal-${theme}`}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({
              dirty,
            }) => (
              <Form>
                {"Provide the following information to sign up"}
                <Field
                  className={`form-input-${theme}`}
                  name="username"
                  placeholder="Username"
                  type="username"
                />
                <ErrorMessage name="username" component="div" />
                <br />
                <Field
                  className={`form-input-${theme}`}
                  name="email"
                  placeholder="Email"
                  type="email"
                />
                <ErrorMessage name="email" component="div" />
                <br />
                <Field
                  className={`form-input-${theme}`}
                  name="password1"
                  placeholder="Password"
                  type="password"
                />
                <ErrorMessage name="password1" component="div" />
                <br />
                <Field
                  className={`form-input-${theme}`}
                  name="password2"
                  placeholder="Repeat password"
                  type="password"
                />
                <ErrorMessage name="password2" component="div" />
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
    </React.Fragment>
  )
}

export { Signup };
