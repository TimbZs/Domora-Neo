import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProviderOnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    serviceTypes: [] as string[],
    serviceArea: '',
    experience: '',
    portfolio: '',
  });

  const serviceTypes = [
    { id: 'house_cleaning', name: 'House Cleaning', icon: 'home-outline' },
    { id: 'car_washing', name: 'Car Washing', icon: 'car-outline' },
    { id: 'landscaping', name: 'Landscaping', icon: 'leaf-outline' },
  ];

  const toggleServiceType = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceId)
        ? prev.serviceTypes.filter(id => id !== serviceId)
        : [...prev.serviceTypes, serviceId]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      submitApplication();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = () => {
    Alert.alert(
      'Application Submitted!',
      'Your provider application has been submitted for review. We will contact you within 2-3 business days.',
      [
        { text: 'OK', onPress: () => router.push('/(tabs)/profile') }
      ]
    );
  };

  if (user?.role !== 'provider') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Only providers can access this page</Text>
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
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#f8fafc" />
            </Pressable>
            <Text style={styles.title}>Provider Setup</Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>Step {currentStep} of 4</Text>
          </View>

          {/* Step Content */}
          <View style={styles.content}>
            {currentStep === 1 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Business Information</Text>
                <Text style={styles.stepDescription}>Tell us about your business</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Business Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.businessName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
                    placeholder="Enter your business name"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Business Description *</Text>
                  <TextInput
                    style={styles.textArea}
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                    placeholder="Describe your services and experience..."
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            )}

            {currentStep === 2 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Services Offered</Text>
                <Text style={styles.stepDescription}>Select the services you provide</Text>
                
                <View style={styles.serviceGrid}>
                  {serviceTypes.map((service) => (
                    <Pressable
                      key={service.id}
                      style={[
                        styles.serviceCard,
                        formData.serviceTypes.includes(service.id) && styles.serviceCardSelected
                      ]}
                      onPress={() => toggleServiceType(service.id)}
                    >
                      <Ionicons 
                        name={service.icon as keyof typeof Ionicons.glyphMap} 
                        size={32} 
                        color={formData.serviceTypes.includes(service.id) ? "#3b82f6" : "#94a3b8"}
                      />
                      <Text style={[
                        styles.serviceName,
                        formData.serviceTypes.includes(service.id) && styles.serviceNameSelected
                      ]}>
                        {service.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {currentStep === 3 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Service Area</Text>
                <Text style={styles.stepDescription}>Where do you provide services?</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Primary Service Area *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.serviceArea}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, serviceArea: text }))}
                    placeholder="e.g., Ljubljana, Slovenia"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Years of Experience *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.experience}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
                    placeholder="How many years of experience do you have?"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}

            {currentStep === 4 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Portfolio & Documents</Text>
                <Text style={styles.stepDescription}>Showcase your work (optional)</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Portfolio/Website URL</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.portfolio}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, portfolio: text }))}
                    placeholder="https://your-portfolio.com"
                    placeholderTextColor="#64748b"
                    keyboardType="url"
                  />
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="information-circle" size={24} color="#3b82f6" />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Application Review</Text>
                    <Text style={styles.infoDescription}>
                      Your application will be reviewed within 2-3 business days. 
                      We may contact you for additional information or verification.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentStep > 1 && (
              <Pressable style={styles.prevButton} onPress={prevStep}>
                <Text style={styles.prevButtonText}>Previous</Text>
              </Pressable>
            )}
            
            <Pressable style={styles.nextButton} onPress={nextStep}>
              <Text style={styles.nextButtonText}>
                {currentStep === 4 ? 'Submit Application' : 'Next'}
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
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  step: {
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
    minHeight: 120,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  serviceCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  serviceName: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  serviceNameSelected: {
    color: '#3b82f6',
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
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  prevButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  prevButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
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