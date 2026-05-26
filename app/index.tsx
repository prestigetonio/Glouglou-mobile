import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F3EE', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7A1515" />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)/cave' : '/(auth)/login'} />;
}
