import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthCtx = createContext(null);

/**
 * DEMO-ONLY session. There is NO real authentication here.
 * When Supabase Auth is added, the role must come from the backend's trusted
 * `role_assignments` table (never from the browser or the signup form).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('aevitwin.demo.session', null);
  const value = useMemo(() => ({
    user,
    signInDemo: (role) => setUser(role === 'doctor' ? { role: 'doctor', name: 'Dr. Ananya Sharma' } : { role: 'patient', name: 'Priya Reddy' }),
    signOut: () => setUser(null),
  }), [user, setUser]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
