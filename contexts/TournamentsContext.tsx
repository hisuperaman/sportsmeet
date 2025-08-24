import { getArchivedTournaments, getUpcomingTournaments } from "@/services/firebaseService";
import { TournamentType } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import Toast from "react-native-toast-message";


type TournamentsContextType = {
    tournaments: TournamentType[]
    tournamentsLoading: boolean
    populateTournaments: () => void
    upcomingTournaments: TournamentType[]
    upcomingTournamentsLoading: boolean
    populateUpcomingTournaments: () => Promise<void>
};

const TournamentContext = createContext<TournamentsContextType | null>(null)

export function useTournaments() {
    const context = useContext(TournamentContext);
    if (!context) throw new Error("useTournaments must be used within TournamentsProvider");
    return context;
}

export default function TournamentsProvider({
    children
}: { children: ReactNode }) {
    const [tournaments, setTournaments] = useState<TournamentType[]>([])
    const [tournamentsLoading, setTournamentsLoading] = useState<boolean>(true)

    const [upcomingTournaments, setUpcomingTournaments] = useState<TournamentType[]>([])
    const [upcomingTournamentsLoading, setUpcomingTournamentsLoading] = useState<boolean>(true)

    async function populateTournaments() {
        setTournamentsLoading(true)
        try {
            const ts = await getArchivedTournaments()
            setTournaments(ts)
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error fetching tournaments'
            })
        }
        finally {
            setTournamentsLoading(false)
        }
    }

    async function populateUpcomingTournaments() {
        setUpcomingTournamentsLoading(true)
        try {
            const ts = await getUpcomingTournaments()
            setUpcomingTournaments(ts)
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error fetching tournaments'
            })
        }
        finally {
            setUpcomingTournamentsLoading(false)
        }
    }


    return (
        <TournamentContext.Provider value={{
            tournaments,
            tournamentsLoading,
            populateTournaments,
            upcomingTournaments,
            upcomingTournamentsLoading,
            populateUpcomingTournaments
        }}>
            {children}
        </TournamentContext.Provider>
    )
}