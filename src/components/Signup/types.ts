export interface IRegisterResult{
  register: {
    success: Boolean,
    errors: {
    email: [
      {
        message: string,
        code: string,
      },
    ],
    username: [
      {
        message: string,
        code: string,
      },
    ],
    password1: [
      {
        message: string,
        code: string,
      },
    ],
    password2: [
      {
        message: string,
        code: string,
      },
    ]
  },
    token: string | null,
    refreshToken: string | null,
  },
};
