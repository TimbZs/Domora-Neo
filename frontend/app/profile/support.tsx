import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/providers/AuthProvider';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void;
}

export default function SupportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium',
  });

  const faqData: FAQItem[] = [
    {
      id: 'booking-1',
      category: 'Booking',
      question: 'How do I book a service?',
      answer: 'You can book a service by browsing our available services, selecting your preferred provider, choosing a time slot, and completing the payment process.',
      helpful: 45,
    },
    {
      id: 'booking-2',
      category: 'Booking',
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled time without any cancellation fee.',
      helpful: 38,
    },
    {
      id: 'payment-1',
      category: 'Payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards, PayPal, and SEPA bank transfers for EU customers. All payments are processed securely through Stripe.',
      helpful: 52,
    },
    {
      id: 'payment-2',
      category: 'Payment',
      question: 'How do refunds work?',
      answer: 'Refunds are processed automatically for eligible cancellations and typically take 3-5 business days to appear in your account.',
      helpful: 29,
    },
    {
      id: 'account-1',
      category: 'Account',
      question: 'How do I update my profile information?',
      answer: 'Go to Profile > Personal Information to update your details, addresses, and preferences.',
      helpful: 33,
    },
    {
      id: 'technical-1',
      category: 'Technical',
      question: 'The app is not working properly. What should I do?',
      answer: 'Try refreshing the app, checking your internet connection, or updating to the latest version. Contact support if the issue persists.',
      helpful: 41,
    },
  ];

  const categories = ['All', 'Booking', 'Payment', 'Account', 'Technical'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const supportOptions: SupportOption[] = [
    {
      id: 'live_chat',
      title: 'Live Chat',
      description: 'Chat with our support team (Available 9 AM - 6 PM CET)',
      icon: 'chatbubble-ellipses-outline',
      color: '#10b981',
      action: () => Alert.alert('Live Chat', 'Connecting to live chat...'),
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: 'mail-outline',
      color: '#3b82f6',
      action: () => setShowContactModal(true),
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: '+386 1 234 5678 (Mon-Fri, 9 AM - 6 PM CET)',
      icon: 'call-outline',
      color: '#f59e0b',
      action: () => Linking.openURL('tel:+38612345678'),
    },
    {
      id: 'emergency',
      title: 'Emergency Support',
      description: 'For urgent issues during active service bookings',
      icon: 'warning-outline',
      color: '#ef4444',
      action: () => Alert.alert('Emergency Support', 'Emergency support is available 24/7 for active bookings.'),
    },
  ];

  const handleContactSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll respond within 24 hours.',
      [{ text: 'OK', onPress: () => setShowContactModal(false) }]
    );
    
    setContactForm({
      subject: '',
      category: 'general',
      message: '',
      priority: 'medium',
    });
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
            <Text style={styles.title}>Help & Support</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Welcome Message */}
          <View style={styles.section}>
            <View style={styles.welcomeCard}>
              <Ionicons name="help-circle" size={32} color="#3b82f6" />
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeTitle}>Hi {user?.full_name?.split(' ')[0]}!</Text>
                <Text style={styles.welcomeDescription}>
                  How can we help you today? Browse our FAQ or contact our support team.
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Support Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            
            <View style={styles.supportGrid}>
              {supportOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.supportCard}
                  onPress={option.action}
                >
                  <View style={[styles.supportIcon, { backgroundColor: `${option.color}20` }]}>
                    <Ionicons name={option.icon} size={24} color={option.color} />
                  </View>
                  <Text style={styles.supportTitle}>{option.title}</Text>
                  <Text style={styles.supportDescription}>{option.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive
                    ]}>
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* FAQ List */}
            <View style={styles.faqList}>
              {filteredFAQs.map((faq) => (
                <View key={faq.id} style={styles.faqCard}>
                  <Pressable
                    style={styles.faqHeader}
                    onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <View style={styles.faqQuestion}>
                      <Text style={styles.faqQuestionText}>{faq.question}</Text>
                      <View style={styles.faqMeta}>
                        <Text style={styles.faqCategory}>{faq.category}</Text>
                        <View style={styles.faqHelpful}>
                          <Ionicons name="thumbs-up-outline" size={12} color="#10b981" />
                          <Text style={styles.faqHelpfulText}>{faq.helpful}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons 
                      name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#94a3b8" 
                    />
                  </Pressable>
                  
                  {expandedFAQ === faq.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      <View style={styles.faqActions}>
                        <Pressable style={styles.faqActionButton}>
                          <Ionicons name="thumbs-up-outline" size={16} color="#10b981" />
                          <Text style={styles.faqActionText}>Helpful</Text>
                        </Pressable>
                        <Pressable style={styles.faqActionButton}>
                          <Ionicons name="thumbs-down-outline" size={16} color="#ef4444" />
                          <Text style={styles.faqActionText}>Not helpful</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Additional Resources */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Resources</Text>
            
            <View style={styles.resourcesCard}>
              <Pressable style={styles.resourceItem}>
                <Ionicons name="book-outline" size={20} color="#8b5cf6" />
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>User Guide</Text>
                  <Text style={styles.resourceDescription}>Complete guide to using Domora</Text>
                </View>
                <Ionicons name="open-outline" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.resourceItem}>
                <Ionicons name="videocam-outline" size={20} color="#f59e0b" />
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Video Tutorials</Text>
                  <Text style={styles.resourceDescription}>Step-by-step video guides</Text>
                </View>
                <Ionicons name="open-outline" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.resourceItem}>
                <Ionicons name="people-outline" size={20} color="#06b6d4" />
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Community Forum</Text>
                  <Text style={styles.resourceDescription}>Connect with other users</Text>
                </View>
                <Ionicons name="open-outline" size={16} color="#94a3b8" />
              </Pressable>

              <Pressable style={styles.resourceItem}>
                <Ionicons name="document-text-outline" size={20} color="#10b981" />
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Terms & Privacy</Text>
                  <Text style={styles.resourceDescription}>Legal documents and policies</Text>
                </View>
                <Ionicons name="open-outline" size={16} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* System Status */}
          <View style={styles.section}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons name="pulse-outline" size={20} color="#10b981" />
                <Text style={styles.statusTitle}>System Status</Text>
                <View style={styles.statusIndicator}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>All systems operational</Text>
                </View>
              </View>
              <Text style={styles.statusDescription}>
                Last updated: {new Date().toLocaleString()}
              </Text>
            </View>
          </View>

        </ScrollView>

        {/* Contact Modal */}
        <Modal visible={showContactModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Contact Support</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowContactModal(false)}
                >
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Subject *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={contactForm.subject}
                    onChangeText={(text) => setContactForm(prev => ({ ...prev, subject: text }))}
                    placeholder="Brief description of your issue"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Category</Text>
                  <View style={styles.categoryButtons}>
                    {['general', 'booking', 'payment', 'technical', 'account'].map((cat) => (
                      <Pressable
                        key={cat}
                        style={[
                          styles.categoryModalButton,
                          contactForm.category === cat && styles.categoryModalButtonActive
                        ]}
                        onPress={() => setContactForm(prev => ({ ...prev, category: cat }))}
                      >
                        <Text style={[
                          styles.categoryModalButtonText,
                          contactForm.category === cat && styles.categoryModalButtonTextActive
                        ]}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Priority</Text>
                  <View style={styles.priorityButtons}>
                    {['low', 'medium', 'high'].map((priority) => (
                      <Pressable
                        key={priority}
                        style={[
                          styles.priorityButton,
                          contactForm.priority === priority && styles.priorityButtonActive,
                          { borderColor: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981' }
                        ]}
                        onPress={() => setContactForm(prev => ({ ...prev, priority }))}
                      >
                        <Text style={[
                          styles.priorityButtonText,
                          contactForm.priority === priority && styles.priorityButtonTextActive
                        ]}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Message *</Text>
                  <TextInput
                    style={[styles.modalInput, styles.messageInput]}
                    value={contactForm.message}
                    onChangeText={(text) => setContactForm(prev => ({ ...prev, message: text }))}
                    placeholder="Please describe your issue in detail..."
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setShowContactModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={styles.submitButton}
                  onPress={handleContactSubmit}
                >
                  <Text style={styles.submitButtonText}>Send Message</Text>
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
  welcomeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supportCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 16,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    marginRight: 12,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 8,
    lineHeight: 22,
  },
  faqMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqCategory: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  faqHelpful: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  faqHelpfulText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  faqActions: {
    flexDirection: 'row',
    gap: 12,
  },
  faqActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  faqActionText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  resourcesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  resourceContent: {
    marginLeft: 12,
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statusCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  statusDescription: {
    fontSize: 14,
    color: '#94a3b8',
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
    maxHeight: 500,
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
  messageInput: {
    height: 120,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryModalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  categoryModalButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryModalButtonText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  categoryModalButtonTextActive: {
    color: '#ffffff',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  priorityButtonTextActive: {
    color: '#3b82f6',
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
  submitButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});