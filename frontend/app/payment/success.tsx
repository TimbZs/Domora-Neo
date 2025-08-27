import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { bookingId, session_id } = useLocalSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (session_id) {
      verifyPayment();
    } else {
      setIsVerifying(false);
      setPaymentConfirmed(true); // Assume success if no session_id
    }
  }, [session_id]);

  const verifyPayment = async () => {
    try {
      const response = await axios.get(`/payments/status/${session_id}`);
      
      if (response.data.payment_status === 'paid') {
        setPaymentConfirmed(true);
      } else {
        Alert.alert('Payment Verification', 'Payment is still being processed. Please check your booking status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify payment status');
    } finally {
      setIsVerifying(false);
    }
  };

  const navigateToBooking = () => {
    if (bookingId) {
      router.push(`/booking/details?bookingId=${bookingId}`);
    } else {
      router.push('/(tabs)/bookings');
    }
  };

  const navigateToHome = () => {
    router.push('/(tabs)/home');
  };

  if (isVerifying) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
          <View style={styles.content}>
            <View style={styles.loadingContainer}>
              <View style={styles.loadingIcon}>
                <Ionicons name="sync" size={48} color="#3b82f6" />
              </View>
              <Text style={styles.loadingTitle}>Verifying Payment...</Text>
              <Text style={styles.loadingText}>Please wait while we confirm your payment</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
        <View style={styles.content}>
          
          {paymentConfirmed ? (
            /* Success State */
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color="#10b981" />
              </View>
              
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successMessage}>
                Your booking has been confirmed and payment processed successfully.
              </Text>
              
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                  <Text style={styles.detailText}>Booking confirmed and scheduled</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="card-outline" size={20} color="#10b981" />
                  <Text style={styles.detailText}>Payment processed securely</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={20} color="#f59e0b" />
                  <Text style={styles.detailText}>Confirmation email sent</Text>
                </View>
              </View>

              <View style={styles.nextSteps}>
                <Text style={styles.nextStepsTitle}>What's Next?</Text>
                <View style={styles.stepItem}>
                  <Text style={styles.stepNumber}>1</Text>
                  <Text style={styles.stepText}>You'll receive a confirmation email</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepNumber}>2</Text>
                  <Text style={styles.stepText}>Provider will be assigned to your booking</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepNumber}>3</Text>
                  <Text style={styles.stepText}>Service will be performed as scheduled</Text>
                </View>
              </View>
              
              <View style={styles.actions}>
                <Pressable style={styles.primaryButton} onPress={navigateToBooking}>
                  <Text style={styles.primaryButtonText}>View Booking Details</Text>
                </Pressable>
                
                <Pressable style={styles.secondaryButton} onPress={navigateToHome}>
                  <Text style={styles.secondaryButtonText}>Return to Home</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* Error State */
            <View style={styles.errorContainer}>
              <View style={styles.errorIcon}>
                <Ionicons name="alert-circle" size={80} color="#ef4444" />
              </View>
              
              <Text style={styles.errorTitle}>Payment Issue</Text>
              <Text style={styles.errorMessage}>
                We couldn't verify your payment. Don't worry, no charges were made.
              </Text>
              
              <View style={styles.actions}>
                <Pressable style={styles.retryButton} onPress={() => router.back()}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
                
                <Pressable style={styles.secondaryButton} onPress={navigateToHome}>
                  <Text style={styles.secondaryButtonText}>Return to Home</Text>
                </Pressable>
              </View>
            </View>
          )}
          
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
  loadingContainer: {
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#374151',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#f8fafc',
    marginLeft: 12,
  },
  nextSteps: {
    width: '100%',
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  actions: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});