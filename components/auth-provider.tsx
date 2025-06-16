"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  store_name?: string;
  phone?: string;
  address?: string;
  status: "active" | "suspended" | "pending";
  verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type UserRole = "admin" | "seller" | "buyer";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
    storeName?: string
  ) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount by calling /api/auth/me
    const checkAuthStatus = async () => {
      try {
        console.log("🔄 Checking auth status...");
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            console.log(`✅ User authenticated: ${data.user.email}`);
          }
        } else {
          console.log("❌ No authenticated user found");
        }
      } catch (error) {
        console.error("❌ Failed to check auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`🔐 Attempting login for: ${email}`);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.success) {
        setUser(data.user);
        console.log(`✅ Login successful for: ${email}`);
        return true;
      } else {
        console.error("❌ Login failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role = "buyer",
    storeName?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`📝 Attempting registration for: ${email}, role: ${role}`);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          ...(role === "seller" && storeName && { storeName }),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        console.log(`✅ Registration successful for: ${email}`);
        return true;
      } else {
        console.error("❌ Registration failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
