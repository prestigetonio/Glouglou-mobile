import React from 'react';
import { Text, View } from 'react-native';
import { WINE_TYPE_CONFIG, WineType } from '@/lib/types';

interface Props {
  type: WineType;
}

export default function WineTypeBadge({ type }: Props) {
  const cfg = WINE_TYPE_CONFIG[type];
  return (
    <View
      style={{
        backgroundColor: cfg.bg,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 12 }}>{cfg.icon}</Text>
      <Text style={{ fontSize: 12, color: cfg.text, fontWeight: '600' }}>{type}</Text>
    </View>
  );
}
