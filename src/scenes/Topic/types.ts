import { IPost } from "components/Post/types";

export interface IGetTopicPosts{
  topic: {
    name: string,
    description: string,
    postSet: IPost[]
  },
};
