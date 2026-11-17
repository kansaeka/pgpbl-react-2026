import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { BottomTabInset, Spacing } from '@/constants/theme';

type Props = { onPress: () => void; label?: string };

/** Floating action button (tombol "+") di kanan bawah. */
export function Fab({ onPress, label = 'Tambah data' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]}>
      <SymbolView
        name={{ ios: 'plus', android: 'add', web: 'add' }}
        tintColor="#ffffff"
        size={28}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.three,
    bottom: BottomTabInset + Spacing.three,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6a1b9a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
