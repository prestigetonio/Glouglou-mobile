import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  }

  if (!user) return null;

  const isPremium = user.plan === 'premium';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <Text style={{ fontSize: 32, color: '#7A1515', fontFamily: 'CormorantGaramond_700Bold', marginBottom: 24 }}>
          Mon Profil
        </Text>

        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#F2EDE6',
            borderWidth: 2,
            borderColor: '#C8BAA8',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 20, color: '#1C1410', fontFamily: 'CormorantGaramond_600SemiBold', fontWeight: '600' }}>
            {user.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#7A6E65', marginTop: 2, fontFamily: 'Inter_400Regular' }}>
            {user.email}
          </Text>
        </View>

        {/* Plan */}
        <View style={{
          backgroundColor: isPremium ? '#FFF8EC' : '#FFFFFF',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isPremium ? '#A87C2A' : '#C8BAA8',
          padding: 16,
          marginBottom: 20,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13, color: '#7A6E65', fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                Plan actuel
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: isPremium ? '#A87C2A' : '#1C1410', fontFamily: isPremium ? 'CormorantGaramond_700Bold' : 'Inter_600SemiBold' }}>
                {isPremium ? '✨ Premium' : 'Gratuit'}
              </Text>
            </View>
            {!isPremium && (
              <View style={{ backgroundColor: '#7A1515', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700', fontFamily: 'Inter_600SemiBold' }}>
                  Passer Premium
                </Text>
              </View>
            )}
          </View>
          {!isPremium && (
            <Text style={{ fontSize: 12, color: '#7A6E65', marginTop: 8, fontFamily: 'Inter_400Regular' }}>
              Plan gratuit : 50 bouteilles maximum
            </Text>
          )}
        </View>

        {/* Infos */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#C8BAA8', overflow: 'hidden', marginBottom: 24 }}>
          <InfoRow label="Nom complet" value={user.name} />
          <View style={{ height: 1, backgroundColor: '#F2EDE6' }} />
          <InfoRow label="Adresse e-mail" value={user.email} />
        </View>

        {/* Déconnexion */}
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => ({
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#C8BAA8',
            padding: 14,
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: '#991B1B', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
            Se déconnecter
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      <Text style={{ fontSize: 12, color: '#9E9189', fontFamily: 'Inter_400Regular', marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 15, color: '#1C1410', fontFamily: 'Inter_500Medium' }}>
        {value}
      </Text>
    </View>
  );
}
