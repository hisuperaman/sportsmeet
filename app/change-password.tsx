import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { auth } from "@/FirebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "@firebase/auth";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ChangePassword({

}) {
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    function resetForm() {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    async function onChangeClick() {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All inputs are required'
            })
            return
        }
        if (formData.newPassword !== formData.confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'New password and confirm password does not match'
            })
            return
        }
        const user = auth.currentUser
        if (user) {
            setIsLoading(true)
            const credential = EmailAuthProvider.credential(user.email || "", formData.currentPassword)
            try {
                await reauthenticateWithCredential(user, credential)
                await updatePassword(user, formData.newPassword)
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Password updated'
                })
                resetForm()
                return
            }
            catch (e: any) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: e.message.split("Firebase:")[1].trim()
                })
                resetForm()
                return
            }
            finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >

            <ScrollView className="bg-background">

                <View className="p-4 gap-2">
                    <Input label={'Current Password'} value={formData.currentPassword}
                        onChange={(text) => setFormData((prev) => ({ ...prev, currentPassword: text }))}
                    />
                    <Input label={'New Password'} value={formData.newPassword}
                        onChange={(text) => setFormData((prev) => ({ ...prev, newPassword: text }))}
                    />
                    <Input label={'Confirm Password'} value={formData.confirmPassword}
                        onChange={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
                    />

                    <Button label={'Change'} onPress={onChangeClick} isLoading={isLoading} />
                </View>

            </ScrollView>
        </KeyboardAvoidingView>

    )
}