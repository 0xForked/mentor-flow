import { JWTForm } from "@/components/jwt-form";
import { MentorList } from "@/components/mentee/mentor-list";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMenteeJWTStore } from "@/stores/menteeJWT";
import { useEffect } from "react";

export const MenteePage = () => {
  const { setCache, getCache, clearExpiredCache } = useLocalStorage();
  const { menteeJWTKey, menteeJWTValue, setJWT, clearMenteeJWT } = useMenteeJWTStore();

  useEffect(() => {
    const jwt = getCache(menteeJWTKey);
    if (jwt) setJWT(jwt);
    const intervalTime = 5 * 60 * 1000; // 30s
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

  return (<div className="flex w-1/2 justify-center mx-auto mb-32">
    {!menteeJWTValue ? <JWTForm callback={onJWTUpdated} /> : <MentorList />}
  </div>)
};
