import { View, Text } from 'react-native';
import { ProductStatus } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = useColors();

  const getStatusInfo = () => {
    switch (status) {
      case 'AUTHORIZED':
        return {
          label: 'HOMOLOGUÉ',
          icon: '✓',
          bgColor: '#2E7D32',
          textColor: '#FFFFFF',
        };
      case 'RETIRED':
        return {
          label: 'RETIRÉ (PPNU)',
          icon: '⚠️',
          bgColor: '#D32F2F',
          textColor: '#FFFFFF',
        };
      case 'NOT_FOUND':
        return {
          label: 'NON TROUVÉ',
          icon: '?',
          bgColor: '#757575',
          textColor: '#FFFFFF',
        };
      default:
        return {
          label: 'INCONNU',
          icon: '?',
          bgColor: '#757575',
          textColor: '#FFFFFF',
        };
    }
  };

  const info = getStatusInfo();

  const sizeClasses = {
    sm: 'px-3 py-1',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={`rounded-full flex-row items-center gap-2 ${sizeClasses[size]}`}
      style={{ backgroundColor: info.bgColor }}
    >
      <Text style={{ fontSize: size === 'sm' ? 12 : size === 'md' ? 14 : 16 }}>
        {info.icon}
      </Text>
      <Text
        className={`font-semibold ${textSizeClasses[size]}`}
        style={{ color: info.textColor }}
      >
        {info.label}
      </Text>
    </View>
  );
}
