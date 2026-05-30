import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottleForm from '@/components/BottleForm';
import PremiumModal from '@/components/PremiumModal';
import { apiGetBottle, apiUpdateBottle } from '@/lib/api';
import { Bottle, BottleFormData } from '@/lib/types';

export default function EditBottleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bottle, setBottle] = useState<Bottle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    if (id) {
      apiGetBottle(Number(id))
        .then(setBottle)
        .finally(() => setLoading(false));
    }
  }, [id]);

  async function handleSubmit(data: BottleFormData) {
    if (!bottle) return;
    try {
      await apiUpdateBottle(bottle.id, data);
      router.replace(`/bottle/${bottle.id}`);
    } catch (e: unknown) {
      const err = e as Error & { code?: string };
      if (err.code === 'FREE_LIMIT_REACHED') {
        setShowPremium(true);
        return;
      }
      throw e;
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7A1515" />
      </SafeAreaView>
    );
  }

  if (!bottle) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#7A6E65', fontFamily: 'Inter_400Regular' }}>Bouteille introuvable</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, color: '#7A1515', fontFamily: 'CormorantGaramond_700Bold' }}>
          Modifier la bouteille
        </Text>
        <Text style={{ fontSize: 14, color: '#7A6E65', marginTop: 2, fontFamily: 'Inter_400Regular' }}>
          {bottle.name}
        </Text>
      </View>

      <BottleForm
        initial={bottle}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel="Enregistrer"
      />

      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
    </SafeAreaView>
  );
}
