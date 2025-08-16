import TournamentsSection from "@/components/TournamentsSection";
import { useTournaments } from "@/contexts/TournamentsContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function Archives() {
    const router = useRouter()

    const { tournaments, tournamentsLoading, populateTournaments } = useTournaments()

    function handleCardClick(tId: string) {
        const tournament = tournaments.find(t => t.id === tId)
        router.push({
            pathname: '/archived-results',
            params: { tournamentId: tId, tournamentName: tournament?.name }
        })
    }

    useEffect(() => {
        populateTournaments()
    }, [])

    return (
        <ScrollView
            className="bg-background"
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
                <RefreshControl refreshing={tournamentsLoading} onRefresh={populateTournaments} />
            }
        >

            <TournamentsSection
                title={'Archives'}
                titleVisible={false}
                tournaments={tournaments}
                onCardClick={handleCardClick}
                matchesLoading={tournamentsLoading}
            />

        </ScrollView>
    )
}