import ExtraActions from "@/components/ExtraActions";
import Button from "@/components/ui/Button";
import GameIcon from "@/components/ui/GameIcon";
import MyText from "@/components/ui/MyText";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/contexts/MatchesContext";
import { useTournaments } from "@/contexts/TournamentsContext";
import { games } from "@/data/games";
import { deleteMatchById, updateMatchScore, updateMatchStatus } from "@/services/firebaseService";
import { ActionButtonType, ScoreLayoutAdminType, ScoreLayoutType, TeamMembersType, TeamScoreAdminType, TeamScoreType, TournamentType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";


function ActionButton({
    label,
    color,
    onPress,
    disabled = false
}: ActionButtonType) {
    return (
        <TouchableOpacity onPress={onPress} className="items-center justify-center w-16 h-16 p-2" style={{ borderRadius: '100%' }} disabled={disabled}>
            <MyText className="text-4xl" style={{ color: color }}>{label}</MyText>
        </TouchableOpacity>
    )
}

function TeamScore({
    name,
    score,
    winner = null,
    completed = false
}: TeamScoreType) {
    return (
        <View className="gap-2">
            <MyText className="text-center text-6xl">{score}</MyText>
            <MyText className={`text-center text-2xl break-words ${completed ? (winner == name ? 'text-success font-semibold' : 'text-danger font-semibold') : ''}`}>{name}</MyText>

            {
                (completed && winner == name) && (
                    <MyText className="break-words text-xl" style={{ textAlign: 'center', fontFamily: 'poppins-semibold' }}>
                        Winner 🏆
                    </MyText>
                )
            }
        </View>
    )
}

function TeamScoreAdmin({
    name,
    score,
    onScoreUpdate,
    winner = null,
    completed = false,
    editable = true
}: TeamScoreAdminType) {
    return (
        <View className="gap-2 flex-row items-center justify-between">
            <View className="">
                <MyText className={`text-center text-2xl break-words ${completed ? (winner == name ? 'text-success font-semibold' : 'text-danger font-semibold') : ''}`}>{name}</MyText>
                {
                    (completed && winner == name) && (
                        <MyText className="break-words" style={{ textAlign: 'center' }}>
                            Winner 🏆
                        </MyText>
                    )
                }
            </View>

            <View className="flex-row items-center gap-4">
                <ActionButton onPress={() => onScoreUpdate(name, -1)} label={'-'} color={editable ? 'red' : 'gray'} disabled={!editable} />
                <MyText className="text-center text-6xl">{score}</MyText>
                <ActionButton onPress={() => onScoreUpdate(name, 1)} label={'+'} color={editable ? 'green' : 'gray'} disabled={!editable} />
            </View>
        </View>
    )
}

function TeamMembers({
    members,
    align = 'center'
}: TeamMembersType) {
    return (
        <View>
            <MyText className="text-center font-poppins-semibold text-lg" style={{ fontFamily: 'poppins-semibold' }}>Members</MyText>

            <View className="">
                {
                    members.split(',').map((member, index) => (
                        <MyText key={index} className="w-full" style={{ textAlign: align }}>{index + 1}.   {member.trim()}</MyText>
                    ))
                }
            </View>
        </View>
    )
}

function ScoreLayoutAdmin({
    match,
    completed,
    editable,
    onScoreUpdate,
    onStatusChange,
    isLoading,
    upcomingTournament
}: ScoreLayoutAdminType) {
    return (
        <>
            <View className="bg-card rounded-xl p-4 shadow-md">
                <View className="">
                    <TeamScoreAdmin
                        name={match?.teamA.name}
                        score={match?.teamA.score}
                        winner={match?.winner}
                        completed={completed}
                        editable={editable}
                        onScoreUpdate={(_, sc) => onScoreUpdate('teamA', sc)}
                    />
                </View>

                <View>
                    <MyText className="opacity-50">VS</MyText>
                </View>

                <View className="">
                    <TeamScoreAdmin
                        name={match?.teamB.name}
                        score={match?.teamB.score}
                        winner={match?.winner}
                        completed={completed}
                        editable={editable}
                        onScoreUpdate={(_, sc) => onScoreUpdate('teamB', sc)}
                    />
                </View>

                <View className="items-center mt-2">
                    {
                        match?.draw && (
                            <MyText className="text-2xl" style={{ fontFamily: 'poppins-semibold' }}>
                                Draw
                            </MyText>
                        )
                    }
                </View>
            </View>

            {
                !upcomingTournament && (
                    match?.status !== 'completed' && (
                        <View className="bg-card rounded-xl p-4">
                            <Button isLoading={isLoading} label={match?.status === 'upcoming' ? 'Live Now' : 'Complete Now'} onPress={onStatusChange} />
                        </View>
                    )
                )
            }

        </>

    )
}

function ScoreLayout({
    match,
    completed
}: ScoreLayoutType) {
    return (
        <View className="bg-card rounded-xl p-4 shadow-md">
            <View className="flex-row justify-between items-center">

                <View className="w-[40%]">
                    <TeamScore
                        name={match?.teamA.name}
                        score={match?.teamA.score}
                        completed={completed}
                        winner={match?.winner}
                    />
                </View>

                <View>
                    <MyText className="opacity-50">VS</MyText>
                </View>

                <View className="w-[40%]">
                    <TeamScore
                        name={match?.teamB.name}
                        score={match?.teamB.score}
                        completed={completed}
                        winner={match?.winner}
                    />
                </View>
            </View>

            <View className="items-center mt-2">
                {
                    match?.draw && (
                        <MyText className="text-2xl" style={{ fontFamily: 'poppins-semibold' }}>
                            Draw
                        </MyText>
                    )
                }
            </View>
        </View>
    )
}

export default function MatchInfo() {
    const { isArchived, id: matchId, tournamentType, tournamentId, hideActions } = useLocalSearchParams()

    const user = useAuth()?.user

    const router = useRouter()

    const { matches, archivedMatches, setArchivedMatches, liveTournament } = useMatches()
    const match = isArchived ? archivedMatches.find(m => m.id === matchId) : matches.find(m => m.id === matchId)

    const { upcomingTournaments, tournaments } = useTournaments()

    let tournament: TournamentType | null | undefined = liveTournament
    switch (tournamentType) {
        case 'upcoming':
            tournament = upcomingTournaments.find(t => t.id === tournamentId)
            break;
        case 'archived':
            tournament = tournaments.find(t => t.id === tournamentId)
            break;
        default:
            break;
    }


    useEffect(() => {
        if (!match) {
            router.back();
        }
    }, [match, router]);


    const editable = match?.status === 'live'

    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)



    if (!match) {
        return (
            <ActivityIndicator size={'large'} color={'blue'} />
        )
    }

    function handleChangeToLive() {
        Alert.alert(
            'Confirm',
            'Do you want to make the match live?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        setIsLoading(true)
                        try {
                            await updateMatchStatus(match?.id, 'live', tournament)
                            Toast.show({
                                type: 'success',
                                text1: 'Success',
                                text2: 'Now live'
                            })
                        }
                        catch (e) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Server error'
                            })
                        }
                        finally {
                            setIsLoading(false)
                        }
                    }
                }
            ]
        )
    }

    function handleChangeToCompleted() {
        Alert.alert(
            'Confirm',
            'Do you want to make the match completed?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        setIsLoading(true)
                        try {
                            await updateMatchStatus(match?.id, 'completed', tournament, match?.teamA, match?.teamB)
                            Toast.show({
                                type: 'success',
                                text1: 'Success',
                                text2: 'Match completed'
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
                            setIsLoading(false)
                        }
                    }
                }
            ]
        )
    }

    function handleStatusChange() {
        if (match?.status === 'upcoming') {
            handleChangeToLive()
        }
        else if (match?.status === 'live') {
            handleChangeToCompleted()
        }
    }

    async function handleScoreUpdate(team: string, sc: number) {
        if (match) {
            if (team == 'teamA' || team == 'teamB') {
                if (match[team]?.score === 0 && sc == -1) return
            }

            await updateMatchScore(match?.id, team, sc)
        }
    }


    function handleDeleteClick() {
        Alert.alert(
            'Confirm',
            'Do you want to delete this match?',
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
                            await deleteMatchById(match?.id, tournament, (match?.teamA.players || "") + (match?.teamB.players || ""))
                            Toast.show({
                                type: 'success',
                                text1: 'Success',
                                text2: 'Match deleted'
                            })
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


                            if (isArchived) {
                                setArchivedMatches((prev) => prev.filter(m => m.id !== matchId))
                            }
                        }
                    }
                }
            ]
        )
    }


    const gameIcon = games.find(g => g.name === match.gameName)?.icon

    const completed = match.winner !== null || match.draw !== null

    return (
        <View className="flex-1 bg-background">

            <ScrollView>

                <View className="p-4 gap-4">

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-4 w-[70%]">
                            <GameIcon icon={gameIcon} />

                            <MyText className="text-3xl w-[70%]">
                                {match?.gameName.toUpperCase()}
                            </MyText>
                        </View>

                        <View className="">
                            <StatusBadge className={`${match?.status === 'upcoming' ? 'bg-primary' : (match?.status === 'live' ? 'bg-secondary' : 'bg-success')}`} label={match?.status.toUpperCase()} />
                        </View>
                    </View>

                    {
                        user ? (
                            <ScoreLayoutAdmin
                                match={match}
                                completed={completed}
                                editable={editable}
                                onScoreUpdate={handleScoreUpdate}
                                onStatusChange={handleStatusChange}
                                isLoading={isLoading}
                                upcomingTournament={tournamentType === 'upcoming'}
                            />
                        ) : (
                            <ScoreLayout
                                match={match}
                                completed={completed}
                            />
                        )
                    }

                    {
                        (match?.teamA.players && match?.teamB.players) && (
                            <View className="bg-card rounded-xl p-4 flex-row justify-between">
                                <View className="w-[50%]">
                                    <TeamMembers
                                        members={match?.teamA.players}
                                    />
                                </View>
                                <View className="w-[50%]">
                                    <TeamMembers
                                        members={match?.teamB.players}
                                    />
                                </View>
                            </View>
                        )
                    }




                </View>

            </ScrollView >


            {
                (match.status === 'upcoming' && (user && !hideActions)) && (
                    <View
                        className="absolute bottom-32 right-0 p-4 gap-2"
                    >
                        <ExtraActions
                            onDelete={handleDeleteClick}
                            onEdit={() => router.push({
                                pathname: '/new-match',
                                params: {
                                    tournamentId,
                                    matchId: match.id,
                                    gameName: match.gameName,
                                    round: match.round,
                                    teamAName: match.teamA.name,
                                    teamAPlayers: match.teamA.players,
                                    teamBName: match.teamB.name,
                                    teamBPlayers: match.teamB.players,
                                    editing: 'true'
                                }
                            })}
                            isDeleting={isDeleting}
                        />

                    </View>
                )
            }
        </View>

    )
}