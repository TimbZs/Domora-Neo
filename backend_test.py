#!/usr/bin/env python3
"""
Domora Marketplace Backend API Testing Suite
Tests all critical backend APIs for Phase 1 implementation
"""

import asyncio
import aiohttp
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Configuration
BASE_URL = "http://localhost:8001"  # Use localhost for testing since external URL mapping has issues
API_BASE_URL = f"{BASE_URL}/api"

class DomoraAPITester:
    def __init__(self):
        self.session = None
        self.customer_token = None
        self.provider_token = None
        self.customer_user = None
        self.provider_user = None
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        
        if success:
            self.test_results['passed'] += 1
        else:
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"{test_name}: {message}")
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, 
                          headers: Dict = None, token: str = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{API_BASE_URL}{endpoint}"
        
        request_headers = {'Content-Type': 'application/json'}
        if headers:
            request_headers.update(headers)
        if token:
            request_headers['Authorization'] = f'Bearer {token}'
        
        try:
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                return response.status < 400, response_data, response.status
                
        except Exception as e:
            return False, str(e), 0

    # Authentication Tests
    async def test_customer_registration(self):
        """Test customer registration"""
        test_email = f"customer_{uuid.uuid4().hex[:8]}@test.com"
        registration_data = {
            "email": test_email,
            "password": "SecurePass123!",
            "full_name": "Maria Silva",
            "role": "customer"
        }
        
        success, response, status = await self.make_request(
            'POST', '/auth/register', registration_data
        )
        
        if success and 'access_token' in response:
            self.customer_token = response['access_token']
            self.customer_user = response['user']
            self.log_result("Customer Registration", True, f"User ID: {self.customer_user['id']}")
        else:
            self.log_result("Customer Registration", False, f"Status: {status}, Response: {response}")
    
    async def test_provider_registration(self):
        """Test provider registration"""
        test_email = f"provider_{uuid.uuid4().hex[:8]}@test.com"
        registration_data = {
            "email": test_email,
            "password": "SecurePass123!",
            "full_name": "João Santos",
            "role": "provider"
        }
        
        success, response, status = await self.make_request(
            'POST', '/auth/register', registration_data
        )
        
        if success and 'access_token' in response:
            self.provider_token = response['access_token']
            self.provider_user = response['user']
            self.log_result("Provider Registration", True, f"User ID: {self.provider_user['id']}")
        else:
            self.log_result("Provider Registration", False, f"Status: {status}, Response: {response}")
    
    async def test_login(self):
        """Test login with valid credentials"""
        if not self.customer_user:
            self.log_result("Login Test", False, "No customer user available for login test")
            return
            
        login_data = {
            "email": self.customer_user['email'],
            "password": "SecurePass123!"
        }
        
        success, response, status = await self.make_request(
            'POST', '/auth/login', login_data
        )
        
        if success and 'access_token' in response:
            self.log_result("Login", True, "Successfully logged in")
        else:
            self.log_result("Login", False, f"Status: {status}, Response: {response}")
    
    async def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        }
        
        success, response, status = await self.make_request(
            'POST', '/auth/login', login_data
        )
        
        # Should fail with 401
        if not success and status == 401:
            self.log_result("Invalid Login", True, "Correctly rejected invalid credentials")
        else:
            self.log_result("Invalid Login", False, f"Expected 401, got {status}")
    
    async def test_get_current_user(self):
        """Test JWT token validation"""
        if not self.customer_token:
            self.log_result("Get Current User", False, "No customer token available")
            return
            
        success, response, status = await self.make_request(
            'GET', '/auth/me', token=self.customer_token
        )
        
        if success and 'id' in response:
            self.log_result("Get Current User", True, f"Retrieved user: {response['full_name']}")
        else:
            self.log_result("Get Current User", False, f"Status: {status}, Response: {response}")

    # Service Management Tests
    async def test_get_service_packages(self):
        """Test retrieving service packages"""
        success, response, status = await self.make_request('GET', '/services/packages')
        
        if success and isinstance(response, list) and len(response) > 0:
            self.log_result("Get Service Packages", True, f"Retrieved {len(response)} packages")
            # Store first package for later tests
            self.test_package = response[0]
        else:
            self.log_result("Get Service Packages", False, f"Status: {status}, Response: {response}")
    
    async def test_get_service_addons(self):
        """Test retrieving service addons"""
        success, response, status = await self.make_request('GET', '/services/addons')
        
        if success and isinstance(response, list) and len(response) > 0:
            self.log_result("Get Service Addons", True, f"Retrieved {len(response)} addons")
            # Store first addon for later tests
            self.test_addon = response[0]
        else:
            self.log_result("Get Service Addons", False, f"Status: {status}, Response: {response}")
    
    async def test_price_estimate(self):
        """Test price calculation"""
        if not hasattr(self, 'test_package'):
            self.log_result("Price Estimate", False, "No test package available")
            return
            
        estimate_data = {
            "package_id": self.test_package['id'],
            "service_address": {
                "street": "Trubarjeva cesta 1",
                "city": "Ljubljana",
                "postal_code": "1000",
                "country": "Slovenia"
            },
            "addon_ids": [self.test_addon['id']] if hasattr(self, 'test_addon') else []
        }
        
        success, response, status = await self.make_request(
            'POST', '/services/price-estimate', estimate_data
        )
        
        if success and 'total_price' in response:
            self.log_result("Price Estimate", True, f"Total price: €{response['total_price']}")
            self.test_price_estimate = response
        else:
            self.log_result("Price Estimate", False, f"Status: {status}, Response: {response}")

    # Booking System Tests
    async def test_create_booking(self):
        """Test booking creation with authentication"""
        if not self.customer_token or not hasattr(self, 'test_package'):
            self.log_result("Create Booking", False, "Missing customer token or test package")
            return
            
        booking_data = {
            "service_type": self.test_package['service_type'],
            "package_id": self.test_package['id'],
            "addon_ids": [self.test_addon['id']] if hasattr(self, 'test_addon') else [],
            "service_address": {
                "street": "Trubarjeva cesta 1",
                "city": "Ljubljana",
                "postal_code": "1000",
                "country": "Slovenia"
            },
            "scheduled_datetime": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "notes": "Test booking for API validation"
        }
        
        success, response, status = await self.make_request(
            'POST', '/bookings', booking_data, token=self.customer_token
        )
        
        if success and 'id' in response:
            self.log_result("Create Booking", True, f"Booking ID: {response['id']}")
            self.test_booking = response
        else:
            self.log_result("Create Booking", False, f"Status: {status}, Response: {response}")
    
    async def test_get_bookings(self):
        """Test user-specific booking retrieval"""
        if not self.customer_token:
            self.log_result("Get Bookings", False, "No customer token available")
            return
            
        success, response, status = await self.make_request(
            'GET', '/bookings', token=self.customer_token
        )
        
        if success and isinstance(response, list):
            self.log_result("Get Bookings", True, f"Retrieved {len(response)} bookings")
        else:
            self.log_result("Get Bookings", False, f"Status: {status}, Response: {response}")
    
    async def test_get_specific_booking(self):
        """Test individual booking access"""
        if not self.customer_token or not hasattr(self, 'test_booking'):
            self.log_result("Get Specific Booking", False, "Missing customer token or test booking")
            return
            
        booking_id = self.test_booking['id']
        success, response, status = await self.make_request(
            'GET', f'/bookings/{booking_id}', token=self.customer_token
        )
        
        if success and response['id'] == booking_id:
            self.log_result("Get Specific Booking", True, f"Retrieved booking: {booking_id}")
        else:
            self.log_result("Get Specific Booking", False, f"Status: {status}, Response: {response}")
    
    async def test_unauthorized_booking_access(self):
        """Test booking access without authentication"""
        if not hasattr(self, 'test_booking'):
            self.log_result("Unauthorized Booking Access", False, "No test booking available")
            return
            
        booking_id = self.test_booking['id']
        success, response, status = await self.make_request(
            'GET', f'/bookings/{booking_id}'  # No token
        )
        
        # Should fail with 401 or 403
        if not success and status in [401, 403]:
            self.log_result("Unauthorized Booking Access", True, "Correctly rejected unauthorized access")
        else:
            self.log_result("Unauthorized Booking Access", False, f"Expected 401/403, got {status}")

    # Payment Integration Tests
    async def test_create_checkout_session(self):
        """Test Stripe checkout session creation"""
        if not self.customer_token or not hasattr(self, 'test_booking'):
            self.log_result("Create Checkout Session", False, "Missing customer token or test booking")
            return
            
        booking_id = self.test_booking['id']
        success, response, status = await self.make_request(
            'POST', f'/payments/create-checkout?booking_id={booking_id}', 
            token=self.customer_token
        )
        
        if success and 'checkout_url' in response and 'session_id' in response:
            self.log_result("Create Checkout Session", True, f"Session ID: {response['session_id']}")
            self.test_session_id = response['session_id']
        else:
            self.log_result("Create Checkout Session", False, f"Status: {status}, Response: {response}")
    
    async def test_payment_status(self):
        """Test payment status checking"""
        if not self.customer_token or not hasattr(self, 'test_session_id'):
            self.log_result("Payment Status", False, "Missing customer token or session ID")
            return
            
        success, response, status = await self.make_request(
            'GET', f'/payments/status/{self.test_session_id}', 
            token=self.customer_token
        )
        
        if success and 'status' in response:
            self.log_result("Payment Status", True, f"Status: {response['status']}")
        else:
            self.log_result("Payment Status", False, f"Status: {status}, Response: {response}")
    
    async def test_webhook_endpoint(self):
        """Test webhook endpoint accessibility"""
        # Test that webhook endpoint exists (we can't test full webhook without Stripe)
        webhook_data = {
            "id": "evt_test",
            "object": "event",
            "type": "checkout.session.completed",
            "data": {"object": {"id": "cs_test"}}
        }
        
        success, response, status = await self.make_request(
            'POST', '/webhooks/stripe', webhook_data,
            headers={'Stripe-Signature': 'test_signature'}
        )
        
        # Webhook should be accessible (even if it fails signature validation)
        if status in [200, 400]:  # 400 is expected for invalid signature
            self.log_result("Webhook Endpoint", True, "Webhook endpoint is accessible")
        else:
            self.log_result("Webhook Endpoint", False, f"Unexpected status: {status}")

    # Error Handling Tests
    async def test_invalid_package_id(self):
        """Test error handling for invalid package ID"""
        estimate_data = {
            "package_id": "invalid-package-id",
            "service_address": {
                "street": "Test Street",
                "city": "Ljubljana",
                "postal_code": "1000",
                "country": "Slovenia"
            }
        }
        
        success, response, status = await self.make_request(
            'POST', '/services/price-estimate', estimate_data
        )
        
        if not success and status == 404:
            self.log_result("Invalid Package ID Error Handling", True, "Correctly returned 404")
        else:
            self.log_result("Invalid Package ID Error Handling", False, f"Expected 404, got {status}")
    
    async def test_provider_cannot_create_booking(self):
        """Test that providers cannot create bookings"""
        if not self.provider_token or not hasattr(self, 'test_package'):
            self.log_result("Provider Booking Restriction", False, "Missing provider token or test package")
            return
            
        booking_data = {
            "service_type": self.test_package['service_type'],
            "package_id": self.test_package['id'],
            "service_address": {
                "street": "Test Street",
                "city": "Ljubljana",
                "postal_code": "1000",
                "country": "Slovenia"
            },
            "scheduled_datetime": (datetime.utcnow() + timedelta(days=1)).isoformat()
        }
        
        success, response, status = await self.make_request(
            'POST', '/bookings', booking_data, token=self.provider_token
        )
        
        if not success and status == 403:
            self.log_result("Provider Booking Restriction", True, "Correctly prevented provider from creating booking")
        else:
            self.log_result("Provider Booking Restriction", False, f"Expected 403, got {status}")

    async def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Domora Marketplace Backend API Tests")
        print(f"📍 Testing against: {API_BASE_URL}")
        print("=" * 60)
        
        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        await self.test_customer_registration()
        await self.test_provider_registration()
        await self.test_login()
        await self.test_invalid_login()
        await self.test_get_current_user()
        
        # Service Management Tests
        print("\n🛠️ SERVICE MANAGEMENT TESTS")
        await self.test_get_service_packages()
        await self.test_get_service_addons()
        await self.test_price_estimate()
        
        # Booking System Tests
        print("\n📅 BOOKING SYSTEM TESTS")
        await self.test_create_booking()
        await self.test_get_bookings()
        await self.test_get_specific_booking()
        await self.test_unauthorized_booking_access()
        
        # Payment Integration Tests
        print("\n💳 PAYMENT INTEGRATION TESTS")
        await self.test_create_checkout_session()
        await self.test_payment_status()
        await self.test_webhook_endpoint()
        
        # Error Handling Tests
        print("\n⚠️ ERROR HANDLING TESTS")
        await self.test_invalid_package_id()
        await self.test_provider_cannot_create_booking()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results['errors']:
            print("\n🔍 FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.test_results['passed'] / 
                       (self.test_results['passed'] + self.test_results['failed'])) * 100
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.test_results['failed'] == 0

async def main():
    """Main test runner"""
    async with DomoraAPITester() as tester:
        success = await tester.run_all_tests()
        return 0 if success else 1

if __name__ == "__main__":
    import sys
    sys.exit(asyncio.run(main()))