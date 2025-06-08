import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface FlameProps {
  flames: number;
  color: string;
}

const FlameAnimation = ({ flames, color }: FlameProps) => {
  const mainFlame = useSharedValue(0);
  const secondaryFlame = useSharedValue(0);
  const tertiaryFlame = useSharedValue(0);

  const mainConfig = {
    duration: 1500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  const secondaryConfig = {
    duration: 1200,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  };

  const tertiaryConfig = {
    duration: 900,
    easing: Easing.bezier(0.2, 0.8, 0.4, 1),
  };

  useEffect(() => {
    mainFlame.value = withRepeat(withTiming(1, mainConfig), -1, true);

    secondaryFlame.value = withDelay(
      200,
      withRepeat(withTiming(1, secondaryConfig), -1, true)
    );

    tertiaryFlame.value = withDelay(
      400,
      withRepeat(withTiming(1, tertiaryConfig), -1, true)
    );
  }, []);

  const mainFlameStyle = useAnimatedStyle(() => {
    const scale = interpolate(mainFlame.value, [0, 0.5, 1], [1, 1.1, 1]);

    const opacity = interpolate(mainFlame.value, [0, 0.5, 1], [0.9, 1, 0.9]);

    return {
      transform: [
        { scale },
        {
          skewX: `${interpolate(mainFlame.value, [0, 0.5, 1], [-2, 0, 2])}deg`,
        },
      ],
      opacity,
    };
  });

  const secondaryFlameStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      secondaryFlame.value,
      [0, 0.5, 1],
      [0.85, 0.95, 0.85]
    );

    const opacity = interpolate(
      secondaryFlame.value,
      [0, 0.5, 1],
      [0.7, 0.9, 0.7]
    );

    return {
      transform: [
        { scale },
        {
          skewX: `${interpolate(
            secondaryFlame.value,
            [0, 0.5, 1],
            [2, 0, -2]
          )}deg`,
        },
      ],
      opacity,
    };
  });

  const tertiaryFlameStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      tertiaryFlame.value,
      [0, 0.5, 1],
      [0.7, 0.8, 0.7]
    );

    const opacity = interpolate(
      tertiaryFlame.value,
      [0, 0.5, 1],
      [0.5, 0.7, 0.5]
    );

    return {
      transform: [
        { scale },
        {
          skewX: `${interpolate(
            tertiaryFlame.value,
            [0, 0.5, 1],
            [-3, 0, 3]
          )}deg`,
        },
      ],
      opacity,
    };
  });

  return (
    <View className="flex-row items-center gap-2">
      <Text
        style={{
          color: color,
        }}
        className="text-gray-400 font-bold text-lg"
      >
        {flames}
      </Text>
      <View style={styles.flameContainer}>
        <Animated.View style={[styles.flame, styles.mainFlame, mainFlameStyle]}>
          <Text style={styles.flameEmoji}>🔥</Text>
        </Animated.View>
        <Animated.View
          style={[styles.flame, styles.secondaryFlame, secondaryFlameStyle]}
        >
          <Text style={styles.flameEmoji}>🔥</Text>
        </Animated.View>
        <Animated.View
          style={[styles.flame, styles.tertiaryFlame, tertiaryFlameStyle]}
        >
          <Text style={styles.flameEmoji}>🔥</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flameContainer: {
    position: "relative",
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  flame: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  mainFlame: {
    zIndex: 3,
  },
  secondaryFlame: {
    zIndex: 2,
  },
  tertiaryFlame: {
    zIndex: 1,
  },
  flameEmoji: {
    fontSize: 18,
  },
});

export default FlameAnimation;
