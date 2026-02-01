export enum MazeTiles {
  Wall = 'W',
}

export type Point = [number, number];
export type Maze = (string | number)[][];
export type MazeInfo = {
  matrix: Maze;
  exit: number;
};

const numerateBestRoute = (maze: (string | number)[][]): MazeInfo => {
  const n = maze.length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let start: [number, number], end: [number, number];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (maze![i]![j] === 'S') start = [i, j];
      if (maze![i]![j] === 'E') end = [i, j];
    }
  }

  type QueueItem = [number, number, Point[]];
  const queue: QueueItem[] = [[...start!, []] as QueueItem];
  const visited = Array.from({ length: n }, () => Array(n).fill(false));
  visited[start![0]!]![start![1]!] = true;

  while (queue.length) {
    const item = queue.shift()!;
    const [x, y, path] = item;
    if (x === end![0] && y === end![1]) {
      // Found path, numerate it
      maze![start![0]]![start![1]] = 0; // S = 0
      for (let k = 0; k < path.length; k++) {
        const [px, py] = path[k] ?? [0, 0];
        if (maze![px]![py] === 'O') maze![px]![py] = k + 1; // Number the path
      }
      maze![end![0]]![end![1]] = path.length; // E = exit number
      return { matrix: maze, exit: path.length };
    }
    for (const [dx, dy] of dirs) {
      const nx = x + dx!,
        ny = y + dy!;
      if (
        nx >= 0 &&
        nx < n &&
        ny >= 0 &&
        ny < n &&
        !visited![nx]![ny] &&
        (maze![nx]![ny] === 'O' || maze![nx]![ny] === 'E')
      ) {
        visited![nx]![ny] = true;
        queue.push([nx, ny, [...path, [nx, ny]]]);
      }
    }
  }
  // No path found
  return { matrix: maze, exit: 0 };
};

export const mazeGenerator = (n: number): MazeInfo => {
  const maze: (string | number)[][] = Array.from({ length: n }, () =>
    Array(n).fill(MazeTiles.Wall)
  );

  const dirs: [number, number][] = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  const inMazeBounds = ([x, y]: Point, size: number) => {
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  const carve = (x: number, y: number) => {
    if (!maze[x] || !maze[x][y]) return;
    maze[x][y] = 'O';

    dirs.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (inMazeBounds([nx, ny], n) && maze[nx] && maze[nx][ny] === 'W') {
        maze[x + dx / 2]![y + dy / 2] = 'O';
        carve(nx, ny);
      }
    }
  };

  const ensureExitConnected = (_maze: (string | number)[][], _n: number) => {
    const exitX = _n - 1,
      exitY = _n - 1;
    const adj: [number, number][] = [
      [exitX - 1, exitY],
      [exitX, exitY - 1],
    ];
    for (const [x, y] of adj) {
      if (x >= 0 && y >= 0 && _maze![x]![y] === 'O') {
        _maze[exitX]![exitY] = 'E';
        return;
      }
    }

    _maze[exitX]![exitY - 1] = 'O';
    _maze[exitX]![exitY] = 'E';
  };

  carve(0, 0);
  maze![0]![0] = 'S';
  ensureExitConnected(maze, n);

  return numerateBestRoute(maze);
};
