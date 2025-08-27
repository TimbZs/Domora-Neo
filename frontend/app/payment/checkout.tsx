import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await axios.get(`/bookings/${bookingId}`);
      setBooking(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking details');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async () => {
    if (!booking) return;

    setIsProcessing(true);
    
    try {
      const response = await axios.post(`/payments/create-checkout?booking_id=${booking.id}`);
      
      const { checkout_url } = response.data;
      
      // Open Stripe checkout in browser
      const result = await WebBrowser.openBrowserAsync(checkout_url);
      
      if (result.type === 'cancel') {
        Alert.alert('Payment Cancelled', 'Payment was cancelled by user.');
      } else {
        // Check payment status after returning
        router.push(`/payment/success?bookingId=${booking.id}`);
      }
    } catch (error) {
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading checkout...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Booking not found</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#f8fafc" />
            </Pressable>
            <Text style={styles.title}>Secure Checkout</Text>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text style={styles.securityText}>Secured by Stripe</Text>
          </View>

          {/* Booking Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>
                  {booking.service_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Booking ID</Text>
                <Text style={styles.summaryValue}>#{booking.id.slice(-8)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Address</Text>
                <Text style={styles.summaryValue}>{booking.service_address.street}</Text>
              </View>
            </View>
          </View>

          {/* Price Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.priceCard}>
              {Object.entries(booking.price_estimate.breakdown).map(([item, price]) => (
                <View key={item} style={styles.priceRow}>
                  <Text style={styles.priceLabel}>{item}</Text>
                  <Text style={styles.priceValue}>€{price}</Text>
                </View>
              ))}
              <View style={styles.priceDivider} />
              <View style={styles.priceRow}>
                <Text style={styles.priceTotalLabel}>Total Amount</Text>
                <Text style={styles.priceTotalValue}>€{booking.price_estimate.total_price}</Text>
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentMethodHeader}>
                <Ionicons name="card-outline" size={24} color="#3b82f6" />
                <Text style={styles.paymentMethodTitle}>Credit/Debit Card</Text>
              </View>
              <Text style={styles.paymentMethodDescription}>
                Secure payment processing via Stripe. We accept Visa, Mastercard, and American Express.
              </Text>
              <View style={styles.cardLogos}>
                <Text style={styles.cardLogo}>💳 Visa</Text>
                <Text style={styles.cardLogo}>💳 Mastercard</Text>
                <Text style={styles.cardLogo}>💳 Amex</Text>
              </View>
            </View>
          </View>

          {/* Terms */}
          <View style={styles.section}>
            <View style={styles.termsCard}>
              <Text style={styles.termsText}>
                By proceeding with payment, you agree to our Terms of Service and Privacy Policy. 
                Payment will be processed securely through Stripe.
              </Text>
            </View>
          </View>

          {/* Pay Button */}
          <View style={styles.section}>
            <Pressable
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={processPayment}
              disabled={isProcessing}
            >
              <Ionicons name="lock-closed" size={20} color="#ffffff" />
              <Text style={styles.payButtonText}>
                {isProcessing ? 'Processing...' : `Pay €${booking.price_estimate.total_price}`}
              </Text>
            </Pressable>
            
            <Text style={styles.payButtonSubtext}>
              You will be redirected to Stripe's secure payment page
            </Text>
          </View>

        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 24,
  },
  securityText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  summaryValue: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '500',
  },
  priceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  priceValue: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '500',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 12,
  },
  priceTotalLabel: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '600',
  },
  priceTotalValue: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '700',
  },
  paymentMethodCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginLeft: 12,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardLogos: {
    flexDirection: 'row',
    gap: 12,
  },
  cardLogo: {
    fontSize: 12,
    color: '#64748b',
  },
  termsCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  termsText: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
    textAlign: 'center',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  payButtonSubtext: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '600',
  },
});