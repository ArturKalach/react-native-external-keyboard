import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { KeyboardFocus } from 'react-native-external-keyboard';
import { FocusableImage } from './FocusableImage';

export const Cats = forwardRef((_, ref) => {
  const firstRef = useRef<KeyboardFocus>(null);

  useImperativeHandle(ref, () => ({
    focus: () => firstRef?.current?.focus(),
  }));

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={{ flexDirection: 'row', backgroundColor: "yellow", margin: 10 }}>
        <FocusableImage
          ref={firstRef}
          source={require('./assets/01.png')}
          width="34%"
        />
        <FocusableImage source={require('./assets/02.png')} width="25%" />
        <FocusableImage source={require('./assets/03.png')} width="30%" />
        {/* <FocusableImage source={require('./assets/06.png')} width="30%" /> */}
      </View>
 <View style={{ flexDirection: 'row', backgroundColor: "yellow", margin: 10 }}>
        <FocusableImage
          ref={firstRef}
          source={require('./assets/01.png')}
          width="34%"
        />
        <FocusableImage source={require('./assets/02.png')} width="25%" />
        <FocusableImage source={require('./assets/03.png')} width="30%" />
        {/* <FocusableImage source={require('./assets/06.png')} width="30%" /> */}
      </View>
       <View style={{ flexDirection: 'row', backgroundColor: "yellow", margin: 10 }}>
        <FocusableImage
          ref={firstRef}
          source={require('./assets/01.png')}
          width="34%"
        />
        <FocusableImage source={require('./assets/02.png')} width="25%" />
        <FocusableImage source={require('./assets/03.png')} width="30%" />
        {/* <FocusableImage source={require('./assets/06.png')} width="30%" /> */}
      </View>
       <View style={{ flexDirection: 'row', backgroundColor: "yellow", margin: 10 }}>
        <FocusableImage
          ref={firstRef}
          source={require('./assets/01.png')}
          width="34%"
        />
        <FocusableImage source={require('./assets/02.png')} width="25%" />
        <FocusableImage source={require('./assets/03.png')} width="30%" />
        {/* <FocusableImage source={require('./assets/06.png')} width="30%" /> */}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flexDirection: 'row', flexWrap: 'wrap' },
  container: { height: 150 },
  image: { width: '100%', height: 150 },
});
