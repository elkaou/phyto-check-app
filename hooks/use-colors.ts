import { useColorScheme } from 'react-native';

export const useColors = () => {
  const scheme = useColorScheme();
  return {
    primary: '#007AFF',
    background: scheme === 'dark' ? '#000000' : '#FFFFFF',
    text: scheme === 'dark' ? '#FFFFFF' : '#000000',
  };
};
