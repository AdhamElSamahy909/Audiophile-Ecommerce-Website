"use client";

import { AuthUser } from "@/features/auth/tokens";
import { createContext, useContext, useRef, useState } from "react";
import { createStore, useStore } from "zustand";

type User = AuthUser | null;

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const createAuthStore = (initUser: User) => {
  return createStore<AuthState>()((set) => ({
    user: initUser,
    isAuthenticated: !!initUser,
    setUser: (user: User) => set({ user, isAuthenticated: true }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
  }));
};

type AuthStoreType = ReturnType<typeof createAuthStore>;
const AuthContext = createContext<AuthStoreType | null>(null);

export function AuthProvider({
  children,
  initUser,
}: {
  children: React.ReactNode;
  initUser: User;
}) {
  const [store] = useState(() => createAuthStore(initUser));

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export function useAuth<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthContext);

  if (!store) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return useStore(store, selector);
}
