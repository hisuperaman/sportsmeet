import { Text } from "react-native";

export default function MyText(props: any) {
  return <Text {...props} style={[{ fontFamily: 'poppins' }, props.style]} />;
}