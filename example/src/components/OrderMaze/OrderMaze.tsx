import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable, type KeyboardFocus } from 'react-native-external-keyboard';
import { mazeGenerator } from './OrderMaze.util';
import { MazeRender } from './MazeRender/MazeRender';

const size = 14;

export const OrderMaze = () => {
  const [finished, setFinished] = useState(false);
  const [maze, setMaze] = useState(() => mazeGenerator(size));
  const startRef = useRef<KeyboardFocus>(null);
  const restartRef = useRef<KeyboardFocus>(null);
  const reset = () => startRef.current?.focus();
  const exit = () => {
    setFinished(true);
    setTimeout(() => restartRef.current?.focus(), 100);
  };

  const restart = () => {
    setFinished(false);
    setMaze(mazeGenerator(size));
    setTimeout(() => startRef.current?.focus(), 100);
  };

  return (
    <View style={styles.gap}>
      <MazeRender
        onFinish={exit}
        reset={reset}
        startRef={startRef}
        maze={maze}
      />
      {finished && (
        <View style={styles.gap}>
          <Text>🎉🎉 Hurray! 🎉🎉</Text>
          <Pressable
            focusStyle={styles.cta}
            lockFocus={['forward', 'last']}
            onPress={restart}
            ref={restartRef}
          >
            <Text>Restart?</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  gap: { gap: 10 },
  cta: { borderWidth: 2, borderColor: 'blue' },
});
