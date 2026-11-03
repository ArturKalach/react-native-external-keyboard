import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import {
  Focus,
  KeyboardGroupProvider,
  KeyboardOrderFocusGroup,
  Pressable,
  useIsViewFocused,
  type KeyboardFocusGuideProps,
} from 'react-native-external-keyboard';
import {
  BLUEPRINT,
  BlueprintGrid,
  BlueprintStage,
} from '../Blueprint/Blueprint';

const GROUP = 'guide-demo';

const {
  platinum: PLATINUM,
  azure: AZURE,
  ink: INK,
  amber: AMBER,
  grid: GRID_COLOR,
} = BLUEPRINT;

type Theme = {
  name: string;
  stage: string;
  grid: string;
  cell: { bg: string; border: string; text: string };
  focus: {
    bg: string;
    border: string;
    text: string;
    tag: string;
    ring: string;
  };
  target: { bg: string; border: string; text: string; tag: string };
  guide: {
    bg: string;
    border: string;
    text: string;
    divider: string;
    off: string;
  };
  redirect: string;
  token: string;
  tokenRing: string;
  bannerOn: { bg: string; border: string; text: string };
  accent: string;
  legend: { focus: string; focusRing?: string; guide: string };
};

// Cyanotype: royal azure paper, white lines.
const THEME: Theme = {
  name: 'Cyanotype',
  stage: AZURE,
  grid: GRID_COLOR,
  cell: { bg: 'transparent', border: 'rgba(255,255,255,0.75)', text: '#fff' },
  focus: { bg: PLATINUM, border: '#fff', text: INK, tag: INK, ring: '#fff' },
  target: {
    bg: 'rgba(7,7,7,0.5)',
    border: '#fff',
    text: '#fff',
    tag: '#e6eafc',
  },
  guide: {
    bg: 'rgba(7,7,7,0.42)',
    border: 'rgba(255,255,255,0.85)',
    text: '#fff',
    divider: 'rgba(255,255,255,0.25)',
    off: 'rgba(255,255,255,0.18)',
  },
  redirect: AMBER,
  token: '#fff',
  tokenRing: INK,
  bannerOn: { bg: '#e7ebfb', border: AZURE, text: '#243a9e' },
  accent: AZURE,
  legend: { focus: PLATINUM, focusRing: AZURE, guide: '#1d2e73' },
};

const PAD = 14;
const GAP = 10;
const CELL_H = 56;
const GUIDE_H = 52;
// Android picks the next focus by `13 * major^2 + minor^2` (major: distance along the move, minor: offset
// between centres). A full-width guide is off-centre from every tile, so a tile right below the row would win
// over it. Keep the rows far apart when the guide collapses, and hug each guide to the row it redirects from.
const INVISIBLE_GAP = 40;
const INVISIBLE_PAD = 2;

/** The bottom row follows the guide: when the guide collapses, the stage shrinks with it. */
const row2Y = (invisible: boolean) =>
  CELL_H + (invisible ? INVISIBLE_GAP : GAP + GUIDE_H + GAP);

type Cell = { id: string; label: string; row: 0 | 1; col: number };

const CELLS: Cell[] = [
  { id: 'coffee', label: 'Coffee', row: 0, col: 0 },
  { id: 'bagel', label: 'Bagel', row: 0, col: 1 },
  { id: 'juice', label: 'Juice', row: 0, col: 2 },
  { id: 'back', label: 'Back', row: 1, col: 0 },
  { id: 'cancel', label: 'Cancel', row: 1, col: 1 },
  { id: 'pay', label: 'Pay now', row: 1, col: 2 },
];

const byId = (id: string | null) => CELLS.find((c) => c.id === id);

/** Where focus is redirected to, when it enters the guide from this row. */
const guideTarget = (row: 0 | 1) => (row === 0 ? 'pay' : 'coffee');

const TARGET_IDS = [guideTarget(0), guideTarget(1)];

type Trip = { from: string; to: string; redirected: boolean };

// --- Pieces ----------------------------------------------------------------------------------

type CellViewProps = {
  row2: number;
  cell: Cell;
  cellW: number;
  focused: boolean;
  isTarget: boolean;
  onFocus: (id: string) => void;
  onBlur: (id: string) => void;
};

const CellView = ({
  row2,
  cell,
  cellW,
  focused,
  isTarget,
  onFocus,
  onBlur,
}: CellViewProps) => {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!focused) return;
    pop.setValue(0);
    Animated.timing(pop, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focused, pop]);

  const top = cell.row === 0 ? 0 : row2;

  return (
    <Pressable
      orderId={cell.id}
      tintType="none"
      accessibilityRole="button"
      accessibilityLabel={cell.label}
      style={styles.cellInner}
      containerStyle={[
        styles.cell,
        {
          width: cellW,
          left: cell.col * (cellW + GAP),
          top,
        },
        isTarget && styles.cellTarget,
        focused && styles.cellFocused,
      ]}
      onFocus={() => onFocus(cell.id)}
      onBlur={() => onBlur(cell.id)}
    >
      {focused ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              opacity: pop.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 0],
              }),
              transform: [
                {
                  scale: pop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.18],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}
      <Text
        style={[
          styles.cellText,
          isTarget && styles.cellTextTarget,
          focused && styles.cellTextFocused,
        ]}
      >
        {cell.label}
      </Text>
      {isTarget ? (
        <Text style={[styles.cellTag, focused && styles.cellTagFocused]}>
          GUIDE TARGET
        </Text>
      ) : null}
    </Pressable>
  );
};

const Toggle = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={onPress}
      containerStyle={styles.toggle}
      style={styles.toggleInner}
    >
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.switchTrack, value && styles.switchTrackOn]}>
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
      </View>
    </Pressable>
  );
};

// --- Screen ----------------------------------------------------------------------------------

export const FocusGuideDemoScreen = () => {
  const [enabled, setEnabled] = useState(true);
  const [screenReader, setScreenReader] = useState(false);
  const [invisible, setInvisible] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [stageW, setStageW] = useState(0);
  const [trip, setTrip] = useState<Trip | null>(null);

  const previous = useRef<string | null>(null);

  const idle = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const tokenOpacity = useRef(new Animated.Value(0)).current;

  const guideInputs: KeyboardFocusGuideProps['guide'] = screenReader
    ? ['keyboard', 'screen-reader']
    : 'keyboard';

  const stageHeight = row2Y(invisible) + CELL_H + PAD * 2;
  const innerW = Math.max(stageW - PAD * 2, 0);
  const cellW = (innerW - GAP * 2) / 3;

  const center = (id: string) => {
    const c = byId(id)!;
    return {
      x: c.col * (cellW + GAP) + cellW / 2,
      y: (c.row === 0 ? 0 : row2Y(invisible)) + CELL_H / 2,
    };
  };

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idle, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(idle, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [idle]);

  // Fly the circle once the new trip has rendered, so its path uses the fresh coordinates.
  useEffect(() => {
    if (!trip) return;
    progress.setValue(0);
    tokenOpacity.setValue(1);
    Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: trip.redirected ? 650 : 280,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(tokenOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }),
    ]).start();
  }, [trip, progress, tokenOpacity]);

  const fromPos = trip ? center(trip.from) : { x: 0, y: 0 };
  const toPos = trip ? center(trip.to) : { x: 0, y: 0 };
  const tokenColor = trip?.redirected ? THEME.redirect : THEME.token;

  const onFocus = (id: string) => {
    const from = previous.current;
    previous.current = id;
    setFocused(id);
    if (!from || from === id) return;

    const fromCell = byId(from)!;
    const toCell = byId(id)!;
    // Landing in the same column is the nearest view anyway: only a sideways jump is the guide's doing.
    const redirected =
      enabled &&
      fromCell.row !== toCell.row &&
      fromCell.col !== toCell.col &&
      id === guideTarget(fromCell.row);
    setTrip({ from, to: id, redirected });
  };
  const onBlur = (id: string) => setFocused((f) => (f === id ? null : f));

  const guideLabel = (row: 0 | 1) =>
    `jumps to ${byId(guideTarget(row))!.label}`;

  const message = !trip
    ? 'Focus Coffee, then press ↓'
    : trip.redirected
    ? `${byId(trip.from)!.label} ${
        byId(trip.from)!.row === 0 ? '↓' : '↑'
      } went straight to ${byId(trip.to)!.label}`
    : `${byId(trip.from)!.label} → ${byId(trip.to)!.label}, the nearest view`;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.description}>
          Focus.Guide sends keyboard focus to a view you choose. Use a hardware
          keyboard.
        </Text>
        <View style={styles.body}>
          <View style={styles.legend}>
            <Legend
              color={THEME.legend.focus}
              ring={THEME.legend.focusRing}
              label="focused"
            />
            <Legend color={THEME.legend.guide} label="guide and its target" />
            <Legend color={THEME.redirect} label="redirect" />
          </View>

          <KeyboardOrderFocusGroup groupId={GROUP}>
            <View
              collapsable={false}
              style={[styles.stage, { height: stageHeight }]}
              onLayout={(e: LayoutChangeEvent) =>
                setStageW(e.nativeEvent.layout.width)
              }
            >
              {stageW > 0 ? (
                <BlueprintGrid width={stageW} height={stageHeight} />
              ) : null}
              {stageW > 0 ? (
                <View collapsable={false} style={styles.stageInner}>
                  {CELLS.map((cell) => (
                    <CellView
                      key={cell.id}
                      cell={cell}
                      cellW={cellW}
                      row2={row2Y(invisible)}
                      focused={focused === cell.id}
                      isTarget={enabled && TARGET_IDS.includes(cell.id)}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  ))}

                  <View
                    collapsable={false}
                    style={[
                      styles.capsule,
                      !enabled && styles.capsuleOff,
                      invisible && styles.capsuleInvisible,
                    ]}
                  >
                    <Focus.Guide
                      orderGroup={GROUP}
                      to="pay"
                      guide={guideInputs}
                      enabled={enabled}
                      style={[styles.guide, invisible && styles.guideInvisible]}
                    >
                      <Animated.Text
                        style={[
                          styles.guideArrow,
                          invisible && styles.hidden,
                          {
                            transform: [
                              {
                                translateY: idle.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [-2, 3],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        ↓
                      </Animated.Text>
                      <Text
                        style={[styles.guideText, invisible && styles.hidden]}
                      >
                        {enabled ? guideLabel(0) : 'guide off'}
                      </Text>
                    </Focus.Guide>
                    {invisible ? null : <View style={styles.capsuleDivider} />}
                    <Focus.Guide
                      orderGroup={GROUP}
                      to="coffee"
                      guide={guideInputs}
                      enabled={enabled}
                      style={[styles.guide, invisible && styles.guideInvisible]}
                    >
                      <Animated.Text
                        style={[
                          styles.guideArrow,
                          invisible && styles.hidden,
                          {
                            transform: [
                              {
                                translateY: idle.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [2, -3],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        ↑
                      </Animated.Text>
                      <Text
                        style={[styles.guideText, invisible && styles.hidden]}
                      >
                        {enabled ? guideLabel(1) : 'guide off'}
                      </Text>
                    </Focus.Guide>
                  </View>

                  {trip ? (
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.token,
                        {
                          backgroundColor: tokenColor,
                          shadowColor: tokenColor,
                          opacity: tokenOpacity,
                          left: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [fromPos.x - 9, toPos.x - 9],
                          }),
                          top: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [fromPos.y - 9, toPos.y - 9],
                          }),
                        },
                      ]}
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          </KeyboardOrderFocusGroup>

          <View
            style={[styles.banner, trip?.redirected && styles.bannerOn]}
            accessibilityLiveRegion="polite"
          >
            <View
              style={[styles.bannerDot, trip?.redirected && styles.bannerDotOn]}
            />
            <Text
              style={[
                styles.bannerText,
                trip?.redirected && styles.bannerTextOn,
              ]}
            >
              {message}
            </Text>
          </View>

          <HorizontalDemo enabled={enabled} guide={guideInputs} />
          <VerticalDemo enabled={enabled} guide={guideInputs} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <KeyboardGroupProvider groupIdentifier="guide-demo-toggles">
          <View style={styles.toggles}>
            <Toggle
              label="Guide"
              value={enabled}
              onPress={() => setEnabled((v) => !v)}
            />
            <Toggle
              label="Screen reader"
              value={screenReader}
              onPress={() => setScreenReader((v) => !v)}
            />
            <Toggle
              label="Hide guide"
              value={invisible}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setInvisible((v) => !v);
              }}
            />
          </View>
        </KeyboardGroupProvider>
      </View>
    </View>
  );
};

// --- Horizontal list -------------------------------------------------------------------------

const H_GROUP = 'guide-demo-h';
const H_ITEMS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const H_FIRST = `h-${H_ITEMS[0]}`;
const H_LAST = `h-${H_ITEMS[H_ITEMS.length - 1]}`;

type HorizontalDemoProps = {
  enabled: boolean;
  guide: KeyboardFocusGuideProps['guide'];
};

/** A scrolling row with two shortcuts: a guide after the first card sends → to the last card, one before the last card sends ← back to the first. */
const HorizontalDemo = ({ enabled, guide }: HorizontalDemoProps) => {
  const jump = (to: string, arrow: string, label: string) => (
    <Focus.Guide
      orderGroup={H_GROUP}
      to={to}
      guide={guide}
      enabled={enabled}
      style={[hs.guide, !enabled && hs.guideOff]}
    >
      <Text style={hs.guideArrow}>{arrow}</Text>
      <Text style={hs.guideText}>{enabled ? label : 'off'}</Text>
    </Focus.Guide>
  );

  return (
    <View style={hs.section}>
      <View style={hs.head}>
        <Text style={hs.title}>Horizontal list</Text>
        <Text style={hs.sub}>start ⇄ end</Text>
      </View>
      <KeyboardOrderFocusGroup groupId={H_GROUP}>
        <BlueprintStage style={hs.stage}>
          <ScrollView
            horizontal
            // Off-screen children stay mounted, so a guide can reach a target that is scrolled out of view.
            removeClippedSubviews={false}
            showsHorizontalScrollIndicator={false}
            style={hs.scroll}
            contentContainerStyle={hs.row}
          >
            {H_ITEMS.map((item, i) => {
              const id = `h-${item}`;
              const tag =
                enabled && id === H_FIRST
                  ? 'START'
                  : enabled && id === H_LAST
                  ? 'END'
                  : undefined;
              return (
                <Fragment key={id}>
                  {id === H_LAST ? jump(H_FIRST, '←', 'to start') : null}
                  <Pressable
                    orderId={id}
                    tintType="none"
                    accessibilityRole="button"
                    accessibilityLabel={item}
                    focusStyle={hs.focused}
                    containerStyle={[hs.card, tag && hs.target]}
                    style={hs.inner}
                  >
                    <ItemLabel label={item} tag={tag} />
                  </Pressable>
                  {i === 0 ? jump(H_LAST, '→', 'to end') : null}
                </Fragment>
              );
            })}
          </ScrollView>
        </BlueprintStage>
      </KeyboardOrderFocusGroup>
    </View>
  );
};

/** Reads the host's keyboard focus itself, so the list does not re-render on every move. */
const ItemLabel = ({ label, tag }: { label: string; tag?: string }) => {
  const focused = useIsViewFocused();
  const target = tag != null;
  return (
    <>
      <Text
        style={[hs.text, target && hs.textTarget, focused && hs.textFocused]}
      >
        {label}
      </Text>
      {tag ? (
        <Text style={[hs.tag, focused && hs.tagFocused]}>{tag}</Text>
      ) : null}
    </>
  );
};

// --- Vertical list -------------------------------------------------------------------------

const V_GROUP = 'guide-demo-v';
const V_ITEMS = [
  'Apple',
  'Banana',
  'Cherry',
  'Dates',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
];
const V_FIRST = `v-${V_ITEMS[0]}`;
const V_LAST = `v-${V_ITEMS[V_ITEMS.length - 1]}`;

type VerticalDemoProps = {
  enabled: boolean;
  guide: KeyboardFocusGuideProps['guide'];
};

/** A scrolling column with two shortcuts: a guide before the first item sends ↑ to the last item, one after the last item sends ↓ back to the first. */
const VerticalDemo = ({ enabled, guide }: VerticalDemoProps) => {
  const jump = (to: string, arrow: string, label: string) => (
    <Focus.Guide
      orderGroup={V_GROUP}
      to={to}
      guide={guide}
      enabled={enabled}
      style={[vs.guide, !enabled && vs.guideOff]}
    >
      <Text style={vs.guideArrow}>{arrow}</Text>
      <Text style={vs.guideText}>{enabled ? label : 'off'}</Text>
    </Focus.Guide>
  );

  return (
    <View style={vs.section}>
      <View style={vs.head}>
        <Text style={vs.title}>Vertical list</Text>
        <Text style={vs.sub}>first ↕ last</Text>
      </View>
      <KeyboardOrderFocusGroup groupId={V_GROUP}>
        <BlueprintStage style={vs.stage}>
          <ScrollView
            // Off-screen children stay mounted, so a guide can reach a target that is scrolled out of view.
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            style={vs.scroll}
            contentContainerStyle={vs.column}
          >
            {V_ITEMS.map((item, i) => {
              const id = `v-${item}`;
              const tag =
                enabled && id === V_FIRST
                  ? 'FIRST'
                  : enabled && id === V_LAST
                  ? 'LAST'
                  : undefined;
              return (
                <Fragment key={id}>
                  {i === V_ITEMS.length - 1
                    ? jump(V_FIRST, '↑', 'to first')
                    : null}
                  <Pressable
                    orderId={id}
                    tintType="none"
                    accessibilityRole="button"
                    accessibilityLabel={item}
                    focusStyle={vs.focused}
                    containerStyle={[vs.card, tag && vs.target]}
                    style={vs.inner}
                  >
                    <ItemLabel label={item} tag={tag} />
                  </Pressable>
                  {i === 0 ? jump(V_LAST, '↓', 'to last') : null}
                </Fragment>
              );
            })}
          </ScrollView>
        </BlueprintStage>
      </KeyboardOrderFocusGroup>
    </View>
  );
};

const Legend = ({
  color,
  ring,
  label,
}: {
  color: string;
  ring?: string;
  label: string;
}) => {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          { backgroundColor: color },
          ring ? [styles.legendRing, { borderColor: ring }] : null,
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: PLATINUM,
      backgroundColor: PLATINUM,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    bannerOn: {
      borderColor: t.bannerOn.border,
      backgroundColor: t.bannerOn.bg,
    },
    bannerDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#a3a3a3',
    },
    bannerDotOn: { backgroundColor: t.redirect },
    bannerText: { flex: 1, fontSize: 15, fontWeight: '600', color: INK },
    bannerTextOn: { color: t.bannerOn.text },

    stage: { borderRadius: 18, backgroundColor: t.stage, overflow: 'hidden' },
    stageInner: { flex: 1, margin: PAD },

    cell: {
      position: 'absolute',
      height: CELL_H,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: t.cell.border,
      backgroundColor: t.cell.bg,
    },
    cellInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cellTarget: { borderColor: t.target.border, backgroundColor: t.target.bg },
    cellFocused: { borderColor: t.focus.border, backgroundColor: t.focus.bg },
    cellText: { fontSize: 15, fontWeight: '700', color: t.cell.text },
    cellTextTarget: { color: t.target.text },
    cellTextFocused: { color: t.focus.text },
    cellTagFocused: { color: t.focus.tag },
    cellTag: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: t.target.tag,
    },
    ring: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: t.focus.ring,
    },
    capsule: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: CELL_H + GAP,
      height: GUIDE_H,
      borderRadius: 14,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: t.guide.border,
      backgroundColor: t.guide.bg,
      overflow: 'hidden',
    },
    capsuleDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: t.guide.divider,
    },
    guide: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    guideArrow: {
      width: 16,
      textAlign: 'center',
      fontSize: 15,
      fontWeight: '800',
      color: t.guide.text,
    },
    guideText: { fontSize: 12, fontWeight: '700', color: t.guide.text },

    token: {
      position: 'absolute',
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: THEME.tokenRing,
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    },

    capsuleInvisible: {
      top: CELL_H + INVISIBLE_PAD,
      height: INVISIBLE_GAP - INVISIBLE_PAD * 2,
      justifyContent: 'space-between',
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    guideInvisible: { flex: 0, height: 1 },
    root: { flex: 1, backgroundColor: '#fff' },
    scroll: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 16, paddingBottom: 48 },
    description: { fontSize: 14, color: '#555' },
    body: { marginTop: 16, gap: 12 },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#e2e8f0',
      backgroundColor: '#fff',
    },
    toggles: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    hidden: { opacity: 0 },
    capsuleOff: { backgroundColor: t.guide.off },
    toggle: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#d4d4d4',
      backgroundColor: PLATINUM,
    },
    toggleInner: {
      paddingVertical: 6,
      paddingLeft: 8,
      paddingRight: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    toggleLabel: { fontSize: 12, fontWeight: '600', color: INK },
    switchTrack: {
      width: 30,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#b8b8b8',
      padding: 2,
    },
    switchTrackOn: { backgroundColor: t.accent },
    switchThumb: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#fff',
    },
    switchThumbOn: { transform: [{ translateX: 12 }] },
    legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendRing: { borderWidth: 2 },
    legendSwatch: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: '#525252' },
  });

const styles = makeStyles(THEME);

const hs = StyleSheet.create({
  section: { gap: 6, marginTop: 8 },
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: { fontSize: 16, fontWeight: '700', color: INK },
  sub: { fontSize: 12.5, color: '#5b5b63' },
  stage: { paddingVertical: PAD },
  scroll: { flexGrow: 0, marginHorizontal: -PAD },
  row: { gap: GAP, paddingHorizontal: PAD },
  card: {
    width: 88,
    height: CELL_H,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: THEME.cell.border,
    backgroundColor: THEME.cell.bg,
  },
  target: {
    borderColor: THEME.target.border,
    backgroundColor: THEME.target.bg,
  },
  focused: {
    borderColor: THEME.focus.border,
    backgroundColor: THEME.focus.bg,
    borderRadius: 14,
  },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 15, fontWeight: '700', color: THEME.cell.text },
  textTarget: { color: THEME.target.text },
  textFocused: { color: THEME.focus.text },
  tag: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: THEME.target.tag,
  },
  tagFocused: { color: THEME.focus.tag },
  guide: {
    width: 60,
    height: CELL_H,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: THEME.guide.border,
    backgroundColor: THEME.guide.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideOff: { backgroundColor: THEME.guide.off },
  guideArrow: { fontSize: 16, fontWeight: '800', color: THEME.guide.text },
  guideText: { fontSize: 10.5, fontWeight: '700', color: THEME.guide.text },
});

const vs = StyleSheet.create({
  section: { gap: 6, marginTop: 8 },
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: { fontSize: 16, fontWeight: '700', color: INK },
  sub: { fontSize: 12.5, color: '#5b5b63' },
  stage: { paddingVertical: PAD, maxHeight: 250 },
  scroll: { flexGrow: 0 },
  column: { gap: GAP, paddingVertical: PAD },
  card: {
    height: CELL_H,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: THEME.cell.border,
    backgroundColor: THEME.cell.bg,
    marginHorizontal: PAD,
  },
  target: {
    borderColor: THEME.target.border,
    backgroundColor: THEME.target.bg,
  },
  focused: {
    borderColor: THEME.focus.border,
    backgroundColor: THEME.focus.bg,
    borderRadius: 14,
  },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 15, fontWeight: '700', color: THEME.cell.text },
  textTarget: { color: THEME.target.text },
  textFocused: { color: THEME.focus.text },
  tag: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: THEME.target.tag,
  },
  tagFocused: { color: THEME.focus.tag },
  guide: {
    height: 36,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: THEME.guide.border,
    backgroundColor: THEME.guide.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: PAD,
  },
  guideOff: { backgroundColor: THEME.guide.off },
  guideArrow: { fontSize: 16, fontWeight: '800', color: THEME.guide.text },
  guideText: { fontSize: 10.5, fontWeight: '700', color: THEME.guide.text },
});
