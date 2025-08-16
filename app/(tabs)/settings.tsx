import MyText from "@/components/ui/MyText";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/FirebaseConfig";
import { SettingCardType } from "@/types";
import { signOut } from "@firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";


function SettingCard({
    label,
    onPress,
    isLoading = false
}: SettingCardType) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-card shadow-md p-4 rounded-xl h-14"
            activeOpacity={0.6}
        >
            {
                isLoading ? (
                    <ActivityIndicator size="small" color="blue" />
                ) : (
                    <MyText className="text-textPrimary">{label}</MyText>
                )
            }
        </TouchableOpacity>
    )
}

export default function Settings({

}) {
    const router = useRouter()

    const { user } = useAuth()

    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function handleLogout() {
        setIsLoggingOut(true)
        try {
            await signOut(auth)
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'You are logged out!'
            })

            router.replace({
                pathname: '/landing-page'
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
            setIsLoggingOut(false)
        }
    }

    if (!user) return null

    return (
        <ScrollView
            className="bg-background"
            contentContainerStyle={{ paddingBottom: 120 }}
        >

            <View className="p-4 gap-4">

                <SettingCard label={'Change Password'} onPress={() => router.push('/change-password')} />
                <SettingCard label={'Logout'} onPress={handleLogout} isLoading={isLoggingOut} />

            </View>
        </ScrollView>
    )
}