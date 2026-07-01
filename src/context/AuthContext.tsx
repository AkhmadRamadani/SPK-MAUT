"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, signInWithGoogle } from "@/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  auth: typeof auth;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle,
  auth,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, auth }}>
      {children}
    </AuthContext.Provider>
  );
};
