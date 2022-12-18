export interface IGetUserResult {
  me: {
    id: string;
    username: string;
    dateJoined: string;
  };
};

export interface IDeleteAccountResult {
  deleteAccount: {
    success: boolean;
    errors: {
      nonFieldErrors: [
        {
          message: string;
          code: string;
        }
      ]
    };
  };
};

export interface IPasswordChangeResult {
  passwordChange: {
    success: boolean;
    errors: {
      nonFieldErrors: [
        {
          message: string;
          code: string;
        }
      ]
    };
  };
};

export interface IResendActEmail {
  resendActivationEmail: {
    success: boolean;
    errors: {
      email: [
        {
          message: string;
          code: string;
        }
      ]
    };
  };
};
