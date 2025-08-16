import { View } from "react-native";
import MyText from "./MyText";

export default function GameIcon({
    icon
}: { icon: string | React.ComponentType | undefined }) {
    if (typeof icon === "string") {
        return (
            <View className='overflow-hidden p-2 h-16 w-16 bg-primary rounded-xl items-center justify-center'>
                <MyText className="text-4xl" style={{ color: 'white' }}>{icon}</MyText>
            </View>
        )
    }

    if (!icon) return null

    const IconComponent = icon
    return (
        <View className='overflow-hidden p-2 h-16 w-16 bg-primary rounded-xl items-center justify-center'>
            <IconComponent />
        </View>
    )
}