import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-external-keyboard';

const RAIL = '#d8d8e0';
const SYSTEM_BLUE = '#0a84ff';

type Variant = 'default' | 'tint' | 'expanded' | 'custom';

const CARDS: {
  variant: Variant;
  title: string;
  code: string;
  accent: string; // drives comet / node / focus wash
  tintProp?: string; // value passed to tintColor (undefined = system default)
}[] = [
  {
    variant: 'default',
    title: 'Default halo',
    code: '<Pressable />',
    accent: SYSTEM_BLUE,
  },
  {
    variant: 'tint',
    title: 'tintColor',
    code: 'tintColor="#ff7a00"',
    accent: '#ff7a00',
    tintProp: '#ff7a00',
  },
  {
    variant: 'expanded',
    title: 'Expanded halo',
    code: 'haloExpendX={16} haloExpendY={16}',
    accent: '#34c759',
    tintProp: '#34c759',
  },
  {
    variant: 'custom',
    title: 'Custom ring',
    code: 'haloEffect={false} + focusStyle',
    accent: '#ff2d55',
  },
];

const CARD_H = 84;
const GAP = 24;
const RAIL_W = 34;
const RAIL_CX = 17;
const DOT_R = 9;
const nodeY = (i: number) => i * (CARD_H + GAP) + CARD_H / 2;

export const NativeFocusStyleScreen = () => {
  const [focused, setFocused] = useState<number | null>(null);

  const t = useRef(new Animated.Value(0)).current;
  const cometOn = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused == null) {
      Animated.timing(cometOn, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
      return;
    }
    pop.setValue(0.6);
    Animated.parallel([
      Animated.timing(cometOn, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.spring(t, {
        toValue: focused,
        useNativeDriver: true,
        speed: 13,
        bounciness: 7,
      }),
      Animated.spring(pop, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 12,
      }),
    ]).start();
  }, [focused, cometOn, t, pop]);

  const onNav = (index: number, isFocused: boolean) =>
    setFocused((cur) => (isFocused ? index : cur === index ? null : cur));

  const cometColor = focused != null ? CARDS[focused]!.accent : SYSTEM_BLUE;

  return (
    <View style={styles.screen}>
      <Text style={styles.intro}>
        Tab through the buttons — each shows a different native focus halo. iOS
        draws the halo; Android shows its system highlight.
      </Text>

      <View style={styles.body}>
        {/* Left rail with a comet that follows the focused button. */}
        <View style={styles.rail}>
          <View style={styles.railLine} />
          {CARDS.map((c, i) => {
            const active = focused === i;
            return (
              <View
                key={c.variant}
                style={[
                  styles.node,
                  {
                    top: nodeY(i) - DOT_R,
                    borderColor: active ? c.accent : RAIL,
                  },
                  active && { backgroundColor: c.accent },
                ]}
              />
            );
          })}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.comet,
              {
                opacity: cometOn,
                transform: [
                  {
                    translateY: t.interpolate({
                      inputRange: CARDS.map((_, i) => i),
                      outputRange: CARDS.map((_, i) => nodeY(i)),
                    }),
                  },
                  { scale: pop },
                ],
              },
            ]}
          >
            <View style={[styles.cometCore, { backgroundColor: cometColor }]} />
          </Animated.View>
        </View>

        <View style={styles.cards}>
          {CARDS.map((c, i) => (
            <HaloCard
              key={c.variant}
              index={i}
              focused={focused === i}
              onNav={onNav}
              {...c}
            />
          ))}
        </View>
      </View>

      <Text style={styles.footnote}>
        The comet on the left tracks keyboard focus; the halo around each button
        is the native effect those props produce.
      </Text>
    </View>
  );
};

const HaloCard = ({
  index,
  variant,
  title,
  code,
  accent,
  tintProp,
  focused,
  onNav,
}: {
  index: number;
  variant: Variant;
  title: string;
  code: string;
  accent: string;
  tintProp?: string;
  focused: boolean;
  onNav: (index: number, isFocused: boolean) => void;
}) => {
  const expanded = variant === 'expanded';
  const custom = variant === 'custom';
  // The last two avoid corner radius — the iOS halo follows the view's
  // cornerRadius, and rounding it (haloCornerRadius / roundedHaloFix) is flaky.
  return (
    <Pressable
      onFocusChange={(isFocused) => onNav(index, isFocused)}
      tintColor={tintProp}
      haloEffect={!custom}
      haloExpendX={expanded ? 16 : undefined}
      haloExpendY={expanded ? 16 : undefined}
      haloCornerRadius={expanded ? 16 : undefined}
      roundedHaloFix={expanded ? true : undefined}
      defaultFocusHighlightEnabled={custom ? false : undefined}
      focusStyle={custom ? styles.customRing : undefined}
      style={[
        styles.card,
        focused && { backgroundColor: accent + '14', borderColor: accent },
      ]}
    >
      <Text style={[styles.cardTitle, focused && { color: accent }]}>
        {title}
      </Text>
      <Text style={styles.cardCode}>{code}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f7', padding: 16 },

  intro: {
    fontSize: 13.5,
    color: '#3c3c43',
    lineHeight: 19,
    marginBottom: 18,
  },

  body: { flexDirection: 'row' },
  rail: { width: RAIL_W, height: nodeY(CARDS.length - 1) + CARD_H / 2 },
  railLine: {
    position: 'absolute',
    left: RAIL_CX,
    top: nodeY(0),
    height: nodeY(CARDS.length - 1) - nodeY(0),
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: RAIL,
  },
  node: {
    position: 'absolute',
    left: RAIL_CX - DOT_R + 1,
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  comet: {
    position: 'absolute',
    top: -DOT_R,
    left: RAIL_CX - DOT_R + 1,
    width: DOT_R * 2,
    height: DOT_R * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cometCore: {
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  cards: { flex: 1, gap: GAP },
  card: {
    height: CARD_H,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  cardSquare: { borderRadius: 0 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1c1c1e' },
  cardCode: { fontFamily: 'Courier', fontSize: 12.5, color: '#8e8e93' },

  customRing: {
    borderWidth: 3,
    borderColor: '#ff2d55',
    backgroundColor: '#ffffff',
  },

  footnote: {
    marginTop: 18,
    fontSize: 12.5,
    color: '#8e8e93',
    lineHeight: 17,
  },
});
