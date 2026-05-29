import { Stack } from 'expo-router';
import React from 'react';

export default function BottleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F7F3EE' },
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    />
  );
}
