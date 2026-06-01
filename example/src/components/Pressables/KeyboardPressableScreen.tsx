import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Pressable } from 'react-native-external-keyboard';

type RenderMode = 'children' | 'renderContent' | 'renderFocusable';

const MODES: { key: RenderMode; label: string; hint: string }[] = [
  {
    key: 'children',
    label: 'children',
    hint: 'Standard Pressable children — receives `{ pressed }`, no keyboard `focused` state.',
  },
  {
    key: 'renderContent',
    label: 'renderContent',
    hint: 'Receives `{ pressed, focused }` together — pressed comes from Pressable, focused from the keyboard.',
  },
  {
    key: 'renderFocusable',
    label: 'renderFocusable',
    hint: 'Receives only `{ focused }` — for components without a `{ pressed }` render prop.',
  },
];

export const KeyboardPressableScreen = () => {
  const [mode, setMode] = useState<RenderMode>('children');
  const [log, setLog] = useState('');

  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) =>
      `${time} — ${msg}\n${prev}`
        .split('\n')
        .filter(Boolean)
        .slice(0, 8)
        .join('\n')
    );
  };

  const commonProps = {
    haloEffect: false,
    defaultFocusHighlightEnabled: false,
    // Android: surface keyboard activation as `pressed` in the render props.
    androidKeyboardPressState: true,
    roundedHaloFix: true,
    onPress: () => appendLog(`${mode}: Press`),
    onLongPress: () => appendLog(`${mode}: Long Press`),
    onFocus: () => appendLog(`${mode}: Focus`),
    onBlur: () => appendLog(`${mode}: Blur`),
  };

  const activeHint = MODES.find((m) => m.key === mode)?.hint;

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {MODES.map((m) => {
          const selected = m.key === mode;
          return (
            <Pressable
              key={m.key}
              roundedHaloFix
              haloEffect={false}
              defaultFocusHighlightEnabled={false}
              focusStyle={styles.focused}
              containerStyle={styles.segmentItemContainer}
              style={[styles.segmentItem, selected && styles.segmentItemActive]}
              onPress={() => setMode(m.key)}
            >
              <Text
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextActive,
                ]}
              >
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>{activeHint}</Text>

      <View style={styles.demo}>
        {mode === 'children' && (
          <Pressable {...commonProps} focusStyle={styles.focused}>
            {({ pressed }) => (
              <View style={[styles.button, pressed && styles.pressed]}>
                <Text style={styles.buttonText}>
                  {pressed ? 'Pressed' : 'Default'}
                </Text>
                <Text style={styles.buttonSub}>pressed: {String(pressed)}</Text>
              </View>
            )}
          </Pressable>
        )}

        {mode === 'renderContent' && (
          <Pressable
            {...commonProps}
            renderContent={({ pressed, focused }) => (
              <View
                style={[
                  styles.button,
                  pressed && styles.pressed,
                  focused && styles.focused,
                ]}
              >
                <Text style={styles.buttonText}>
                  {pressed ? 'Pressed' : focused ? 'Focused' : 'Default'}
                </Text>
                <Text style={styles.buttonSub}>
                  pressed: {String(pressed)} · focused: {String(focused)}
                </Text>
              </View>
            )}
          />
        )}

        {mode === 'renderFocusable' && (
          <Pressable
            {...commonProps}
            renderFocusable={({ focused }) => (
              <View style={[styles.button, focused && styles.focused]}>
                <Text style={styles.buttonText}>
                  {focused ? 'Focused' : 'Default'}
                </Text>
                <Text style={styles.buttonSub}>focused: {String(focused)}</Text>
              </View>
            )}
          />
        )}
      </View>

      <TextInput
        style={styles.log}
        multiline
        editable={false}
        value={log}
        placeholder="Event log"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#f2f2f7' },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#e5e5ea',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  segmentItemContainer: { flex: 1, borderRadius: 8 },
  segmentItem: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentItemActive: { backgroundColor: '#ffffff' },
  segmentText: { fontSize: 13, color: '#6b6b6b' },
  segmentTextActive: { color: '#000000', fontWeight: '600' },

  hint: { fontSize: 13, color: '#8e8e93', lineHeight: 18 },

  demo: { alignItems: 'center', paddingVertical: 24 },
  button: {
    minWidth: 220,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    gap: 6,
  },
  pressed: { backgroundColor: '#d1e7ff' },
  focused: { borderWidth: 2, borderColor: '#007AFF' },
  buttonText: { fontSize: 17, fontWeight: '500', color: '#000000' },
  buttonSub: { fontSize: 12, color: '#8e8e93' },

  log: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});
