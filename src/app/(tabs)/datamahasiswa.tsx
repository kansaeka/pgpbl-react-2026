import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fab } from '@/components/fab';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { KELAS_OPTIONS, Mahasiswa, useMahasiswa } from '@/context/mahasiswa-context';

export default function DataMahasiswaScreen() {
  const { items, remove } = useMahasiswa();
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KELAS_OPTIONS.map((title) => ({
      title,
      data: items.filter(
        (m) =>
          m.kelas === title &&
          (!q || m.nama.toLowerCase().includes(q) || m.nim.toLowerCase().includes(q)),
      ),
    })).filter((s) => s.data.length > 0);
  }, [items, query]);

  const confirmDelete = (m: Mahasiswa) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Hapus ${m.nama}?`)) remove(m.id);
      return;
    }
    Alert.alert('Hapus data', `Hapus ${m.nama} dari daftar?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => remove(m.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.heading}>Daftar Hadir Praktikum</Text>
      <Text style={styles.subheading}>{items.length} orang terdaftar</Text>

      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Cari nama atau NIM"
        placeholderTextColor="#888"
        clearButtonMode="while-editing"
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={<Text style={styles.empty}>Tidak ada data yang cocok.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <SymbolView
              name={{ ios: 'graduationcap.fill', android: 'school', web: 'school' }}
              tintColor="#6a1b9a"
              size={20}
              style={styles.icon}
            />
            <View style={styles.itemText}>
              <Text style={styles.title}>{item.nama}</Text>
              {item.nim ? <Text style={styles.nim}>{item.nim}</Text> : null}
            </View>
            <Pressable
              accessibilityLabel={`Hapus ${item.nama}`}
              hitSlop={10}
              onPress={() => confirmDelete(item)}>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                tintColor="#b00020"
                size={20}
              />
            </Pressable>
          </View>
        )}
        renderSectionHeader={({ section: { title, data } }) => (
          <Text style={styles.header}>
            {title} <Text style={styles.count}>({data.length})</Text>
          </Text>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Fab onPress={() => router.push('/forminput')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    // Web: beri ruang untuk tab bar yang melayang di atas.
    paddingTop: Platform.OS === 'web' ? Spacing.six : 0,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Spacing.two,
    color: '#000',
  },
  subheading: {
    fontSize: 12,
    textAlign: 'center',
    color: '#60646C',
    marginBottom: Spacing.two,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: Spacing.two,
    height: 40,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    backgroundColor: '#fff',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 16,
    // Beri ruang agar item terakhir tidak tertutup bottom tab / FAB.
    paddingBottom: BottomTabInset + Spacing.six + Spacing.three,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9c2ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 6,
  },
  header: {
    fontSize: 20,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: 8,
    color: '#000',
  },
  count: { fontSize: 14, color: '#60646C' },
  icon: { width: 20, height: 20, marginRight: Spacing.two },
  itemText: { flex: 1 },
  title: { fontSize: 14, color: '#000' },
  nim: { fontSize: 11, color: '#4a4a4a' },
  empty: { textAlign: 'center', color: '#60646C', marginTop: Spacing.four },
});
