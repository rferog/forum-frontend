import { IPost } from "components/Post/types"

export interface IPostFeed {
  morePosts: () => void;
  posts: IPost[];
};
