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

const serviceTypes = [
  { 
    id: 'house_cleaning', 
    title: 'House Cleaning', 
    icon: 'home-outline' as keyof typeof Ionicons.glyphMap,
    color: '#10b981'
  },
  { 
    id: 'car_washing', 
    title: 'Car Washing', 
    icon: 'car-outline' as keyof typeof Ionicons.glyphMap,
    color: '#3b82f6'
  },
  { 
    id: 'landscaping', 
    title: 'Landscaping', 
    icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
    color: '#f59e0b'
  },
];

export default function ServicesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState('house_cleaning');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServices();
  }, [selectedServiceType]);

  const loadServices = async () => {
    try {
      const [packagesResponse, addonsResponse] = await Promise.all([
        axios.get(`/services/packages?service_type=${selectedServiceType}`),
        axios.get(`/services/addons?service_type=${selectedServiceType}`)
      ]);
      
      setPackages(packagesResponse.data);
      setAddons(addonsResponse.data);
    } catch (error) {
      console.error('Error loading services:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadServices();
  };

  const handlePackagePress = (packageItem: ServicePackage) => {
    if (user?.role !== 'customer') {
      Alert.alert(
        'Access Restricted',
        'Only customers can book services. Please create a customer account.'
      );
      return;
    }

    router.push({
      pathname: '/booking/create',
      params: { 
        serviceType: packageItem.service_type,
        packageId: packageItem.id 
      }
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const currentServiceType = serviceTypes.find(s => s.id === selectedServiceType);

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
          <Text style={styles.title}>Services</Text>
          <Text style={styles.subtitle}>
            Choose from our professional services
          </Text>
        </View>

        {/* Service Type Selector */}
        <View style={styles.serviceTypeContainer}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceTypeScroll}>
            {serviceTypes.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.serviceTypeCard,
                  selectedServiceType === type.id && styles.serviceTypeCardActive,
                  { borderColor: selectedServiceType === type.id ? type.color : '#374151' }
                ]}
                onPress={() => setSelectedServiceType(type.id)}
              >
                <Ionicons 
                  name={type.icon} 
                  size={24} 
                  color={selectedServiceType === type.id ? type.color : '#94a3b8'} 
                />
                <Text style={[
                  styles.serviceTypeTitle,
                  selectedServiceType === type.id && { color: type.color }
                ]}>
                  {type.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Service Packages */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>
            {currentServiceType?.title} Packages
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading packages...</Text>
            </View>
          ) : packages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No packages available</Text>
            </View>
          ) : (
            packages.map((pkg) => (
              <Pressable
                key={pkg.id}
                style={styles.packageCard}
                onPress={() => handlePackagePress(pkg)}
              >
                <View style={styles.packageHeader}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>€{pkg.base_price}</Text>
                    <Text style={styles.currency}>EUR</Text>
                  </View>
                </View>
                
                <Text style={styles.packageDescription}>{pkg.description}</Text>
                
                <View style={styles.packageFooter}>
                  <View style={styles.durationContainer}>
                    <Ionicons name="time-outline" size={16} color="#94a3b8" />
                    <Text style={styles.duration}>
                      {formatDuration(pkg.duration_minutes)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Add-ons */}
        {addons.length > 0 && (
          <View style={styles.addonsSection}>
            <Text style={styles.sectionTitle}>Available Add-ons</Text>
            
            {addons.map((addon) => (
              <View key={addon.id} style={styles.addonCard}>
                <View style={styles.addonContent}>
                  <Text style={styles.addonName}>{addon.name}</Text>
                  <Text style={styles.addonDescription}>{addon.description}</Text>
                </View>
                <Text style={styles.addonPrice}>+€{addon.price}</Text>
              </View>
            ))}
            
            <Text style={styles.addonNote}>
              Add-ons can be selected during the booking process
            </Text>
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
  serviceTypeContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  serviceTypeScroll: {
    flexDirection: 'row',
  },
  serviceTypeCard: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#374151',
  },
  serviceTypeCardActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  serviceTypeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  packagesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
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
    paddingVertical: 40,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  packageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
    marginRight: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  currency: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  packageDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
  },
  addonsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
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
  addonContent: {
    flex: 1,
  },
  addonName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  addonDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 18,
  },
  addonPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  addonNote: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});