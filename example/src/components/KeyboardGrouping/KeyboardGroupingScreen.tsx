import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardGroupProvider,
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';

const FOCUS = '#34c759';

type ItemProps = {
  id: string;
  focused: string | null;
  onFocus: (id: string) => void;
  uniqueGroupIdentifier?: boolean;
  orderIndex?: number;
};

const Item = ({
  id,
  focused,
  onFocus,
  uniqueGroupIdentifier,
  orderIndex,
}: ItemProps) => (
  <Pressable
    tintType="none"
    accessibilityRole="button"
    accessibilityLabel={id}
    uniqueGroupIdentifier={uniqueGroupIdentifier}
    orderIndex={orderIndex}
    onFocus={() => onFocus(id)}
    style={styles.itemInner}
    containerStyle={[styles.item, focused === id && styles.itemFocused]}
  >
    <Text style={styles.itemText}>{id}</Text>
  </Pressable>
);

type RegionProps = {
  title: string;
  hint: string;
  prefix: string;
  focused: string | null;
  onFocus: (id: string) => void;
  uniqueGroupIdentifier?: boolean;
};

const Region = ({ title, hint, prefix, ...item }: RegionProps) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{title}</Text>
    <Text style={styles.hint}>{hint}</Text>
    <View style={styles.row}>
      {[1, 2, 3].map((n) => (
        <Item key={n} id={`${prefix}${n}`} {...item} />
      ))}
    </View>
  </View>
);

/**
 * iOS keyboard focus groups: Tab / Shift+Tab move between groups, Ctrl+Tab / Ctrl+Shift+Tab
 * inside one. Android has no focus groups, so every region behaves the same there.
 */
export const KeyboardGroupingScreen = () => {
  const [focused, setFocused] = useState<string | null>(null);
  const [unique, setUnique] = useState(false);
  const [orderUnique, setOrderUnique] = useState(false);
  const item = { focused, onFocus: setFocused };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <Text style={styles.description}>
        iOS: Tab / Shift+Tab move between focus groups, Ctrl+Tab /
        Ctrl+Shift+Tab move inside one. Connect a keyboard (or turn on Full
        Keyboard Access) and compare the regions. Android has no focus groups.
      </Text>
      <Text style={styles.status}>Focused: {focused ?? '—'}</Text>

      <Region
        title="DEFAULT (NO GROUP ID)"
        hint="No id is generated, so iOS applies its own grouping."
        prefix="D"
        {...item}
      />

      <KeyboardGroupProvider groupIdentifier="grouping-toolbar">
        <Region
          title="NAMED GROUP · KeyboardGroupProvider groupIdentifier"
          hint="One Tab stop for the row; Ctrl+Tab moves between T1–T3."
          prefix="T"
          {...item}
        />
      </KeyboardGroupProvider>

      <KeyboardGroupProvider uniqueGroupIdentifier>
        <Region
          title="UNIQUE · KeyboardGroupProvider uniqueGroupIdentifier"
          hint="Every view is its own group, so Tab stops at U1, U2 and U3 (the pre-0.14 behavior)."
          prefix="U"
          {...item}
        />
      </KeyboardGroupProvider>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>PER VIEW · uniqueGroupIdentifier</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Per-view unique ids: ${unique ? 'on' : 'off'}`}
          onPress={() => setUnique((v) => !v)}
          containerStyle={styles.toggle}
        >
          <Text style={styles.toggleText}>
            uniqueGroupIdentifier: {unique ? 'ON' : 'OFF'}
          </Text>
        </Pressable>
        <View style={styles.row}>
          {[1, 2, 3].map((n) => (
            <Item
              key={n}
              id={`V${n}`}
              uniqueGroupIdentifier={unique}
              {...item}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>ORDER · orderIndex (O3 → O2 → O1)</Text>
        <Text style={styles.hint}>
          The index order runs right to left. Unique ids off: Ctrl+Tab follows
          it and Tab moves on to the next group. Unique ids on: plain Tab
          follows it.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Order unique ids: ${orderUnique ? 'on' : 'off'}`}
          onPress={() => setOrderUnique((v) => !v)}
          containerStyle={styles.toggle}
        >
          <Text style={styles.toggleText}>
            uniqueGroupIdentifier: {orderUnique ? 'ON' : 'OFF'}
          </Text>
        </Pressable>
        <KeyboardGroupProvider uniqueGroupIdentifier={orderUnique}>
          <KeyboardOrderFocusGroup groupId="grouping-order">
            <View style={styles.row}>
              {[1, 2, 3].map((n) => (
                <Item key={n} id={`O${n}`} orderIndex={3 - n} {...item} />
              ))}
            </View>
          </KeyboardOrderFocusGroup>
        </KeyboardGroupProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  screenContent: { padding: 16, paddingBottom: 48, gap: 12 },
  description: { fontSize: 14, color: '#555' },
  status: { fontSize: 13, fontWeight: '600', color: '#334155' },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    backgroundColor: '#fafafa',
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  hint: { fontSize: 13, color: '#475569' },
  row: { flexDirection: 'row', gap: 10 },
  item: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5ea',
    backgroundColor: '#fff',
  },
  itemInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  itemFocused: { borderColor: FOCUS, backgroundColor: '#f0fbf3' },
  itemText: { fontSize: 15, fontWeight: '600', color: '#1c1c1e' },
  toggle: { borderRadius: 12, backgroundColor: '#eef2ff', padding: 12 },
  toggleText: { fontWeight: '700', color: '#5856d6' },
});
