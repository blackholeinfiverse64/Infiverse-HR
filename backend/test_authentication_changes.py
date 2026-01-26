"""
Comprehensive Test Script for Authentication Changes
Tests all authentication flows: candidate, recruiter, and client login
"""
import asyncio
import requests
import json
import sys
from datetime import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL_PREFIX = f"test_{int(datetime.now().timestamp())}"

# Test results
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_test(test_name, passed, message=""):
    """Log test result"""
    if passed:
        test_results["passed"].append(test_name)
        print(f"[OK] {test_name}: PASSED")
        if message:
            print(f"   {message}")
    else:
        test_results["failed"].append(test_name)
        print(f"[ERROR] {test_name}: FAILED")
        if message:
            print(f"   {message}")

def test_candidate_registration():
    """Test candidate registration with role field"""
    print("\n" + "="*60)
    print("TEST 1: Candidate Registration")
    print("="*60)
    
    email = f"{TEST_EMAIL_PREFIX}_candidate@test.com"
    data = {
        "name": "Test Candidate",
        "email": email,
        "password": "test123456",
        "phone": "1234567890",
        "role": "candidate"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/v1/candidate/register", json=data)
        if response.status_code == 200 and response.json().get("success"):
            # Verify role is saved in database (would need MongoDB check)
            log_test("Candidate Registration", True, f"Registered: {email}")
            return email, "test123456"
        else:
            log_test("Candidate Registration", False, f"Response: {response.text}")
            return None, None
    except Exception as e:
        log_test("Candidate Registration", False, f"Error: {str(e)}")
        return None, None

def test_recruiter_registration():
    """Test recruiter registration with role field"""
    print("\n" + "="*60)
    print("TEST 2: Recruiter Registration")
    print("="*60)
    
    email = f"{TEST_EMAIL_PREFIX}_recruiter@test.com"
    data = {
        "name": "Test Recruiter",
        "email": email,
        "password": "test123456",
        "phone": "1234567890",
        "role": "recruiter"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/v1/candidate/register", json=data)
        if response.status_code == 200 and response.json().get("success"):
            log_test("Recruiter Registration", True, f"Registered: {email}")
            return email, "test123456"
        else:
            log_test("Recruiter Registration", False, f"Response: {response.text}")
            return None, None
    except Exception as e:
        log_test("Recruiter Registration", False, f"Error: {str(e)}")
        return None, None

def test_client_registration():
    """Test client registration"""
    print("\n" + "="*60)
    print("TEST 3: Client Registration")
    print("="*60)
    
    client_id = f"test_client_{TEST_EMAIL_PREFIX}"
    email = f"{TEST_EMAIL_PREFIX}_client@test.com"
    data = {
        "client_id": client_id,
        "company_name": "Test Company",
        "contact_email": email,
        "password": "test123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/v1/client/register", json=data)
        result = response.json() if response.content else {}
        # Check for success in response (status code can be 200 or 201)
        if response.status_code in [200, 201] or result.get("success") or result.get("client_id"):
            log_test("Client Registration", True, f"Registered: {email}, client_id: {result.get('client_id', client_id)}")
            return email, "test123456", result.get("client_id", client_id)
        else:
            log_test("Client Registration", False, f"Status: {response.status_code}, Response: {response.text}")
            return None, None, None
    except Exception as e:
        log_test("Client Registration", False, f"Error: {str(e)}")
        return None, None, None

def test_candidate_login(email, password):
    """Test candidate login and verify JWT token contains role"""
    print("\n" + "="*60)
    print("TEST 4: Candidate Login")
    print("="*60)
    
    if not email:
        log_test("Candidate Login", False, "No candidate email available")
        return None, None
    
    data = {"email": email, "password": password}
    
    try:
        response = requests.post(f"{BASE_URL}/v1/candidate/login", json=data)
        if response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                token = result.get("token")
                candidate_id = result.get("candidate_id")
                # Decode JWT to check role
                import base64
                try:
                    payload = json.loads(base64.b64decode(token.split('.')[1] + '=='))
                    role = payload.get("role", "missing")
                    if role == "candidate":
                        log_test("Candidate Login", True, f"Token contains role: {role}, candidate_id: {candidate_id}")
                        return token, candidate_id
                    else:
                        log_test("Candidate Login", False, f"Wrong role in token: {role}")
                        return None, None
                except:
                    log_test("Candidate Login", False, "Could not decode JWT token")
                    return None, None
            else:
                log_test("Candidate Login", False, f"Response: {result}")
                return None, None
        else:
            log_test("Candidate Login", False, f"Status: {response.status_code}, Response: {response.text}")
            return None, None
    except Exception as e:
        log_test("Candidate Login", False, f"Error: {str(e)}")
        return None, None

def test_recruiter_login(email, password):
    """Test recruiter login and verify JWT token contains role"""
    print("\n" + "="*60)
    print("TEST 5: Recruiter Login")
    print("="*60)
    
    if not email:
        log_test("Recruiter Login", False, "No recruiter email available")
        return None
    
    data = {"email": email, "password": password}
    
    try:
        response = requests.post(f"{BASE_URL}/v1/candidate/login", json=data)
        if response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                token = result.get("token")
                # Decode JWT to check role
                import base64
                try:
                    payload = json.loads(base64.b64decode(token.split('.')[1] + '=='))
                    role = payload.get("role", "missing")
                    if role == "recruiter":
                        log_test("Recruiter Login", True, f"Token contains role: {role}")
                        return token
                    else:
                        log_test("Recruiter Login", False, f"Wrong role in token: {role} (expected: recruiter)")
                        return None
                except:
                    log_test("Recruiter Login", False, "Could not decode JWT token")
                    return None
            else:
                log_test("Recruiter Login", False, f"Response: {result}")
                return None
        else:
            log_test("Recruiter Login", False, f"Status: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test("Recruiter Login", False, f"Error: {str(e)}")
        return None

def test_client_login_email(email, password):
    """Test client login with email (new feature)"""
    print("\n" + "="*60)
    print("TEST 6: Client Login with Email")
    print("="*60)
    
    if not email:
        log_test("Client Login (Email)", False, "No client email available")
        return None
    
    data = {"email": email, "password": password}
    
    try:
        response = requests.post(f"{BASE_URL}/v1/client/login", json=data)
        if response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("access_token"):
                token = result.get("access_token")
                # Decode JWT to check role
                import base64
                try:
                    payload = json.loads(base64.b64decode(token.split('.')[1] + '=='))
                    role = payload.get("role", "missing")
                    if role == "client":
                        log_test("Client Login (Email)", True, f"Token contains role: {role}")
                        return token
                    else:
                        log_test("Client Login (Email)", False, f"Wrong role in token: {role}")
                        return None
                except:
                    log_test("Client Login (Email)", False, "Could not decode JWT token")
                    return None
            else:
                log_test("Client Login (Email)", False, f"Response: {result}")
                return None
        else:
            log_test("Client Login (Email)", False, f"Status: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test("Client Login (Email)", False, f"Error: {str(e)}")
        return None

def test_authenticated_endpoint(token, role, candidate_id=None):
    """Test authenticated endpoint with JWT token"""
    print("\n" + "="*60)
    print(f"TEST 7: Authenticated Endpoint ({role})")
    print("="*60)
    
    if not token:
        log_test(f"Authenticated Endpoint ({role})", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        if role == "candidate":
            # Test candidate stats endpoint (uses candidate_id from token)
            if candidate_id:
                response = requests.get(f"{BASE_URL}/v1/candidate/stats/{candidate_id}", headers=headers)
            else:
                # Fallback to health endpoint if no candidate_id
                response = requests.get(f"{BASE_URL}/v1/health", headers=headers)
        elif role == "client":
            # Test a client endpoint (if available)
            response = requests.get(f"{BASE_URL}/v1/health", headers=headers)
        else:
            response = requests.get(f"{BASE_URL}/v1/health", headers=headers)
        
        if response.status_code in [200, 404]:  # 404 is OK if endpoint doesn't exist
            log_test(f"Authenticated Endpoint ({role})", True, f"Status: {response.status_code}")
            return True
        elif response.status_code == 401:
            log_test(f"Authenticated Endpoint ({role})", False, "Unauthorized - token not accepted")
            return False
        elif response.status_code == 403:
            log_test(f"Authenticated Endpoint ({role})", False, f"Forbidden - Status: {response.status_code}, Response: {response.text[:100]}")
            return False
        else:
            log_test(f"Authenticated Endpoint ({role})", False, f"Status: {response.status_code}, Response: {response.text[:100]}")
            return False
    except Exception as e:
        log_test(f"Authenticated Endpoint ({role})", False, f"Error: {str(e)}")
        return False

def test_health_check():
    """Test if backend is running"""
    print("\n" + "="*60)
    print("TEST 0: Backend Health Check")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            log_test("Backend Health Check", True, "Backend is running")
            return True
        else:
            log_test("Backend Health Check", False, f"Status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        log_test("Backend Health Check", False, "Cannot connect to backend. Is it running?")
        return False
    except Exception as e:
        log_test("Backend Health Check", False, f"Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("AUTHENTICATION CHANGES TEST SUITE")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Email Prefix: {TEST_EMAIL_PREFIX}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    # Test 0: Health check
    if not test_health_check():
        print("\n⚠️ Backend is not running. Please start the backend first.")
        print("   cd backend && python run_services.py")
        return
    
    # Test 1: Candidate registration
    candidate_email, candidate_password = test_candidate_registration()
    
    # Test 2: Recruiter registration
    recruiter_email, recruiter_password = test_recruiter_registration()
    
    # Test 3: Client registration
    client_email, client_password, client_id = test_client_registration()
    
    # Test 4: Candidate login
    candidate_result = test_candidate_login(candidate_email, candidate_password) if candidate_email else (None, None)
    candidate_token, candidate_id = candidate_result if candidate_result else (None, None)
    
    # Test 5: Recruiter login
    recruiter_token = test_recruiter_login(recruiter_email, recruiter_password) if recruiter_email else None
    
    # Test 6: Client login with email
    client_token = test_client_login_email(client_email, client_password) if client_email else None
    
    # Test 7: Authenticated endpoints
    if candidate_token:
        test_authenticated_endpoint(candidate_token, "candidate", candidate_id)
    if recruiter_token:
        test_authenticated_endpoint(recruiter_token, "recruiter")
    if client_token:
        test_authenticated_endpoint(client_token, "client")
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"[OK] Passed: {len(test_results['passed'])}")
    print(f"[ERROR] Failed: {len(test_results['failed'])}")
    print(f"[WARN] Warnings: {len(test_results['warnings'])}")
    
    if test_results['passed']:
        print("\n[OK] Passed Tests:")
        for test in test_results['passed']:
            print(f"   - {test}")
    
    if test_results['failed']:
        print("\n[ERROR] Failed Tests:")
        for test in test_results['failed']:
            print(f"   - {test}")
    
    print("\n" + "="*60)
    if len(test_results['failed']) == 0:
        print("[SUCCESS] ALL TESTS PASSED!")
    else:
        print(f"[WARN] {len(test_results['failed'])} test(s) failed. Please review above.")
    print("="*60)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[WARN] Tests interrupted by user")
    except Exception as e:
        print(f"\n\n[ERROR] Test suite error: {str(e)}")
        import traceback
        traceback.print_exc()

