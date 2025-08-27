import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated users to main app
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="home" size={64} color="#3b82f6" />
            <Text style={styles.title}>Domora</Text>
            <Text style={styles.subtitle}>
              Professional home services across Europe
            </Text>
          </View>

          <View style={styles.features}>
            <FeatureItem 
              icon="home-outline"
              title="House Cleaning"
              description="Professional cleaning services"
            />
            <FeatureItem 
              icon="car-outline"
              title="Car Washing"
              description="Complete car care and detailing"
            />
            <FeatureItem 
              icon="leaf-outline"
              title="Landscaping"
              description="Garden and lawn maintenance"
            />
          </View>

          <View style={styles.actions}>
            <Pressable 
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, description }: { 
  icon: keyof typeof Ionicons.glyphMap; 
  title: string; 
  description: string; 
}) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color="#3b82f6" />
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  loadingText: {
    color: '#f8fafc',
    fontSize: 16,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  actions: {
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#475569',
  },
  secondaryButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
});