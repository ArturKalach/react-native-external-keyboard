import React, { forwardRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Color } from './Color/Color';
import { KeyboardFocus, Pressable } from 'react-native-external-keyboard';

const colors: {
  background: string;
  color: string;
  colorTag: string;
  contrast: string;
}[] = [
  {
    background: '#000000',
    color: '#E5C804',
    colorTag: 'Orange Text',
    contrast: '12.59:1',
  },
  {
    background: '#5e9753',
    color: '#fff',
    colorTag: 'White Text',
    contrast: '3.48:1',
  },
  {
    background: '#8034ec',
    color: '#fff',
    colorTag: 'White Text',
    contrast: '5.8:1',
  },
  {
    background: '#59152c',
    color: '#fff',
    colorTag: 'White Text',
    contrast: '13.38:1',
  },
  {
    background: '#71b4a3',
    color: '#000',
    colorTag: 'Black Text',
    contrast: '8.75:1',
  },
  {
    background: '#00bf7d',
    color: '#000',
    colorTag: 'Black Text',
    contrast: '8.75:1',
  },
  {
    background: '#00b4c5',
    color: '#000',
    colorTag: 'Black Text',
    contrast: '8.33:1',
  },
  {
    background: '#c44601',
    color: '#fff',
    colorTag: 'White Text',
    contrast: '4.97:1',
  },
  {
    background: '#b51963',
    color: '#fff',
    colorTag: 'White Text',
    contrast: '6.39:1',
  },
  {
    background: '#89ce00',
    color: '#000',
    colorTag: 'Black Text',
    contrast: '10.89:1',
  },
];

const Separator = () => <View style={styles.separator} />;

export const ContrastColors = forwardRef<KeyboardFocus>((_, ref) => {
  return (
    <FlatList
      data={colors}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <Pressable
          tintColor="#ff0000"
          tintType="hover"
          ref={index === 0 ? ref : undefined}
          containerStyle={styles.item}
        >
          <Color
            color={item.color}
            backround={item.background}
            colorTag={item.colorTag}
            contrast={item.contrast}
          />
        </Pressable>
      )}
      ItemSeparatorComponent={Separator}
      columnWrapperStyle={styles.column}
      keyExtractor={(item) => `${item.background}_${item.color}`}
      numColumns={2}
    />
  );
});

const styles = StyleSheet.create({
  container: { padding: 10 },
  column: { justifyContent: 'space-between' },
  item: { width: '48%' },
  separator: { width: '100%', height: 13 },
});
