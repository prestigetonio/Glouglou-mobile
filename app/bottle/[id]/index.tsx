import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from '@/components/StarRating';
import WineTypeBadge from '@/components/WineTypeBadge';
import { apiDeleteBottle, apiGetBottle } from '@/lib/api';
import { getAgingInfo } from '@/lib/aging';
import { Bottle } from '@/lib/types';

export default function BottleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bottle, setBottle] = useState<Bottle | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      apiGetBottle(Number(id))
        .then(setBottle)
        .finally(() => setLoading(false));
    }
  }, [id]);

  function handleDelete() {
    Alert.alert(
      'Supprimer la bouteille',
      `Êtes-vous sûr de vouloir supprimer "${bottle?.name}" de votre cave ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (!bottle) return;
            setDeleting(true);
            try {
              await apiDeleteBottle(bottle.id);
              router.replace('/(tabs)/cave');
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer cette bouteille');
              setDeleting(false);
            }
          },
        },
      ]
    );
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
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#7A1515' }}>Retour</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Retour */}
        <Pressable
          onPress={() => router.replace('/(tabs)/cave')}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 6 }}
        >
          <Text style={{ fontSize: 18, color: '#7A1515' }}>←</Text>
          <Text style={{ color: '#7A1515', fontSize: 14, fontFamily: 'Inter_500Medium' }}>Ma Cave</Text>
        </Pressable>

        {/* Badge type */}
        <WineTypeBadge type={bottle.type} />

        {/* Nom */}
        <Text style={{ fontSize: 32, color: '#1C1410', fontFamily: 'CormorantGaramond_700Bold', marginTop: 12, marginBottom: 4, lineHeight: 38 }}>
          {bottle.name}
        </Text>
        <Text style={{ fontSize: 16, color: '#7A6E65', fontFamily: 'Inter_400Regular', marginBottom: 20 }}>
          {bottle.domain}
        </Text>

        {/* État de vieillissement */}
        {(() => {
          const aging = getAgingInfo(bottle);
          if (!aging) return null;
          return (
            <View style={{
              backgroundColor: aging.bgColor,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: aging.color + '40',
              padding: 14,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <View style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: aging.color,
              }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: 'Inter_600SemiBold', color: aging.color }}>
                  {aging.label}
                </Text>
                <Text style={{ fontSize: 13, color: '#7A6E65', fontFamily: 'Inter_400Regular', marginTop: 2 }}>
                  {aging.sublabel}
                </Text>
              </View>
            </View>
          );
        })()}

        {/* Note */}
        {bottle.rating && (
          <View style={{ marginBottom: 20 }}>
            <StarRating value={bottle.rating} readonly size="lg" />
          </View>
        )}

        {/* Infos */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#C8BAA8', overflow: 'hidden', marginBottom: 20 }}>
          {bottle.vintage && <DetailRow label="Millésime" value={String(bottle.vintage)} />}
          {bottle.region && <DetailRow label="Région" value={bottle.region} divider />}
          {bottle.country && <DetailRow label="Pays" value={bottle.country} divider />}
          <DetailRow label="Quantité" value={`${bottle.quantity} bouteille${bottle.quantity > 1 ? 's' : ''}`} divider />
          {bottle.price != null && (
            <DetailRow
              label="Prix"
              value={`${bottle.price % 1 === 0 ? bottle.price : bottle.price.toFixed(2)} €`}
              divider
              valueStyle={{ color: '#A87C2A', fontWeight: '700' }}
            />
          )}
        </View>

        {/* Notes */}
        {bottle.notes && (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#C8BAA8', padding: 16, marginBottom: 28 }}>
            <Text style={{ fontSize: 12, color: '#9E9189', fontFamily: 'Inter_400Regular', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Notes
            </Text>
            <Text style={{ fontSize: 15, color: '#1C1410', fontFamily: 'Inter_400Regular', lineHeight: 22 }}>
              {bottle.notes}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => router.push(`/bottle/${bottle.id}/edit`)}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: '#F2EDE6',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#C8BAA8',
              padding: 14,
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: '#1C1410', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
              ✏️ Modifier
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            disabled={deleting}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: pressed || deleting ? '#F5DADA' : '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F5DADA',
              padding: 14,
              alignItems: 'center',
            })}
          >
            {deleting
              ? <ActivityIndicator size="small" color="#7A1515" />
              : <Text style={{ color: '#7A1515', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
                  🗑️ Supprimer
                </Text>
            }
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  divider = false,
  valueStyle = {},
}: {
  label: string;
  value: string;
  divider?: boolean;
  valueStyle?: object;
}) {
  return (
    <>
      {divider && <View style={{ height: 1, backgroundColor: '#F2EDE6' }} />}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 14, color: '#7A6E65', fontFamily: 'Inter_400Regular' }}>{label}</Text>
        <Text style={{ fontSize: 14, color: '#1C1410', fontWeight: '600', fontFamily: 'Inter_600SemiBold', ...valueStyle }}>
          {value}
        </Text>
      </View>
    </>
  );
}
