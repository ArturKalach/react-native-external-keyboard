import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-external-keyboard';

const ACCENT = '#5856d6'; // press
const FOCUS = '#34c759'; // keyboard focus
const NA = '#c7c7cc';

type Mode = 'children' | 'renderContent' | 'renderFocusable';

const MODES: { mode: Mode; receives: string }[] = [
  { mode: 'children', receives: '{ pressed }' },
  { mode: 'renderContent', receives: '{ pressed, focused }' },
  { mode: 'renderFocusable', receives: '{ focused }' },
];

type EventKind = 'focus' | 'blur' | 'keydown' | 'keyup' | 'press' | 'longpress';

const KIND_LABEL: Record<EventKind, string> = {
  focus: 'onFocus',
  blur: 'onBlur',
  keydown: 'onKeyDownPress',
  keyup: 'onKeyUpPress',
  press: 'onPress',
  longpress: 'onLongPress',
};
const KIND_COLOR: Record<EventKind, string> = {
  focus: FOCUS,
  blur: '#aeaeb2',
  keydown: ACCENT,
  keyup: '#b6b4e6',
  press: '#0a84ff',
  longpress: '#ff9500',
};

type LogEntry = { id: number; mode: Mode; kind: EventKind };

export const KeyboardPressableShowcaseScreen = () => {
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextId = useRef(0);

  const addEvent = (mode: Mode, kind: EventKind) =>
    setLog((prev) =>
      [{ id: nextId.current++, mode, kind }, ...prev].slice(0, 6)
    );

  return (
    <View style={styles.screen}>
      <View style={styles.intro}>
        <Text style={styles.introText}>
          This Pressable exposes the keyboard{' '}
          <Text style={styles.bold}>focused</Text> state alongside{' '}
          <Text style={styles.bold}>pressed</Text>. Each render mode receives a
          different slice — Tab to move focus, press Enter/Space (or tap) to
          press, and watch which dots each mode can light.
        </Text>
      </View>

      <View style={styles.row}>
        {MODES.map((m) => (
          <ModeButton
            key={m.mode}
            mode={m.mode}
            receives={m.receives}
            onEvent={addEvent}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <LegendDot color={FOCUS} label="focused" />
        <LegendDot color={ACCENT} label="pressed" />
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.dotNa]} />
          <Text style={styles.legendText}>not received</Text>
        </View>
      </View>

      <Text style={styles.logTitle}>KEY EVENTS</Text>
      <View style={styles.logBox}>
        {log.length === 0 ? (
          <Text style={styles.logEmpty}>
            Focus a button and press a key to see events…
          </Text>
        ) : (
          log.map((e) => <EventRow key={e.id} entry={e} />)
        )}
      </View>
    </View>
  );
};

const ModeButton = ({
  mode,
  receives,
  onEvent,
}: {
  mode: Mode;
  receives: string;
  onEvent: (mode: Mode, kind: EventKind) => void;
}) => {
  // Component-level focus state (from onFocus/onBlur) drives the focus ring for
  // *every* mode — even `children`, whose render prop never gets `focused`. The
  // dots below still show the render-prop truth, so the greyed `children` focus
  // dot makes the point: the ring is container styling, not the render prop.
  const [isFocused, setIsFocused] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;

  const runPulse = () => {
    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  // `pressed` / `focused` are `undefined` when this render mode doesn't expose
  // them — that's what greys out the corresponding dot.
  const renderBody = (pressed?: boolean, focused?: boolean) => (
    <View
      style={[
        styles.card,
        isFocused && styles.cardFocused,
        pressed === true && styles.cardPressed,
        pressed === true && styles.cardPressedScale,
      ]}
    >
      {isFocused ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseRing,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0],
              }),
              transform: [
                {
                  scale: pulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.18],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}

      <Text style={styles.cardTitle}>{mode}</Text>
      <Text style={styles.cardReceives}>{receives}</Text>

      <View style={styles.dots}>
        <StateDot
          label="focus"
          exposed={focused !== undefined}
          on={!!focused}
          color={FOCUS}
        />
        <StateDot
          label="press"
          exposed={pressed !== undefined}
          on={!!pressed}
          color={ACCENT}
        />
      </View>
    </View>
  );

  const handlers = {
    haloEffect: false,
    defaultFocusHighlightEnabled: false,
    androidKeyboardPressState: true,
    containerStyle: styles.cardContainer,
    onFocus: () => {
      setIsFocused(true);
      runPulse();
      onEvent(mode, 'focus');
    },
    onBlur: () => {
      setIsFocused(false);
      onEvent(mode, 'blur');
    },
    onPress: () => onEvent(mode, 'press'),
    onLongPress: () => onEvent(mode, 'longpress'),
    onKeyDownPress: () => onEvent(mode, 'keydown'),
    onKeyUpPress: () => onEvent(mode, 'keyup'),
  };

  if (mode === 'children') {
    return (
      <Pressable {...handlers}>
        {({ pressed }) => renderBody(pressed, undefined)}
      </Pressable>
    );
  }
  if (mode === 'renderContent') {
    return (
      <Pressable
        {...handlers}
        renderContent={({ pressed, focused }) => renderBody(pressed, focused)}
      />
    );
  }
  return (
    <Pressable
      {...handlers}
      renderFocusable={({ focused }) => renderBody(undefined, focused)}
    />
  );
};

const StateDot = ({
  label,
  exposed,
  on,
  color,
}: {
  label: string;
  exposed: boolean;
  on: boolean;
  color: string;
}) => (
  <View style={styles.dotItem}>
    <View
      style={[
        styles.dot,
        !exposed && styles.dotNa,
        exposed && { borderColor: color },
        exposed && on && { backgroundColor: color },
      ]}
    >
      {!exposed ? <Text style={styles.dotNaMark}>–</Text> : null}
    </View>
    <Text style={[styles.dotLabel, !exposed && styles.dotLabelNa]}>
      {label}
    </Text>
  </View>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendSwatch, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const EventRow = ({ entry }: { entry: LogEntry }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [anim]);

  const color = KIND_COLOR[entry.kind];
  return (
    <Animated.View
      style={[
        styles.eventRow,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-8, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.eventDot, { backgroundColor: color }]} />
      <Text style={[styles.eventKind, { color }]}>
        {KIND_LABEL[entry.kind]}
      </Text>
      <Text style={styles.eventMode}>{entry.mode}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f7', padding: 16 },

  intro: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  introText: { fontSize: 14, color: '#3c3c43', lineHeight: 20 },
  bold: { fontWeight: '700', color: '#000000' },

  row: { flexDirection: 'row', gap: 10 },
  cardContainer: { flex: 1 },
  card: {
    height: 138,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e5e5ea',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 6,
  },
  cardFocused: {
    borderColor: FOCUS,
    shadowColor: FOCUS,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardPressed: { backgroundColor: '#efeefb', borderColor: ACCENT },
  cardPressedScale: { transform: [{ scale: 0.96 }] },
  cardTitle: {
    fontFamily: 'Courier',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1c1c1e',
    textAlign: 'center',
  },
  cardReceives: {
    fontSize: 10.5,
    color: '#8e8e93',
    textAlign: 'center',
  },
  pulseRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: FOCUS,
  },

  dots: { flexDirection: 'row', gap: 14, marginTop: 4 },
  dotItem: { alignItems: 'center', gap: 3 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotNa: { borderColor: NA, borderStyle: 'dashed' },
  dotNaMark: { fontSize: 11, color: NA, fontWeight: '700', lineHeight: 12 },
  dotLabel: { fontSize: 10, color: '#636366', fontWeight: '600' },
  dotLabelNa: { color: NA },

  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: '#636366' },

  logTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8e8e93',
    letterSpacing: 0.5,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  logBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    minHeight: 150,
    gap: 8,
  },
  logEmpty: { fontSize: 13, color: '#aeaeb2', fontStyle: 'italic' },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventDot: { width: 8, height: 8, borderRadius: 4 },
  eventKind: { fontFamily: 'Courier', fontSize: 13, fontWeight: '700' },
  eventMode: { fontSize: 12, color: '#8e8e93', marginLeft: 'auto' },
});
