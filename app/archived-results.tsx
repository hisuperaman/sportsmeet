import MatchesSection from "@/components/MatchesSection";
import MyText from "@/components/ui/MyText";
import StatusBadge from "@/components/ui/StatusBadge";
import { useMatches } from "@/contexts/MatchesContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

type localParamsType = {
    tournamentId: string,
    tournamentName: string
}

export default function ArchivedResults() {
    const { tournamentId, tournamentName }: localParamsType = useLocalSearchParams()

    const { archivedMatches, archivedMatchesLoading, populateArchivedMatches } = useMatches()

    const router = useRouter()

    useEffect(() => {
        populateArchivedMatches(tournamentId)
    }, [tournamentId])


    function handleMatchClick(id: string) {
        router.push({
            pathname: '/match-info',
            params: { id, isArchived: 'true', tournamentType: 'archived', tournamentId, hideActions: 'true' }
        })
    }


    return (
        <View className="flex-1 bg-background">

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={archivedMatchesLoading} onRefresh={() => populateArchivedMatches(tournamentId)} />
                }
            >

                {
                    tournamentName && (
                        <View className="flex-row items-center justify-between px-4 pt-4">
                            <MyText
                                className="text-3xl"
                                style={{ fontFamily: 'poppins-semibold' }}
                            >
                                {tournamentName}
                            </MyText>

                            <StatusBadge className="bg-success" label="COMPLETED" />
                        </View>
                    )
                }

                <MatchesSection
                    title={'Matches'}
                    titleVisible={false}
                    matches={archivedMatches}
                    onMatchClick={handleMatchClick}
                    matchesLoading={archivedMatchesLoading}
                />

            </ScrollView>

        </View>
    )
}