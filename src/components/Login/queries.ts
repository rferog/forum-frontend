import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const GET_USER_TOKEN: DocumentNode = gql`
  mutation GetUserToken($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export { GET_USER_TOKEN }
