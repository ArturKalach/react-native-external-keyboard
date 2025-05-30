import { forwardRef, useMemo, useState } from 'react';
import {
  Text,
  View,
  Platform,
  Pressable as RNPressable,
  StyleSheet,
} from 'react-native';
import {
  KeyboardFocusGroup,
  withKeyboardFocus,
  type KeyboardFocus,
} from 'react-native-external-keyboard';
import { Color } from './Color/Color';

const Pressable = withKeyboardFocus(RNPressable);

type OptionButtonProps = { onPress: () => void; content: string | number };

const isIOS = Platform.OS === 'ios';

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

const OptionButton = ({ onPress, content }: OptionButtonProps) => (
  <Pressable
    style={styles.optionButton}
    focusStyle={isIOS ? undefined : styles.androidOption}
    tintType={isIOS ? 'default' : 'none'}
    onFocus={isIOS ? onPress : undefined}
    onPress={onPress}
    haloExpendX={5}
    haloExpendY={5}
    haloCornerRadius={15}
  >
    <Text>{content}</Text>
  </Pressable>
);

type FocusItemProps = {
  radius?: number;
  onPress: () => void;
  background: string;
  color: string;
  content: string;
};

const FocusItem = forwardRef<KeyboardFocus, FocusItemProps>(
  ({ radius = 10, onPress, background, color, content }, ref) => {
    const hoverComponent = useMemo(() => {
      if (isIOS) return undefined;
      return (
        <View
          style={[
            styles.androidHover,
            {
              borderRadius: radius + 5,
              borderColor: background,
            },
          ]}
        />
      );
    }, [background, radius]);

    return (
      <Pressable
        ref={ref}
        tintColor={background}
        haloExpendY={5}
        haloExpendX={5}
        onFocus={isIOS ? onPress : undefined}
        onPress={onPress}
        haloCornerRadius={radius}
        tintType={isIOS ? 'default' : 'hover'}
        FocusHoverComponent={hoverComponent}
        containerStyle={[
          styles.focusItemContainer,
          {
            borderRadius: radius,
            backgroundColor: background,
          },
        ]}
      >
        <View style={styles.focusItemContent}>
          <Text style={[styles.focusItemText, { color }]}>{content}</Text>
        </View>
      </Pressable>
    );
  }
);

export const FocusGroupExample = forwardRef<KeyboardFocus>((_, ref) => {
  const [radius, setRadious] = useState(5);
  const [currentItem, setCurrentItem] = useState(colors[0]);
  return (
    <View style={styles.container}>
      {currentItem && (
        <View style={styles.colorExample}>
          <Color
            color={currentItem.color}
            backround={currentItem.background}
            colorTag={currentItem.colorTag}
            contrast={currentItem.contrast}
          />
        </View>
      )}
      <KeyboardFocusGroup style={styles.colorsContainer} groupIdentifier="main">
        {colors.map((item, index) => (
          <FocusItem
            ref={index === 0 ? ref : undefined}
            key={`${item.background}_${item.color}`}
            radius={radius}
            background={item.background}
            content={item.colorTag}
            color={item.color}
            onPress={() => setCurrentItem(item)}
          />
        ))}
      </KeyboardFocusGroup>
      <View style={styles.optionGroupContainer}>
        <KeyboardFocusGroup
          style={styles.optionGroup}
          focusStyle={styles.optionGroupFocus}
          groupIdentifier="additional"
        >
          <OptionButton onPress={() => setRadious(5)} content={5} />
          <OptionButton onPress={() => setRadious(15)} content={15} />
          <OptionButton onPress={() => setRadious(30)} content={30} />
        </KeyboardFocusGroup>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  optionGroupContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  optionGroup: {
    flexDirection: 'row',
    borderRadius: 20,
    borderColor: '#eee',
    borderWidth: 2,
    marginBottom: 10,
  },
  optionGroupFocus: {
    borderColor: '#106ae0',
    backgroundColor: '#1573ed11',
  },
  colorsContainer: {
    padding: 10,
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  colorExample: { padding: 10 },
  container: { flex: 1 },
  focusItemContainer: {
    width: 60,
    height: 60,
  },
  focusItemContent: {
    padding: 5,
    width: 60,
    height: 60,
    alignContent: 'center',
    justifyContent: 'center',
  },
  focusItemText: { textAlign: 'center' },
  optionButton: {
    padding: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidHover: {
    width: 70,
    height: 70,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: -5,
    top: -5,
    borderWidth: 2,
  },
  androidOption: { borderRadius: 15, backgroundColor: '#ddf' },
});
