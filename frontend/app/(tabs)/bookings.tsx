import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

interface Booking {
  id: string;
  customer_id: string;
  provider_id?: string;
  service_type: string;
  package_id: string;
  scheduled_datetime: string;
  status: string;
  payment_status: string;
  price_estimate: {
    total_price: number;
    currency: string;
  };
  service_address: {
    street: string;
    city: string;
    postal_code: string;
  };
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

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleBookingPress = (booking: Booking) => {
    router.push({
      pathname: '/booking/details',
      params: { bookingId: booking.id }
    });
  };

  const handleCreateBooking = () => {
    router.push('/services');
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

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch {
      return 'Invalid time';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Ionicons name="person-outline" size={48} color="#94a3b8" />
          <Text style={styles.authPromptTitle}>Sign In Required</Text>
          <Text style={styles.authPromptText}>
            Please sign in to view your bookings
          </Text>
          <Pressable 
            style={styles.authButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>
            Track and manage your service appointments
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable 
            style={styles.quickActionButton}
            onPress={handleCreateBooking}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
            <Text style={styles.quickActionText}>Book New Service</Text>
          </Pressable>
        </View>

        {/* Bookings List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#374151" />
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyText}>
              You haven't made any bookings. Explore our services to get started!
            </Text>
            <Pressable 
              style={styles.emptyButton}
              onPress={handleCreateBooking}
            >
              <Text style={styles.emptyButtonText}>Browse Services</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {bookings.map((booking) => (
              <Pressable
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => handleBookingPress(booking)}
              >
                <View style={styles.bookingHeader}>
                  <View style={styles.serviceInfo}>
                    <Ionicons 
                      name={getServiceIcon(booking.service_type) as keyof typeof Ionicons.glyphMap}
                      size={24} 
                      color="#3b82f6" 
                    />
                    <View style={styles.serviceDetails}>
                      <Text style={styles.serviceTitle}>
                        {getServiceTitle(booking.service_type)}
                      </Text>
                      <Text style={styles.bookingDate}>
                        {formatDate(booking.scheduled_datetime)} at {formatTime(booking.scheduled_datetime)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      €{booking.price_estimate.total_price}
                    </Text>
                  </View>
                </View>

                <View style={styles.addressContainer}>
                  <Ionicons name="location-outline" size={16} color="#94a3b8" />
                  <Text style={styles.address}>
                    {booking.service_address.street}, {booking.service_address.city}
                  </Text>
                </View>

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
                      {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                    </Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 20,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  authPromptTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 8,
  },
  authPromptText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  authButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingsList: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  bookingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  address: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
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
});