import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function PremiumModal({ visible, onClose }: Props) {
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
            padding: 28,
            paddingBottom: 40,
          }}
          onPress={() => {}}
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

          <View style={{ gap: 12, marginBottom: 24 }}>
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

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#991B1B' : '#7A1515',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              marginBottom: 12,
            })}
            onPress={onClose}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
              Passer à Premium — Bientôt disponible
            </Text>
          </Pressable>

          <Pressable onPress={onClose} style={{ alignItems: 'center', padding: 8 }}>
            <Text style={{ color: '#9E9189', fontSize: 14 }}>Continuer avec le plan gratuit</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
