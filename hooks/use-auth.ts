import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, loginWithGoogle, logout as apiLogout } from "@/lib/api";
import type { User } from "@/types/api";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);

  const { data: user, isLoading: isQueryLoading, refetch } = useQuery({
    queryKey: ["auth:me"],
    queryFn: getCurrentUser,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    setIsLoading(isQueryLoading);
  }, [isQueryLoading]);

  const login = () => {
    loginWithGoogle();
  };

  const logout = async () => {
    try {
      await apiLogout();
      refetch();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetch,
  };
}
