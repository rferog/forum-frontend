import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const GET_TOPIC_INFO: DocumentNode = gql`
  query GetTopicInfo($topicId: String!, $first: Int) {
    topic(id: $topicId) {
      name
      description
      postSet(first: $first) {
        edges {
          node {
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
            }
          }
        }
      }
    }
  }
`;

export { GET_TOPIC_INFO };
