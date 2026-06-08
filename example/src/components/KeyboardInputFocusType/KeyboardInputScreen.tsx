import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable as RNPressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { KeyboardExtendedInput } from 'react-native-external-keyboard';

const NAV = '#34c759'; // keyboard navigation focus
const EDIT = '#5856d6'; // editing (cursor in the field)
const RAIL = '#d8d8e0';

const FIELD_H = 76;
const GAP = 14;
const RAIL_W = 34;
const RAIL_CX = 17;
const DOT_R = 9;
const nodeY = (i: number) => i * (FIELD_H + GAP) + FIELD_H / 2;

type FocusType = 'default' | 'press' | 'auto';

const FOCUS_TYPES: { key: FocusType; blurb: string }[] = [
  {
    key: 'default',
    blurb: 'Platform default — Android edits on focus; iOS needs a press.',
  },
  {
    key: 'press',
    blurb: 'Tab highlights the field; press Return to start editing.',
  },
  { key: 'auto', blurb: 'Keyboard focus jumps straight into editing.' },
];

const FIELDS: {
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
}[] = [
  { label: 'Full name', placeholder: 'Ada Lovelace' },
  {
    label: 'Email',
    placeholder: 'ada@analytical.dev',
    keyboardType: 'email-address',
  },
  { label: 'City', placeholder: 'London' },
];

export const KeyboardInputScreen = () => {
  const [focusType, setFocusType] = useState<FocusType>('press');
  const [values, setValues] = useState(['', '', '']);
  const [navIndex, setNavIndex] = useState<number | null>(null); // keyboard focus
  const [editIndex, setEditIndex] = useState<number | null>(null); // cursor

  const t = useRef(new Animated.Value(0)).current;
  const cometOn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (navIndex == null) {
      Animated.timing(cometOn, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.parallel([
      Animated.timing(cometOn, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.spring(t, {
        toValue: navIndex,
        useNativeDriver: true,
        speed: 13,
        bounciness: 6,
      }),
    ]).start();
  }, [navIndex, cometOn, t]);

  const pickType = (key: FocusType) => {
    setFocusType(key);
    setNavIndex(null);
    setEditIndex(null);
  };

  const setValue = (i: number, v: string) =>
    setValues((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  const blurb = FOCUS_TYPES.find((f) => f.key === focusType)?.blurb;
  const editing = editIndex != null;

  return (
    <View collapsable={false} style={styles.screen}>
      <View style={styles.intro}>
        <Text style={styles.introText}>
          A <Text style={styles.code}>KeyboardExtendedInput</Text> joins the Tab
          order without trapping it. <Text style={styles.bold}>focusType</Text>{' '}
          controls how it takes focus — navigate with Tab, then edit.
        </Text>
      </View>

      <View collapsable={false} style={styles.segmented}>
        {FOCUS_TYPES.map((f) => {
          const selected = f.key === focusType;
          return (
            <RNPressable
              key={f.key}
              onPress={() => pickType(f.key)}
              style={[styles.segment, selected && styles.segmentActive]}
            >
              <Text
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextActive,
                ]}
              >
                {f.key}
              </Text>
            </RNPressable>
          );
        })}
      </View>
      <Text style={styles.blurb}>{blurb}</Text>

      <View style={styles.form}>
        {/* Left rail with a comet that follows the focused field. */}
        <View style={styles.rail}>
          <View style={styles.railLine} />
          {FIELDS.map((_, i) => {
            const active = navIndex === i;
            const color = editIndex === i ? EDIT : NAV;
            return (
              <View
                key={i}
                style={[
                  styles.node,
                  { top: nodeY(i) - DOT_R, borderColor: active ? color : RAIL },
                  active && { backgroundColor: color },
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
                      inputRange: [0, 1, 2],
                      outputRange: [nodeY(0), nodeY(1), nodeY(2)],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.cometCore,
                { backgroundColor: editing ? EDIT : NAV },
              ]}
            />
          </Animated.View>
        </View>

        <View
          collapsable={false}
          collapsableChildren={false}
          style={styles.fields}
        >
          {FIELDS.map((f, i) => (
            <Field
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              keyboardType={f.keyboardType}
              focusType={focusType}
              value={values[i]!}
              onChangeText={(v) => setValue(i, v)}
              navFocused={navIndex === i}
              editing={editIndex === i}
              onNav={(isFocused) =>
                setNavIndex((cur) => (isFocused ? i : cur === i ? null : cur))
              }
              onEditStart={() => setEditIndex(i)}
              onEditEnd={() => setEditIndex((cur) => (cur === i ? null : cur))}
            />
          ))}
        </View>
      </View>

      <Text style={styles.footnote}>
        Green = keyboard focus (navigated), indigo = editing. With{' '}
        <Text style={styles.code}>press</Text>, the field highlights on Tab but
        only captures keystrokes after you press Return.
      </Text>
    </View>
  );
};

const Field = ({
  label,
  placeholder,
  keyboardType,
  focusType,
  value,
  onChangeText,
  navFocused,
  editing,
  onNav,
}: {
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  focusType: FocusType;
  value: string;
  onChangeText: (v: string) => void;
  navFocused: boolean;
  editing: boolean;
  onNav: (isFocused: boolean) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
}) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!navFocused) return;
    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [navFocused, pulse]);

  return (
    <View
      style={[
        styles.field,
        navFocused && styles.fieldNav,
        editing && styles.fieldEditing,
      ]}
    >
      {navFocused && !editing ? (
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
                    outputRange: [1, 1.06],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}

      <View style={styles.fieldMain}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <KeyboardExtendedInput
          focusType={focusType}
          blurType="auto"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b8b8bf"
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          haloEffect={false}
          defaultFocusHighlightEnabled={false}
          onFocusChange={onNav}
          containerStyle={styles.inputWrap}
          style={styles.input}
        />
      </View>

      <StatePill navFocused={navFocused} editing={editing} />
    </View>
  );
};

const StatePill = ({
  navFocused,
  editing,
}: {
  navFocused: boolean;
  editing: boolean;
}) => {
  if (editing) {
    return (
      <View style={[styles.pill, { backgroundColor: EDIT }]}>
        <Caret />
        <Text style={styles.pillText}>editing</Text>
      </View>
    );
  }
  if (navFocused) {
    return (
      <View style={[styles.pill, { backgroundColor: NAV }]}>
        <Text style={styles.pillText}>navigated</Text>
      </View>
    );
  }
  return (
    <View style={[styles.pill, styles.pillIdle]}>
      <Text style={styles.pillIdleText}>idle</Text>
    </View>
  );
};

const Caret = () => {
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [blink]);
  return <Animated.View style={[styles.caret, { opacity: blink }]} />;
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f7', padding: 16 },

  intro: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  introText: { fontSize: 14, color: '#3c3c43', lineHeight: 20 },
  bold: { fontWeight: '700', color: '#000000' },
  code: { fontFamily: 'Courier', fontWeight: '700', color: EDIT, fontSize: 13 },

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#e6e6ec',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 7,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: '700',
    color: '#8e8e93',
  },
  segmentTextActive: { color: '#1c1c1e' },
  blurb: {
    fontSize: 12.5,
    color: '#8e8e93',
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 4,
    lineHeight: 17,
  },

  form: { flexDirection: 'row' },
  rail: { width: RAIL_W, height: nodeY(2) + FIELD_H / 2 },
  railLine: {
    position: 'absolute',
    left: RAIL_CX,
    top: nodeY(0),
    height: nodeY(2) - nodeY(0),
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

  fields: { flex: 1, gap: GAP },
  field: {
    height: FIELD_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e5e5ea',
    paddingHorizontal: 14,
  },
  fieldNav: { borderColor: NAV },
  fieldEditing: {
    borderColor: EDIT,
    shadowColor: EDIT,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  pulseRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: NAV,
  },
  fieldMain: { flex: 1, gap: 2 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8e8e93',
    letterSpacing: 0.3,
  },
  inputWrap: { marginLeft: -2 },
  input: { fontSize: 16, color: '#1c1c1e', padding: 0 },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pillText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  pillIdle: { backgroundColor: '#f2f2f7' },
  pillIdleText: { color: '#aeaeb2', fontSize: 11, fontWeight: '700' },
  caret: { width: 2, height: 12, borderRadius: 1, backgroundColor: '#ffffff' },

  footnote: {
    marginTop: 20,
    fontSize: 12.5,
    color: '#8e8e93',
    lineHeight: 17,
  },
});
