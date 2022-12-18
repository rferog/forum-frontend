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
import React, { useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import './index.css';
import { CustomButton } from 'components/Buttons';
import { UserDescription } from 'components/Description';
import { ToastMsg } from 'components/ToastMsg';
import {
  CHANGE_PASSWORD_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  GET_USER,
  RESEND_ACT_EMAIL_MUTATION
} from 'scenes/User/queries';
import {
  IDeleteAccountResult,
  IPasswordChangeResult,
  IResendActEmail
} from 'scenes/User/types';
import { ThemeContext } from 'themeContext';

const UserScene: React.FC = (): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  const handleQueryError = (): void => {
    ToastMsg("Error getting user");
  };

  const { data, loading } = useQuery(GET_USER, {
    onError: handleQueryError,
  });

  const handleDeleteUserResult = (result: IDeleteAccountResult): void => {
    if (result.deleteAccount.success) {
      ToastMsg("Account has been successfully deleted");
      localStorage.clear();
      navigate("/");
    } else if (result.deleteAccount.errors) {
      ToastMsg(result.deleteAccount.errors.nonFieldErrors[0].message);
    };
  };

  const handleDeleteUserError = (): void => {
    ToastMsg("Error deleting account, please try again");
  };

  const [deleteAccount] = useMutation<IDeleteAccountResult>(
    DELETE_ACCOUNT_MUTATION,
    {
      onCompleted: handleDeleteUserResult,
      onError: handleDeleteUserError,
    },
  );

  const handleDeleteAccount = useCallback(
    (values: {
      password: string;
    }): void => {
      void deleteAccount({
        variables: {
          password: values.password,
        },
      });
    },
    [deleteAccount]
  );

  const handleChangePassResult = (result: IPasswordChangeResult): void => {
    if (result.passwordChange.success) {
      ToastMsg("Password changed successfully");
    } else if (result.passwordChange.errors) {
      ToastMsg(result.passwordChange.errors.nonFieldErrors[0].message);
    };
  };

  const handleChangePassError = (): void => {
    ToastMsg("Error changing password, please try again");
  };

  const [changePass] = useMutation<IPasswordChangeResult>(
    CHANGE_PASSWORD_MUTATION,
    {
      onCompleted: handleChangePassResult,
      onError: handleChangePassError,
    },
  );

  const handleChangePass = useCallback(
    (values: {
      oldPassword: string;
      newPassword1: string;
      newPassword2: string;
    }): void => {
      void changePass({
        variables: {
          oldPassword: values.oldPassword,
          newPassword1: values.newPassword1,
          newPassword2: values.newPassword2,
        },
      });
    },
    [changePass]
  );

  const handleResendActEmailResult = (result: IResendActEmail): void => {
    if (result.resendActivationEmail.success) {
      ToastMsg("Email sent successfully");
    } else if (result.resendActivationEmail.errors) {
      ToastMsg(result.resendActivationEmail.errors.email[0].message);
    };
  };

  const handleResendActEmailError = (): void => {
    ToastMsg("Error sending activation email, please try again");
  };

  const [resendActEmail] = useMutation<IResendActEmail>(
    RESEND_ACT_EMAIL_MUTATION,
    {
      onCompleted: handleResendActEmailResult,
      onError: handleResendActEmailError,
    });

  const handleResendActEmail = useCallback(
    (values: {
      email: string;
    }): void => {
      void resendActEmail({
        variables: {
          email: values.email,
        },
      });
    },
    [resendActEmail]
  );

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }

  if (loading) return (
    <div className="user-container">
      <div className="home-content">
        <p className="default-post-container">
          {"Loading..."}
        </p>
      </div>
    </div>
  );
  if (data.me == null) navigate(0);

  return (
    <React.Fragment>
      <div className="user-container">
        {token ?
          <React.Fragment>
            <div className={`user-settings-${theme}`}>
              <h4>{"Delete Account"}</h4>
              <Formik
                initialValues={{ password: "" }}
                onSubmit={handleDeleteAccount}
              >
                {({
                  dirty,
                }) => (
                  <Form>
                    <Field
                      className={`form-input-${theme}`}
                      name="password"
                      placeholder="Password"
                      type="password"
                    />
                    <ErrorMessage name="password" component="div" />
                    <CustomButton
                      customStyle="generic"
                      disabled={!dirty}
                      type="submit"
                    >
                      {"Delete Account"}
                    </CustomButton>
                  </Form>
                )}
              </Formik>
              <hr />
              <h4>{"Change Password"}</h4>
              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword1: "",
                  newPassword2: "",
                }}
                onSubmit={handleChangePass}
              >
                {({
                  dirty,
                }) => (
                  <Form>
                    <Field
                      className={`form-input-${theme}`}
                      name="oldPassword"
                      placeholder="Old password"
                      type="password"
                    />
                    <ErrorMessage name="oldPassword" component="div" />
                    <br />
                    <Field
                      className={`form-input-${theme}`}
                      name="newPassword1"
                      placeholder="New password"
                      type="password"
                    />
                    <ErrorMessage name="newPassword1" component="div" />
                    <br />
                    <Field
                      className={`form-input-${theme}`}
                      name="newPassword2"
                      placeholder="Confirm new password"
                      type="password"
                    />
                    <ErrorMessage name="newPassword2" component="div" />
                    <CustomButton
                      customStyle="generic"
                      disabled={!dirty}
                      type="submit"
                    >
                      {"Change Password"}
                    </CustomButton>
                  </Form>
                )}
              </Formik>
              <hr />
              <h4>{"Resend Activation Email"}</h4>
              <Formik
                initialValues={{ email: "" }}
                onSubmit={handleResendActEmail}
              >
                {({
                  dirty,
                }) => (
                  <Form>
                      <Field
                        className={`form-input-${theme}`}
                        name="email"
                        placeholder="Enter your account's email"
                      />
                      <ErrorMessage name="email" component="div" />
                    <CustomButton
                      customStyle="generic"
                      disabled={!dirty}
                      type="submit"
                    >
                      {"Resend Email"}
                    </CustomButton>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="user-description">
              <UserDescription userDescription={data.me} />
            </div>
          </React.Fragment> :
          undefined
        }
      </div>
    </React.Fragment>
  )
}

export { UserScene };
