import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const LIST_DATA = Array.from({ length: 10 });

export const ListsTest = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={LIST_DATA}
        onRefresh={() => {}}
        refreshing={false}
        renderItem={() => <Pressable style={styles.pressable} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  pressable: {
    borderColor: 'red',
    borderWidth: 1,
    width: '100%',
    height: 50,
  },
});
