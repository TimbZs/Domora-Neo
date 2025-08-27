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

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const adminFeatures = [
    {
      id: 'bookings',
      title: 'Manage Bookings',
      description: 'View and manage all service bookings',
      icon: 'calendar-outline',
      color: '#3b82f6',
    },
    {
      id: 'providers',
      title: 'Provider Management',
      description: 'Verify and manage service providers',
      icon: 'people-outline',
      color: '#10b981',
    },
    {
      id: 'customers',
      title: 'Customer Support',
      description: 'Handle customer inquiries and issues',
      icon: 'help-circle-outline',
      color: '#f59e0b',
    },
    {
      id: 'payments',
      title: 'Payment Management',
      description: 'Monitor payments and payouts',
      icon: 'card-outline',
      color: '#8b5cf6',
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'View business metrics and insights',
      icon: 'bar-chart-outline',
      color: '#ef4444',
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: 'settings-outline',
      color: '#06b6d4',
    },
  ];

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    // In a real app, this would load from API
    setStats({
      totalBookings: 1247,
      totalProviders: 85,
      totalCustomers: 892,
      totalRevenue: 45680.50,
    });
  };

  const handleFeaturePress = (featureId: string) => {
    Alert.alert(
      'Coming Soon',
      `${adminFeatures.find(f => f.id === featureId)?.title} will be available in a future update.`
    );
  };

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <Ionicons name="lock-closed" size={64} color="#ef4444" />
            <Text style={styles.errorTitle}>Access Denied</Text>
            <Text style={styles.errorText}>Only administrators can access this panel</Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
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
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#f8fafc" />
            </Pressable>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Admin Dashboard</Text>
              <Text style={styles.subtitle}>Platform Management & Analytics</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color="#3b82f6" />
                <Text style={styles.statNumber}>{stats.totalBookings}</Text>
                <Text style={styles.statLabel}>Total Bookings</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color="#10b981" />
                <Text style={styles.statNumber}>{stats.totalProviders}</Text>
                <Text style={styles.statLabel}>Providers</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="person" size={24} color="#f59e0b" />
                <Text style={styles.statNumber}>{stats.totalCustomers}</Text>
                <Text style={styles.statLabel}>Customers</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="wallet" size={24} color="#8b5cf6" />
                <Text style={styles.statNumber}>€{stats.totalRevenue.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
            </View>
          </View>

          {/* Admin Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Administration</Text>
            
            <View style={styles.featuresGrid}>
              {adminFeatures.map((feature) => (
                <Pressable
                  key={feature.id}
                  style={styles.featureCard}
                  onPress={() => handleFeaturePress(feature.id)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                    <Ionicons 
                      name={feature.icon as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color={feature.color} 
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            <View style={styles.activityCard}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="person-add" size={16} color="#10b981" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>New provider application</Text>
                  <Text style={styles.activityTime}>2 minutes ago</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="calendar" size={16} color="#3b82f6" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Booking completed</Text>
                  <Text style={styles.activityTime}>15 minutes ago</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="card" size={16} color="#f59e0b" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Payment processed</Text>
                  <Text style={styles.activityTime}>32 minutes ago</Text>
                </View>
              </View>
            </View>
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
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
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
    lineHeight: 18,
  },
  activityContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});