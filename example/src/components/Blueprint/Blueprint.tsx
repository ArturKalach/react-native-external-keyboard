import { useState, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

/** Cyanotype palette shared by the blueprint-style demo screens. */
export const BLUEPRINT = {
  platinum: '#efefef',
  azure: '#3454d1',
  ink: '#070707',
  amber: '#ffc233',
  grid: 'rgba(255,255,255,0.2)',
} as const;

const GRID = 20;

/** Faint blueprint grid drawn behind the stage content. */
export const BlueprintGrid = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <View
    pointerEvents="none"
    importantForAccessibility="no-hide-descendants"
    accessibilityElementsHidden
    style={StyleSheet.absoluteFill}
  >
    {Array.from({ length: Math.floor(width / GRID) + 1 }, (_, i) => (
      <View
        key={`v${i}`}
        style={[styles.line, styles.vertical, { left: i * GRID }]}
      />
    ))}
    {Array.from({ length: Math.floor(height / GRID) + 1 }, (_, i) => (
      <View
        key={`h${i}`}
        style={[styles.line, styles.horizontal, { top: i * GRID }]}
      />
    ))}
  </View>
);

type BlueprintStageProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

/** Royal azure panel with a grid behind its children; measures itself to size the grid. */
export const BlueprintStage = ({ style, children }: BlueprintStageProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <View
      collapsable={false}
      style={[styles.stage, style]}
      onLayout={(e: LayoutChangeEvent) => setSize(e.nativeEvent.layout)}
    >
      {size.width > 0 ? (
        <BlueprintGrid width={size.width} height={size.height} />
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  stage: {
    borderRadius: 18,
    backgroundColor: BLUEPRINT.azure,
    overflow: 'hidden',
    padding: 14,
  },
  line: { position: 'absolute', backgroundColor: BLUEPRINT.grid },
  vertical: { top: 0, bottom: 0, width: StyleSheet.hairlineWidth },
  horizontal: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
});
