import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const KELAS_OPTIONS = ['Asisten', 'Mahasiswa Kelas A', 'Mahasiswa Kelas B'] as const;
export type Kelas = (typeof KELAS_OPTIONS)[number];

export type Mahasiswa = {
  id: string;
  nama: string;
  nim: string;
  kelas: Kelas;
};

type NewMahasiswa = Omit<Mahasiswa, 'id'>;

type MahasiswaContextValue = {
  items: Mahasiswa[];
  loaded: boolean;
  add: (data: NewMahasiswa) => void;
  remove: (id: string) => void;
};

const STORAGE_KEY = 'pgpbl.mahasiswa.v1';

const seed = (kelas: Kelas, names: string[]): Mahasiswa[] =>
  names.map((nama, i) => ({ id: `seed-${kelas}-${i}`, nama, nim: '', kelas }));

// Data awal sesuai modul.
const INITIAL: Mahasiswa[] = [
  ...seed('Asisten', ['Asbil', 'Budi', 'Charlie', 'David']),
  ...seed('Mahasiswa Kelas A', ['Cindy', 'Dina', 'Evi', 'Fani', 'Gina', 'Hani', 'Ika', 'Jeni', 'Kiko']),
  ...seed('Mahasiswa Kelas B', ['Dono', 'Kasino', 'Indro', 'Toto', 'Joko', 'Budi', 'Charlie', 'David', 'Eko']),
];

const MahasiswaContext = createContext<MahasiswaContextValue | null>(null);

export function MahasiswaProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Mahasiswa[]>(INITIAL);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // abaikan: pakai data awal
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, loaded]);

  const add = useCallback((data: NewMahasiswa) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((prev) => [...prev, { id, ...data }]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const value = useMemo(() => ({ items, loaded, add, remove }), [items, loaded, add, remove]);

  return <MahasiswaContext.Provider value={value}>{children}</MahasiswaContext.Provider>;
}

export function useMahasiswa() {
  const ctx = useContext(MahasiswaContext);
  if (!ctx) throw new Error('useMahasiswa harus dipakai di dalam MahasiswaProvider');
  return ctx;
}
