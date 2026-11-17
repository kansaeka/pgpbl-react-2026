import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fab } from '@/components/fab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { KELAS_OPTIONS, useMahasiswa } from '@/context/mahasiswa-context';

export default function TambahDataScreen() {
  const { items } = useMahasiswa();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Tambah Data</ThemedText>
          <ThemedText themeColor="textSecondary">
            Tekan tombol + untuk menambah data mahasiswa baru. Ringkasan data saat ini:
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Total terdaftar</ThemedText>
            <ThemedText type="title">{items.length}</ThemedText>
          </ThemedView>

          <View style={styles.row}>
            {KELAS_OPTIONS.map((k) => (
              <ThemedView key={k} type="backgroundElement" style={[styles.card, styles.cardSmall]}>
                <ThemedText type="small" themeColor="textSecondary">
                  {k.replace('Mahasiswa ', '')}
                </ThemedText>
                <ThemedText type="subtitle">{items.filter((m) => m.kelas === k).length}</ThemedText>
              </ThemedView>
            ))}
          </View>
        </ScrollView>
        <Fab onPress={() => router.push('/forminput')} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingTop: Platform.OS === 'web' ? Spacing.six : 0,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.six,
  },
  row: { flexDirection: 'row', gap: Spacing.two },
  card: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  cardSmall: { flex: 1 },
});
