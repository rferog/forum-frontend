import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const REGISTER_NEW_USER_MUTATION: DocumentNode = gql`
  mutation RegisterNewUserMutation(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export { REGISTER_NEW_USER_MUTATION };
