import { View, Text, StyleSheet } from 'react-native';

type StatusBadgeProps = {
  status: 'success' | 'warning' | 'error' | 'info';
  text?: string;
};

export const StatusBadge = ({ status, text }: StatusBadgeProps) => {
  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return '#4CAF50'; // Vert
      case 'warning':
        return '#FF9800'; // Orange
      case 'error':
        return '#F44336'; // Rouge
      case 'info':
        return '#2196F3'; // Bleu
      default:
        return '#9E9E9E'; // Gris
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>
        {text || status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
