import { router, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { KELAS_OPTIONS, Kelas, useMahasiswa } from '@/context/mahasiswa-context';
import { useTheme } from '@/hooks/use-theme';

type Errors = { nama?: string; nim?: string };

export default function FormInputScreen() {
  const theme = useTheme();
  const { add } = useMahasiswa();
  const nimRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [kelas, setKelas] = useState<Kelas>(KELAS_OPTIONS[1]);
  const [errors, setErrors] = useState<Errors>({});

  const inputStyle = (hasError?: string) => [
    styles.input,
    {
      color: theme.text,
      borderColor: hasError ? '#d32f2f' : theme.textSecondary,
      backgroundColor: theme.background,
    },
  ];

  const validate = () => {
    const e: Errors = {};
    if (!nama.trim()) e.nama = 'Nama wajib diisi';
    if (!nim.trim()) e.nim = 'NIM wajib diisi';
    else if (!/^[0-9/A-Za-z]+$/.test(nim.trim())) e.nim = 'NIM hanya boleh berisi angka, huruf, dan "/"';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = () => {
    if (!validate()) return;
    add({ nama: nama.trim(), nim: nim.trim(), kelas });
    if (Platform.OS === 'web') {
      window.alert(`Data ${nama.trim()} tersimpan`);
    } else {
      Alert.alert('Data tersimpan', `${nama.trim()} ditambahkan ke ${kelas}.`);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.flex}>
        <Stack.Screen options={{ title: 'Form Input' }} />
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.field}>
            <ThemedText type="smallBold">Nama</ThemedText>
            <TextInput
              style={inputStyle(errors.nama)}
              onChangeText={setNama}
              value={nama}
              placeholder="Nama lengkap"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => nimRef.current?.focus()}
            />
            {errors.nama ? <Text style={styles.error}>{errors.nama}</Text> : null}
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">NIM</ThemedText>
            <TextInput
              ref={nimRef}
              style={inputStyle(errors.nim)}
              onChangeText={setNim}
              value={nim}
              placeholder="NIM"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={onSave}
            />
            {errors.nim ? <Text style={styles.error}>{errors.nim}</Text> : null}
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Kelas</ThemedText>
            <View style={styles.chips}>
              {KELAS_OPTIONS.map((k) => {
                const active = k === kelas;
                return (
                  <Pressable
                    key={k}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    onPress={() => setKelas(k)}
                    style={[
                      styles.chip,
                      { borderColor: active ? '#6a1b9a' : theme.textSecondary },
                      active && { backgroundColor: '#6a1b9a' },
                    ]}>
                    <Text style={{ color: active ? '#fff' : theme.text }}>
                      {k.replace('Mahasiswa ', '')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onSave}
            style={({ pressed }) => [styles.save, pressed && { opacity: 0.8 }]}>
            <Text style={styles.saveText}>SAVE</Text>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: Spacing.three, gap: Spacing.three },
  field: { gap: Spacing.one },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: Spacing.two,
  },
  error: { color: '#d32f2f', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
  },
  save: {
    backgroundColor: '#2196F3',
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
});
