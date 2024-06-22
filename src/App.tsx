import reactLogo from "./assets/react.svg";
import { JWTForm } from "./components/jwt-form";
import { useEffect } from "react";
import { ProfileContainer } from "./components/profile-container";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useJWTStore } from "./stores/jwt";

function App() {
  const { setCache, getCache, clearExpiredCache } = useLocalStorage();
  const { jwtKey, jwtValue, setJWT, clearJWT } = useJWTStore();

  useEffect(() => {
    const jwt = getCache(jwtKey);
    if (jwt) setJWT(jwt);
    const intervalTime = 5 * 60 * 1000; // 30s
    const interval = setInterval(() => {
      clearExpiredCache(clearJWT);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [getCache, clearExpiredCache, jwtKey, setJWT, clearJWT]);

  const onJWTUpdated = (jwt: string) => {
    const cacheTime = 30 * 60 * 1000; // 30m
    setCache(jwtKey, jwt, cacheTime);
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
        {!jwtValue ? <JWTForm callback={onJWTUpdated} /> : <ProfileContainer />}
      </div>
    </>
  );
}

export default App;
