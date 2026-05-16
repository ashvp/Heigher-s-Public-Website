import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Define your whitelist here
export const WHITELISTED_EMAILS = [
  "23f3000169@ds.study.iitm.ac.in",
  "moderator@heighers.com",
  "test@example.com",
  // Add more emails here
];

interface WhitelistedRouteProps {
  children: React.ReactNode;
}

export default function WhitelistedRoute({ children }: WhitelistedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse text-xl font-heading uppercase tracking-widest">
          Verifying <span className="text-primary">Access...</span>
        </div>
      </div>
    );
  }

  const isAllowed = user && user.email && WHITELISTED_EMAILS.includes(user.email.toLowerCase());

  if (isAllowed) {
    return <>{children}</>;
  }

  // If not logged in or not whitelisted, redirect to login or home
  // Here we redirect to home
  return <Navigate to="/" replace />;
}
