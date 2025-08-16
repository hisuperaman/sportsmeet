import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageTitle from "@/components/ui/PageTitle";
import { useTournaments } from "@/contexts/TournamentsContext";
import { createOrUpdateTournament } from "@/services/firebaseService";
import { NewTournamentStateType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function NewTournament({

}) {
    const { tournamentId, tournamentName, editing } = useLocalSearchParams()

    const router = useRouter()
    const [formData, setFormData] = useState<NewTournamentStateType>({
        tournamentName: editing ? tournamentName as string : ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const { populateUpcomingTournaments } = useTournaments()

    function resetForm() {
        setFormData({
            tournamentName: ''
        })
    }


    async function handleCreateClick() {
        if (!formData.tournamentName) {
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
                await createOrUpdateTournament(formData, tournamentId as string)
            }
            else {
                await createOrUpdateTournament(formData)
            }
            await populateUpcomingTournaments()
            Toast.show({
                type: 'info',
                text1: 'Success',
                text2: editing ? 'Tournament updated' : 'Tournament created'
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
                            <PageTitle title={'New Tournament'} />

                            <View className="gap-2">

                                <Input
                                    label={'Name'}
                                    value={formData.tournamentName}
                                    onChange={(text) =>
                                        setFormData((prev) => ({ ...prev, tournamentName: text }))
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