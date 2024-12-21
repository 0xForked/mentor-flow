import { useEffect } from "react";
import { JWTForm } from "@/components/jwt-form";
import { ProfileContainer } from "@/components/mentor/profile-container";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMentorJWTStore } from "@/stores/mentorJWT";

export const MentorPage = () => {
  const { setCache, getCache, clearExpiredCache } = useLocalStorage();
  const { mentorJWTKey, mentorJWTValue, setJWT, clearMentorJWT } = useMentorJWTStore();

  useEffect(() => {
    const jwt = getCache(mentorJWTKey);
    if (jwt) setJWT(jwt);
    const intervalTime = 5 * 60 * 1000; // 5m
    const interval = setInterval(() => {
      clearExpiredCache(clearMentorJWT);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [getCache, clearExpiredCache, mentorJWTKey, setJWT, clearMentorJWT]);

  const onJWTUpdated = (jwt: string) => {
    const cacheTime = 45 * 60 * 1000; // 45m
    setCache(mentorJWTKey, jwt, cacheTime);
    setJWT(jwt);
  };

  return (
    <div className="flex w-1/2 justify-center mx-auto mb-32">
      {!mentorJWTValue ? <JWTForm callback={onJWTUpdated} /> : <ProfileContainer />}
    </div>
  );
};
