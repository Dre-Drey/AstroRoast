import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../actions";
import { useAuth } from "../contexts/AuthContext";

export const profileQueryKey = (userId?: string) => ["profile", userId];

export const useProfileQuery = () => {
  const { session, loading } = useAuth();

  return useQuery({
    queryKey: profileQueryKey(session?.user.id),
    queryFn: () => fetchProfile(session!.user.id),
    enabled: !!session?.user.id && !loading,
    retry: 1,
  });
};
