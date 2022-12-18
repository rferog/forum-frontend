import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const CHANGE_PASSWORD_MUTATION: DocumentNode = gql`
  mutation ChangePasswordMutation(
    $oldPassword: String!
    $newPassword1: String!
    $newPassword2: String!
  ) {
    passwordChange(
      oldPassword: $oldPassword
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
    }
  }
`;

const DELETE_ACCOUNT_MUTATION: DocumentNode = gql`
  mutation DeleteAccountMutation($password: String!) {
    deleteAccount(password: $password) {
      success
      errors
    }
  }
`;

const GET_USER: DocumentNode = gql`
  query GetUser {
    me {
      id
      username
      dateJoined
    }
  }
`;

const RESEND_ACT_EMAIL_MUTATION: DocumentNode = gql`
  mutation ResendActEmailMutation($email: String!) {
    resendActivationEmail(email: $email) {
      success
      errors
    }
  }
`;

export {
  CHANGE_PASSWORD_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  GET_USER,
  RESEND_ACT_EMAIL_MUTATION,
};
