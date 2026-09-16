import { useCallback, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BaseKeyboardView, K, Pressable } from 'react-native-external-keyboard';

/**
 * Tab-focus regression bench. Every shape below is a keyboard-focusable host that differs
 * from its neighbours in exactly one way, so a Tab pass across the screen reads as a
 * pass/fail table without a debugger attached.
 *
 * How to read it: Tab from the top. Each shape logs its number when it takes focus, and
 * the trail at the top of the screen shows the order. A correct pass is
 * `1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17` with no gaps; a shape that iOS has dropped
 * from the ordered candidate list simply never appears.
 *
 * Shape 4 is the iOS 26 regression: the content view covers the focus target 1:1, and
 * before the occlusion fix iOS 26 dropped it (and 5, 6, 8, 9 with it) while arrow keys
 * still reached all of them. Shapes 1-3 and 7 were never affected and are the controls —
 * if one of THEM disappears, the fix has overreached.
 *
 * Shapes 1-9 use a single library `Pressable` (`withKeyboardFocus`, `focusableWrapper:
 * true` — the target is a separate child view). 10-17 nest one focusable host inside
 * another's covering content, covering every combination of the two host shapes the
 * library has — wrapper (`Pressable`, target is a separate child) and self-target
 * (`BaseKeyboardView` used directly, `focusableWrapper: false` — the host IS the target):
 *
 *   | outer \ inner | wrapper (Pressable)  | self-target (BaseKeyboardView) |
 *   |---------------|----------------------|---------------------------------|
 *   | wrapper       | 10/11                | 14/15                          |
 *   | self-target   | 12/13                | 16/17                          |
 *
 * This matters because the occlusion fix's `RNCEKVIsFocusWrapper` check only recognizes
 * an ancestor with `focusableWrapper == YES` — it has no special case for "ancestor is
 * itself a self-target focus item". 10/11 (the only wrapper-anchored cell) was the
 * original verified case; 12/13, 14/15 and 16/17 each remove one more `focusableWrapper`
 * from the chain, checking the fix doesn't secretly depend on one being present.
 */

type ShapeProps = {
  index: number;
  title: string;
  note: string;
  children?: React.ReactNode;
};

const Shape = ({ index, title, note, children }: ShapeProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>
      {index} · {title}
    </Text>
    <Text style={styles.note}>{note}</Text>
    {children}
  </View>
);

export const FocusSandbox = () => {
  const [trail, setTrail] = useState<number[]>([]);
  const lastRef = useRef<number | null>(null);

  const onFocus = useCallback((index: number) => {
    // onFocusChange can fire twice for one move (leave + enter); collapse repeats so the
    // trail shows the ORDER Tab walked, not the event count.
    if (lastRef.current === index) {
      return;
    }
    lastRef.current = index;
    setTrail((prev) => [...prev, index].slice(-24));
  }, []);

  const reset = useCallback(() => {
    lastRef.current = null;
    setTrail([]);
  }, []);

  const focusHandler = (index: number) => (focused: boolean) => {
    if (focused) {
      onFocus(index);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.trailLabel}>
          Tab order ({Platform.OS} {String(Platform.Version)})
        </Text>
        <Text style={styles.trail}>
          {trail.length ? trail.join(' → ') : '—'}
        </Text>
        <Text style={styles.expected}>
          expected: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 →
          15 → 16 → 17
        </Text>
        <Pressable
          style={styles.reset}
          onPress={reset}
          onFocusChange={() => {}}
        >
          <Text style={styles.resetText}>reset trail</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {/* 1 — control. The box is on the Pressable; the child is too small to cover it. */}
        <Shape
          index={1}
          title="box on the Pressable, small child"
          note="control — never affected"
        >
          <Pressable style={styles.box} onFocusChange={focusHandler(1)}>
            <Text style={styles.boxText}>one</Text>
          </Pressable>
        </Shape>

        {/* 2 — control. Extra depth is harmless while nothing covers the target. */}
        <Shape
          index={2}
          title="box on the Pressable + extra child View"
          note="control — extra depth, no cover"
        >
          <Pressable style={styles.box} onFocusChange={focusHandler(2)}>
            <View>
              <Text style={styles.boxText}>two</Text>
            </View>
          </Pressable>
        </Shape>

        {/* 3 — control. Function children, no wrapping View at all. */}
        <Shape
          index={3}
          title="function children, no wrapping View"
          note="control — render-prop form"
        >
          <Pressable style={styles.box} onFocusChange={focusHandler(3)}>
            {({ pressed }) => (
              <Text style={[styles.boxText, pressed && styles.pressed]}>
                three
              </Text>
            )}
          </Pressable>
        </Shape>

        {/* 4 — THE REGRESSION. An opaque child at the focus target's exact frame. */}
        <Shape
          index={4}
          title="box on a child covering the Pressable 1:1"
          note="the iOS 26 regression case"
        >
          <Pressable onFocusChange={focusHandler(4)}>
            <View style={styles.box}>
              <Text style={styles.boxText}>four</Text>
            </View>
          </Pressable>
        </Shape>

        {/* 5 — same, with flattening explicitly disabled. */}
        <Shape
          index={5}
          title="covering child + collapsable={false}"
          note="rules out Fabric view flattening"
        >
          <Pressable onFocusChange={focusHandler(5)}>
            <View collapsable={false} style={styles.box}>
              <Text style={styles.boxText}>five</Text>
            </View>
          </Pressable>
        </Shape>

        {/* 6 — same, but the Pressable carries a style that draws nothing. */}
        <Shape
          index={6}
          title="covering child, Pressable styled with no box"
          note="backgroundColor: transparent on the target"
        >
          <Pressable style={styles.noBox} onFocusChange={focusHandler(6)}>
            <View style={styles.box}>
              <Text style={styles.boxText}>six</Text>
            </View>
          </Pressable>
        </Shape>

        {/* 7 — control. 1pt of the target stays visible, so it is never covered. */}
        <Shape
          index={7}
          title="child inset by 1pt"
          note="control — coverage lost by 1pt"
        >
          <Pressable onFocusChange={focusHandler(7)}>
            <View style={[styles.box, styles.inset]}>
              <Text style={styles.boxText}>seven</Text>
            </View>
          </Pressable>
        </Shape>

        {/* 8 — covering child plus a decorative overlay the walk must ignore. */}
        <Shape
          index={8}
          title="covering child + pointerEvents='none' overlay"
          note="the overlay must not be taken for the card"
        >
          <Pressable onFocusChange={focusHandler(8)}>
            <View style={styles.box}>
              <Text style={styles.boxText}>eight</Text>
            </View>
            <View pointerEvents="none" style={styles.overlay} />
          </Pressable>
        </Shape>

        {/* 9 — three covering layers deep. */}
        <Shape
          index={9}
          title="nested covering children, three deep"
          note="the walk must descend, not stop at the first"
        >
          <Pressable onFocusChange={focusHandler(9)}>
            <View style={styles.fill}>
              <View style={styles.fill}>
                <View style={styles.box}>
                  <Text style={styles.boxText}>nine</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Shape>

        {/* 10 — a button inside another button's covering content. Both must stay
            reachable: the inner wrapper's own view reports transparent, but its focus
            target keeps UIKit's answer, and a focusable item is never transparent. */}
        <Shape
          index={10}
          title="library Pressable nested inside a covering child"
          note="both buttons must be reachable — 10 then 11"
        >
          <Pressable onFocusChange={focusHandler(10)}>
            <View style={[styles.box, styles.boxTall]}>
              <Text style={styles.boxText}>ten (outer)</Text>
              <Pressable
                style={styles.inner}
                onFocusChange={focusHandler(11)}
                onPress={() => {}}
              >
                <View style={styles.innerBox}>
                  <Text style={styles.boxText}>eleven (inner)</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Shape>

        {/* 12/13 — same shape as 10/11, but the OUTER host is a bare `BaseKeyboardView`
            (`focusableWrapper={false}`, itself the focus target — no Pressable-style
            indirection through a separate target child) instead of a library `Pressable`.
            `RNCEKVIsFocusWrapper` in the occlusion fix only recognizes an ancestor with
            `focusableWrapper == YES`; a self-target host never satisfies that, so this
            checks whether the fix actually covers this component shape or only the
            Pressable/withKeyboardFocus one. */}
        <Shape
          index={12}
          title="BaseKeyboardView (self-target) covered, K.Pressable nested inside"
          note="both must be reachable — 12 then 13"
        >
          <BaseKeyboardView
            focusableWrapper={false}
            onFocusChange={focusHandler(12)}
          >
            <View style={[styles.box, styles.boxTall]}>
              <Text style={styles.boxText}>twelve (BaseKeyboardView)</Text>
              <K.Pressable
                style={styles.inner}
                onFocusChange={focusHandler(13)}
                onPress={() => {}}
              >
                <View style={styles.innerBox}>
                  <Text style={styles.boxText}>thirteen (K.Pressable)</Text>
                </View>
              </K.Pressable>
            </View>
          </BaseKeyboardView>
        </Shape>

        {/* 14/15 — the reverse pairing of 12/13: a library `Pressable` (wrapper) on the
            outside, a bare `BaseKeyboardView` (self-target) nested inside its covering
            content. Checks the walk still finds the OUTER Pressable's target through
            content that itself contains a self-target host (which the walk does not
            recognize as a wrapper at all), and that the inner BaseKeyboardView still
            resolves its own covering content independently. */}
        <Shape
          index={14}
          title="Pressable covered, BaseKeyboardView (self-target) nested inside"
          note="both must be reachable — 14 then 15"
        >
          <Pressable onFocusChange={focusHandler(14)}>
            <View style={[styles.box, styles.boxTall]}>
              <Text style={styles.boxText}>fourteen (Pressable)</Text>
              <BaseKeyboardView
                focusableWrapper={false}
                style={styles.inner}
                onFocusChange={focusHandler(15)}
              >
                <View style={styles.innerBox}>
                  <Text style={styles.boxText}>fifteen (BaseKeyboardView)</Text>
                </View>
              </BaseKeyboardView>
            </View>
          </Pressable>
        </Shape>

        {/* 16/17 — the last cell in the 2x2 matrix: a self-target `BaseKeyboardView`
            nested inside another self-target `BaseKeyboardView`'s covering content.
            Neither ancestor is ever a `focusableWrapper`, so this stacks the same open
            question from 12/13 one level deeper: does each host resolve its OWN covering
            content independently of the other, with no `focusableWrapper` anywhere in
            the chain to anchor the walk. */}
        <Shape
          index={16}
          title="BaseKeyboardView nested inside BaseKeyboardView, both self-target"
          note="both must be reachable — 16 then 17"
        >
          <BaseKeyboardView
            focusableWrapper={false}
            onFocusChange={focusHandler(16)}
          >
            <View style={[styles.box, styles.boxTall]}>
              <Text style={styles.boxText}>
                sixteen (outer BaseKeyboardView)
              </Text>
              <BaseKeyboardView
                focusableWrapper={false}
                style={styles.inner}
                onFocusChange={focusHandler(17)}
              >
                <View style={styles.innerBox}>
                  <Text style={styles.boxText}>
                    seventeen (inner BaseKeyboardView)
                  </Text>
                </View>
              </BaseKeyboardView>
            </View>
          </BaseKeyboardView>
        </Shape>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f7' },
  header: {
    padding: 16,
    gap: 4,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d1d6',
  },
  trailLabel: { fontSize: 11, color: '#8e8e93', letterSpacing: 0.5 },
  trail: { fontFamily: 'Courier', fontSize: 16, color: '#1c1c1e' },
  expected: { fontFamily: 'Courier', fontSize: 11, color: '#8e8e93' },
  reset: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e5e5ea',
  },
  resetText: { fontSize: 12, color: '#1c1c1e' },

  list: { padding: 16, gap: 14, paddingBottom: 48 },
  row: { gap: 2 },
  label: { fontSize: 12, fontWeight: '600', color: '#3c3c43' },
  note: { fontSize: 11, color: '#8e8e93', marginBottom: 4 },

  box: {
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d1d6',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // A style on the Pressable that draws nothing — the target still has no visible pixels.
  noBox: { backgroundColor: 'transparent' },
  fill: { alignSelf: 'stretch' },
  inset: { margin: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
  },
  boxTall: { height: 92 },
  inner: { marginTop: 6 },
  innerBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c7c7cc',
    backgroundColor: '#e5e5ea',
  },
  boxText: { fontSize: 14, fontWeight: '600', color: '#1c1c1e' },
  pressed: { opacity: 0.5 },
});
