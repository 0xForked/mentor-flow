import { useMutation, UseMutationResult, UseQueryResult, useQuery } from 'react-query';
import { Availability, User } from '@/lib/user';
import { API_PATH, handleResponse, HttpResponse } from '@/lib/http';
import { useUserStore } from '@/states/userStore';
import { useJWTStore } from '@/states/jwtStore';


export function useAPI() {
  const { jwtValue } = useJWTStore();
  const { setUserProfile, setUserAvailability } = useUserStore();

  const useCreateAvailability = (): UseMutationResult<HttpResponse<Availability>, Error, Partial<Availability>, unknown> => {
    return useMutation<HttpResponse<Availability>, Error, Partial<Availability>>(
      async (data) => {
        const response = await fetch(API_PATH.AVAILABILITY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtValue}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        return handleResponse<HttpResponse<Availability>>(response);
      }
    );
  }

  const useGetProfile = (): UseQueryResult<User | null, Error> => {
    return useQuery<User | null, Error>(
      ['profile', jwtValue],
      async () => {
        const pr = await fetch(API_PATH.PROFILE, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtValue}`,
          },
          credentials: 'include',
        });
        const profileData = await handleResponse<HttpResponse<User>>(pr);
        const pd = profileData?.data;
        setUserProfile(pd);
        return pd;
      }
    );
  };

  const useGetAvailability = (): UseQueryResult<Availability | null, Error> => {
    return useQuery<Availability | null, Error>(
      ['availability', jwtValue],
      async () => {
        const ar = await fetch(API_PATH.AVAILABILITY, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtValue}`,
          },
          credentials: 'include',
        });
        const availabilityData = await handleResponse<HttpResponse<Availability>>(ar);
        const ad = availabilityData?.data;
        setUserAvailability(ad);
        return ad;
      }
    );
  };

  return {
    useCreateAvailability,
    useGetProfile,
    useGetAvailability,
  };
}
