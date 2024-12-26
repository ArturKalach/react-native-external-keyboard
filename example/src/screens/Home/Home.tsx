import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineButton } from '../../components/LineButton/LineButton';
import type { KeyboardFocus } from 'react-native-external-keyboard';
import { Cats } from '../../components/Cats/Cats';
import { ComponentsExample } from '../../components/ComponentsExample/ComponentsExample';
import { ContrastColors } from '../../components/ContrastColors/ContrastColors';

const Divider = () => (
  <View style={styles.menuDivider}>
    <View style={styles.menuDividerLine} />
  </View>
);

const Menu = ({
  onPress,
  onLongPress,
}: {
  onLongPress: (value: string) => void;
  onPress: (value: string) => void;
}) => {
  return (
    <View style={styles.menuContainer}>
      <LineButton
        onLongPress={() => onLongPress('Components')}
        onPress={() => onPress('Components')}
        title="Components"
      />
      <Divider />
      <LineButton
        onLongPress={() => onLongPress('Cats')}
        onPress={() => onPress('Cats')}
        title="Cats"
      />
      <Divider />
      <LineButton
        autoFocus
        onLongPress={() => onLongPress('Colors')}
        onPress={() => onPress('Colors')}
        title="Colors"
      />
    </View>
  );
};

const ContentDivider = () => <View style={styles.divider} />;

export const Home = () => {
  const [selected, setSelected] = useState('Components');
  const componentsExampleRef = useRef<KeyboardFocus>(null);
  const contrastColorsRef = useRef<KeyboardFocus>(null);
  const catsRef = useRef<KeyboardFocus>(null);
  const onLongPressHandle = (value: string) => {
    if (value === 'Components') {
      componentsExampleRef?.current?.focus();
    }
    if (value === 'Colors') {
      contrastColorsRef?.current?.focus();
    }

    if (value === 'Cats') {
      catsRef?.current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Menu onLongPress={onLongPressHandle} onPress={setSelected} />
        <ContentDivider />
        <Text>{selected}:</Text>
      </View>
      {selected === 'Components' && (
        <ComponentsExample ref={componentsExampleRef} />
      )}
      {selected === 'Colors' && <ContrastColors ref={contrastColorsRef} />}
      {selected === 'Cats' && <Cats ref={catsRef} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  menu: { padding: 10 },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
  },
  divider: { height: 20, width: '100%' },
  menuDivider: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  menuDividerLine: {
    backgroundColor: '#aaa',
    width: '100%',
    height: 1,
  },
  menuContainer: { borderRadius: 15, backgroundColor: '#ffffff' },
});
