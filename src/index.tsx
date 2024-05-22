import type { LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { useCallback, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import type { Props } from './interfaces';
import { clamp } from './utils';

function Slider(props: Props) {
  const {
    hitSlop: _hitSlop,
    thumbWidth = 24,
    orientation = 'horizontal',
  } = props;

  const hitSlop = useMemo(() => {
    const targ = thumbWidth / 2;
    return (
      _hitSlop ?? {
        top: targ,
        bottom: targ,
        left: targ,
        right: targ,
      }
    );
  }, [_hitSlop, thumbWidth]);

  const thumbValue = useSharedValue(0);

  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const layoutWidth = nativeEvent.layout.width;
    const layoutHeight = nativeEvent.layout.height;

    width.value = layoutWidth;
    height.value = layoutHeight;
  };

  const onActiveSlider = useCallback(
    (x: number, y: number) => {
      'worklet';

      if (orientation === 'horizontal') {
        thumbValue.value = clamp(x, 0, width.value);
      } else {
        thumbValue.value = clamp(y, 0, height.value);
      }
    },
    [orientation, thumbValue, width.value, height.value]
  );

  const onGestureEvent = useMemo(() => {
    return Gesture.Pan()
      .hitSlop(hitSlop)
      .onUpdate(({ x, y }) => {
        onActiveSlider(x, y);
      });
  }, [onActiveSlider, hitSlop]);

  const onSingleTapEvent = useMemo(() => {
    return Gesture.Tap()
      .hitSlop(hitSlop)
      .onBegin(({ x, y }) => {
        onActiveSlider(x, y);
      })
      .onEnd(({ x, y }) => {
        onActiveSlider(x, y);
      });
  }, [onActiveSlider, hitSlop]);

  const gesture = useMemo(
    () => Gesture.Race(onSingleTapEvent, onGestureEvent),
    [onGestureEvent, onSingleTapEvent]
  );

  const animatedThumbStyle = useAnimatedStyle(() => {
    let moveValue = 0;

    moveValue = clamp(
      thumbValue.value,
      0,
      orientation === 'horizontal'
        ? width.value
          ? width.value + thumbWidth
          : 0
        : height.value
          ? height.value + thumbWidth
          : 0
    );
    return {
      transform: [
        orientation === 'horizontal'
          ? {
              translateX: moveValue,
            }
          : {
              translateY: moveValue,
            },
      ],
    };
  }, [orientation === 'horizontal' ? width.value : height.value, orientation]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        onLayout={onLayout}
        style={[
          { flex: 1 },
          orientation === 'horizontal'
            ? {
                height: 10,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.3)',
                position: 'relative',
                justifyContent: 'center',
              }
            : {
                width: 10,
                backgroundColor: 'rgba(0,0,0,0.3)',
                position: 'relative',
                alignItems: 'center',
              },
          props.trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              height: thumbWidth,
              width: thumbWidth,
              borderRadius: thumbWidth,
              backgroundColor: 'black',
            },
            orientation === 'horizontal'
              ? {
                  left: -thumbWidth / 2,
                }
              : {
                  top: -thumbWidth / 2,
                },
            props.thumbStyle,
            animatedThumbStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

export default Slider;
