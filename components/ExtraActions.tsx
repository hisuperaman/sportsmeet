import { ExtraActionsType } from "@/types";
import FloatingButton from "./ui/FloatingButton";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose, faEllipsis, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function ExtraActions({
    onDelete,
    onEdit,
    isDeleting = false
}: ExtraActionsType) {
    const [isVisible, setIsVisible] = useState(false)

    const opacity = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {

        return {
            opacity: interpolate(opacity.value, [0, 1], [0, 1]),
            transform: [{ translateY: interpolate(opacity.value, [0, 1], [50, 0]) }]
        }
    })

    useEffect(() => {
        if (isVisible) {
            opacity.value = withTiming(1, {
                duration: 100
            })
        }
        else {
            opacity.value = withTiming(0, {
                duration: 100
            })
        }
    }, [isVisible])

    return (
        <>
            <Animated.View
                style={animatedStyle}
                className={'gap-2'}
                pointerEvents={isVisible ? 'auto' : 'none'}
            >
                <View className="flex-row justify-center">
                    <FloatingButton
                        icon={faTrash as IconDefinition}
                        onPress={onDelete}
                        cls="bg-secondary"
                        isSmall={true}
                        isLoading={isDeleting}
                    />
                </View>

                <View className="flex-row justify-center">
                    <FloatingButton
                        icon={faPencil as IconDefinition}
                        onPress={onEdit}
                        cls=""
                        isSmall={true}
                    />
                </View>
            </Animated.View>

            <View className="flex-row justify-center">
                <FloatingButton
                    icon={!isVisible ? faEllipsis as IconDefinition : faClose as IconDefinition}
                    isSmall
                    onPress={() => setIsVisible(prev => !prev)}
                />
            </View>
        </>
    )
}