import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArchive, faCircle, faGear, faMedal, faUser } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutChangeEvent, TouchableOpacity, View } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useEffect, useState } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";


function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const [dimensions, setDimensions] = useState({ height: 20, width: 100 })

    const buttonWidth = dimensions.width / state.routes.length

    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        })
    }

    const tabPositionX = useSharedValue(0)

    const animatedTranslateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }]
        }
    })

    return (
        <View onLayout={onTabbarLayout} className="flex-row bg-primary mx-6 mb-8 rounded-full gap-4 p-2 absolute bottom-0">

            <Animated.View
                style={[
                    animatedTranslateStyle,
                    { backgroundColor: 'rgba(255, 255, 255, 1)', margin: 4, width: buttonWidth - 8, height: dimensions.height - 8, position: 'absolute', borderRadius: '50%' }
                ]}
            />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const isFocused = state.index === index;


                const scale = useSharedValue(0)

                useEffect(() => {
                    scale.value = withTiming(isFocused ? 1 : 0, {
                        duration: 100,
                        easing: Easing.out(Easing.quad)
                    })
                }, [isFocused])

                const animatedScaleStyle = useAnimatedStyle(() => ({
                    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.4]) }]
                }))


                const onPress = () => {
                    tabPositionX.value = withTiming(buttonWidth * index, { duration: 20 })

                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            borderRadius: '50%',
                        }}
                        className="items-center justify-center h-20"
                    >
                        <Animated.View
                            style={[animatedScaleStyle]}
                        >
                            {options.tabBarIcon ? options.tabBarIcon({
                                focused: isFocused,
                                color: 'gray',
                                size: 24,
                            }) : null}
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}

        </View>
    );
}


export default function TabLayout() {
    const { user } = useAuth()

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: "#F5F5F5" },
                headerTintColor: 'black',
                headerTitleStyle: {
                    fontFamily: 'poppins-semibold',
                    fontSize: 24
                },
                headerTitleAlign: 'center',

                headerShadowVisible: false
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Live Tournament',
                    tabBarIcon: () => (
                        <FontAwesomeIcon icon={faCircle as IconProp} style={{ color: 'gray' }} size={22} />
                    )
                }} />
            <Tabs.Screen
                name="tournaments"
                options={{
                    title: 'Tournaments',
                    tabBarIcon: () => (
                        <FontAwesomeIcon icon={faMedal as IconProp} style={{ color: 'gray' }} size={22} />
                    )
                }} />

            <Tabs.Screen
                name="archives"
                options={{
                    title: 'Archives',
                    tabBarIcon: () => (
                        <FontAwesomeIcon icon={faArchive as IconProp} style={{ color: 'gray' }} size={22} />
                    )
                }} />

            <Tabs.Screen
                name="settings"
                options={{
                    title: user ? 'Settings' : 'Login',
                    tabBarIcon: () => (
                        user ? (
                            <FontAwesomeIcon icon={faGear as IconProp} style={{ color: 'gray' }} size={22} />
                        ) : (
                            <FontAwesomeIcon icon={faUser as IconProp} style={{ color: 'gray' }} size={22} />
                        )
                    ),
                }}
            />

        </Tabs>
    )
}