import { FloatingButtonType } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ActivityIndicator, TouchableOpacity } from "react-native";

export default function FloatingButton({
    icon,
    onPress,
    isLoading = false,
    cls = '',
    isSmall = false
}: FloatingButtonType) {
    return (
        <TouchableOpacity
            className={`bg-primary ${isSmall ? 'p-4' : 'p-6'} rounded-full items-center justify-center ${cls}`}
            activeOpacity={0.8}
            onPress={onPress}
        >
            {
                isLoading ? (
                    <ActivityIndicator size={'small'} color={'blue'} />
                ) : (
                    <FontAwesomeIcon icon={icon} size={isSmall ? 18 : 20} color="white" />
                )
            }
        </TouchableOpacity>
    )
}