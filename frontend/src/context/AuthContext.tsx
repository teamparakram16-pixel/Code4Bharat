import { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role?: "user" | "expert";
  // Add more fields as per your backend response
}

interface AuthContextType {
  isLoggedIn: boolean | undefined;
  setIsLoggedIn: (value: boolean | undefined) => void;
  role: "user" | "expert" | undefined;
  setRole: (value: "user" | "expert" | undefined) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [role, setRole] = useState<"user" | "expert" | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, role, setRole, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
