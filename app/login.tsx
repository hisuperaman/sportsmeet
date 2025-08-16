import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/FirebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import Toast from 'react-native-toast-message';
import IconButton from "@/components/ui/IconButton";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import MyText from "@/components/ui/MyText";

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  async function handleLoginClick() {
    if (!formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All inputs are required'
      })
      return
    }

    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'You are logged in!'
      })

      router.replace({
        pathname: '/(tabs)'
      })
    }
    catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Incorrect email or password'
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="w-16 ml-2 bg-background">
          <IconButton
            icon={faHome}
            onPress={() => router.replace('/(tabs)')}
          />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingTop: '30%', paddingBottom: 50 }}
        >


          <View className="flex justify-center items-center relative">

            <View className="w-[75%] gap-1 mb-8">
              <MyText
                className={'text-4xl pb-4'}
                style={{ fontFamily: 'poppins-semibold', lineHeight: 44 }}
              >
                Login
              </MyText>
              <MyText>Welcome back to the app</MyText>
            </View>

            <View className="w-[75%]">
              <Input
                label="Email"
                value={formData.email}
                onChange={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                autoCapitalize="none"
              />
              <Input
                label="Password"
                value={formData.password}
                onChange={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                secureTextEntry
                autoCapitalize="none"
              />
              <Button label="Login" onPress={handleLoginClick} isLoading={isLoading} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
