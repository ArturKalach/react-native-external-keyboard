import { FlatList, Pressable, View } from 'react-native';

const LIST_DATA = Array.from({ length: 10 });

export const ListsTest = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={LIST_DATA}
        onRefresh={() => {}}
        refreshing={false}
        renderItem={() => (
          <Pressable
            style={{
              borderColor: 'red',
              borderWidth: 1,
              width: '100%',
              height: 50,
            }}
          />
        )}
      />
    </View>
  );
};
