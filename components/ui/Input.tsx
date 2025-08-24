import { TextInput, View } from "react-native";
import MyText from "./MyText";
import { InputType } from "@/types";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "sentences"
}: InputType) {
  return (
    <View className="mb-4">
      <MyText className="mb-1 text-base text-gray-700">{label}</MyText>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 text-base bg-white h-12 text-black"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
