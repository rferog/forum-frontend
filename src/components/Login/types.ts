export interface IAuthResult {
  tokenAuth: {
    success: boolean;
    errors: {
      nonFieldErrors: [
        {
          message: string;
          code: string;
        }
      ]
    };
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
    }
  }
}
