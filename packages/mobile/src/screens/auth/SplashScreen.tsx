import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import * as ExpoSplashScreen from 'expo-splash-screen';

ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreen({ navigation }: any) {
  const { token, user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const prepareApp = async () => {
      if (!loading) {
        await ExpoSplashScreen.hideAsync();
        if (token && user) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      }
    };
    prepareApp();
  }, [loading, token, user, navigation]);

  return (
    <LinearGradient
      colors={['#eef2ff', '#e0e7ff', '#ddd6fe']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Truck Network</Text>
        <Text style={styles.tagline}>Smart Transportation Platform</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e1b4b',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
});