import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageTitle from "@/components/ui/PageTitle";
import { useMatches } from "@/contexts/MatchesContext";
import { games } from "@/data/games";
import { createMatch } from "@/services/firebaseService";
import { NewMatchStateType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from "react-native-toast-message";

type localParamsType = {
    tournamentId: string
    matchId: string
    gameName: string
    round: string
    teamAName: string
    teamAPlayers: string
    teamBName: string
    teamBPlayers: string
    editing: string
}

export default function NewMatch({

}) {
    const {
        tournamentId,
        matchId,
        gameName,
        round,
        teamAName,
        teamAPlayers,
        teamBName,
        teamBPlayers,
        editing
    }: localParamsType = useLocalSearchParams()

    const router = useRouter()

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(
        games.map(game => (
            { label: game.name.toUpperCase(), value: game.name }
        ))
    );

    const { populateArchivedMatches } = useMatches()

    const [formData, setFormData] = useState<NewMatchStateType>({
        gameName: editing ? gameName : '',
        round: editing ? round : '',
        teamA: {
            name: editing ? teamAName : '',
            players: editing ? teamAPlayers : '',
        },
        teamB: {
            name: editing ? teamBName : '',
            players: editing ? teamBPlayers : '',
        }
    })

    const [isLoading, setIsLoading] = useState(false)


    function resetForm() {
        setFormData({
            gameName: '',
            round: '',
            teamA: {
                name: '',
                players: '',
            },
            teamB: {
                name: '',
                players: '',
            }
        })
    }


    async function handleCreateClick() {
        if (!formData.gameName || !formData.round || !formData.teamA.name || !formData.teamB.name) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Input fields must not be empty'
            })
            return
        }

        setIsLoading(true)
        try {
            if (editing) {
                await createMatch(formData, tournamentId, matchId)
            }
            else {
                await createMatch(formData, tournamentId)
            }
            await populateArchivedMatches(tournamentId)
            Toast.show({
                type: 'info',
                text1: 'Success',
                text2: 'Match created'
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
            resetForm()
        }
    }

    return (
        <FlatList
            renderItem={null}
            data={[]}
            ListHeaderComponent={
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={100}
                >
                    <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        className="bg-background"
                    >

                        <View className="p-4 gap-4" style={{ flex: 1 }}>
                            <PageTitle title={editing ? 'Edit Match' : 'New Match'} />

                            <View className="gap-2">
                                <DropDownPicker
                                    open={open}
                                    value={formData.gameName}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={(callback) =>
                                        setFormData((prev) => ({ ...prev, gameName: callback(prev.gameName) }))
                                    }
                                    setItems={setItems}
                                    style={{ borderRadius: 10 }}
                                />

                                <Input
                                    label={'Round'}
                                    value={formData.round}
                                    onChange={(text) =>
                                        setFormData((prev) => ({ ...prev, round: text }))
                                    }
                                />

                                <Input
                                    label={'Team A'}
                                    value={formData.teamA.name}
                                    onChange={(text) =>
                                        setFormData((prev) => ({ ...prev, teamA: { ...prev.teamA, name: text } }))
                                    }
                                />
                                <Input
                                    label={'Team A Players (comma-separated) *'}
                                    value={formData.teamA.players}
                                    onChange={(text) =>
                                        setFormData((prev) => ({ ...prev, teamA: { ...prev.teamA, players: text } }))
                                    }
                                />
                                <Input
                                    label={'Team B'}
                                    value={formData.teamB.name}
                                    onChange={(text) =>
                                        setFormData((prev) => ({ ...prev, teamB: { ...prev.teamB, name: text } }))
                                    }
                                />
                                <Input
                                    label={'Team B Players (comma-separated) *'}
                                    value={formData.teamB.players}
                                    onChange={(text) =>
                                        setFormData((prev) => ({ ...prev, teamB: { ...prev.teamB, players: text } }))
                                    }
                                />

                                <Button label={editing ? 'Update' : 'Create'} onPress={handleCreateClick} isLoading={isLoading} />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            }
        />
    )
}