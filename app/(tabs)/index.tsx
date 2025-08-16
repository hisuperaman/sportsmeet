import MatchesSection from "@/components/MatchesSection";
import MyText from "@/components/ui/MyText";
import StatusBadge from "@/components/ui/StatusBadge";
import { useMatches } from "@/contexts/MatchesContext";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

export default function Index() {
    const router = useRouter()

    function handleMatchClick(id: string) {
        router.push({
            pathname: '/match-info',
            params: { id, tournamentType: 'live' }
        })
    }


    const { matches, matchesLoading, liveTournament } = useMatches()
    const liveMatches = matches.filter(match => match.status === 'live');
    const upcomingMatches = matches.filter(match => match.status === 'upcoming');
    const completedMatches = matches.filter(match => match.status === 'completed');

    return (
        <View className="flex-1 bg-background">

            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {
                    liveTournament && (
                        <View className="flex-row items-center justify-between px-4">
                            <MyText
                                className="text-3xl"
                                style={{ fontFamily: 'poppins-semibold' }}
                            >
                                {liveTournament?.name}
                            </MyText>

                            <StatusBadge className="bg-secondary" label="LIVE" />
                        </View>
                    )
                }

                <MatchesSection
                    title={'Live Matches'}
                    matches={liveMatches}
                    onMatchClick={handleMatchClick}
                    matchesLoading={matchesLoading}
                    showLoader={true}
                />

                <MatchesSection
                    title={'Upcoming'}
                    matches={upcomingMatches}
                    onMatchClick={handleMatchClick}
                    matchesLoading={matchesLoading}
                    showLoader={true}
                />

                <MatchesSection
                    title={'Completed'}
                    matches={completedMatches}
                    onMatchClick={handleMatchClick}
                    matchesLoading={matchesLoading}
                    showLoader={true}
                />

            </ScrollView>


        </View>
    )
}