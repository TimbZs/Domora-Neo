import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
  service_type: string;
}

interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  service_type: string;
}

export default function CreateBookingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { serviceType, packageId } = useLocalSearchParams();
  
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [availableAddons, setAvailableAddons] = useState<ServiceAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [address, setAddress] = useState({
    street: '',
    city: 'Ljubljana',
    postal_code: '',
    country: 'Slovenia'
  });
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState<any>(null);

  useEffect(() => {
    if (user?.role !== 'customer') {
      Alert.alert('Access Denied', 'Only customers can create bookings', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      return;
    }
    loadServiceData();
  }, [serviceType, packageId]);

  const loadServiceData = async () => {
    try {
      const [packagesResponse, addonsResponse] = await Promise.all([
        axios.get(`/services/packages?service_type=${serviceType}`),
        axios.get(`/services/addons?service_type=${serviceType}`)
      ]);
      
      const packages = packagesResponse.data;
      const addons = addonsResponse.data;
      
      const pkg = packageId ? packages.find((p: any) => p.id === packageId) : packages[0];
      setSelectedPackage(pkg);
      setAvailableAddons(addons);
    } catch (error) {
      Alert.alert('Error', 'Failed to load service data');
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateEstimate = async () => {
    if (!selectedPackage || !address.street) return;

    try {
      const response = await axios.post('/services/price-estimate', {
        package_id: selectedPackage.id,
        addon_ids: selectedAddons,
        service_address: address
      });
      setPriceEstimate(response.data);
    } catch (error) {
      console.log('Estimate calculation failed:', error);
    }
  };

  useEffect(() => {
    calculateEstimate();
  }, [selectedPackage, selectedAddons, address]);

  const createBooking = async () => {
    if (!selectedPackage || !address.street || !address.postal_code) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const scheduledDateTime = setHours(
        setMinutes(selectedDate, parseInt(selectedTime.split(':')[1])),
        parseInt(selectedTime.split(':')[0])
      );

      const response = await axios.post('/bookings', {
        service_type: serviceType,
        package_id: selectedPackage.id,
        addon_ids: selectedAddons,
        service_address: address,
        scheduled_datetime: scheduledDateTime.toISOString(),
        notes: notes
      });

      Alert.alert('Booking Created!', 'Your service has been booked successfully.', [
        { 
          text: 'View Booking', 
          onPress: () => router.push(`/booking/details?bookingId=${response.data.id}`) 
        },
        { 
          text: 'Continue', 
          onPress: () => router.push('/(tabs)/bookings') 
        }
      ]);
    } catch (error) {
      Alert.alert('Booking Failed', 'Unable to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  if (!user || user.role !== 'customer') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Access Denied</Text>
        </View>
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
            <Text style={styles.title}>Book Service</Text>
          </View>

          {/* Service Package */}
          {selectedPackage && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selected Service</Text>
              <View style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  <Text style={styles.packageName}>{selectedPackage.name}</Text>
                  <Text style={styles.packagePrice}>€{selectedPackage.base_price}</Text>
                </View>
                <Text style={styles.packageDescription}>{selectedPackage.description}</Text>
                <Text style={styles.packageDuration}>Duration: {selectedPackage.duration_minutes} minutes</Text>
              </View>
            </View>
          )}

          {/* Add-ons */}
          {availableAddons.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add-ons (Optional)</Text>
              {availableAddons.map((addon) => (
                <Pressable
                  key={addon.id}
                  style={[
                    styles.addonCard,
                    selectedAddons.includes(addon.id) && styles.addonCardSelected
                  ]}
                  onPress={() => toggleAddon(addon.id)}
                >
                  <View style={styles.addonContent}>
                    <Text style={styles.addonName}>{addon.name}</Text>
                    <Text style={styles.addonDescription}>{addon.description}</Text>
                  </View>
                  <View style={styles.addonRight}>
                    <Text style={styles.addonPrice}>+€{addon.price}</Text>
                    <View style={[
                      styles.checkbox,
                      selectedAddons.includes(addon.id) && styles.checkboxSelected
                    ]}>
                      {selectedAddons.includes(addon.id) && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Address *</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={address.street}
                onChangeText={(text) => setAddress(prev => ({ ...prev, street: text }))}
                placeholder="Enter street address"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={address.city}
                  onChangeText={(text) => setAddress(prev => ({ ...prev, city: text }))}
                  placeholder="City"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                  style={styles.input}
                  value={address.postal_code}
                  onChangeText={(text) => setAddress(prev => ({ ...prev, postal_code: text }))}
                  placeholder="1000"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={format(selectedDate, 'MMM dd, yyyy')}
                placeholder="Select date"
                placeholderTextColor="#64748b"
                editable={false}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlots}>
                {generateTimeSlots().map((time) => (
                  <Pressable
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.timeSlotSelected
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextSelected
                    ]}>
                      {time}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any special instructions or requests..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Price Estimate */}
          {priceEstimate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Estimate</Text>
              <View style={styles.priceCard}>
                {Object.entries(priceEstimate.breakdown).map(([item, price]) => (
                  <View key={item} style={styles.priceRow}>
                    <Text style={styles.priceLabel}>{item}</Text>
                    <Text style={styles.priceValue}>€{price}</Text>
                  </View>
                ))}
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.priceTotalLabel}>Total</Text>
                  <Text style={styles.priceTotalValue}>€{priceEstimate.total_price}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Create Booking Button */}
          <View style={styles.section}>
            <Pressable
              style={[styles.createButton, isLoading && styles.createButtonDisabled]}
              onPress={createBooking}
              disabled={isLoading}
            >
              <Text style={styles.createButtonText}>
                {isLoading ? 'Creating Booking...' : 'Book Now'}
              </Text>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  packageDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  packageDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  addonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  addonCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  addonContent: {
    flex: 1,
  },
  addonName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  addonDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  addonRight: {
    alignItems: 'center',
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  timeSlots: {
    flexDirection: 'row',
  },
  timeSlot: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  timeSlotSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeSlotText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#ffffff',
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
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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