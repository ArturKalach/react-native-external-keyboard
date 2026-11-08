import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  K,
  Pressable,
  type KeyboardFocusGuideProps,
} from 'react-native-external-keyboard';

const FOCUS = '#34c759'; // keyboard focus
const TARGET = '#5856d6'; // guide target
const GUIDE = '#fb7185'; // guide (never holds focus)

// --- Layout ---------------------------------------------------------------------------------

const Screen = ({
  description,
  children,
}: {
  description: string;
  children: ReactNode;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.description}>{description}</Text>
    <View style={styles.screenBody}>{children}</View>
  </ScrollView>
);

const Card = ({ label, children }: { label: string; children: ReactNode }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    {children}
  </View>
);

// --- Shared focus tracking -------------------------------------------------------------------

type LogEntry = { key: number; id: string; section: string };

const useFocusTracker = () => {
  const [focused, setFocused] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextKey = useRef(0);

  const onFocus = (section: string, id: string) => {
    setFocused(id);
    setLog((prev) =>
      [{ key: nextKey.current++, id, section }, ...prev].slice(0, 5)
    );
  };
  const onBlur = (id: string) => setFocused((f) => (f === id ? null : f));

  return { focused, log, onFocus, onBlur };
};

type Tracker = ReturnType<typeof useFocusTracker>;

// --- Building blocks -------------------------------------------------------------------------

type FocusCellProps = {
  id: string;
  section: string;
  tracker: Tracker;
  label?: string;
  isTarget?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** A focusable cell: green ring + pulse when focused, indigo badge when it is a guide target. */
const FocusCell = ({
  id,
  section,
  tracker,
  label = id,
  isTarget,
  style,
}: FocusCellProps) => {
  const isFocused = tracker.focused === id;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFocused) return;
    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isFocused, pulse]);

  return (
    <Pressable
      orderId={id}
      tintType="none"
      accessibilityRole="button"
      accessibilityLabel={isTarget ? `${label}, guide target` : label}
      style={styles.cellPressable}
      containerStyle={[
        styles.cell,
        style,
        isTarget && styles.cellTarget,
        isFocused && styles.cellFocused,
      ]}
      onFocus={() => tracker.onFocus(section, id)}
      onBlur={() => tracker.onBlur(id)}
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
                    outputRange: [1, 1.14],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}
      <Text style={styles.cellText}>{label}</Text>
      {isTarget ? <Text style={styles.cellBadge}>guide target</Text> : null}
    </Pressable>
  );
};

type GuideBarProps = {
  group: string;
  to: string;
  label: string;
  enabled?: boolean;
  guide?: KeyboardFocusGuideProps['guide'];
  style?: StyleProp<ViewStyle>;
};

const GuideBar = ({
  group,
  to,
  label,
  enabled = true,
  guide,
  style,
}: GuideBarProps) => (
  <K.Guide
    orderGroup={group}
    to={to}
    enabled={enabled}
    guide={guide}
    accessibilityLabel={`${label}, skips to ${to}`}
    style={[styles.guide, !enabled && styles.guideOff, style]}
  >
    <Text style={styles.guideText}>
      {label}
      {enabled ? '' : ' (disabled)'}
    </Text>
    <Text style={styles.guideSub}>FocusGuide → {to}</Text>
  </K.Guide>
);

const Status = ({
  focused,
  extra,
}: {
  focused: string | null;
  extra?: string;
}) => (
  <View style={styles.status}>
    <View style={[styles.statusDot, focused ? styles.statusDotOn : null]} />
    <Text style={styles.statusText}>
      Focused: {focused ?? '—'}
      {extra ? ` · ${extra}` : ''}
    </Text>
  </View>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendSwatch, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

type ToggleProps = { label: string; value: string; onPress: () => void };

const Toggle = ({ label, value, onPress }: ToggleProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${label}: ${value}`}
    onPress={onPress}
    containerStyle={styles.toggle}
  >
    <View style={styles.toggleInner}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleValue}>{value}</Text>
    </View>
  </Pressable>
);

// --- 1. Wide guide in a grid -----------------------------------------------------------------

const COLS = 5;
const ROWS = 3;
const GRID_GROUP = 'guide-grid';
// Row 2 has a wide guide over columns 3–5 instead of cells 2.3–2.5.
const GUIDE_ROW = 2;
const GUIDE_FROM_COL = 3;
const GRID_TARGETS = ['2.1', '2.2', '3.3'];

const gridCellIds = (row: number) =>
  Array.from({ length: COLS }, (_, i) => `${row}.${i + 1}`).filter(
    (id) => row !== GUIDE_ROW || Number(id.split('.')[1]) < GUIDE_FROM_COL
  );

const GridSection = ({ tracker }: { tracker: Tracker }) => {
  const [enabled, setEnabled] = useState(true);
  const [target, setTarget] = useState('2.2');
  const [targetMounted, setTargetMounted] = useState(true);

  const cycleTarget = () =>
    setTarget(
      (t) => GRID_TARGETS[(GRID_TARGETS.indexOf(t) + 1) % GRID_TARGETS.length]!
    );

  const renderCell = (id: string) =>
    id === target && !targetMounted ? (
      <View key={id} style={styles.cellGap} />
    ) : (
      <FocusCell
        key={id}
        id={id}
        section="grid"
        tracker={tracker}
        isTarget={enabled && id === target}
        style={styles.gridCell}
      />
    );

  return (
    <Card label="1 · WIDE GUIDE IN A GRID">
      <Text style={styles.hint}>
        Row 2 has a wide guide where cells 2.3–2.5 would be. Press Down from 1.3
        / 1.4 / 1.5 and focus lands on the target instead of whatever the engine
        would pick.
      </Text>
      <Status
        focused={tracker.focused}
        extra={`guide ${enabled ? 'on' : 'off'} → ${target}${
          targetMounted ? '' : ' (unmounted)'
        }`}
      />

      <K.Order groupId={GRID_GROUP}>
        <View style={styles.grid}>
          {Array.from({ length: ROWS }, (_, r) => r + 1).map((row) => (
            <View collapsable={false} key={row} style={styles.row}>
              {gridCellIds(row).map(renderCell)}
              {row === GUIDE_ROW ? (
                <GuideBar
                  group={GRID_GROUP}
                  to={target}
                  enabled={enabled}
                  label="Wide guide"
                  style={styles.guideWide}
                />
              ) : null}
            </View>
          ))}
        </View>
      </K.Order>

      <View style={styles.controls}>
        <Toggle
          label="Guide enabled"
          value={enabled ? 'ON' : 'OFF'}
          onPress={() => setEnabled((v) => !v)}
        />
        <Toggle
          label="Target (changes orderId at runtime)"
          value={target}
          onPress={cycleTarget}
        />
        <Toggle
          label="Target mounted"
          value={targetMounted ? 'MOUNTED' : 'UNMOUNTED'}
          onPress={() => setTargetMounted((v) => !v)}
        />
      </View>
      <Text style={styles.hint}>
        Try: Up from 3.3–3.5 · Right from 2.2 (must not get stuck on the guide)
        · cycle the target and repeat · unmount the target (no redirect), then
        remount · turn the guide off to compare with default focus.
      </Text>
    </Card>
  );
};

// --- 2. Full-width guides --------------------------------------------------------------------

const STACK_GROUP = 'guide-stack';
const STACK_ROWS = [
  ['cell1', 'cell2', 'cell3'],
  ['cell4', 'cell5', 'cell6'],
];

const GUIDE_PRESETS: {
  label: string;
  guide: KeyboardFocusGuideProps['guide'];
}[] = [
  { label: "'keyboard'", guide: 'keyboard' },
  { label: "'arrows'", guide: 'arrows' },
  { label: "'screen-reader'", guide: 'screen-reader' },
  {
    label: "['keyboard', 'screen-reader']",
    guide: ['keyboard', 'screen-reader'],
  },
  {
    label: "['arrows', 'screen-reader']",
    guide: ['arrows', 'screen-reader'],
  },
];

const StackSection = ({ tracker }: { tracker: Tracker }) => {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = GUIDE_PRESETS[presetIndex]!;
  const [guidesCollapsed, setGuidesCollapsed] = useState(false);

  return (
    <Card label="2 · STACKED FULL-WIDTH GUIDES">
      <Text style={styles.hint}>
        Two guides between two rows. Down from cell1–cell3 → cell5, Up from
        cell4–cell6 → cell2. Tab from cell3 → cell5, Shift+Tab from cell4 →
        cell2. Left/Right inside a row is plain navigation.
      </Text>
      <Status focused={tracker.focused} />
      <Toggle
        label="guide (keyboard → arrows → screen-reader → combos)"
        value={preset.label}
        onPress={() => setPresetIndex((i) => (i + 1) % GUIDE_PRESETS.length)}
      />
      <Toggle
        label="Guide size (full width, 1px transparent = not visible)"
        value={guidesCollapsed ? '1PX' : 'VISIBLE'}
        onPress={() => setGuidesCollapsed((v) => !v)}
      />
      <K.Order groupId={STACK_GROUP}>
        <View collapsable={false} style={styles.grid}>
          <View collapsable={false} style={styles.row}>
            {STACK_ROWS[0]!.map((id) => (
              <FocusCell
                key={id}
                id={id}
                section="stack"
                tracker={tracker}
                isTarget={id === 'cell2'}
                style={styles.gridCell}
              />
            ))}
          </View>
          <GuideBar
            group={STACK_GROUP}
            to="cell5"
            label="Redirect bottom"
            guide={preset.guide}
            style={guidesCollapsed ? styles.guideCollapsed : undefined}
          />
          <GuideBar
            group={STACK_GROUP}
            to="cell2"
            label="Redirect top"
            guide={preset.guide}
            style={guidesCollapsed ? styles.guideCollapsed : undefined}
          />
          <View style={styles.row}>
            {STACK_ROWS[1]!.map((id) => (
              <FocusCell
                key={id}
                id={id}
                section="stack"
                tracker={tracker}
                isTarget={id === 'cell5'}
                style={styles.gridCell}
              />
            ))}
          </View>
        </View>
      </K.Order>
    </Card>
  );
};

// --- 3. Jump across a scrolled list ----------------------------------------------------------

const LIST_GROUP = 'guide-list';
const LIST_ITEMS = [
  'Morning light',
  'Quiet streets',
  'Coffee and paper',
  'Train windows',
  'Rain on glass',
  'Night market',
  'Last bloom',
];

const ListSection = ({ tracker }: { tracker: Tracker }) => {
  const [guidesCollapsed, setGuidesCollapsed] = useState(false);
  const guideStyle = guidesCollapsed ? styles.guideCollapsed : undefined;

  return (
    <Card label="3 · JUMP ACROSS A LONG LIST">
      <Text style={styles.hint}>
        The guide under “Start” sends focus to “End”, far below the fold, and
        the screen scrolls to it with the focus move. The guide above “End”
        jumps back up. Use Down on Start, Up on End, or Tab / Shift+Tab. Items
        in between are plain text, so there is nothing else to land on.
      </Text>
      <Status focused={tracker.focused} />
      <Toggle
        label="Guide size (full width, 1px transparent = not visible)"
        value={guidesCollapsed ? '1PX' : 'VISIBLE'}
        onPress={() => setGuidesCollapsed((v) => !v)}
      />
      <K.Order groupId={LIST_GROUP}>
        <View style={styles.list}>
          <FocusCell
            id="start"
            label="Start of list"
            section="list"
            tracker={tracker}
            isTarget
          />
          <GuideBar
            group={LIST_GROUP}
            to="end"
            label="↓ Skip the list"
            style={guideStyle}
          />
          {LIST_ITEMS.map((title, i) => (
            <View key={title} style={styles.listItem}>
              <Text style={styles.listIndex}>{i + 1}</Text>
              <Text style={styles.listText}>{title}</Text>
            </View>
          ))}
          <GuideBar
            group={LIST_GROUP}
            to="start"
            label="↑ Back to the top"
            style={guideStyle}
          />
          <FocusCell
            id="end"
            label="End of list"
            section="list"
            tracker={tracker}
            isTarget
          />
        </View>
      </K.Order>
    </Card>
  );
};

// --- Screen ----------------------------------------------------------------------------------

export const FocusGuideScreen = () => {
  const tracker = useFocusTracker();

  return (
    <Screen description="K.Guide (KeyboardFocusGuide) redirects hardware-keyboard focus to a target by orderId: a focusable stop on iOS and Android (iOS adds a native UIFocusGuide for the arrows-only modes). The guide never holds focus itself. Connect a keyboard, use the arrow keys and Tab, and watch where focus lands.">
      <View style={styles.legend}>
        <LegendDot color={FOCUS} label="focused" />
        <LegendDot color={TARGET} label="guide target" />
        <LegendDot color={GUIDE} label="guide (never focused)" />
      </View>

      <GridSection tracker={tracker} />
      <StackSection tracker={tracker} />
      <ListSection tracker={tracker} />

      <Text style={styles.logTitle}>FOCUS LOG</Text>
      <View style={styles.logBox}>
        {tracker.log.length === 0 ? (
          <Text style={styles.logEmpty}>Move focus to see events…</Text>
        ) : (
          tracker.log.map((e) => (
            <View key={e.key} style={styles.logRow}>
              <View style={styles.logDot} />
              <Text style={styles.logKind}>onFocus</Text>
              <Text style={styles.logId}>{e.id}</Text>
              <Text style={styles.logSection}>{e.section}</Text>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  // layout
  screen: { flex: 1, backgroundColor: '#fff' },
  screenContent: { padding: 16, paddingBottom: 48 },
  screenBody: { marginTop: 16, gap: 12 },
  description: { fontSize: 14, color: '#555' },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    backgroundColor: '#fafafa',
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#666' },

  // legend + status
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingLeft: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: '#636366' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#c7c7cc',
  },
  statusDotOn: { borderColor: FOCUS, backgroundColor: FOCUS },
  statusText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  hint: { fontSize: 13, color: '#475569', lineHeight: 19 },

  // layout
  grid: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  list: { gap: 10 },

  // cells
  cell: {
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e5e5ea',
    backgroundColor: '#fff',
  },
  gridCell: { flex: 1 },
  // The inner Pressable must fill the fixed-size container, or it collapses to
  // zero height and can't take keyboard focus.
  cellPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cellGap: { flex: 1, height: 64 },
  cellTarget: { borderColor: TARGET },
  cellFocused: {
    borderColor: FOCUS,
    backgroundColor: '#f0fbf3',
    shadowColor: FOCUS,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cellText: { fontSize: 15, fontWeight: '600', color: '#1c1c1e' },
  cellBadge: { fontSize: 10, fontWeight: '700', color: TARGET },
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

  // guides
  guide: {
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: GUIDE,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideWide: { flex: COLS - GUIDE_FROM_COL + 1, height: 64 },
  // 1px, not 0: a zero-size view cannot take focus (Android 9+, iOS), so it could not redirect.
  guideCollapsed: {
    width: '100%',
    height: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  guideOff: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  guideText: { fontSize: 14, fontWeight: '600', color: '#9f1239' },
  guideSub: { fontSize: 10.5, color: '#be123c' },

  // controls
  controls: { gap: 8 },
  toggle: { borderRadius: 12, backgroundColor: '#eef2ff' },
  toggleInner: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  toggleLabel: { flexShrink: 1, fontWeight: '600', color: '#1e293b' },
  toggleValue: { fontWeight: '700', color: TARGET },

  // long list
  listItem: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  listIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
  },
  listText: { fontSize: 15, color: '#475569' },

  // log
  logTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8e8e93',
    letterSpacing: 0.5,
    marginTop: 10,
    marginLeft: 4,
  },
  logBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    padding: 12,
    minHeight: 130,
    gap: 8,
  },
  logEmpty: { fontSize: 13, color: '#aeaeb2', fontStyle: 'italic' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: FOCUS },
  logKind: {
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: '700',
    color: FOCUS,
  },
  logId: { fontFamily: 'Courier', fontSize: 13, color: '#1c1c1e' },
  logSection: { fontSize: 12, color: '#8e8e93', marginLeft: 'auto' },
});
