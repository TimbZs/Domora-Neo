import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaymentCancelScreen() {
  const router = useRouter();

  const navigateToBookings = () => {
    router.push('/(tabs)/bookings');
  };

  const navigateToHome = () => {
    router.push('/(tabs)/home');
  };

  const retryPayment = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
        <View style={styles.content}>
          
          <View style={styles.cancelContainer}>
            <View style={styles.cancelIcon}>
              <Ionicons name="close-circle" size={80} color="#f59e0b" />
            </View>
            
            <Text style={styles.cancelTitle}>Payment Cancelled</Text>
            <Text style={styles.cancelMessage}>
              No worries! Your payment was cancelled and no charges were made. 
              Your booking is still pending and you can complete payment anytime.
            </Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
                <Text style={styles.infoText}>Your booking is saved and waiting for payment</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#f59e0b" />
                <Text style={styles.infoText}>Complete payment within 24 hours to confirm</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
                <Text style={styles.infoText}>Your payment info is secure and not stored</Text>
              </View>
            </View>

            <View style={styles.nextSteps}>
              <Text style={styles.nextStepsTitle}>What would you like to do?</Text>
            </View>
            
            <View style={styles.actions}>
              <Pressable style={styles.primaryButton} onPress={retryPayment}>
                <Ionicons name="card-outline" size={20} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Try Payment Again</Text>
              </Pressable>
              
              <Pressable style={styles.secondaryButton} onPress={navigateToBookings}>
                <Text style={styles.secondaryButtonText}>View My Bookings</Text>
              </Pressable>
              
              <Pressable style={styles.tertiaryButton} onPress={navigateToHome}>
                <Text style={styles.tertiaryButtonText}>Return to Home</Text>
              </Pressable>
            </View>
          </View>
          
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cancelContainer: {
    alignItems: 'center',
  },
  cancelIcon: {
    marginBottom: 24,
  },
  cancelTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 12,
  },
  cancelMessage: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#f8fafc',
    marginLeft: 12,
    flex: 1,
  },
  nextSteps: {
    width: '100%',
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
});