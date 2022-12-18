import { gql, useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "themeContext";

interface IVerifyAccount {
  verifyAccount: {
    success: Boolean,
    errors: {
      nonFieldErrors: [
        {
          message: String,
          code: String,
        }
      ],
    };
  };
};

const VERIFY_ACCOUNT_MUTATION = gql`
  mutation verifyAccountMutation (
    $token: String!
  ) {
    verifyAccount (
      token: $token
    ) {
      success,
      errors
    }
  }`;

const AccountVerification: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;

  const { token } = useParams();

  const navigate = useNavigate();

  const [verifyUser, { loading }] = useMutation<IVerifyAccount>(
    VERIFY_ACCOUNT_MUTATION
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    verifyUser({
      variables: {
        token: token
      }
    }).then(activationResult => {
      if (activationResult.data?.verifyAccount.success) {
        setSuccess(true);
        setTimeout(() => { navigate("/") }, 5000);
      } else {
        setSuccess(false);
        setTimeout(() => { navigate("/") }, 5000);
      }
    })
  }, [setSuccess, token, verifyUser]);

  if (loading) {
    return (
      <React.Fragment>
        <div className="base-container">
          <div className="home-content">
            <div className={`default-post-container-${theme}`}>
              {"Verifying..."}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  };

  return (
    <div className="base-container">
      <div className="home-content">
        <div className={`default-post-container-${theme}`}>
          {success ?
            "Account has been verified" :
            "Account could not be verified"
          }
        </div>
      </div>
    </div>
  );
}

export { AccountVerification };
