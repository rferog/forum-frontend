interface ICastVote {
  castVote: {
    success: Boolean;
  };
}

interface IComment {
  id: string;
  parentCommentId: string | null;
  content: string;
  author: string;
  parentPost: {
    id: string;
  };
  children?: IComment[];
}

interface IPost {
  id: string;
  upvoteSet: {
    userId: string;
  }[];
  downvoteSet: {
    userId: string;
  }[];
  author: string;
  title: string;
  content: string;
  parentTopic: {
    id: string;
    name: string;
  };
  comments?: IComment[]
}

export type {ICastVote, IComment, IPost}
