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

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  nickname: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
  bankName?: string;
  accountEnding?: string;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      nickname: 'Primary Card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    {
      id: '2',
      type: 'paypal',
      nickname: 'PayPal Account',
      email: 'john.doe@example.com',
      isDefault: false,
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'card' | 'paypal' | 'bank'>('card');

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'Payment method integration will be available soon.');
    setShowAddModal(false);
  };

  const handleEditPaymentMethod = (methodId: string) => {
    Alert.alert('Edit Payment Method', 'Payment method editing will be available soon.');
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
            Alert.alert('Success', 'Payment method removed successfully.');
          },
        },
      ]
    );
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId,
    })));
    Alert.alert('Success', 'Default payment method updated.');
  };

  const getPaymentIcon = (type: string, brand?: string) => {
    switch (type) {
      case 'card':
        return brand === 'Visa' ? 'card' : brand === 'Mastercard' ? 'card' : 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'bank':
        return 'business-outline';
      default:
        return 'card-outline';
    }
  };

  const getCardBrandColor = (brand?: string) => {
    switch (brand) {
      case 'Visa': return '#1a1f71';
      case 'Mastercard': return '#eb001b';
      case 'American Express': return '#006fcf';
      default: return '#3b82f6';
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
            <Text style={styles.title}>Payment Methods</Text>
            <Pressable 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={20} color="#3b82f6" />
            </Pressable>
          </View>

          {/* Security Info */}
          <View style={styles.section}>
            <View style={styles.securityCard}>
              <Ionicons name="shield-checkmark" size={24} color="#10b981" />
              <View style={styles.securityText}>
                <Text style={styles.securityTitle}>Secure Payment Processing</Text>
                <Text style={styles.securityDescription}>
                  All payment information is encrypted and processed securely through Stripe. We never store your complete card details.
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Methods List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Payment Methods ({paymentMethods.length})</Text>
            
            {paymentMethods.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="card-outline" size={48} color="#374151" />
                <Text style={styles.emptyTitle}>No Payment Methods</Text>
                <Text style={styles.emptyText}>
                  Add a payment method to make booking services faster and easier.
                </Text>
                <Pressable 
                  style={styles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Text style={styles.emptyButtonText}>Add Payment Method</Text>
                </Pressable>
              </View>
            ) : (
              paymentMethods.map((method) => (
                <View key={method.id} style={styles.paymentCard}>
                  <View style={styles.paymentHeader}>
                    <View style={[
                      styles.paymentIcon,
                      { backgroundColor: method.type === 'card' ? getCardBrandColor(method.brand) : '#3b82f6' }
                    ]}>
                      <Ionicons 
                        name={getPaymentIcon(method.type, method.brand) as keyof typeof Ionicons.glyphMap} 
                        size={24} 
                        color="#ffffff" 
                      />
                    </View>
                    <View style={styles.paymentInfo}>
                      <View style={styles.paymentTitleRow}>
                        <Text style={styles.paymentNickname}>{method.nickname}</Text>
                        {method.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      {method.type === 'card' && (
                        <>
                          <Text style={styles.paymentDetails}>
                            {method.brand} •••• {method.last4}
                          </Text>
                          <Text style={styles.paymentExpiry}>
                            Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                          </Text>
                        </>
                      )}
                      {method.type === 'paypal' && (
                        <Text style={styles.paymentDetails}>{method.email}</Text>
                      )}
                      {method.type === 'bank' && (
                        <>
                          <Text style={styles.paymentDetails}>{method.bankName}</Text>
                          <Text style={styles.paymentDetails}>•••• {method.accountEnding}</Text>
                        </>
                      )}
                    </View>
                  </View>

                  <View style={styles.paymentActions}>
                    {!method.isDefault && (
                      <Pressable 
                        style={styles.actionButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Ionicons name="star-outline" size={16} color="#f59e0b" />
                        <Text style={styles.actionText}>Set Default</Text>
                      </Pressable>
                    )}
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleEditPaymentMethod(method.id)}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#3b82f6" />
                      <Text style={styles.actionText}>Edit</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleDeletePaymentMethod(method.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      <Text style={[styles.actionText, { color: '#ef4444' }]}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Payment Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Features</Text>
            
            <View style={styles.featuresCard}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Secure Encryption</Text>
                  <Text style={styles.featureDescription}>256-bit SSL encryption for all transactions</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="flash-outline" size={20} color="#f59e0b" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Instant Processing</Text>
                  <Text style={styles.featureDescription}>Payments processed in real-time</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="refresh-outline" size={20} color="#3b82f6" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Easy Refunds</Text>
                  <Text style={styles.featureDescription}>Hassle-free refund processing</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="receipt-outline" size={20} color="#8b5cf6" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Digital Receipts</Text>
                  <Text style={styles.featureDescription}>Automatic receipt generation and storage</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Billing History */}
          <View style={styles.section}>
            <View style={styles.billingHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Pressable style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>
            
            <View style={styles.transactionCard}>
              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>House Cleaning Service</Text>
                  <Text style={styles.transactionDate}>August 25, 2025</Text>
                </View>
                <Text style={styles.transactionAmount}>€75.00</Text>
              </View>

              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Car Washing & Detailing</Text>
                  <Text style={styles.transactionDate}>August 20, 2025</Text>
                </View>
                <Text style={styles.transactionAmount}>€45.00</Text>
              </View>

              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Garden Maintenance</Text>
                  <Text style={styles.transactionDate}>August 15, 2025</Text>
                </View>
                <Text style={styles.transactionAmount}>€65.00</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Add Payment Method Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Payment Method</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.paymentTypeSection}>
                  <Text style={styles.modalSectionTitle}>Payment Type</Text>
                  <View style={styles.paymentTypes}>
                    {[
                      { type: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
                      { type: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
                      { type: 'bank', label: 'Bank Transfer', icon: 'business-outline' },
                    ].map((option) => (
                      <Pressable
                        key={option.type}
                        style={[
                          styles.paymentTypeOption,
                          selectedPaymentType === option.type && styles.paymentTypeOptionActive
                        ]}
                        onPress={() => setSelectedPaymentType(option.type as any)}
                      >
                        <Ionicons 
                          name={option.icon as keyof typeof Ionicons.glyphMap} 
                          size={24} 
                          color={selectedPaymentType === option.type ? '#3b82f6' : '#94a3b8'} 
                        />
                        <Text style={[
                          styles.paymentTypeLabel,
                          selectedPaymentType === option.type && styles.paymentTypeLabelActive
                        ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {selectedPaymentType === 'card' && (
                  <View style={styles.cardForm}>
                    <Text style={styles.modalSectionTitle}>Card Information</Text>
                    <View style={styles.comingSoonCard}>
                      <Ionicons name="construct-outline" size={32} color="#f59e0b" />
                      <Text style={styles.comingSoonTitle}>Secure Card Integration</Text>
                      <Text style={styles.comingSoonText}>
                        Stripe secure card input will be integrated here for PCI-compliant card data collection.
                      </Text>
                    </View>
                  </View>
                )}

                {selectedPaymentType === 'paypal' && (
                  <View style={styles.paypalForm}>
                    <Text style={styles.modalSectionTitle}>PayPal Integration</Text>
                    <View style={styles.comingSoonCard}>
                      <Ionicons name="logo-paypal" size={32} color="#003087" />
                      <Text style={styles.comingSoonTitle}>PayPal SDK Integration</Text>
                      <Text style={styles.comingSoonText}>
                        PayPal payment SDK will be integrated for seamless PayPal payments.
                      </Text>
                    </View>
                  </View>
                )}

                {selectedPaymentType === 'bank' && (
                  <View style={styles.bankForm}>
                    <Text style={styles.modalSectionTitle}>Bank Transfer</Text>
                    <View style={styles.comingSoonCard}>
                      <Ionicons name="business-outline" size={32} color="#10b981" />
                      <Text style={styles.comingSoonTitle}>SEPA Bank Integration</Text>
                      <Text style={styles.comingSoonText}>
                        SEPA direct debit and bank transfer integration will be available for EU customers.
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={styles.addMethodButton}
                  onPress={handleAddPaymentMethod}
                >
                  <Text style={styles.addMethodButtonText}>Add Method</Text>
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
  securityCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  securityText: {
    marginLeft: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  securityDescription: {
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
  paymentCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentNickname: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
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
  paymentDetails: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  paymentExpiry: {
    fontSize: 12,
    color: '#64748b',
  },
  paymentActions: {
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
  featuresCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureContent: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  billingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
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
  paymentTypeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  paymentTypes: {
    gap: 8,
  },
  paymentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  paymentTypeOptionActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  paymentTypeLabel: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 12,
  },
  paymentTypeLabelActive: {
    color: '#3b82f6',
  },
  cardForm: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paypalForm: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bankForm: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  comingSoonCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
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
  addMethodButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addMethodButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});