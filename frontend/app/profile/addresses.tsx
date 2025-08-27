import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Address {
  id: string;
  nickname: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      nickname: 'Home',
      street: 'Trubarjeva cesta 25',
      city: 'Ljubljana',
      postalCode: '1000',
      country: 'Slovenia',
      isDefault: true,
      type: 'home',
    },
    {
      id: '2',
      nickname: 'Office',
      street: 'Slovenska cesta 50',
      city: 'Ljubljana',
      postalCode: '1000',
      country: 'Slovenia',
      isDefault: false,
      type: 'work',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    nickname: '',
    street: '',
    city: 'Ljubljana',
    postalCode: '',
    country: 'Slovenia',
    type: 'home' as 'home' | 'work' | 'other',
  });

  const handleSaveAddress = () => {
    if (!newAddress.nickname || !newAddress.street || !newAddress.postalCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...newAddress, id: addr.id }
          : addr
      ));
    } else {
      // Add new address
      const address: Address = {
        ...newAddress,
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
      };
      setAddresses(prev => [...prev, address]);
    }

    setShowAddModal(false);
    setEditingAddress(null);
    setNewAddress({
      nickname: '',
      street: '',
      city: 'Ljubljana',
      postalCode: '',
      country: 'Slovenia',
      type: 'home',
    });
    
    Alert.alert('Success', 'Address saved successfully!');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      nickname: address.nickname,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      type: address.type,
    });
    setShowAddModal(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== addressId));
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    })));
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return 'home-outline';
      case 'work': return 'business-outline';
      default: return 'location-outline';
    }
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
            <Text style={styles.title}>Saved Addresses</Text>
            <Pressable 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={20} color="#3b82f6" />
            </Pressable>
          </View>

          {/* Info Card */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#3b82f6" />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Quick Service Booking</Text>
                <Text style={styles.infoDescription}>
                  Save your frequently used addresses for faster booking. Your default address will be pre-selected when booking services.
                </Text>
              </View>
            </View>
          </View>

          {/* Addresses List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Addresses ({addresses.length})</Text>
            
            {addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={48} color="#374151" />
                <Text style={styles.emptyTitle}>No Saved Addresses</Text>
                <Text style={styles.emptyText}>
                  Add your first address to make booking services faster and easier.
                </Text>
                <Pressable 
                  style={styles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Text style={styles.emptyButtonText}>Add Address</Text>
                </Pressable>
              </View>
            ) : (
              addresses.map((address) => (
                <View key={address.id} style={styles.addressCard}>
                  <View style={styles.addressHeader}>
                    <View style={styles.addressInfo}>
                      <View style={styles.addressTitleRow}>
                        <Ionicons 
                          name={getAddressTypeIcon(address.type) as keyof typeof Ionicons.glyphMap} 
                          size={20} 
                          color="#3b82f6" 
                        />
                        <Text style={styles.addressNickname}>{address.nickname}</Text>
                        {address.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.addressText}>
                        {address.street}
                      </Text>
                      <Text style={styles.addressText}>
                        {address.city}, {address.postalCode}
                      </Text>
                      <Text style={styles.addressText}>
                        {address.country}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.addressActions}>
                    {!address.isDefault && (
                      <Pressable 
                        style={styles.actionButton}
                        onPress={() => handleSetDefault(address.id)}
                      >
                        <Ionicons name="star-outline" size={16} color="#f59e0b" />
                        <Text style={styles.actionText}>Set Default</Text>
                      </Pressable>
                    )}
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleEditAddress(address)}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#3b82f6" />
                      <Text style={styles.actionText}>Edit</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Address Guidelines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Guidelines</Text>
            
            <View style={styles.guidelinesCard}>
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.guidelineText}>Use specific street addresses for accurate service delivery</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.guidelineText}>Include apartment/unit numbers when applicable</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.guidelineText}>Verify postal codes for correct service area matching</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.guidelineText}>Set a default address for faster booking</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Add/Edit Address Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => {
                    setShowAddModal(false);
                    setEditingAddress(null);
                  }}
                >
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Address Nickname *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={newAddress.nickname}
                    onChangeText={(text) => setNewAddress(prev => ({ ...prev, nickname: text }))}
                    placeholder="e.g., Home, Office, Mom's House"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Address Type</Text>
                  <View style={styles.typeButtons}>
                    {['home', 'work', 'other'].map((type) => (
                      <Pressable
                        key={type}
                        style={[
                          styles.typeButton,
                          newAddress.type === type && styles.typeButtonActive
                        ]}
                        onPress={() => setNewAddress(prev => ({ ...prev, type: type as any }))}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          newAddress.type === type && styles.typeButtonTextActive
                        ]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Street Address *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={newAddress.street}
                    onChangeText={(text) => setNewAddress(prev => ({ ...prev, street: text }))}
                    placeholder="Street name and number"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.modalRow}>
                  <View style={styles.modalHalf}>
                    <Text style={styles.modalLabel}>City *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={newAddress.city}
                      onChangeText={(text) => setNewAddress(prev => ({ ...prev, city: text }))}
                      placeholder="City"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                  <View style={styles.modalHalf}>
                    <Text style={styles.modalLabel}>Postal Code *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={newAddress.postalCode}
                      onChangeText={(text) => setNewAddress(prev => ({ ...prev, postalCode: text }))}
                      placeholder="1000"
                      placeholderTextColor="#64748b"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Country</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={newAddress.country}
                    onChangeText={(text) => setNewAddress(prev => ({ ...prev, country: text }))}
                    placeholder="Country"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddModal(false);
                    setEditingAddress(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={styles.saveAddressButton}
                  onPress={handleSaveAddress}
                >
                  <Text style={styles.saveAddressButtonText}>
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  addressHeader: {
    marginBottom: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressNickname: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginLeft: 8,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  defaultText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  actionText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  guidelinesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guidelineText: {
    fontSize: 14,
    color: '#f8fafc',
    marginLeft: 12,
    flex: 1,
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
    maxHeight: '90%',
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
    marginBottom: 20,
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
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  modalRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  modalHalf: {
    flex: 1,
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
  saveAddressButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveAddressButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});