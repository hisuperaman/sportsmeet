import { View } from "react-native";
import MyText from "./MyText";
import { StatusBadgeType } from "@/types";

export default function StatusBadge({
    label,
    className
}: StatusBadgeType) {
    return (
        <View className={`${className} bg-opacity-50 px-3 py-1 rounded-xl flex-row items-center justify-center`}>
            <MyText className="text-white items-center" style={{ textAlignVertical: 'center', height: 20 }}>
                {label}
            </MyText>
        </View>
    )
}