export interface ICreatePostResult {
  createPost: {
    success: boolean;
  },
}

export interface ICreateTopicResult {
  createTopic: {
    success: boolean;
    topic: {
      id: string;
      name: string;
      description: string;
    };
  },
}

export interface IGetAllTopicNamesResult {
  topics: {
    id: string;
    name: string;
  }[],
}

export interface IUserInfo {
  username: string;
  exp: number;
}
