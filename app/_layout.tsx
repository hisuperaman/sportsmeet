import { useFonts } from "expo-font"
import "../global.css"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message"
import "@/FirebaseConfig"
import AuthProvider from "@/contexts/AuthContext";
import MatchesProvider from "@/contexts/MatchesContext";
import TournamentsProvider from "@/contexts/TournamentsContext";


const PoppinsRegular = require('@/assets/fonts/Poppins-Regular.ttf');
const PoppinsBlack = require('@/assets/fonts/Poppins-Black.ttf');
const PoppinsBlackItalic = require('@/assets/fonts/Poppins-BlackItalic.ttf');
const PoppinsBold = require('@/assets/fonts/Poppins-Bold.ttf');
const PoppinsBoldItalic = require('@/assets/fonts/Poppins-BoldItalic.ttf');
const PoppinsExtraBold = require('@/assets/fonts/Poppins-ExtraBold.ttf');
const PoppinsExtraBoldItalic = require('@/assets/fonts/Poppins-ExtraBoldItalic.ttf');
const PoppinsExtraLight = require('@/assets/fonts/Poppins-ExtraLight.ttf');
const PoppinsExtraLightItalic = require('@/assets/fonts/Poppins-ExtraLightItalic.ttf');
const PoppinsItalic = require('@/assets/fonts/Poppins-Italic.ttf');
const PoppinsLight = require('@/assets/fonts/Poppins-Light.ttf');
const PoppinsLightItalic = require('@/assets/fonts/Poppins-LightItalic.ttf');
const PoppinsMedium = require('@/assets/fonts/Poppins-Medium.ttf');
const PoppinsMediumItalic = require('@/assets/fonts/Poppins-MediumItalic.ttf');
const PoppinsSemiBold = require('@/assets/fonts/Poppins-SemiBold.ttf');
const PoppinsSemiBoldItalic = require('@/assets/fonts/Poppins-SemiBoldItalic.ttf');
const PoppinsThin = require('@/assets/fonts/Poppins-Thin.ttf');
const PoppinsThinItalic = require('@/assets/fonts/Poppins-ThinItalic.ttf');


SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'poppins': PoppinsRegular,
    'poppins-black': PoppinsBlack,
    'poppins-black-italic': PoppinsBlackItalic,
    'poppins-bold': PoppinsBold,
    'poppins-bold-italic': PoppinsBoldItalic,
    'poppins-extra-bold': PoppinsExtraBold,
    'poppins-extra-bold-italic': PoppinsExtraBoldItalic,
    'poppins-extra-light': PoppinsExtraLight,
    'poppins-extra-light-italic': PoppinsExtraLightItalic,
    'poppins-italic': PoppinsItalic,
    'poppins-light': PoppinsLight,
    'poppins-light-italic': PoppinsLightItalic,
    'poppins-medium': PoppinsMedium,
    'poppins-medium-italic': PoppinsMediumItalic,
    'poppins-semibold': PoppinsSemiBold,
    'poppins-semibold-italic': PoppinsSemiBoldItalic,
    'poppins-thin': PoppinsThin,
    'poppins-thin-italic': PoppinsThinItalic,
  });

  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return null
  }

  return (
    <AuthProvider>

      <TournamentsProvider>

        <MatchesProvider>
          <Stack
            screenOptions={({ navigation }) => ({
              headerShown: false,
              headerStyle: { backgroundColor: "#F5F5F5" },
              headerTintColor: 'black',
              headerTitleStyle: {
                fontFamily: 'poppins-semibold',
              },
              headerTitleAlign: 'center',

              headerShadowVisible: false,
            })}>

            <Stack.Screen name="landing-page" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="match-info" options={{ headerShown: true, title: 'Match Info' }} />
            <Stack.Screen name="change-password" options={{ headerShown: true, title: 'Change Password' }} />
            <Stack.Screen name="archived-results" options={{ headerShown: true, title: 'Archived Results' }} />
            <Stack.Screen name="new-match" options={{ headerShown: true, title: 'New/Edit Match' }} />
            <Stack.Screen name="new-tournament" options={{ headerShown: true, title: 'New/Edit Tournament' }} />
            <Stack.Screen name="tournament-matches" options={{ headerShown: true, title: 'Tournament Matches' }} />

          </Stack>
          <Toast />
        </MatchesProvider>

      </TournamentsProvider>

    </AuthProvider>

  );
}
