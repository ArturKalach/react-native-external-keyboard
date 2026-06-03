import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable } from 'react-native-external-keyboard';
import { ANDROID_FOCUS_STYLE } from '../../constants/styles';

/** Ordered list of the demo screens, shared by the Prev/Next footer. */
export const DEMO_ORDER: { name: string; title: string }[] = [
  { name: 'KeyboardPressableShowcase', title: 'Pressable Focus' },
  { name: 'NativeFocusStyle', title: 'Focus Styling' },
  { name: 'ProgrammaticFocus', title: 'Programmatic Focus' },
  { name: 'KeyboardInput', title: 'TextInput' },
  { name: 'FocusOrderAnimated', title: 'Focus Order' },
];

type Step = (typeof DEMO_ORDER)[number];

const DemoFooter = ({ prev, next }: { prev?: Step; next?: Step }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View
      collapsable={false}
      style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
    >
      <FooterButton
        align="start"
        step={prev}
        caption="Prev"
        chevron="‹"
        onPress={() => prev && navigation.replace(prev.name)}
      />
      <FooterButton
        align="end"
        step={next}
        caption="Next"
        chevron="›"
        onPress={() => next && navigation.replace(next.name)}
      />
    </View>
  );
};

const FooterButton = ({
  step,
  caption,
  chevron,
  align,
  onPress,
}: {
  step?: Step;
  caption: string;
  chevron: string;
  align: 'start' | 'end';
  onPress: () => void;
}) => {
  if (!step) {
    return <View style={styles.navButtonSpacer} />;
  }

  const isEnd = align === 'end';
  return (
    <Pressable
      defaultFocusHighlightEnabled={false}
      focusStyle={ANDROID_FOCUS_STYLE}
      onPress={onPress}
      containerStyle={styles.navButtonContainer}
      style={({ pressed }) => [
        styles.navButton,
        isEnd && styles.navButtonEnd,
        pressed && styles.navButtonPressed,
      ]}
    >
      {!isEnd && <Text style={styles.navChevron}>{chevron}</Text>}
      <Text style={styles.navCaption}>{caption}</Text>
      {isEnd && <Text style={styles.navChevron}>{chevron}</Text>}
    </Pressable>
  );
};

/** Wraps a demo screen, adding a Prev/Next footer based on {@link DEMO_ORDER}. */
export function withDemoNav<P extends object>(
  Screen: ComponentType<P>,
  name: string
): ComponentType<P> {
  const index = DEMO_ORDER.findIndex((d) => d.name === name);
  const prev = index > 0 ? DEMO_ORDER[index - 1] : undefined;
  const next =
    index >= 0 && index < DEMO_ORDER.length - 1
      ? DEMO_ORDER[index + 1]
      : undefined;

  return function DemoNavWrapper(props: P) {
    return (
      <View style={styles.flex}>
        <View style={styles.flex}>
          <Screen {...props} />
        </View>
        <DemoFooter prev={prev} next={next} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5ea',
  },
  navButtonContainer: { flex: 1 },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f2f2f7',
  },
  navButtonEnd: { justifyContent: 'flex-end' },
  navButtonPressed: { backgroundColor: '#e5e5ea' },
  navButtonSpacer: { flex: 1 },
  navCaption: { fontSize: 16, fontWeight: '600', color: '#000000' },
  navChevron: { fontSize: 22, color: '#8e8e93', lineHeight: 24 },
});
