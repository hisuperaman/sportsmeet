import { ActivityIndicator, TouchableOpacity } from "react-native";
import MyText from "./MyText";
import { ButtonType } from "@/types";

export default function Button({
    label,
    onPress,
    isDanger = false,
    isLoading = false,
}: ButtonType) {
    return (
        <TouchableOpacity onPress={onPress} className={`${isDanger ? 'bg-secondary' : 'bg-primary'} rounded-xl p-4 text-center h-14`} activeOpacity={0.8} disabled={isLoading}>
            {
                isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <MyText className="text-center text-white">{label}</MyText>
                )
            }
        </TouchableOpacity>
    )
}