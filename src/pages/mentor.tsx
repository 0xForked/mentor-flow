import { useEffect } from "react";
import { JWTForm } from "@/components/jwt-form";
import { ProfileContainer } from "@/components/profile-container";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useJWTStore } from "@/stores/jwt";

export const MentorPage = () => {
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

  return (<div className="flex w-1/2 justify-center mx-auto mb-32">
    {!jwtValue ? <JWTForm callback={onJWTUpdated} /> : <ProfileContainer />}
  </div>)
}
