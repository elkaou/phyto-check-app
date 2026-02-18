import { View, type ViewProps } from "react-native";
import { useColors } from "@/hooks/use-colors";

export function ThemedView(props: ViewProps) {
  const colors = useColors();
  return (
    <View
      {...props}
      style={[{ backgroundColor: colors.background }, props.style]}
    />
  );
}
