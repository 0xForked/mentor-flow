import { JWTForm } from "@/components/jwt-form";
import { MenteeContainer } from "@/components/mentee/mentee-container";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMenteeJWTStore } from "@/stores/menteeJWT";
import { useEffect } from "react";

export const MenteePage = () => {
  const { setCache, getCache, clearExpiredCache } = useLocalStorage();
  const { menteeJWTKey, menteeJWTValue, setJWT, clearMenteeJWT } = useMenteeJWTStore();

  useEffect(() => {
    const jwt = getCache(menteeJWTKey);
    if (jwt) setJWT(jwt);
    const intervalTime = 5 * 60 * 1000; // 5m
    const interval = setInterval(() => {
      clearExpiredCache(clearMenteeJWT);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [getCache, clearExpiredCache, menteeJWTKey, setJWT, clearMenteeJWT]);

  const onJWTUpdated = (jwt: string) => {
    const cacheTime = 30 * 60 * 1000; // 30m
    setCache(menteeJWTKey, jwt, cacheTime);
    setJWT(jwt);
  };

  if (!menteeJWTValue) {
    return (
      <div className="flex w-1/2 justify-center mx-auto mb-32">
        <JWTForm callback={onJWTUpdated} />{" "}
      </div>
    );
  }

  return <MenteeContainer />;
};
