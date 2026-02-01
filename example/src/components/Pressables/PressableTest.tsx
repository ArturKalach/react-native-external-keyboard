import { useState } from 'react';
import { TouchableOpacity as TO } from 'react-native-gesture-handler';

import { StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { View } from 'react-native';

import { Pressable, withKeyboardFocus } from 'react-native-external-keyboard';

const KTouchableOpacity = withKeyboardFocus(TouchableOpacity);
const KGTouchableOpacity = withKeyboardFocus(TO);

export const PressableTest = () => {
  const [log, setLog] = useState('');
  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => {
      const all = `${time} — ${msg}\n${prev}`;
      const lines = all.split('\n').filter(Boolean);
      const limited = lines.slice(0, 8);
      return limited.join('\n');
    });
  };

  return (
    <View style={styles.home}>
      <Pressable
        onPress={() => appendLog('Pressable: Press')}
        onLongPress={() => appendLog('Pressable: Long Press')}
      >
        <Text>Pressable</Text>
      </Pressable>
      <KTouchableOpacity
        onPress={() => appendLog('TouchableOpacity: Press')}
        onLongPress={() => appendLog('TouchableOpacity: Long Press')}
      >
        <Text>TouchableOpacity</Text>
      </KTouchableOpacity>
      <KGTouchableOpacity
        onPress={() => appendLog('GH TouchableOpacity: Press')}
        onLongPress={() => appendLog('GH TouchableOpacity: Long Press')}
      >
        <Text>Gesture Handler TouchableOpacity</Text>
      </KGTouchableOpacity>

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
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  home: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  log: {
    height: 150,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});
