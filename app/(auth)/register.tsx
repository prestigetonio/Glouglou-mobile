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
import { apiRegister } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await apiRegister(firstName.trim(), lastName.trim(), email.trim().toLowerCase(), password);
      await signIn(email.trim().toLowerCase(), password);
      router.replace('/(tabs)/cave');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur d'inscription");
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
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <Text style={{ fontSize: 40, marginBottom: 4 }}>🍷</Text>
            <Text style={{ fontSize: 30, color: '#7A1515', fontFamily: 'CormorantGaramond_700Bold' }}>
              Créer mon compte
            </Text>
            <Text style={{ fontSize: 14, color: '#7A6E65', marginTop: 6, fontFamily: 'Inter_400Regular' }}>
              Rejoignez GlouGlou gratuitement
            </Text>
          </View>

          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Prénom</FieldLabel>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Jean"
                  placeholderTextColor="#9E9189"
                  autoCapitalize="words"
                  style={inputStyle}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldLabel>Nom</FieldLabel>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Dupont"
                  placeholderTextColor="#9E9189"
                  autoCapitalize="words"
                  style={inputStyle}
                />
              </View>
            </View>

            <View>
              <FieldLabel>Adresse e-mail</FieldLabel>
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
              <FieldLabel>Mot de passe</FieldLabel>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="8 caractères minimum"
                placeholderTextColor="#9E9189"
                secureTextEntry
                style={inputStyle}
              />
            </View>

            {error && (
              <Text style={{ color: '#991B1B', fontSize: 14, textAlign: 'center' }}>{error}</Text>
            )}

            <Pressable
              onPress={handleRegister}
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
                    Créer mon compte
                  </Text>
              }
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 28, gap: 4 }}>
            <Text style={{ color: '#7A6E65', fontSize: 14, fontFamily: 'Inter_400Regular' }}>
              Déjà un compte ?
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={{ color: '#7A1515', fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
                  Se connecter
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: '600', color: '#7A6E65', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter_600SemiBold' }}>
      {children}
    </Text>
  );
}

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
