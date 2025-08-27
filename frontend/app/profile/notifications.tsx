import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  category: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'booking_updates',
      title: 'Booking Updates',
      description: 'Notifications about booking confirmations, changes, and completions',
      category: 'Service',
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      icon: 'calendar-outline',
      color: '#3b82f6',
    },
    {
      id: 'payment_receipts',
      title: 'Payment Receipts',
      description: 'Payment confirmations, receipts, and refund notifications',
      category: 'Financial',
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      icon: 'card-outline',
      color: '#10b981',
    },
    {
      id: 'provider_messages',
      title: 'Provider Messages',
      description: 'Messages and communications from service providers',
      category: 'Communication',
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      icon: 'chatbubble-outline',
      color: '#f59e0b',
    },
    {
      id: 'appointment_reminders',
      title: 'Appointment Reminders',
      description: 'Reminders 24h and 2h before scheduled services',
      category: 'Service',
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      icon: 'alarm-outline',
      color: '#ef4444',
    },
    {
      id: 'promotional_offers',
      title: 'Promotional Offers',
      description: 'Special deals, discounts, and promotional campaigns',
      category: 'Marketing',
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: false,
      icon: 'gift-outline',
      color: '#8b5cf6',
    },
    {
      id: 'system_updates',
      title: 'System Updates',
      description: 'App updates, maintenance notifications, and system announcements',
      category: 'System',
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      icon: 'notifications-outline',
      color: '#06b6d4',
    },
    {
      id: 'security_alerts',
      title: 'Security Alerts',
      description: 'Login attempts, password changes, and security notifications',
      category: 'Security',
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      icon: 'shield-outline',
      color: '#dc2626',
    },
    {
      id: 'weekly_summary',
      title: 'Weekly Summary',
      description: 'Weekly digest of your bookings, payments, and activity',
      category: 'Summary',
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: false,
      icon: 'stats-chart-outline',
      color: '#059669',
    },
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    doNotDisturb: false,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  const updateNotificationSetting = (id: string, type: 'push' | 'email' | 'sms', value: boolean) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === id) {
        switch (type) {
          case 'push':
            return { ...notification, pushEnabled: value };
          case 'email':
            return { ...notification, emailEnabled: value };
          case 'sms':
            return { ...notification, smsEnabled: value };
          default:
            return notification;
        }
      }
      return notification;
    }));
  };

  const handleTestNotification = () => {
    Alert.alert('Test Notification', 'A test notification has been sent to your device!');
  };

  const categories = ['Service', 'Financial', 'Communication', 'Marketing', 'System', 'Security', 'Summary'];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#f8fafc" />
            </Pressable>
            <Text style={styles.title}>Notifications</Text>
            <Pressable 
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <Ionicons name="send-outline" size={16} color="#3b82f6" />
            </Pressable>
          </View>

          {/* Global Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Global Settings</Text>
            
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="moon-outline" size={20} color="#8b5cf6" />
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Do Not Disturb</Text>
                    <Text style={styles.settingDescription}>Disable all notifications temporarily</Text>
                  </View>
                </View>
                <Switch
                  value={globalSettings.doNotDisturb}
                  onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, doNotDisturb: value }))}
                  trackColor={{ false: '#374151', true: '#8b5cf6' }}
                  thumbColor={globalSettings.doNotDisturb ? '#ffffff' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="time-outline" size={20} color="#f59e0b" />
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Quiet Hours</Text>
                    <Text style={styles.settingDescription}>
                      {globalSettings.quietHoursEnabled 
                        ? `${globalSettings.quietHoursStart} - ${globalSettings.quietHoursEnd}` 
                        : 'Disabled'
                      }
                    </Text>
                  </View>
                </View>
                <Switch
                  value={globalSettings.quietHoursEnabled}
                  onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, quietHoursEnabled: value }))}
                  trackColor={{ false: '#374151', true: '#f59e0b' }}
                  thumbColor={globalSettings.quietHoursEnabled ? '#ffffff' : '#9ca3af'}
                />
              </View>
            </View>
          </View>

          {/* Delivery Methods Info */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Notification Channels</Text>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelText}>📱 Push: Instant mobile notifications</Text>
                  <Text style={styles.channelText}>📧 Email: Detailed email notifications</Text>
                  <Text style={styles.channelText}>💬 SMS: Critical alerts only (charges may apply)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notification Categories */}
          {categories.map((category) => {
            const categoryNotifications = notifications.filter(n => n.category === category);
            
            return (
              <View key={category} style={styles.section}>
                <Text style={styles.categoryTitle}>{category} Notifications</Text>
                
                <View style={styles.notificationsCard}>
                  {categoryNotifications.map((notification) => (
                    <View key={notification.id} style={styles.notificationItem}>
                      <View style={styles.notificationHeader}>
                        <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}20` }]}>
                          <Ionicons name={notification.icon} size={20} color={notification.color} />
                        </View>
                        <View style={styles.notificationInfo}>
                          <Text style={styles.notificationTitle}>{notification.title}</Text>
                          <Text style={styles.notificationDescription}>{notification.description}</Text>
                        </View>
                      </View>

                      <View style={styles.notificationControls}>
                        <View style={styles.controlItem}>
                          <Ionicons name="phone-portrait-outline" size={16} color="#94a3b8" />
                          <Text style={styles.controlLabel}>Push</Text>
                          <Switch
                            value={notification.pushEnabled}
                            onValueChange={(value) => updateNotificationSetting(notification.id, 'push', value)}
                            trackColor={{ false: '#374151', true: notification.color }}
                            thumbColor={notification.pushEnabled ? '#ffffff' : '#9ca3af'}
                            style={styles.controlSwitch}
                          />
                        </View>

                        <View style={styles.controlItem}>
                          <Ionicons name="mail-outline" size={16} color="#94a3b8" />
                          <Text style={styles.controlLabel}>Email</Text>
                          <Switch
                            value={notification.emailEnabled}
                            onValueChange={(value) => updateNotificationSetting(notification.id, 'email', value)}
                            trackColor={{ false: '#374151', true: notification.color }}
                            thumbColor={notification.emailEnabled ? '#ffffff' : '#9ca3af'}
                            style={styles.controlSwitch}
                          />
                        </View>

                        <View style={styles.controlItem}>
                          <Ionicons name="chatbubble-outline" size={16} color="#94a3b8" />
                          <Text style={styles.controlLabel}>SMS</Text>
                          <Switch
                            value={notification.smsEnabled}
                            onValueChange={(value) => updateNotificationSetting(notification.id, 'sms', value)}
                            trackColor={{ false: '#374151', true: notification.color }}
                            thumbColor={notification.smsEnabled ? '#ffffff' : '#9ca3af'}
                            style={styles.controlSwitch}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {/* Advanced Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Settings</Text>
            
            <View style={styles.advancedCard}>
              <Pressable style={styles.advancedItem}>
                <Ionicons name="settings-outline" size={20} color="#3b82f6" />
                <View style={styles.advancedContent}>
                  <Text style={styles.advancedTitle}>Notification Sound</Text>
                  <Text style={styles.advancedDescription}>Default notification sound</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.advancedItem}>
                <Ionicons name="vibrate-outline" size={20} color="#10b981" />
                <View style={styles.advancedContent}>
                  <Text style={styles.advancedTitle}>Vibration Pattern</Text>
                  <Text style={styles.advancedDescription}>Default vibration pattern</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.advancedItem}>
                <Ionicons name="language-outline" size={20} color="#f59e0b" />
                <View style={styles.advancedContent}>
                  <Text style={styles.advancedTitle}>Language & Localization</Text>
                  <Text style={styles.advancedDescription}>Notification language preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.advancedItem}>
                <Ionicons name="time-outline" size={20} color="#8b5cf6" />
                <View style={styles.advancedContent}>
                  <Text style={styles.advancedTitle}>Timezone Settings</Text>
                  <Text style={styles.advancedDescription}>Europe/Ljubljana (UTC+1)</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* Privacy Notice */}
          <View style={styles.section}>
            <View style={styles.privacyCard}>
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>Privacy & Data Protection</Text>
                <Text style={styles.privacyDescription}>
                  We respect your privacy. Notification preferences are stored securely and you can change them anytime. 
                  SMS notifications may incur carrier charges. We comply with GDPR and data protection regulations.
                </Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
    textAlign: 'center',
  },
  testButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  channelInfo: {
    gap: 4,
  },
  channelText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  notificationsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  notificationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  controlLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
    marginRight: 8,
    flex: 1,
  },
  controlSwitch: {
    transform: [{ scale: 0.8 }],
  },
  advancedCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  advancedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  advancedContent: {
    marginLeft: 12,
    flex: 1,
  },
  advancedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  advancedDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  privacyText: {
    marginLeft: 12,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});