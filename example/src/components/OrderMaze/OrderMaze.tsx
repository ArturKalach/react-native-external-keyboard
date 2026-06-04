import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardOrderFocusGroup,
  Pressable,
  type BaseKeyboardViewType,
} from 'react-native-external-keyboard';
import { mazeGenerator } from './OrderMaze.util';
import { MazeRender } from './MazeRender/MazeRender';

const size = 14;

export const OrderMaze = () => {
  const [finished, setFinished] = useState(false);
  const [maze, setMaze] = useState(() => mazeGenerator(size));
  const startRef = useRef<BaseKeyboardViewType | null>(null);
  const restartRef = useRef<BaseKeyboardViewType | null>(null);
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
      <KeyboardOrderFocusGroup>
        <MazeRender
          onFinish={exit}
          reset={reset}
          startRef={startRef}
          maze={maze}
        />
      </KeyboardOrderFocusGroup>
      {finished && (
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🎉</Text>
          <Text style={styles.bannerText}>You escaped!</Text>
          <Text style={styles.bannerEmoji}>🎉</Text>
          <Pressable
            focusStyle={styles.ctaFocus}
            lockFocus={['forward', 'last']}
            onPress={restart}
            ref={restartRef}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Play again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  gap: { gap: 10 },
  banner: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  bannerEmoji: {
    fontSize: 32,
  },
  bannerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  cta: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: '#22c55e',
    borderRadius: 8,
  },
  ctaFocus: {
    borderWidth: 2,
    borderColor: '#15803d',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
