import * as React from 'react';

import { Button, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedPressable,
  KeyboardRootView,
  withKeyboardFocus,
} from 'react-native-external-keyboard';

const KeyboardedPressable = withKeyboardFocus(Pressable);

export const ModalExample = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <KeyboardRootView style={styles.container}>
      <KeyboardedPressable
        haloEffect={false}
        onPress={() => {
          setShowModal(true);
        }}
      >
        <Text>Jump</Text>
      </KeyboardedPressable>
      <Modal visible={showModal}>
        <KeyboardRootView style={styles.modalRootView}>
          <View>
            <Text>Modal here</Text>
            <Button
              title="Any Press Here"
              onPress={() => setShowModal(false)}
            />
            <KeyboardExtendedPressable
              haloEffect={false}
              // autoFocus
              onPress={() => setShowModal(false)}
            >
              <Text>Somethin else</Text>
            </KeyboardExtendedPressable>
            <KeyboardExtendedPressable
              haloEffect={false}
              autoFocus
              onPress={() => setShowModal(false)}
            >
              <Text>MB</Text>
            </KeyboardExtendedPressable>
            <KeyboardExtendedPressable
              haloEffect={false}
              onPress={() => setShowModal(false)}
            >
              <Text>Close</Text>
            </KeyboardExtendedPressable>
          </View>
        </KeyboardRootView>
      </Modal>
    </KeyboardRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  modalRootView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: { height: 10 },
  pressFocusStyle: { backgroundColor: '#b2c6b7' },
  borderExample: {
    marginVertical: 10,
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 2,
    padding: 10,
  },
});
