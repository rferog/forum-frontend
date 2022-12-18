import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const GET_ALL_POSTS: DocumentNode = gql`
  query GetAllPosts($first: Int) {
    posts(first: $first) {
      id
      title
      content
      author
      upvoteSet {
        userId
      }
      downvoteSet {
        userId
      }
      parentTopic {
        name
      },
    }
  }
`;

const GET_PAG_TOPIC_NAMES: DocumentNode = gql`
  query GetAllPagTopicNames($first: Int) {
    topics(first: $first) {
      id
      name
    }
  }
`;

export {
  GET_ALL_POSTS,
  GET_PAG_TOPIC_NAMES,
}
