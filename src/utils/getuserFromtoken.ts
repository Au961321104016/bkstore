import { jwtDecode } from "jwt-decode";

type UserRole = "ADMIN" | "USER";

interface DecodedToken {
  userId: string;
  email: string;
  role?: UserRole;
  name?: string;
  exp?: number;
}

// Helper to check token expiration
const isTokenExpired = (exp?: number): boolean => {
  return exp ? Date.now() >= exp * 1000 : true;
};

// ✅ Client-side: use in components/pages
export const getUserFromToken = (): DecodedToken | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (isTokenExpired(decoded.exp)) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("JWT decode error in getUserFromToken (client):", error);
    return null;
  }
};

// ✅ Server-side: use in getServerSideProps or API routes
export const getUserFromTokenServer = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (isTokenExpired(decoded.exp)) {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("JWT decode error in getUserFromTokenServer (server):", error);
    return null;
  }
};
