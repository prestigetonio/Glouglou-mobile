import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottleCard from '@/components/BottleCard';
import { useAuth } from '@/contexts/AuthContext';
import { apiGetBottles } from '@/lib/api';
import { Bottle, FREE_LIMIT, WINE_TYPES, WineType } from '@/lib/types';

type FilterType = 'Tous' | WineType;
const FILTERS: FilterType[] = ['Tous', ...WINE_TYPES];

export default function CaveScreen() {
  const { user } = useAuth();
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tous');

  useFocusEffect(
    useCallback(() => {
      loadBottles();
    }, [])
  );

  async function loadBottles() {
    setError(null);
    try {
      const data = await apiGetBottles();
      setBottles(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    loadBottles();
  }

  const filtered = bottles.filter((b) => {
    const matchType = activeFilter === 'Tous' || b.type === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const totalQty = bottles.reduce((s, b) => s + b.quantity, 0);
  const isFree = user?.plan === 'free';
  const limitPct = Math.min((totalQty / FREE_LIMIT) * 100, 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 32, color: '#7A1515', fontFamily: 'CormorantGaramond_700Bold' }}>
          Ma Cave 🍷
        </Text>
        <Text style={{ fontSize: 14, color: '#7A6E65', marginTop: 2, fontFamily: 'Inter_400Regular' }}>
          {totalQty} {totalQty <= 1 ? 'bouteille' : 'bouteilles'}
        </Text>
      </View>

      {/* Freemium bar */}
      {isFree && totalQty > 0 && (
        <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#C8BAA8' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 12, color: '#7A6E65', fontFamily: 'Inter_500Medium' }}>
              Plan gratuit
            </Text>
            <Text style={{
              fontSize: 12, fontWeight: '700', fontFamily: 'Inter_600SemiBold',
              color: limitPct >= 90 ? '#991B1B' : limitPct >= 80 ? '#C9A030' : '#7A1515',
            }}>
              {totalQty} / {FREE_LIMIT}
            </Text>
          </View>
          <View style={{ height: 5, backgroundColor: '#F2EDE6', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{
              height: '100%',
              width: `${limitPct}%`,
              backgroundColor: limitPct >= 90 ? '#991B1B' : limitPct >= 80 ? '#C9A030' : '#7A1515',
              borderRadius: 3,
            }} />
          </View>
        </View>
      )}

      {/* Recherche */}
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un vin…"
          placeholderTextColor="#9E9189"
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#C8BAA8',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 15,
            color: '#1C1410',
            fontFamily: 'Inter_400Regular',
          }}
        />
      </View>

      {/* Filtres par type */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(f) => f}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 10 }}
        renderItem={({ item: f }) => {
          const active = activeFilter === f;
          return (
            <Pressable
              onPress={() => setActiveFilter(f)}
              style={{
                height: 22,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: active ? '#7A1515' : '#FFFFFF',
                borderWidth: 1,
                borderColor: active ? '#7A1515' : '#C8BAA8',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 13, color: active ? '#FFFFFF' : '#7A6E65', fontFamily: 'Inter_600SemiBold' }}>
                {f}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* État chargement */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7A1515" />
        </View>
      ) : error ? (
        /* État erreur */
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
          <Text style={{ fontSize: 16, color: '#991B1B', textAlign: 'center', fontFamily: 'Inter_600SemiBold', marginBottom: 8 }}>
            Impossible de charger la cave
          </Text>
          <Text style={{ fontSize: 13, color: '#7A6E65', textAlign: 'center', fontFamily: 'Inter_400Regular', marginBottom: 24 }}>
            {error}
          </Text>
          <Pressable
            onPress={() => { setLoading(true); loadBottles(); }}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#991B1B' : '#7A1515',
              borderRadius: 10,
              paddingHorizontal: 24,
              paddingVertical: 12,
            })}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
              Réessayer
            </Text>
          </Pressable>
        </View>
      ) : (
        /* Liste */
        <FlatList
          data={filtered}
          keyExtractor={(b) => String(b.id)}
          renderItem={({ item }) => <BottleCard bottle={item} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7A1515" />}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🍷</Text>
              <Text style={{ fontSize: 18, color: '#1C1410', fontFamily: 'CormorantGaramond_600SemiBold', marginBottom: 6 }}>
                {search || activeFilter !== 'Tous' ? 'Aucun résultat' : 'La cave est vide'}
              </Text>
              <Text style={{ fontSize: 14, color: '#7A6E65', textAlign: 'center', fontFamily: 'Inter_400Regular' }}>
                {search || activeFilter !== 'Tous'
                  ? 'Essayez un autre filtre ou terme de recherche'
                  : "Ajoutez votre première bouteille via l'onglet ➕"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
