import { useEffect, useRef, useState, type RefObject } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';
import type { BaseKeyboardViewType } from 'react-native-external-keyboard';

const ACCENT = '#5856d6'; // the custom order path / visited cells
const FOCUS = '#34c759'; // the cell that currently holds focus
const RAIL = '#d8d8e0';

// Fixed grid metrics so we can place cells + draw the path without measuring.
const CELL = 84;
const GAP = 16;
const GRID = CELL * 3 + GAP * 2;
const DOT_R = 11;
const TH = 6; // connector thickness

const cellLeft = (col: number) => col * (CELL + GAP);
const cellTop = (row: number) => row * (CELL + GAP);
const centerX = (col: number) => cellLeft(col) + CELL / 2;
const centerY = (row: number) => cellTop(row) + CELL / 2;

// Step order 1..9 arranged as an inward spiral — deliberately NOT reading order,
// so the numbers visibly disagree with left-to-right / top-to-bottom.
//   1 2 3
//   8 9 4
//   7 6 5
const STOPS: { row: number; col: number }[] = [
  { row: 0, col: 0 }, // 1
  { row: 0, col: 1 }, // 2
  { row: 0, col: 2 }, // 3
  { row: 1, col: 2 }, // 4
  { row: 2, col: 2 }, // 5
  { row: 2, col: 1 }, // 6
  { row: 2, col: 0 }, // 7
  { row: 1, col: 0 }, // 8
  { row: 1, col: 1 }, // 9
];

const idFor = (step: number) => `cell-${step}`; // step is 1-based

export const FocusOrderAnimatedScreen = () => {
  // Truthful focus step (1..9) — driven by each cell's onFocusChange.
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const cellRefs = useRef(
    STOPS.map(
      () => ({ current: null }) as RefObject<BaseKeyboardViewType | null>
    )
  ).current;

  // Comet position follows `activeStep` along the spiral path.
  const t = useRef(new Animated.Value(0)).current;
  const cometOn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeStep == null) {
      Animated.timing(cometOn, {
        toValue: 0,
        duration: 200,
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
        toValue: activeStep - 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, [activeStep, cometOn, t]);

  const onCellFocus = (step: number) => (isFocused: boolean) =>
    setActiveStep((cur) => (isFocused ? step : cur === step ? null : cur));

  const inputRange = STOPS.map((_, i) => i);
  const cometStyle = {
    opacity: cometOn,
    transform: [
      {
        translateX: t.interpolate({
          inputRange,
          outputRange: STOPS.map((s) => centerX(s.col)),
        }),
      },
      {
        translateY: t.interpolate({
          inputRange,
          outputRange: STOPS.map((s) => centerY(s.row)),
        }),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <View style={styles.intro}>
        <Text style={styles.introText}>
          The cells are numbered in <Text style={styles.bold}>focus order</Text>{' '}
          — but they're arranged in a spiral, not reading order. Each cell links
          to the next with <Text style={styles.code}>orderForward</Text> /{' '}
          <Text style={styles.code}>orderBackward</Text>, so Tab follows the
          numbers 1 → 9 instead of going row by row.
        </Text>
      </View>

      <View style={styles.stage}>
        <View style={{ width: GRID, height: GRID }}>
          {/* Path connectors (under the cells). */}
          {STOPS.slice(0, -1).map((s, i) => {
            const a = { x: centerX(s.col), y: centerY(s.row) };
            const next = STOPS[i + 1]!;
            const b = { x: centerX(next.col), y: centerY(next.row) };
            const horizontal = a.y === b.y;
            const lit = activeStep != null && i < activeStep - 1;
            const segStyle = horizontal
              ? {
                  left: Math.min(a.x, b.x),
                  top: a.y - TH / 2,
                  width: Math.abs(a.x - b.x),
                  height: TH,
                }
              : {
                  left: a.x - TH / 2,
                  top: Math.min(a.y, b.y),
                  width: TH,
                  height: Math.abs(a.y - b.y),
                };
            return (
              <View
                key={`seg-${i}`}
                style={[
                  styles.segment,
                  segStyle,
                  { backgroundColor: lit ? ACCENT : RAIL },
                ]}
              />
            );
          })}

          {/* Focusable cells, grouped so order IDs stay namespaced. */}
          <KeyboardOrderFocusGroup>
            {STOPS.map((s, i) => {
              const step = i + 1;
              return (
                <Cell
                  key={step}
                  step={step}
                  row={s.row}
                  col={s.col}
                  innerRef={cellRefs[i]!}
                  current={activeStep === step}
                  visited={activeStep != null && step < activeStep}
                  orderId={idFor(step)}
                  orderForward={idFor(step === STOPS.length ? 1 : step + 1)}
                  orderBackward={idFor(step === 1 ? STOPS.length : step - 1)}
                  onFocusChange={onCellFocus(step)}
                />
              );
            })}
          </KeyboardOrderFocusGroup>

          {/* Comet that rides the order path (on top). */}
          <Animated.View
            pointerEvents="none"
            style={[styles.comet, cometStyle]}
          >
            <View style={styles.cometCore} />
          </Animated.View>
        </View>
      </View>

      <Text style={styles.footnote}>
        Press Tab / Shift+Tab to walk the spiral order, or tap a cell to focus
        it. The highlight follows real focus events.
      </Text>
    </View>
  );
};

const Cell = ({
  step,
  row,
  col,
  current,
  visited,
  innerRef,
  orderId,
  orderForward,
  orderBackward,
  onFocusChange,
}: {
  step: number;
  row: number;
  col: number;
  current: boolean;
  visited: boolean;
  innerRef: RefObject<BaseKeyboardViewType | null>;
  orderId: string;
  orderForward: string;
  orderBackward: string;
  onFocusChange: (isFocused: boolean) => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: current ? 1.06 : 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 9,
    }).start();
    if (current) {
      pulse.setValue(0);
      Animated.timing(pulse, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [current, scale, pulse]);

  return (
    <Animated.View
      style={[
        styles.cellWrap,
        current && styles.cellWrapTop,
        {
          left: cellLeft(col),
          top: cellTop(row),
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        ref={innerRef}
        orderId={orderId}
        orderForward={orderForward}
        orderBackward={orderBackward}
        onPress={() => innerRef.current?.focus()}
        onFocusChange={onFocusChange}
        haloEffect={false}
        defaultFocusHighlightEnabled={false}
        style={[
          styles.cell,
          visited && styles.cellVisited,
          current && styles.cellCurrent,
        ]}
      >
        {current ? (
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
        <Text
          style={[
            styles.cellNumber,
            visited && { color: ACCENT },
            current && { color: FOCUS },
          ]}
        >
          {step}
        </Text>
        <Text style={styles.cellTag}>order {step}</Text>
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
    marginBottom: 16,
  },
  introText: { fontSize: 14, color: '#3c3c43', lineHeight: 20 },
  bold: { fontWeight: '700', color: '#000000' },
  code: {
    fontFamily: 'Courier',
    fontWeight: '700',
    color: ACCENT,
    fontSize: 13,
  },

  stage: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },

  segment: { position: 'absolute', borderRadius: TH / 2 },

  cellWrap: { position: 'absolute', width: CELL, height: CELL, zIndex: 1 },
  cellWrapTop: { zIndex: 2 },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5ea',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cellVisited: { borderColor: ACCENT, backgroundColor: '#f1f0fb' },
  cellCurrent: {
    borderColor: FOCUS,
    backgroundColor: '#ffffff',
    shadowColor: FOCUS,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cellNumber: { fontSize: 30, fontWeight: '800', color: '#1c1c1e' },
  cellTag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#aeaeb2',
    letterSpacing: 0.3,
  },
  pulseRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: FOCUS,
  },

  comet: {
    position: 'absolute',
    top: -DOT_R,
    left: -DOT_R,
    width: DOT_R * 2,
    height: DOT_R * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cometCore: {
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    backgroundColor: FOCUS,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: FOCUS,
    shadowOpacity: 0.9,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 0 },
    elevation: 9,
  },

  footnote: {
    marginTop: 18,
    fontSize: 12.5,
    color: '#8e8e93',
    lineHeight: 17,
  },
});
