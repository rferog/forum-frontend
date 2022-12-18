import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const CREATE_POST_MUTATION: DocumentNode = gql`
  mutation CreatePostMutation(
    $title: String!
    $content: String!
    $parentTopic: String!
  ) {
    createPost(
      title: $title
      content: $content
      parentTopic: $parentTopic
    ) {
      success
    }
  }
`;

const CREATE_TOPIC_MUTATION: DocumentNode = gql`
  mutation CreateTopicMutation($name: String!, $description: String!) {
    createTopic(name: $name, description: $description) {
      success
      topic {
          id
      }
    }
  }
`;

const GET_ALL_TOPIC_NAMES: DocumentNode = gql`
  query GetAllTopicNames {
    topics {
      id
      name
    }
  }
`;

export {
  CREATE_POST_MUTATION,
  CREATE_TOPIC_MUTATION,
  GET_ALL_TOPIC_NAMES,
}
