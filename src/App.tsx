import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwt_decode from "jwt-decode";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { IUserInfo } from "components/Navbar/types";
import { ToastMsg } from "components/ToastMsg";
import { Home } from "scenes/Home";
import { useContext } from "react";
import { ThemeContext } from "themeContext";

interface IRefreshTokenResult {
  refreshToken: {
    success: boolean;
    token: string;
    refreshToken: string;
  };
};

const refreshLink = new TokenRefreshLink({
  accessTokenField: 'token',
  isTokenValidOrUndefined: () => {
    const token = localStorage.getItem("token") ?? "";
    const userInfo: IUserInfo = token ?
    jwt_decode(token) : { username: "", exp: 0 }

    if (!token) {
      return true;
    } else if (userInfo.exp * 1000 > Date.now()) {
      return true;
    } else {
      return false
    }
  },
  fetchAccessToken: async () => {
    const token = localStorage.getItem("token") ?? "";
    const refreshToken = localStorage.getItem("refreshToken") ?? "";
    if (!token) {
      return null;
    }
    const response = await fetch(`https://api.rferog.com/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation refreshToken {
          refreshToken(refreshToken: "${refreshToken}") {
            success
            errors
            token
            refreshToken
            payload
          }
        }`,
      }),
    });
    return response.json();
  },
  handleFetch: (token: string) => {
    localStorage.setItem('token', token);
  },
  handleResponse: () => (response: { data: IRefreshTokenResult }) => {
    if (!response) return { token: null };
    localStorage.setItem(
      'refreshToken', response.data.refreshToken.refreshToken
    );
    return {
      token: response.data.refreshToken.token
    }
  },
  handleError: () => {
    localStorage.clear();
    ToastMsg("Your session has expired, please log in again");
  },
});

const httpLink = createHttpLink({
  uri: 'https://api.rferog.com/graphql',
});

const authLink = setContext(() => {
  // TODO: Auth token shouldn't be stored in localstorage as
  // this method is a potential security vulnerability
  // but good enough for practicing
  const token = localStorage.getItem('token');
  return {
    headers: {
      authorization: token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: refreshLink.concat(authLink).concat(httpLink),
});

const App = () => {
  const themeCtx = useContext(ThemeContext);
  if (themeCtx.theme === "dark") {
    document.body.style.backgroundColor = "rgb(0, 0, 0)";
  } else {
    document.body.style.backgroundColor = "rgb(218, 224, 230)";
  }

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App;
