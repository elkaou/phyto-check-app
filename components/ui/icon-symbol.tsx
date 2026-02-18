import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;

const MAPPING: IconMapping = {
  "house.fill": "home",
  "clock.fill": "history",
  "magnifying-glass": "search",
  "gearshape.fill": "settings",
  "star.fill": "star",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const iconName = MAPPING[name] || "help";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
