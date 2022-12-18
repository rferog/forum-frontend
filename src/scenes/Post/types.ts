import { IComment } from 'components/Post/types';

export interface ICommentBox {
  onCancel?: () => void;
  parentComment?: IComment;
  parentPost: string;
}
