import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  value: number | null;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 16, md: 22, lg: 28 };

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  const fontSize = SIZES[size];
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && value >= star;
        return (
          <Pressable
            key={star}
            onPress={() => !readonly && onChange?.(star)}
            disabled={readonly}
            hitSlop={6}
          >
            <Text style={{ fontSize, color: filled ? '#A87C2A' : '#C8BAA8' }}>
              {filled ? '★' : '☆'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
