import { db } from "@/FirebaseConfig";
import { getMappedMatchesBySnapshot, getTournamentMatchesById } from "@/services/firebaseService";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Unsubscribe } from "@firebase/auth";
import Toast from "react-native-toast-message";
import { MatchType, TournamentType } from "@/types";
import { useTournaments } from "./TournamentsContext";


type MatchesContextType = {
    matches: MatchType[];
    setMatches: React.Dispatch<React.SetStateAction<MatchType[]>>
    matchesLoading: boolean
    archivedMatches: MatchType[]
    setArchivedMatches: React.Dispatch<React.SetStateAction<MatchType[]>>
    archivedMatchesLoading: boolean
    populateArchivedMatches: (tournamentId: string) => Promise<void>
    liveTournament: TournamentType | null
};

const MatchesContext = createContext<MatchesContextType | null>(null)

export function useMatches() {
    const context = useContext(MatchesContext);
    if (!context) throw new Error("useMatches must be used within MatchesProvider");
    return context;
}

export default function MatchesProvider({
    children
}: { children: ReactNode }) {
    const { populateUpcomingTournaments } = useTournaments()

    const [matches, setMatches] = useState<MatchType[]>([])
    const [matchesLoading, setMatchesLoading] = useState<boolean>(false)

    const [liveTournament, setLiveTournament] = useState<TournamentType | null>(null)

    const [archivedMatches, setArchivedMatches] = useState<MatchType[]>([])
    const [archivedMatchesLoading, setArchivedMatchesLoading] = useState<boolean>(false)

    const unsubscribeRef = useRef<Unsubscribe | null>(null)


    useEffect(() => {
        const q = query(collection(db, "tournaments"), where("status", "==", "live"))
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (snapshot.empty) {
                    setLiveTournament(null)
                    return
                }

                const doc = snapshot.docs[0]
                const data = doc.data()
                setLiveTournament({
                    id: doc.id,
                    name: data.name,
                    status: data.status,
                    remaining_matches: data.remaining_matches,
                    matches_count: data.matches_count,
                    players_count: data.players_count,
                    createdAt: data.createdAt ? data.createdAt.toDate() : null,
                    startedAt: data.startedAt ? data.startedAt.toDate() : null,
                    completedAt: data.completedAt ? data.completedAt.toDate() : null,
                });
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!liveTournament) {
            setMatches([])
            return
        }

        const q = query(
            collection(db, "matches"),
            where("tournamentId", "==", liveTournament.id),
            orderBy("createdAt", "desc")
        );

        setMatchesLoading(true)
        unsubscribeRef.current = onSnapshot(q, (snapshot) => {
            const updatedMatches = getMappedMatchesBySnapshot(snapshot)
            setMatches(updatedMatches)
            setMatchesLoading(false)
        })
        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current()
        };
    }, [liveTournament])


    async function populateArchivedMatches(tournamentId: string) {
        // experimental
        populateUpcomingTournaments()

        setArchivedMatchesLoading(true)
        try {
            const fetchedMatches = await getTournamentMatchesById(tournamentId)
            setArchivedMatches(fetchedMatches)
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error fetching matches'
            })
        }
        finally {
            setArchivedMatchesLoading(false)
        }
    }

    return (
        <MatchesContext.Provider value={{
            matches,
            setMatches,
            matchesLoading,
            archivedMatches,
            setArchivedMatches,
            archivedMatchesLoading,
            populateArchivedMatches,
            liveTournament
        }}>
            {children}
        </MatchesContext.Provider>
    )
}