import { forwardRef, useMemo, type RefObject } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Pressable, type KeyboardFocus } from 'react-native-external-keyboard';
import { type Maze, type MazeInfo, type Point } from '../OrderMaze.util';

const isUpLocked = (p: Point, m: Maze) => {
  const r = p[0] - 1;
  if (r < 0) return true;
  return m![r]![p[1]] === 'W' && m![p![0]]![p[1]] !== 'W';
};

const isBottomLocked = (p: Point, m: Maze) => {
  const r = p[0] + 1;
  if (m.length <= r) return true;
  if (m![p![0]]![p[1]] === 'W') return false;
  return m![r]![p[1]] === 'W' && m![p[0]]![p[1]] !== 'W';
};

const isLeftBlocked = (p: Point, m: Maze) => {
  const r = p[0];
  const c = p[1] - 1;
  if (c < 0) return true;
  return m![r]![c] === 'W' && m![p![0]]![p[1]] !== 'W';
};

const isRightBlocked = (p: Point, m: Maze) => {
  const r = p[0];
  const c = p[1] + 1;
  if (m.length <= c) return true;
  return m![r]![c] === 'W' && m![p[0]]![p[1]] !== 'W';
};

const getLockedArray = ([r, c]: Point, maze: Maze) => {
  const list = {
    forward: maze![r]![c] === 'O',
    backward: maze![r]![c] === 'O',
    last: maze![r]![c] === 'O',
    first: maze![r]![c] === 'O',
    up: isUpLocked([r, c], maze),
    down: isBottomLocked([r, c], maze),
    left: isLeftBlocked([r, c], maze),
    right: isRightBlocked([r, c], maze),
  };

  return Object.entries(list).reduce((acc: string[], i) => {
    if (i[1]) return [...acc, i[0]];
    return acc;
  }, []);
};

const next = (a: string | number, b: string | number) => a < b;
const prev = (a: string | number, b: string | number) => a > b;

const getOrderForward = (
  [r, c]: Point,
  maze: Maze,
  compare: (a: string | number, b: string | number) => boolean
) => {
  const val = maze?.[r]?.[c];
  if (val === 'O' || val === 'W') return undefined;
  if (compare(val!, maze?.[r]?.[c + 1]!)) return `${r}_${c + 1}`;
  if (compare(val!, maze?.[r]?.[c - 1]!)) return `${r}_${c - 1}`;
  if (compare(val!, maze?.[r + 1]?.[c]!)) return `${r + 1}_${c}`;
  if (compare(val!, maze?.[r - 1]?.[c]!)) return `${r - 1}_${c}`;
  return undefined;
};

export const MazeItem = forwardRef<
  KeyboardFocus,
  {
    row: number;
    column: number;
    cell: number | string;
    onPress: () => void;
    exit: number;
    onFocus?: () => void;
    matrix: Maze;
  }
>(({ row, column, cell, onPress, exit, onFocus, matrix }, ref) => {
  const point = useMemo<Point>(() => [row, column], [row, column]);
  const isStart = cell === 0;

  const isWall = cell === 'W';

  const cellStyle = useMemo(
    () =>
      isWall
        ? styles.wall
        : {
            backgroundColor:
              cell === 0 ? '#22c55e' : cell === exit ? '#ef4444' : '#f8fafc',
          },
    [cell, exit, isWall]
  );

  if (isWall) {
    return <View style={[styles.cell, styles.wall]} />;
  }

  return (
    <Pressable
      key={`${row}_${column}_${cell}`}
      onPress={onPress}
      ref={isStart ? ref : undefined}
      orderId={`${row}_${column}`}
      onFocus={onFocus}
      orderForward={getOrderForward(point, matrix, next)}
      orderBackward={getOrderForward(point, matrix, prev)}
      lockFocus={getLockedArray(point, matrix) as ('up' | 'down')[]}
      haloCornerRadius={4}
      focusStyle={styles.focus}
      style={[styles.cell, cellStyle]}
    />
  );
});

export const MazeRender = ({
  maze,
  reset,
  startRef,
  onFinish,
}: {
  maze: MazeInfo;
  reset: () => void;
  startRef: RefObject<KeyboardFocus | null>;
  onFinish: () => void;
}) => {
  const { exit, matrix } = maze;
  return (
    <View style={styles.mazeContainer}>
      {matrix.map((row, r) => {
        return (
          <View key={`${r}_`} style={styles.row}>
            {row.map((cell, c) => (
              <MazeItem
                key={`${r}_${c}`}
                exit={exit}
                matrix={matrix}
                ref={startRef}
                column={c}
                row={r}
                cell={cell}
                onFocus={matrix![r]![c] === exit ? onFinish : undefined}
                onPress={reset}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
};

export const styles = StyleSheet.create({
  mazeContainer: {
    borderWidth: 5,
    borderColor: '#1e293b',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cell: {
    width: 20,
    height: 20,
  },
  wall: {
    backgroundColor: '#1e293b',
  },
  focus: {
    backgroundColor: Platform.OS === 'android' ? '#3b82f6' : undefined,
  },
  row: { flexDirection: 'row' },
});
