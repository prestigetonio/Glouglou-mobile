import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Bottle } from '@/lib/types';
import StarRating from './StarRating';
import WineTypeBadge from './WineTypeBadge';

interface Props {
  bottle: Bottle;
}

export default function BottleCard({ bottle }: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/bottle/${bottle.id}`)}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C8BAA8',
        padding: 16,
        marginBottom: 12,
        opacity: pressed ? 0.9 : 1,
        shadowColor: '#3C2814',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <WineTypeBadge type={bottle.type} />
        {bottle.quantity > 1 && (
          <View style={{ backgroundColor: '#F2EDE6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ fontSize: 12, color: '#7A6E65', fontWeight: '600' }}>×{bottle.quantity}</Text>
          </View>
        )}
      </View>

      <Text
        style={{ fontSize: 18, fontWeight: '600', color: '#1C1410', marginBottom: 2 }}
        numberOfLines={1}
      >
        {bottle.name}
      </Text>
      <Text style={{ fontSize: 14, color: '#7A6E65', marginBottom: 8 }} numberOfLines={1}>
        {bottle.domain}
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        {bottle.vintage && (
          <MetaChip label={String(bottle.vintage)} />
        )}
        {bottle.region && <MetaChip label={bottle.region} />}
        {bottle.country && <MetaChip label={bottle.country} />}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {bottle.price != null ? (
          <Text style={{ fontSize: 14, color: '#A87C2A', fontWeight: '600' }}>
            {bottle.price % 1 === 0 ? bottle.price : bottle.price.toFixed(2)} €
          </Text>
        ) : (
          <View />
        )}
        <StarRating value={bottle.rating} readonly size="sm" />
      </View>
    </Pressable>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <Text style={{ fontSize: 12, color: '#7A6E65', backgroundColor: '#F2EDE6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
      {label}
    </Text>
  );
}
