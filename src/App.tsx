import reactLogo from "./assets/react.svg";
import "./App.css";
import { JWTForm } from "./components/jwt-form";
import { useEffect, useState } from "react";
import { ProfileContainer } from "./components/profile-container";

function App() {
  const jwtCacheKey = "user_token";
  const [jwt, setJWT] = useState("");

  function setItemWithExpiry(key: string, value: string, ttl: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  function getItemWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  function removeExpiredItems() {
    const now = new Date().getTime();
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const item = JSON.parse(itemStr);
          if (item.expiry && now > item.expiry) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  }

  useEffect(() => {
    const jwt = getItemWithExpiry(jwtCacheKey);
    if (jwt) {
      setJWT(jwt);
    }
    const interval = setInterval(() => {
      removeExpiredItems();
    }, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  const onJWTUpdated = (jwt: string) => {
    setItemWithExpiry(jwtCacheKey, jwt, 30 * 60 * 1000); // 30m
    setJWT(jwt);
  };

  return (
    <>
      <div className="flex justify-center mt-12 mb-6">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="flex w-1/2 justify-center mx-auto mb-32">
        {!jwt ? (
          <JWTForm callback={onJWTUpdated} />
        ) : (
          <ProfileContainer jwt={jwt} />
        )}
      </div>
    </>
  );
}

export default App;
