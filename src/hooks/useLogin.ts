import { useCallback, useState } from "react";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);

  const login = useCallback(
    (username: string, password: string) => {
      setLoading(true);

      const UserPoolId = process.env.REACT_APP_USER_POOL_ID;
      const ClientId = process.env.REACT_APP_CLIENT_ID;

      if (!UserPoolId || !ClientId) {
        console.error("Invalid environment variables!");
        return;
      }

      const userPool = new CognitoUserPool({
        UserPoolId,
        ClientId,
      });

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (e) => {
          setLoading(false);

          const inOneHour = new Date(new Date().getTime() + 59 * 60 * 1000);

          // Store Cognito ID token as a cookie
          const idToken = e.getIdToken();
          Cookies.set("lcg-id-token", idToken.getJwtToken(), {
            expires: inOneHour,
          });

          // Send the user back to where they were before the login page
          let from = (location.state as any)?.from?.pathname || "/portal";
          navigate(from, { replace: true });
        },
        onFailure: (e) => {
          console.log(e);
          setLoading(false);
        },
      });
    },
    [location.state, navigate]
  );

  return { login, loading };
}
