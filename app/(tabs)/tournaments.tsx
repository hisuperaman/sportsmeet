import TournamentsSection from "@/components/TournamentsSection";
import FloatingButton from "@/components/ui/FloatingButton";
import { useAuth } from "@/contexts/AuthContext";
import { useTournaments } from "@/contexts/TournamentsContext";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function Tournament() {
    const { user } = useAuth()
    const router = useRouter()

    const { upcomingTournaments, upcomingTournamentsLoading, populateUpcomingTournaments } = useTournaments()


    useEffect(() => {
        populateUpcomingTournaments()
    }, [])

    return (
        <View className="flex-1 bg-background">

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={upcomingTournamentsLoading} onRefresh={populateUpcomingTournaments} />
                }
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                <TournamentsSection
                    title={'Upcoming'}
                    titleVisible={false}
                    tournaments={upcomingTournaments}
                    onCardClick={(tournamentId) => (
                        router.push({
                            pathname: '/tournament-matches',
                            params: { tournamentId }
                        })
                    )}
                    matchesLoading={upcomingTournamentsLoading}
                />

            </ScrollView>

            {
                user && (
                    <View
                        className="absolute bottom-32 right-0 p-4"
                    >
                        <FloatingButton
                            icon={faAdd as IconDefinition}
                            onPress={() => router.push('/new-tournament')}
                        />
                    </View>
                )
            }
        </View>
    )
}