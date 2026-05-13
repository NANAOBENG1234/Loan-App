"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && isLoading) {
      authService
        .getProfile()
        .then(setUser)
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, []);

  return { user, isAuthenticated, isLoading };
}
