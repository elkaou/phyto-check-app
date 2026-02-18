import { View } from 'react-native';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export const useTheme = () => ({ theme: 'light' });
