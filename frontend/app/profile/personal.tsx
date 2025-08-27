import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function PersonalInformationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '1990-01-01',
    gender: 'prefer_not_to_say',
    nationality: 'Slovenia',
    language: 'English',
    timezone: 'Europe/Ljubljana',
    address: 'Ljubljana, Slovenia',
  });

  const genderOptions = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'non_binary', label: 'Non-binary' },
    { id: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  const handleSave = () => {
    Alert.alert('Success', 'Your personal information has been updated successfully!');
    setIsEditing(false);
  };

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Photo upload functionality will be available soon.');
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
            <Text style={styles.title}>Personal Information</Text>
            <Pressable 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </Pressable>
          </View>

          {/* Profile Photo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <View style={styles.photoContainer}>
              <View style={styles.photoWrapper}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                {isEditing && (
                  <Pressable style={styles.photoEditButton} onPress={handleUploadPhoto}>
                    <Ionicons name="camera" size={16} color="#ffffff" />
                  </Pressable>
                )}
              </View>
              <View style={styles.photoInfo}>
                <Text style={styles.photoName}>{user?.full_name}</Text>
                <Text style={styles.photoRole}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Account
                </Text>
              </View>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.fullName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                editable={isEditing}
                placeholder="Enter your full name"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                editable={isEditing}
                placeholder="Enter your email"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                editable={isEditing}
                placeholder="+386 XX XXX XXX"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
                editable={isEditing}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          {/* Personal Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioGroup}>
                {genderOptions.map((option) => (
                  <Pressable
                    key={option.id}
                    style={styles.radioOption}
                    onPress={() => isEditing && setFormData(prev => ({ ...prev, gender: option.id }))}
                    disabled={!isEditing}
                  >
                    <View style={[
                      styles.radioCircle,
                      formData.gender === option.id && styles.radioCircleSelected,
                      !isEditing && styles.radioDisabled
                    ]}>
                      {formData.gender === option.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={[styles.radioLabel, !isEditing && styles.textDisabled]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nationality</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.nationality}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nationality: text }))}
                editable={isEditing}
                placeholder="Your nationality"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Language</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.language}
                onChangeText={(text) => setFormData(prev => ({ ...prev, language: text }))}
                editable={isEditing}
                placeholder="Primary language"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Timezone</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.timezone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, timezone: text }))}
                editable={isEditing}
                placeholder="Your timezone"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          {/* Account Verification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Verification</Text>
            
            <View style={styles.verificationCard}>
              <View style={styles.verificationItem}>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationTitle}>Email Verified</Text>
                  <Text style={styles.verificationDescription}>Your email address has been verified</Text>
                </View>
                <View style={styles.verificationBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                </View>
              </View>

              <View style={styles.verificationItem}>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationTitle}>Phone Verification</Text>
                  <Text style={styles.verificationDescription}>Verify your phone number for enhanced security</Text>
                </View>
                <Pressable style={styles.verifyButton}>
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </Pressable>
              </View>

              <View style={styles.verificationItem}>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationTitle}>Identity Verification</Text>
                  <Text style={styles.verificationDescription}>Upload ID document for full verification</Text>
                </View>
                <Pressable style={styles.verifyButton}>
                  <Text style={styles.verifyButtonText}>Upload ID</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Save Button */}
          {isEditing && (
            <View style={styles.section}>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          )}

          {/* Account Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account ID</Text>
                <Text style={styles.infoValue}>{user?.id?.slice(-8) || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <Text style={[styles.infoValue, { color: '#10b981' }]}>Active</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data Region</Text>
                <Text style={styles.infoValue}>EU (GDPR Compliant)</Text>
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
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
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
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  photoInfo: {
    flex: 1,
  },
  photoName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  photoRole: {
    fontSize: 14,
    color: '#94a3b8',
  },
  inputGroup: {
    marginBottom: 20,
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
  inputDisabled: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#3b82f6',
  },
  radioDisabled: {
    opacity: 0.5,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  radioLabel: {
    fontSize: 16,
    color: '#f8fafc',
  },
  textDisabled: {
    color: '#94a3b8',
  },
  verificationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  verificationDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  verificationBadge: {
    padding: 4,
  },
  verifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  verifyButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '500',
  },
});