import { Link, useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '@/contexts/AuthContext';
import { apiGoogleSignIn } from '@/lib/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn, saveSession } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleGoogleToken(access_token);
    }
  }, [response]);

  async function handleGoogleToken(accessToken: string) {
    setGoogleLoading(true);
    setError(null);
    try {
      const data = await apiGoogleSignIn(accessToken);
      await saveSession(data.token, data.user);
      router.replace('/(tabs)/cave');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur Google');
    } finally {
      setGoogleLoading(false);
    }
  }

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
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Image
              source={require('@/assets/logo.png')}
              style={{ width: 260, height: 160 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 15, color: '#7A6E65', marginTop: -8, fontFamily: 'Inter_400Regular' }}>
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
                placeholder="Saisis l'adresse e-mail"
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

            <Pressable onPress={handleLogin} disabled={loading} style={{ marginTop: 4 }}>
              <View style={{
                backgroundColor: '#7A1515',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}>
                {loading
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>
                      Se connecter
                    </Text>
                }
              </View>
            </Pressable>

            {/* Séparateur */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E8E0D5' }} />
              <Text style={{ fontSize: 12, color: '#C8BAA8', fontFamily: 'Inter_400Regular' }}>ou</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E8E0D5' }} />
            </View>

            {/* Bouton Google */}
            <Pressable onPress={() => promptAsync()} disabled={!request || googleLoading}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#C8BAA8',
              }}>
                {googleLoading ? <ActivityIndicator color="#7A6E65" /> : (
                  <>
                    <GoogleIcon />
                    <Text style={{ fontSize: 14, color: '#1C1410', fontFamily: 'Inter_500Medium' }}>
                      Continuer avec Google
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32, gap: 4 }}>
            <Text style={{ color: '#7A6E65', fontSize: 14, fontFamily: 'Inter_400Regular' }}>
              Pas encore de compte ?
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={{ color: '#7A1515', fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>
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

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </Svg>
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
