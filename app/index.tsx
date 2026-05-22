import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/theme';

export default function EntryScreen() {
  const { hasOnboarded, loadState } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadState().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (hasOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
