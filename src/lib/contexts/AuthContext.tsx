"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  profile: any | null;
  signOut: () => Promise<void>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAIL = "abdulquader057@gmail.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const savedMockUser = localStorage.getItem("luxe-mock-user");
        const savedMockProfile = localStorage.getItem("luxe-mock-profile");
        if (savedMockUser && savedMockProfile) {
          setUser(JSON.parse(savedMockUser));
          setProfile(JSON.parse(savedMockProfile));
          setIsLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          fetchProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: "mock-user-12345",
      email: "demo@luxe.com",
      user_metadata: {
        full_name: "Demo Vanguard",
        phone_number: "+919876543210",
        style_dna: {
          wardrobeCompletion: 92,
          level: 5,
        }
      }
    };
    const demoProfile = {
      id: "mock-user-12345",
      email: "demo@luxe.com",
      full_name: "Demo Vanguard",
      phone_number: "+919876543210",
      role: "customer"
    };
    setUser(demoUser as any);
    setProfile(demoProfile);
    localStorage.setItem("luxe-mock-user", JSON.stringify(demoUser));
    localStorage.setItem("luxe-mock-profile", JSON.stringify(demoProfile));
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("luxe-mock-user");
      localStorage.removeItem("luxe-mock-profile");
      setUser(null);
      setProfile(null);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, profile, signOut, loginAsDemo }}>
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
