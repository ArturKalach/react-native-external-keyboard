import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Focus } from 'react-native-external-keyboard';

const variantBg: Record<string, string> = {
  default: '#e5e5ea',
  primary: '#007AFF',
  danger: '#ff3b30',
};
const variantColor: Record<string, string> = {
  default: '#000000',
  primary: '#ffffff',
  danger: '#ffffff',
};

const Btn = ({
  title,
  onPress,
  variant = 'default',
}: {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger';
}) => (
  <TouchableOpacity
    style={[styles.btn, { backgroundColor: variantBg[variant] }]}
    onPress={onPress}
    accessibilityRole="button"
  >
    <Text style={[styles.btnText, { color: variantColor[variant] }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const FocusTrapContent = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.overlay}>
    <Focus.Trap forceLock style={styles.dialog}>
      <View style={styles.dialogHeader}>
        <Text style={styles.dialogTitle}>Focus Trapped</Text>
        <Text style={styles.dialogSubtitle}>
          Keyboard and screen reader focus is locked inside this area. The
          background content is unreachable until dismissed.
        </Text>
      </View>
      <View style={styles.dialogActions}>
        <Btn
          title="Confirm"
          variant="primary"
          onPress={() => console.log('confirmed')}
        />
        <Btn title="Cancel" variant="danger" onPress={onClose} />
      </View>
    </Focus.Trap>
  </View>
);

export const FocusLockExample = () => {
  const [shown, setShown] = React.useState(false);

  return (
    <Focus.Frame style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.screen}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>BACKGROUND CONTENT</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Outside Button A</Text>
              <Text style={styles.cardDesc}>
                Reachable only when the trap is hidden
              </Text>
              <Btn title="Interact" onPress={() => console.log('A pressed')} />
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Outside Button B</Text>
              <Text style={styles.cardDesc}>
                Also unreachable while trap is active
              </Text>
              <Btn title="Interact" onPress={() => console.log('B pressed')} />
            </View>
          </View>

          <View style={styles.triggerSection}>
            <Btn
              title="Open Focus Trap"
              variant="primary"
              onPress={() => setShown(true)}
            />
          </View>
        </View>

        {shown && <FocusTrapContent onClose={() => setShown(false)} />}
      </SafeAreaView>
    </Focus.Frame>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    padding: 16,
    gap: 16,
  },

  section: { gap: 10 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b6b6b',
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#000000' },
  cardDesc: { fontSize: 13, color: '#8e8e93', marginBottom: 4 },

  triggerSection: {
    marginTop: 'auto' as unknown as number,
  },

  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '600' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    gap: 20,
  },
  dialogHeader: { gap: 8 },
  dialogTitle: { fontSize: 18, fontWeight: '700', color: '#000000' },
  dialogSubtitle: { fontSize: 14, color: '#6b6b6b', lineHeight: 20 },
  dialogActions: { gap: 10 },
});
