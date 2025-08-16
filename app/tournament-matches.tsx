import ExtraActions from "@/components/ExtraActions";
import MatchesSection from "@/components/MatchesSection";
import Button from "@/components/ui/Button";
import FloatingButton from "@/components/ui/FloatingButton";
import MyText from "@/components/ui/MyText";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/contexts/MatchesContext";
import { useTournaments } from "@/contexts/TournamentsContext";
import { deleteTournamentById, liveUpdateTournamentStatus } from "@/services/firebaseService";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function TournamentMatches() {
    const { tournamentId } = useLocalSearchParams()

    const { user } = useAuth()

    const { archivedMatches, archivedMatchesLoading, populateArchivedMatches } = useMatches()

    const [isStatusUpdating, setIsStatusUpdating] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)

    const { upcomingTournaments, populateUpcomingTournaments } = useTournaments()

    const tournament = upcomingTournaments.find(t => t.id === tournamentId)

    const router = useRouter()

    useEffect(() => {
        populateArchivedMatches(tournamentId as string)
    }, [tournamentId])


    function handleMatchClick(id: string) {
        router.push({
            pathname: '/match-info',
            params: { id, tournamentType: 'upcoming', isArchived: 'true', tournamentId: tournament?.id }
        })
    }

    function handleStatusChange() {
        // live
        Alert.alert(
            'Confirm',
            'Do you want to make the tournament live?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        setIsStatusUpdating(true)
                        try {
                            const response = await liveUpdateTournamentStatus(tournament?.id)

                            if (response?.error) {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    text2: response?.message
                                })
                                return
                            }
                            Toast.show({
                                type: 'success',
                                text1: 'Success',
                                text2: 'Now live'
                            })

                            router.replace('/(tabs)')
                        }
                        catch (e) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Server error'
                            })
                        }
                        finally {
                            setIsStatusUpdating(false)
                        }
                    }
                }
            ]
        )
    }

    function handleTournamentDelete() {
        Alert.alert(
            'Confirm',
            'Do you want to delete this tournament?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        setIsDeleting(true)
                        try {
                            await deleteTournamentById(tournament?.id)

                            await populateUpcomingTournaments()

                            Toast.show({
                                type: 'success',
                                text1: 'Success',
                                text2: 'Tournament deleted'
                            })


                            router.back()
                        }
                        catch (e) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Server error'
                            })
                        }
                        finally {
                            setIsDeleting(false)
                        }
                    }
                }
            ]
        )
    }

    return (
        <View className="flex-1 bg-background">

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={archivedMatchesLoading} onRefresh={() => populateArchivedMatches(tournamentId as string)} />
                }
            >


                {
                    tournament && (
                        <View className="flex-row items-center justify-between px-4 pt-4">
                            <MyText
                                className="text-3xl"
                                style={{ fontFamily: 'poppins-semibold' }}
                            >
                                {tournament?.name}
                            </MyText>

                            <StatusBadge className="bg-primary" label="UPCOMING" />
                        </View>
                    )
                }

                {
                    (user && !archivedMatchesLoading && archivedMatches.length > 0) && (
                        <View className="px-4 pt-4">
                            <Button isLoading={isStatusUpdating} label={'Live Now'} onPress={handleStatusChange} />
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

            {
                user && (
                    <View
                        className="absolute bottom-32 right-0 p-4 gap-2"
                    >
                        <ExtraActions
                            onDelete={handleTournamentDelete}
                            onEdit={() => router.push({
                                pathname: '/new-tournament',
                                params: { tournamentId, tournamentName: tournament?.name, editing: 'true' }
                            })}
                            isDeleting={isDeleting}
                        />


                        <FloatingButton
                            icon={faAdd as IconDefinition}
                            onPress={() => router.push({
                                pathname: '/new-match',
                                params: { tournamentId }
                            })}
                        />
                    </View>
                )
            }

        </View>
    )
}