import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type Props = {
  hitSlop?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  orientation?: 'horizontal' | 'vertical';
  thumbWidth?: number;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  progress?: SharedValue<number>;
};
