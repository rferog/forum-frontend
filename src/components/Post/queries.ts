import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const CAST_VOTE_MUTATION: DocumentNode = gql`
  mutation CastVoteMutation(
    $parentPostId: ID!
    $voteType: String!
    ) {
      castVote(
        parentPostId: $parentPostId
        voteType: $voteType
      ) {
      success
    }
  }
`;

export { CAST_VOTE_MUTATION }
