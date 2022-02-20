import "./styles.css";
import { useState, useEffect } from "react";

const currentHost = window.location.origin;

console.log("Updated 2");

const getToken = (code: string) => {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      code,
      redirect_uri: currentHost + "/spotify-callback",
      grant_type: "authorization_code"
    }),
    headers: {
      Authorization:
        "Basic " +
        btoa(
          "d82258f507cb4c2abc5c615bab6dfa2a" +
            ":" +
            "299a7f46481d48d4bedd28820e7f11b7"
        )
    },
    json: true
  }).then((response) => response.json());
};

const getLikedSongs = (token: string) => {
  return fetch("https://api.spotify.com/v1/me/tracks", {
    method: "GET",
    headers: {
      Authorization: `Authorization: Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
};

export default function App() {
  // получаем сохранённый токен из локалстораджа
  const [token, setToken] = useState(localStorage.getItem("token"));

  // пользователь переходит в спотифай по ссылке
  const spotifyAuthLink =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: "d82258f507cb4c2abc5c615bab6dfa2a",
      scope:
        "user-read-private user-read-email user-library-modify user-library-read streaming app-remote-control",
      redirect_uri: currentHost + "/spotify-callback"
    }).toString();

  // спотифай редиректит обратно в приложение, отдаёт code
  const query = new URLSearchParams(window.location.search);
  const code = query.get("code");

  // используем code, чтобы получить токен
  useEffect(() => {
    if (code) {
      window.history.replaceState({}, null, "/");

      getToken(code)
        .then((tokenResponse) => {
          setToken(tokenResponse.access_token);
          localStorage.setItem("token", tokenResponse.access_token);

          return tokenResponse.access_token;
        })
        .then((token) => {
          getLikedSongs(token).then(console.log);
        });
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div className="App">
        {token ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
          >
            Sign Out
          </button>
        ) : (
          <header className="App-header">
            {!code && (
              <a
                className="App-link"
                href={spotifyAuthLink}
                rel="noopener noreferrer"
              >
                Sign in with Spotify
              </a>
            )}
          </header>
        )}
      </div>
    </div>
  );
}
