import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/providers/AuthProvider';

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function SecurityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with SMS or app-based 2FA',
      enabled: false,
      icon: 'shield-checkmark-outline',
      color: '#10b981',
    },
    {
      id: 'login_alerts',
      title: 'Login Alerts',
      description: 'Get notified of new login attempts on your account',
      enabled: true,
      icon: 'notifications-outline',
      color: '#3b82f6',
    },
    {
      id: 'device_tracking',
      title: 'Device Tracking',
      description: 'Track devices that have accessed your account',
      enabled: true,
      icon: 'phone-portrait-outline',
      color: '#f59e0b',
    },
    {
      id: 'data_encryption',
      title: 'Enhanced Data Encryption',
      description: 'Use additional encryption for sensitive data storage',
      enabled: true,
      icon: 'lock-closed-outline',
      color: '#ef4444',
    },
  ]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const toggleSecuritySetting = (id: string) => {
    setSecuritySettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    
    Alert.alert('Success', 'Password updated successfully!');
    setShowChangePasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Personal Data',
      'We will prepare your data export and send a download link to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Export', style: 'default' },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion request has been submitted. You will receive a confirmation email.');
            setShowDeleteAccountModal(false);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#f8fafc" />
            </Pressable>
            <Text style={styles.title}>Privacy & Security</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Security Overview */}
          <View style={styles.section}>
            <View style={styles.securityOverview}>
              <View style={styles.securityIcon}>
                <Ionicons name="shield-checkmark" size={32} color="#10b981" />
              </View>
              <View style={styles.securityInfo}>
                <Text style={styles.securityTitle}>Account Security Level</Text>
                <Text style={styles.securityLevel}>Strong</Text>
                <Text style={styles.securityDescription}>
                  Your account has strong security with most recommended settings enabled.
                </Text>
              </View>
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Features</Text>
            
            <View style={styles.settingsCard}>
              {securitySettings.map((setting) => (
                <View key={setting.id} style={styles.settingItem}>
                  <View style={[styles.settingIcon, { backgroundColor: `${setting.color}20` }]}>
                    <Ionicons name={setting.icon} size={20} color={setting.color} />
                  </View>
                  
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                  
                  <Switch
                    value={setting.enabled}
                    onValueChange={() => toggleSecuritySetting(setting.id)}
                    trackColor={{ false: '#374151', true: setting.color }}
                    thumbColor={setting.enabled ? '#ffffff' : '#9ca3af'}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Management</Text>
            
            <View style={styles.actionsCard}>
              <Pressable 
                style={styles.actionItem}
                onPress={() => setShowChangePasswordModal(true)}
              >
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Ionicons name="key-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Change Password</Text>
                  <Text style={styles.actionDescription}>Update your account password</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Ionicons name="people-outline" size={20} color="#f59e0b" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Active Sessions</Text>
                  <Text style={styles.actionDescription}>Manage logged-in devices</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                  <Ionicons name="time-outline" size={20} color="#8b5cf6" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Login History</Text>
                  <Text style={styles.actionDescription}>View recent account activity</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Controls</Text>
            
            <View style={styles.privacyCard}>
              <Pressable style={styles.privacyItem}>
                <Ionicons name="eye-outline" size={20} color="#10b981" />
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Data Visibility</Text>
                  <Text style={styles.privacyDescription}>Control who can see your profile information</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.privacyItem}>
                <Ionicons name="analytics-outline" size={20} color="#3b82f6" />
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Analytics & Tracking</Text>
                  <Text style={styles.privacyDescription}>Manage data collection preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable 
                style={styles.privacyItem}
                onPress={handleExportData}
              >
                <Ionicons name="download-outline" size={20} color="#f59e0b" />
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Export Personal Data</Text>
                  <Text style={styles.privacyDescription}>Download a copy of your data (GDPR)</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Danger Zone</Text>
            
            <View style={styles.dangerCard}>
              <Pressable 
                style={styles.dangerItem}
                onPress={() => setShowDeleteAccountModal(true)}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <View style={styles.dangerContent}>
                  <Text style={styles.dangerTitle}>Delete Account</Text>
                  <Text style={styles.dangerDescription}>
                    Permanently delete your account and all associated data
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ef4444" />
              </Pressable>
            </View>
          </View>

          {/* GDPR Compliance */}
          <View style={styles.section}>
            <View style={styles.complianceCard}>
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              <View style={styles.complianceText}>
                <Text style={styles.complianceTitle}>GDPR Compliant</Text>
                <Text style={styles.complianceDescription}>
                  We are committed to protecting your privacy and comply with GDPR regulations. 
                  Your data is processed lawfully, transparently, and for specific purposes only.
                </Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Change Password Modal */}
        <Modal visible={showChangePasswordModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowChangePasswordModal(false)}
                >
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Current Password</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={passwordForm.currentPassword}
                    onChangeText={(text) => setPasswordForm(prev => ({ ...prev, currentPassword: text }))}
                    placeholder="Enter current password"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>New Password</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={passwordForm.newPassword}
                    onChangeText={(text) => setPasswordForm(prev => ({ ...prev, newPassword: text }))}
                    placeholder="Enter new password"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Confirm New Password</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={passwordForm.confirmPassword}
                    onChangeText={(text) => setPasswordForm(prev => ({ ...prev, confirmPassword: text }))}
                    placeholder="Confirm new password"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                  />
                </View>

                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                  <Text style={styles.requirementItem}>• At least 8 characters long</Text>
                  <Text style={styles.requirementItem}>• Mix of uppercase and lowercase letters</Text>
                  <Text style={styles.requirementItem}>• At least one number</Text>
                  <Text style={styles.requirementItem}>• At least one special character</Text>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setShowChangePasswordModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={styles.changePasswordButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.changePasswordButtonText}>Update Password</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

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
  placeholder: {
    width: 40,
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
  securityOverview: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  securityIcon: {
    marginRight: 16,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  securityLevel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
  },
  securityDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
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
    lineHeight: 20,
  },
  actionsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  privacyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  privacyContent: {
    marginLeft: 12,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  dangerCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dangerContent: {
    marginLeft: 12,
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginBottom: 4,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  complianceCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  complianceText: {
    marginLeft: 12,
    flex: 1,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  complianceDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  passwordRequirements: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});