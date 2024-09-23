import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type ColorProps = {
  color: string;
  colorTag: string;
  backround: string;
  contrast: string;
  style?: ViewStyle;
};

export const Color = ({
  color,
  colorTag,
  backround,
  contrast,
  style,
}: ColorProps) => {
  return (
    <View
      style={[
        styles.container,
        style,
        {
          backgroundColor: backround,
        },
      ]}
    >
      <Text
        style={[
          styles.color,
          {
            color: color,
          },
        ]}
      >
        {backround}
      </Text>
      <View style={styles.divider} />
      <Text
        style={[
          styles.contrast,
          {
            color: color,
          },
        ]}
      >
        Contrast
      </Text>
      <View style={styles.colorInfo}>
        <Text style={{ color }}>{colorTag}</Text>
        <Text style={[styles.bold, { color }]}>{contrast}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
  },
  color: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    padding: 10,
  },
  divider: {
    backgroundColor: 'white',
    height: 1,
    width: '100%',
    marginBottom: 5,
  },
  contrast: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 10,
  },
  colorInfo: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bold: {
    fontWeight: 'bold',
  },
});
