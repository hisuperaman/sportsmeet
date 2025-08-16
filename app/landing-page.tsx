import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function LandingPage() {
    const router = useRouter()


    useEffect(() => {
        setTimeout(() => {
            router.replace({
                pathname: '/(tabs)'
            })
        }, 100);
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="black" />
        </View>
    )
}