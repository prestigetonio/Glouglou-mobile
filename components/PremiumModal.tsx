import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function PremiumModal({ visible, onClose }: Props) {
  const router = useRouter();

  function handleUpgrade() {
    onClose();
    router.push('/(tabs)/profile');
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(28,20,16,0.6)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85%',
          }}
          onPress={() => {}}
        >
          <ScrollView
            contentContainerStyle={{ padding: 28, paddingBottom: 12 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>🍷</Text>
              <Text style={{ fontSize: 26, fontWeight: '700', color: '#7A1515', textAlign: 'center', marginBottom: 6 }}>
                Cave Premium
              </Text>
              <Text style={{ fontSize: 15, color: '#7A6E65', textAlign: 'center', lineHeight: 22 }}>
                Vous avez atteint la limite de 50 bouteilles du plan gratuit.
                Passez à Premium pour gérer une cave illimitée.
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              {[
                { icon: '♾️', text: 'Cave illimitée — autant de bouteilles que vous voulez' },
                { icon: '📊', text: 'Statistiques avancées de votre collection' },
                { icon: '🔔', text: 'Rappels et suggestions de dégustation' },
                { icon: '☁️', text: 'Sauvegarde et synchronisation prioritaire' },
              ].map(({ icon, text }) => (
                <View key={text} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <Text style={{ fontSize: 20 }}>{icon}</Text>
                  <Text style={{ flex: 1, fontSize: 14, color: '#1C1410', lineHeight: 20 }}>{text}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Boutons fixes en bas */}
          <View style={{ paddingHorizontal: 28, paddingBottom: 40, paddingTop: 16, gap: 8 }}>
            <Pressable onPress={handleUpgrade}>
              <View style={{
                backgroundColor: '#7A1515',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                <Text style={{ fontSize: 16 }}>✨</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_600SemiBold' }}>
                  Passer à Premium
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={onClose} style={{ alignItems: 'center', padding: 8 }}>
              <Text style={{ color: '#9E9189', fontSize: 14 }}>Continuer avec le plan gratuit</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
