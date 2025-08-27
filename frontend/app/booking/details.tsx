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
import { format, parseISO } from 'date-fns';

interface Booking {
  id: string;
  customer_id: string;
  provider_id?: string;
  service_type: string;
  package_id: string;
  addon_ids: string[];
  scheduled_datetime: string;
  status: string;
  payment_status: string;
  price_estimate: {
    total_price: number;
    currency: string;
    breakdown: Record<string, number>;
  };
  service_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  notes?: string;
  created_at: string;
}

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  in_progress: '#10b981',
  completed: '#059669',
  cancelled: '#ef4444',
};

const paymentStatusColors = {
  pending: '#f59e0b',
  authorized: '#3b82f6',
  captured: '#10b981',
  failed: '#ef4444',
  refunded: '#6b7280',
};

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handlePayment = async () => {
    if (!booking) return;

    try {
      const response = await axios.post(`/payments/create-checkout?booking_id=${booking.id}`);
      
      Alert.alert(
        'Proceed to Payment',
        'You will be redirected to secure payment processing.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Pay Now', 
            onPress: () => {
              // In a real app, this would open the Stripe checkout URL
              Alert.alert('Payment', 'Payment system would open here.');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.patch(`/bookings/${bookingId}`, { status: 'cancelled' });
              Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          }
        }
      ]
    );
  };

  const getServiceTitle = (serviceType: string) => {
    switch (serviceType) {
      case 'house_cleaning':
        return 'House Cleaning';
      case 'car_washing':
        return 'Car Washing';
      case 'landscaping':
        return 'Landscaping';
      default:
        return 'Service';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'house_cleaning':
        return 'home-outline';
      case 'car_washing':
        return 'car-outline';
      case 'landscaping':
        return 'leaf-outline';
      default:
        return 'grid-outline';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading booking details...</Text>
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
            <Text style={styles.title}>Booking Details</Text>
          </View>

          {/* Service Info */}
          <View style={styles.section}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIcon}>
                <Ionicons 
                  name={getServiceIcon(booking.service_type) as keyof typeof Ionicons.glyphMap} 
                  size={32} 
                  color="#3b82f6" 
                />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{getServiceTitle(booking.service_type)}</Text>
                <Text style={styles.bookingId}>Booking #{booking.id.slice(-8)}</Text>
              </View>
            </View>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: statusColors[booking.status as keyof typeof statusColors] || '#6b7280' }
                ]} />
                <Text style={styles.statusText}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                </Text>
              </View>
              
              <View style={styles.paymentBadge}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors] || '#6b7280' }
                ]} />
                <Text style={styles.statusText}>
                  Payment: {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleRow}>
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                <Text style={styles.scheduleText}>
                  {format(parseISO(booking.scheduled_datetime), 'EEEE, MMMM dd, yyyy')}
                </Text>
              </View>
              <View style={styles.scheduleRow}>
                <Ionicons name="time-outline" size={20} color="#3b82f6" />
                <Text style={styles.scheduleText}>
                  {format(parseISO(booking.scheduled_datetime), 'HH:mm')}
                </Text>
              </View>
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Address</Text>
            <View style={styles.addressCard}>
              <Ionicons name="location-outline" size={20} color="#3b82f6" />
              <View style={styles.addressText}>
                <Text style={styles.addressLine}>{booking.service_address.street}</Text>
                <Text style={styles.addressLine}>
                  {booking.service_address.city}, {booking.service_address.postal_code}
                </Text>
                <Text style={styles.addressLine}>{booking.service_address.country}</Text>
              </View>
            </View>
          </View>

          {/* Price Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.priceCard}>
              {Object.entries(booking.price_estimate.breakdown).map(([item, price]) => (
                <View key={item} style={styles.priceRow}>
                  <Text style={styles.priceLabel}>{item}</Text>
                  <Text style={styles.priceValue}>€{price}</Text>
                </View>
              ))}
              <View style={styles.priceDivider} />
              <View style={styles.priceRow}>
                <Text style={styles.priceTotalLabel}>Total</Text>
                <Text style={styles.priceTotalValue}>€{booking.price_estimate.total_price}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {booking.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{booking.notes}</Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.section}>
            {booking.payment_status === 'pending' && booking.status !== 'cancelled' && (
              <Pressable style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>Pay Now - €{booking.price_estimate.total_price}</Text>
              </Pressable>
            )}
            
            {booking.status === 'pending' && (
              <Pressable style={styles.cancelButton} onPress={handleCancelBooking}>
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </Pressable>
            )}
            
            <Pressable 
              style={styles.contactButton}
              onPress={() => Alert.alert('Contact', 'Messaging feature coming soon!')}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#3b82f6" />
              <Text style={styles.contactButtonText}>Contact Provider</Text>
            </Pressable>
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
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '500',
  },
  scheduleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#f8fafc',
    marginLeft: 12,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  addressText: {
    marginLeft: 12,
    flex: 1,
  },
  addressLine: {
    fontSize: 14,
    color: '#f8fafc',
    marginBottom: 4,
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
    marginVertical: 8,
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
  notesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  notesText: {
    fontSize: 14,
    color: '#f8fafc',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  contactButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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