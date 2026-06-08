import { useRef, useState, type ReactNode } from 'react';
import {
  Pressable as RNPressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  BaseKeyboardView,
  KeyboardExtendedInput,
  Pressable as KeyboardPressable,
  type BaseKeyboardViewType,
  type OnKeyPress,
} from 'react-native-external-keyboard';

type LockDir = 'up' | 'down' | 'left' | 'right';
const LOCK_DIRS: LockDir[] = ['up', 'down', 'left', 'right'];
const LOG_LIMIT = 10;

const useEventLog = () => {
  const [log, setLog] = useState('');
  const append = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) =>
      `${time} — ${msg}\n${prev}`
        .split('\n')
        .filter(Boolean)
        .slice(0, LOG_LIMIT)
        .join('\n')
    );
  };
  return { log, append };
};

const useFocusableLogger = (label: string, log: (msg: string) => void) => {
  const [isFocused, setIsFocused] = useState(false);
  const handlers = {
    onFocus: () => {
      setIsFocused(true);
      log(`${label}: onFocus`);
    },
    onBlur: () => {
      setIsFocused(false);
      log(`${label}: onBlur`);
    },
    onKeyDownPress: (e: OnKeyPress) =>
      log(`${label}: keyDown ${e.nativeEvent.keyCode}`),
    onKeyUpPress: (e: OnKeyPress) =>
      log(`${label}: keyUp ${e.nativeEvent.keyCode}`),
  };
  return { isFocused, handlers };
};

export const ComponentsPlayground = () => {
  const { log, append } = useEventLog();

  const [haloEffect, setHaloEffect] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [focusable, setFocusable] = useState(true);
  const [overflowHidden, setOverflowHidden] = useState(true);
  const [roundedHaloFix, setRoundedHaloFix] = useState(false);
  const [locks, setLocks] = useState<LockDir[]>([]);

  const clipStyle = {
    overflow: overflowHidden ? ('hidden' as const) : ('visible' as const),
  };

  const sharedProps = {
    haloEffect,
    defaultFocusHighlightEnabled: highlight,
    focusable,
    lockFocus: locks,
    roundedHaloFix,
  };

  const toggleLock = (dir: LockDir) =>
    setLocks((prev) =>
      prev.includes(dir) ? prev.filter((d) => d !== dir) : [...prev, dir]
    );

  const basic = useFocusableLogger('basic', append);
  const container = useFocusableLogger('container', append);
  const wrap = useFocusableLogger('wrap', append);
  const kPressable = useFocusableLogger('keyboardPressable', append);
  const kInput = useFocusableLogger('keyboardExtendedInput', append);
  const clipSelf = useFocusableLogger('clipSelf', append);
  const clipParent = useFocusableLogger('clipParent', append);
  const asymmetric = useFocusableLogger('asymmetric', append);

  const basicRef = useRef<BaseKeyboardViewType>(null);
  const containerRef = useRef<BaseKeyboardViewType>(null);
  const wrapRef = useRef<BaseKeyboardViewType>(null);
  const kPressableRef = useRef<BaseKeyboardViewType>(null);
  const kInputRef = useRef<TextInput & { focus: () => void }>(null);
  const clipSelfRef = useRef<BaseKeyboardViewType>(null);
  const clipParentRef = useRef<BaseKeyboardViewType>(null);
  const asymmetricRef = useRef<BaseKeyboardViewType>(null);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.toolbar}>
        <Toggle
          label="haloEffect (iOS)"
          value={haloEffect}
          onToggle={() => setHaloEffect((v) => !v)}
        />
        <Toggle
          label="defaultFocusHighlightEnabled (Android)"
          value={highlight}
          onToggle={() => setHighlight((v) => !v)}
        />
        <Toggle
          label="focusable"
          value={focusable}
          onToggle={() => setFocusable((v) => !v)}
        />
        <Toggle
          label="overflow: hidden (sec. 6-8)"
          value={overflowHidden}
          onToggle={() => setOverflowHidden((v) => !v)}
        />
        <Toggle
          label="roundedHaloFix (iOS)"
          value={roundedHaloFix}
          onToggle={() => setRoundedHaloFix((v) => !v)}
        />
        <Text style={styles.sectionTitle}>lockFocus</Text>
        <View style={styles.row}>
          {LOCK_DIRS.map((dir) => (
            <Toggle
              key={dir}
              label={dir}
              value={locks.includes(dir)}
              onToggle={() => toggleLock(dir)}
            />
          ))}
        </View>
      </View>

      <Section title="1. Basic view (colored square)">
        <BaseKeyboardView
          ref={basicRef}
          {...sharedProps}
          {...basic.handlers}
          focusableWrapper={false}
          style={[styles.square, basic.isFocused && styles.focused]}
        />
        <FocusBtn onPress={() => basicRef.current?.focus()} />
      </Section>

      <Section title="2. Container with nested views">
        <BaseKeyboardView
          ref={containerRef}
          {...sharedProps}
          {...container.handlers}
          style={[styles.container, container.isFocused && styles.focused]}
        >
          <RNPressable
            style={[styles.child, styles.childA]}
            onPress={() => append('container: Child A onPress')}
          >
            <Text style={styles.childText}>Child A</Text>
          </RNPressable>
          <RNPressable
            style={[styles.child, styles.childB]}
            onPress={() => append('container: Child B onPress')}
          >
            <Text style={styles.childText}>Child B</Text>
          </RNPressable>
          <RNPressable
            style={[styles.child, styles.childC]}
            onPress={() => append('container: Child C onPress')}
          >
            <Text style={styles.childText}>Child C</Text>
          </RNPressable>
        </BaseKeyboardView>
        <FocusBtn onPress={() => containerRef.current?.focus()} />
      </Section>

      <Section title="3. Wraps a Pressable">
        <BaseKeyboardView
          ref={wrapRef}
          {...sharedProps}
          {...wrap.handlers}
          focusableWrapper={true}
          style={[styles.wrap, wrap.isFocused && styles.focused]}
        >
          <RNPressable
            style={styles.pressable}
            onPress={() => append('wrap: inner onPress')}
          >
            <Text style={styles.pressableText}>Inner Pressable</Text>
          </RNPressable>
        </BaseKeyboardView>
        <FocusBtn onPress={() => wrapRef.current?.focus()} />
      </Section>

      <Section title="4. KeyboardPressable">
        <KeyboardPressable
          ref={kPressableRef}
          {...sharedProps}
          {...kPressable.handlers}
          onPress={() => append('keyboardPressable: onPress')}
          onLongPress={() => append('keyboardPressable: onLongPress')}
          style={[styles.pressable, kPressable.isFocused && styles.focused]}
        >
          <Text style={styles.pressableText}>KeyboardPressable</Text>
        </KeyboardPressable>
        <FocusBtn onPress={() => kPressableRef.current?.focus()} />
      </Section>

      <Section title="5. KeyboardExtendedInput">
        <KeyboardExtendedInput
          ref={kInputRef}
          haloEffect={haloEffect}
          defaultFocusHighlightEnabled={highlight}
          focusable={focusable}
          lockFocus={locks}
          onFocus={kInput.handlers.onFocus}
          onBlur={kInput.handlers.onBlur}
          focusStyle={styles.inputFocused}
          style={styles.input}
          placeholder="Type here…"
          onSubmitEditing={() => append('keyboardExtendedInput: onSubmit')}
        />
        <FocusBtn onPress={() => kInputRef.current?.focus()} />
      </Section>

      <Section title="6. borderRadius + overflow on focusable view">
        <BaseKeyboardView
          ref={clipSelfRef}
          {...sharedProps}
          {...clipSelf.handlers}
          focusableWrapper={false}
          style={[
            styles.clipSquare,
            clipStyle,
            clipSelf.isFocused && styles.focused,
          ]}
        />
        <FocusBtn onPress={() => clipSelfRef.current?.focus()} />
      </Section>

      <Section title="7. Wrapper with overflow on parent">
        <BaseKeyboardView
          ref={clipParentRef}
          {...sharedProps}
          {...clipParent.handlers}
          focusableWrapper={true}
          style={[styles.clipWrap, clipStyle]}
        >
          <RNPressable
            style={styles.pressable}
            onPress={() => append('clipParent: inner onPress')}
          >
            <Text style={styles.pressableText}>Inner (parent clips)</Text>
          </RNPressable>
        </BaseKeyboardView>
        <FocusBtn onPress={() => clipParentRef.current?.focus()} />
      </Section>

      <Section title="8. Asymmetric borderRadius + overflow">
        <BaseKeyboardView
          ref={asymmetricRef}
          {...sharedProps}
          {...asymmetric.handlers}
          focusableWrapper={false}
          style={[
            styles.asymmetric,
            clipStyle,
            asymmetric.isFocused && styles.focused,
          ]}
        />
        <FocusBtn onPress={() => asymmetricRef.current?.focus()} />
      </Section>

      <Section title="Event log">
        <TextInput
          style={styles.log}
          multiline
          editable={false}
          value={log}
          placeholder="Focus, blur and key events will appear here"
        />
      </Section>
    </ScrollView>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const FocusBtn = ({ onPress }: { onPress: () => void }) => (
  <KeyboardPressable
    onPress={onPress}
    defaultFocusHighlightEnabled={false}
    haloEffect={false}
    focusStyle={({ focused }) => (focused ? styles.focusBtnFocused : undefined)}
    style={styles.focusBtn}
  >
    <Text style={styles.focusBtnText}>focus()</Text>
  </KeyboardPressable>
);

const Toggle = ({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <KeyboardPressable
    onPress={onToggle}
    defaultFocusHighlightEnabled={false}
    haloEffect={false}
    focusStyle={({ focused }) => (focused ? styles.toggleFocused : undefined)}
    style={[styles.toggle, value && styles.toggleOn]}
  >
    <Text style={[styles.toggleText, value && styles.toggleTextOn]}>
      {label}
    </Text>
  </KeyboardPressable>
);

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f2f2f7' },
  scrollContent: { padding: 16, gap: 16 },

  toolbar: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  section: { gap: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b6b6b',
    letterSpacing: 0.5,
  },

  square: {
    width: 120,
    height: 120,
    backgroundColor: '#FF9500',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderColor: '#FF9500',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  focused: {
    borderWidth: 3,
    borderTopRightRadius: 0,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 4,
  },

  container: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  child: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childA: { backgroundColor: '#FF9500' },
  childB: { backgroundColor: '#34C759' },
  childC: { backgroundColor: '#5856D6' },
  childText: { color: '#ffffff', fontWeight: '600' },

  wrap: { alignSelf: 'flex-start', borderRadius: 12 },

  clipSquare: {
    width: 140,
    height: 120,
    backgroundColor: '#34C759',
    borderRadius: 16,
  },
  clipWrap: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    padding: 8,
    borderRadius: 20,
  },
  asymmetric: {
    width: 160,
    height: 100,
    backgroundColor: '#5856D6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 24,
  },

  pressable: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#AF52DE',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pressableText: { color: '#ffffff', fontWeight: '600' },

  focusBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e5ea',
  },
  focusBtnText: { fontSize: 13, color: '#1c1c1e', fontWeight: '500' },
  focusBtnFocused: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
  },

  toggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e5e5ea',
  },
  toggleOn: { backgroundColor: '#007AFF' },
  toggleFocused: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 16,
  },
  toggleText: { fontSize: 13, color: '#1c1c1e' },
  toggleTextOn: { color: '#ffffff', fontWeight: '600' },

  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d1d6',
    fontSize: 16,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },

  log: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: '#d1d1d6',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    fontFamily: 'Menlo',
    fontSize: 12,
  },
});
