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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

const services = [
  {
    id: 'house_cleaning',
    title: 'House Cleaning',
    description: 'Professional cleaning services for your home',
    icon: 'home-outline' as keyof typeof Ionicons.glyphMap,
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
  },
  {
    id: 'car_washing',
    title: 'Car Washing',
    description: 'Complete car care and detailing services',
    icon: 'car-outline' as keyof typeof Ionicons.glyphMap,
    color: '#3b82f6',
    gradient: ['#3b82f6', '#2563eb'],
  },
  {
    id: 'landscaping',
    title: 'Landscaping',
    description: 'Garden maintenance and lawn care',
    icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const handleServicePress = (serviceType: string) => {
    if (user?.role !== 'customer') {
      Alert.alert(
        'Access Restricted',
        'Only customers can book services. Please create a customer account.'
      );
      return;
    }

    router.push({
      pathname: '/booking/create',
      params: { serviceType }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user?.full_name || 'Welcome'}</Text>
          </View>
          <Pressable style={styles.locationButton}>
            <Ionicons name="location-outline" size={20} color="#3b82f6" />
            <Text style={styles.locationText}>Ljubljana</Text>
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Trusted Providers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15km</Text>
            <Text style={styles.statLabel}>Free Travel</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8★</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Text style={styles.sectionSubtitle}>
            Professional services delivered to your doorstep
          </Text>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <Pressable
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service.id)}
            >
              <LinearGradient
                colors={service.gradient}
                style={styles.serviceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.serviceContent}>
                  <Ionicons 
                    name={service.icon} 
                    size={32} 
                    color="#ffffff" 
                  />
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable 
            style={styles.actionCard}
            onPress={() => router.push('/bookings')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View My Bookings</Text>
              <Text style={styles.actionDescription}>
                Check your upcoming and past appointments
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </Pressable>

          <Pressable 
            style={styles.actionCard}
            onPress={() => router.push('/services')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="search-outline" size={24} color="#10b981" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Browse All Services</Text>
              <Text style={styles.actionDescription}>
                Explore our complete range of services
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </Pressable>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  locationText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  servicesGrid: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  serviceCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceGradient: {
    padding: 20,
  },
  serviceContent: {
    alignItems: 'flex-start',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 18,
  },
});