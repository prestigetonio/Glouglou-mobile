import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password) { setError('Veuillez remplir tous les champs'); return; }
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace('/(tabs)/cave');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / titre */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ fontSize: 52, marginBottom: 4 }}>🍷</Text>
            <Text style={{ fontSize: 36, color: '#7A1515', fontFamily: 'CormorantGaramond_700Bold' }}>
              GlouGlou
            </Text>
            <Text style={{ fontSize: 15, color: '#7A6E65', marginTop: 6, fontFamily: 'Inter_400Regular' }}>
              Votre cave personnelle
            </Text>
          </View>

          {/* Formulaire */}
          <View style={{ gap: 14 }}>
            <View>
              <Text style={labelStyle}>Adresse e-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="vous@exemple.com"
                placeholderTextColor="#9E9189"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={inputStyle}
              />
            </View>

            <View>
              <Text style={labelStyle}>Mot de passe</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9E9189"
                secureTextEntry
                style={inputStyle}
              />
            </View>

            {error && (
              <Text style={{ color: '#991B1B', fontSize: 14, textAlign: 'center' }}>{error}</Text>
            )}

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: pressed || loading ? '#991B1B' : '#7A1515',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                marginTop: 4,
              })}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', fontFamily: 'Inter_600SemiBold' }}>
                    Se connecter
                  </Text>
              }
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32, gap: 4 }}>
            <Text style={{ color: '#7A6E65', fontSize: 14, fontFamily: 'Inter_400Regular' }}>
              Pas encore de compte ?
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={{ color: '#7A1515', fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
                  S'inscrire
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const labelStyle = {
  fontSize: 13,
  fontWeight: '600' as const,
  color: '#7A6E65',
  marginBottom: 6,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
  fontFamily: 'Inter_600SemiBold',
};

const inputStyle = {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#C8BAA8',
  borderRadius: 10,
  padding: 14,
  fontSize: 15,
  color: '#1C1410',
  fontFamily: 'Inter_400Regular',
};
