import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Pressable } from 'react-native-external-keyboard';
import type { BaseKeyboardViewType } from 'react-native-external-keyboard';

type StopKey = 'jump' | 'skip' | 'target';

const COLORS = {
  jump: '#5856d6',
  skip: '#8e8e93',
  target: '#34c759',
};

// Fixed card metrics let us place the timeline rail / comet without measuring.
const CARD_H = 96;
const CARD_GAP = 18;
const nodeY = (i: number) => i * (CARD_H + CARD_GAP) + CARD_H / 2;
const RAIL_W = 44;
const RAIL_X = 21; // center of the vertical line within the rail column
const DOT_R = 9;

export const ProgrammaticFocusScreen = () => {
  const targetRef = useRef<BaseKeyboardViewType>(null);

  // Truthful focus state — driven by each button's onFocusChange.
  const [focused, setFocused] = useState<StopKey | null>(null);
  const [jumping, setJumping] = useState(false);

  // Comet travels node 0 -> node 2, bowing left to arc *around* the skipped node.
  const progress = useRef(new Animated.Value(0)).current;
  // Pulse ring shown when the target actually receives focus.
  const pulse = useRef(new Animated.Value(0)).current;

  const onFocus = (key: StopKey) => (isFocused: boolean) =>
    setFocused((cur) => (isFocused ? key : cur === key ? null : cur));

  const runJump = () => {
    setJumping(true);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 720,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setJumping(false));
    // The actual API the demo is about: move keyboard focus to the target.
    targetRef.current?.focus();
  };

  // Pulse the target whenever it gains focus (via focus() or by tabbing).
  useEffect(() => {
    if (focused !== 'target') return;
    pulse.setValue(0);
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, pulse]);

  const cometStyle = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, nodeY(2) - nodeY(0)],
        }),
      },
      {
        translateX: progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -18, 0],
        }),
      },
    ],
    opacity: progress.interpolate({
      inputRange: [0, 0.08, 0.9, 1],
      outputRange: [0, 1, 1, 0],
    }),
  };

  return (
    <View style={styles.screen}>
      <View style={styles.intro}>
        <Text style={styles.introText}>
          Pressing <Text style={styles.code}>Jump</Text> calls{' '}
          <Text style={styles.code}>targetRef.current.focus()</Text> — keyboard
          focus lands on the <Text style={styles.bold}>Target</Text>, skipping
          the stop that Tab would normally visit in between.
        </Text>
      </View>

      <View style={styles.timeline}>
        {/* Left rail: dashed line + a node per stop + the travelling comet. */}
        <View style={styles.rail}>
          <View style={styles.railLine} />
          {(['jump', 'skip', 'target'] as StopKey[]).map((key, i) => (
            <Node
              key={key}
              variant={key}
              top={nodeY(i) - DOT_R}
              active={focused === key}
            />
          ))}
          <Animated.View style={[styles.comet, cometStyle]}>
            <View style={styles.cometCore} />
          </Animated.View>
        </View>

        {/* Right column: the three focusable buttons. */}
        <View style={styles.cards}>
          <FocusCard
            variant="jump"
            label="Jump"
            hint="Calls targetRef.current.focus()"
            focused={focused === 'jump'}
            onPress={runJump}
            onFocusChange={onFocus('jump')}
            badge={jumping ? 'focus() →' : undefined}
          />
          <FocusCard
            variant="skip"
            label="Skipped stop"
            hint="Tab would stop here — focus() jumps past it"
            focused={focused === 'skip'}
            onFocusChange={onFocus('skip')}
          />
          <FocusCard
            variant="target"
            innerRef={targetRef}
            label="Target"
            hint="Receives focus programmatically"
            focused={focused === 'target'}
            onFocusChange={onFocus('target')}
            pulse={pulse}
            badge={focused === 'target' ? '✓ Focused via focus()' : undefined}
          />
        </View>
      </View>

      <Text style={styles.footnote}>
        Tip: connect a keyboard and Tab through the buttons to feel the normal
        order, then press Jump to watch focus leap straight to the Target.
      </Text>
    </View>
  );
};

/** A node marker on the rail, lit up when its stop currently holds focus. */
const Node = ({
  variant,
  top,
  active,
}: {
  variant: StopKey;
  top: number;
  active: boolean;
}) => {
  const color = COLORS[variant];
  return (
    <View
      style={[
        styles.node,
        { top, borderColor: color },
        active && { backgroundColor: color, shadowColor: color },
        active && styles.nodeActive,
      ]}
    >
      {variant === 'skip' && !active ? (
        <Text style={styles.nodeSkip}>✕</Text>
      ) : null}
    </View>
  );
};

const FocusCard = ({
  variant,
  label,
  hint,
  focused,
  onPress,
  onFocusChange,
  innerRef,
  badge,
  pulse,
}: {
  variant: StopKey;
  label: string;
  hint: string;
  focused: boolean;
  onPress?: () => void;
  onFocusChange: (isFocused: boolean) => void;
  innerRef?: RefObject<BaseKeyboardViewType | null>;
  badge?: string;
  pulse?: Animated.Value;
}) => {
  const color = COLORS[variant];
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.03 : 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [focused, scale]);

  const focusedCard: ViewStyle = focused
    ? { borderColor: color, backgroundColor: '#ffffff', shadowColor: color }
    : {};

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        ref={innerRef}
        tintColor={color}
        onPress={onPress}
        onFocusChange={onFocusChange}
        defaultFocusHighlightEnabled={false}
        haloCornerRadius={12}
        style={({ pressed }) => [
          styles.card,
          variant === 'skip' && styles.cardSkip,
          focusedCard,
          focused && styles.cardFocusedShadow,
          pressed && styles.cardPressed,
        ]}
      >
        {pulse ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              { borderColor: color },
              {
                opacity: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.55, 0],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.12],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}

        <View style={styles.cardRow}>
          <View style={styles.cardText}>
            <Text
              style={[
                styles.cardLabel,
                variant === 'skip' && styles.cardLabelSkip,
                focused && { color },
              ]}
            >
              {label}
            </Text>
            <Text style={styles.cardHint}>{hint}</Text>
          </View>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f7', padding: 16 },

  intro: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  introText: { fontSize: 14, color: '#3c3c43', lineHeight: 20 },
  bold: { fontWeight: '700', color: '#000000' },
  code: {
    fontFamily: 'Courier',
    fontWeight: '700',
    color: '#5856d6',
    fontSize: 13,
  },

  timeline: { flexDirection: 'row' },

  rail: { width: RAIL_W, height: nodeY(2) + CARD_H / 2 },
  railLine: {
    position: 'absolute',
    left: RAIL_X,
    top: nodeY(0),
    height: nodeY(2) - nodeY(0),
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d1d6',
  },
  node: {
    position: 'absolute',
    left: RAIL_X - DOT_R + 1,
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActive: {
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  nodeSkip: { fontSize: 10, color: '#8e8e93', fontWeight: '700' },

  comet: {
    position: 'absolute',
    left: RAIL_X - DOT_R + 1,
    top: nodeY(0) - DOT_R,
    width: DOT_R * 2,
    height: DOT_R * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cometCore: {
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    backgroundColor: COLORS.target,
    shadowColor: COLORS.target,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  cards: { flex: 1, gap: CARD_GAP },
  card: {
    height: CARD_H,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  cardSkip: {
    backgroundColor: '#ececf1',
    borderStyle: 'dashed',
    borderColor: '#c7c7cc',
  },
  cardFocusedShadow: {
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardPressed: { opacity: 0.85 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardText: { flex: 1, gap: 3 },
  cardLabel: { fontSize: 17, fontWeight: '700', color: '#000000' },
  cardLabelSkip: { color: '#8e8e93' },
  cardHint: { fontSize: 12.5, color: '#8e8e93', lineHeight: 16 },

  pulseRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 16,
    borderWidth: 3,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  footnote: {
    marginTop: 20,
    fontSize: 12.5,
    color: '#8e8e93',
    lineHeight: 17,
  },
});
