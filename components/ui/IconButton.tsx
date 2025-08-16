import { IconButtonType } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native";

export default function IconButton({
    onPress,
    icon
}: IconButtonType) {
    return (
        <TouchableOpacity onPress={onPress} className={`border border-border items-center justify-center rounded-xl py-4 text-center bg-background`} activeOpacity={0.8}>
            <FontAwesomeIcon icon={icon} size={24} color="rgb(13,16,26)" />
        </TouchableOpacity>

    )
}