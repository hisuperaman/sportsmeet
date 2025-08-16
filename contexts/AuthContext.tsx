import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import { usePathname, useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
    user: any
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export default function AuthProvider({
    children
}: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const auth = useMemo(() => getAuth(), [])


    const [user, setUser] = useState<User | null>(null)

    const value = useMemo(() => ({ user }), [user]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u)
        });

        return unsub;
    }, []);

    useEffect(() => {
        const publicRoutes = [
            "/login",
            "/archived-results",
            "/match-info",
            "/archives",
            "/",
            "/landing-page",
            "/tournaments",
            "/tournament-matches",
        ];
        const isPublic = publicRoutes.includes(pathname);


        if (!user && !isPublic) {
            router.replace("/login");
        }
        else if (user && pathname === '/login') {
            router.replace("/(tabs)")
        }
    }, [pathname])


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}