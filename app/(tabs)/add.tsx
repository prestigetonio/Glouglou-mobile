import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottleForm from '@/components/BottleForm';
import PremiumModal from '@/components/PremiumModal';
import { apiCreateBottle } from '@/lib/api';
import { BottleFormData } from '@/lib/types';

export default function AddScreen() {
  const router = useRouter();
  const [showPremium, setShowPremium] = useState(false);

  async function handleSubmit(data: BottleFormData) {
    try {
      await apiCreateBottle(data);
      router.replace('/(tabs)/cave');
    } catch (e: unknown) {
      const err = e as Error & { code?: string };
      if (err.code === 'FREE_LIMIT_REACHED') {
        setShowPremium(true);
        return;
      }
      throw e;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, color: '#7A1515', fontFamily: 'CormorantGaramond_700Bold' }}>
          Ajouter une bouteille
        </Text>
      </View>

      <BottleForm
        onSubmit={handleSubmit}
        onCancel={() => router.replace('/(tabs)/cave')}
        submitLabel="Ajouter à la cave"
      />

      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
    </SafeAreaView>
  );
}
