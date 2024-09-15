import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { KeyboardFocus } from 'react-native-external-keyboard';
import { FocusableImage } from './FocusableImage';

export const Cats = forwardRef((_, ref) => {
  const firstRef = useRef<KeyboardFocus>(null);

  useImperativeHandle(ref, () => ({
    focus: () => firstRef?.current?.focus(),
  }));

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <FocusableImage
        ref={firstRef}
        source={require('./assets/01.png')}
        width="34%"
      />
      <FocusableImage source={require('./assets/02.png')} width="66%" />
      <FocusableImage source={require('./assets/03.png')} width="50%" />
      <FocusableImage source={require('./assets/06.png')} width="50%" />
      <FocusableImage source={require('./assets/07.png')} width="100%" />
      <FocusableImage source={require('./assets/08.png')} width="50%" />
      <FocusableImage source={require('./assets/09.png')} width="50%" />
      <FocusableImage source={require('./assets/10.png')} width="66%" />
      <FocusableImage source={require('./assets/11.png')} width="34%" />
      <FocusableImage source={require('./assets/12.png')} width="34%" />
      <FocusableImage source={require('./assets/13.png')} width="66%" />
      <FocusableImage source={require('./assets/14.png')} width="50%" />
      <FocusableImage source={require('./assets/15.png')} width="50%" />
      <FocusableImage source={require('./assets/16.png')} width="45%" />
      <FocusableImage source={require('./assets/17.png')} width="55%" />
      <FocusableImage source={require('./assets/19.png')} width="50%" />
      <FocusableImage source={require('./assets/20.png')} width="50%" />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flexDirection: 'row', flexWrap: 'wrap' },
  container: { height: 150, padding: 1 },
  image: { width: '100%', height: 150 },
});
