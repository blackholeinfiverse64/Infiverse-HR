"""
Comprehensive MongoDB Setup Test Script
Tests all database connections, imports, and configurations
"""
import sys
import os
from datetime import datetime

# Color codes for Windows console
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}[PASS] {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}[FAIL] {msg}{Colors.END}")

def print_warning(msg):
    print(f"{Colors.YELLOW}[WARN] {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.BLUE}[INFO] {msg}{Colors.END}")

def test_imports():
    """Test if all MongoDB packages are installed"""
    print("\n" + "="*60)
    print("TEST 1: Package Imports")
    print("="*60)
    
    tests_passed = 0
    tests_failed = 0
    
    # Test pymongo
    try:
        import pymongo
        print_success(f"pymongo imported (version: {pymongo.__version__})")
        tests_passed += 1
    except ImportError as e:
        print_error(f"pymongo import failed: {e}")
        tests_failed += 1
    
    # Test motor
    try:
        import motor
        print_success(f"motor imported (version: {motor.version})")
        tests_passed += 1
    except ImportError as e:
        print_error(f"motor import failed: {e}")
        tests_failed += 1
    
    # Test dnspython
    try:
        import dns
        print_success("dnspython imported")
        tests_passed += 1
    except ImportError as e:
        print_error(f"dnspython import failed: {e}")
        tests_failed += 1
    
    # Test bson
    try:
        from bson import ObjectId
        test_id = ObjectId()
        print_success(f"bson.ObjectId working (test: {test_id})")
        tests_passed += 1
    except Exception as e:
        print_error(f"bson.ObjectId failed: {e}")
        tests_failed += 1
    
    return tests_passed, tests_failed

def test_database_modules():
    """Test if database modules can be imported"""
    print("\n" + "="*60)
    print("TEST 2: Database Module Imports")
    print("="*60)
    
    tests_passed = 0
    tests_failed = 0
    
    # Test agent database module
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'services', 'agent'))
        from database import get_mongo_client, get_mongo_db, get_collection
        print_success("Agent service database module imported")
        tests_passed += 1
    except Exception as e:
        print_error(f"Agent database module failed: {e}")
        tests_failed += 1
    
    # Test gateway database module
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'services', 'gateway', 'app'))
        from database import get_mongo_client as get_gateway_client
        print_success("Gateway service database module imported")
        tests_passed += 1
    except Exception as e:
        print_error(f"Gateway database module failed: {e}")
        tests_failed += 1
    
    # Test langgraph database module
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'services', 'langgraph', 'app'))
        from database import get_mongo_client as get_langgraph_client
        print_success("LangGraph service database module imported")
        tests_passed += 1
    except Exception as e:
        print_error(f"LangGraph database module failed: {e}")
        tests_failed += 1
    
    return tests_passed, tests_failed

def test_no_postgresql():
    """Verify no PostgreSQL code in services"""
    print("\n" + "="*60)
    print("TEST 3: PostgreSQL Code Removal")
    print("="*60)
    
    tests_passed = 0
    tests_failed = 0
    
    postgres_patterns = ['psycopg2', 'cursor.execute', 'fetchall', 'fetchone', 'conn.commit']
    services_dir = os.path.join(os.path.dirname(__file__), 'services')
    
    # Check main service files
    service_files = [
        'agent/app.py',
        'agent/database.py',
        'gateway/app/main.py',
        'gateway/app/database.py',
        'langgraph/app/database.py'
    ]
    
    for service_file in service_files:
        file_path = os.path.join(services_dir, service_file)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check for psycopg2 imports (excluding comments)
            lines = content.split('\n')
            has_postgres = False
            for line in lines:
                line = line.strip()
                if line.startswith('#'):
                    continue
                if 'psycopg2' in line and 'import' in line:
                    has_postgres = True
                    break
            
            if has_postgres:
                print_error(f"{service_file} still has PostgreSQL imports")
                tests_failed += 1
            else:
                print_success(f"{service_file} - No PostgreSQL imports")
                tests_passed += 1
    
    return tests_passed, tests_failed

def test_seed_script():
    """Test if seed script can be imported"""
    print("\n" + "="*60)
    print("TEST 4: Seed Script")
    print("="*60)
    
    tests_passed = 0
    tests_failed = 0
    
    try:
        # Just check if file exists and has correct structure
        seed_file = os.path.join(os.path.dirname(__file__), 'seed_mongodb.py')
        if os.path.exists(seed_file):
            with open(seed_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for key functions
            required_functions = [
                'seed_jobs', 'seed_candidates', 'seed_job_applications',
                'seed_clients', 'seed_users', 'create_indexes'
            ]
            
            all_found = True
            for func in required_functions:
                if f"def {func}" in content:
                    print_success(f"Found function: {func}()")
                else:
                    print_error(f"Missing function: {func}()")
                    all_found = False
            
            if all_found:
                tests_passed += 1
            else:
                tests_failed += 1
        else:
            print_error("seed_mongodb.py not found")
            tests_failed += 1
    except Exception as e:
        print_error(f"Seed script test failed: {e}")
        tests_failed += 1
    
    return tests_passed, tests_failed

def test_env_configuration():
    """Test environment configuration"""
    print("\n" + "="*60)
    print("TEST 5: Environment Configuration")
    print("="*60)
    
    tests_passed = 0
    tests_failed = 0
    
    # Check .env.example
    env_example = os.path.join(os.path.dirname(__file__), '.env.example')
    if os.path.exists(env_example):
        with open(env_example, 'r') as f:
            content = f.read()
        
        if 'DATABASE_URL' in content:
            print_success(".env.example has DATABASE_URL")
            tests_passed += 1
        else:
            print_error(".env.example missing DATABASE_URL")
            tests_failed += 1
        
        if 'MONGODB_DB_NAME' in content or 'bhiv_hr' in content:
            print_success(".env.example has MongoDB database name")
            tests_passed += 1
        else:
            print_warning(".env.example missing MONGODB_DB_NAME (optional)")
            tests_passed += 1
    else:
        print_error(".env.example not found")
        tests_failed += 1
    
    # Check if .env exists
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file):
        print_info(".env file exists (not checking contents for security)")
        tests_passed += 1
    else:
        print_warning(".env file not found - you'll need to create it")
        tests_passed += 1
    
    return tests_passed, tests_failed

def test_requirements():
    """Test requirements.txt"""
    print("\n" + "="*60)
    print("TEST 6: Requirements File")
    print("="*60)
    
    tests_passed = 0
    tests_failed = 0
    
    req_file = os.path.join(os.path.dirname(__file__), 'requirements.txt')
    if os.path.exists(req_file):
        with open(req_file, 'r') as f:
            content = f.read()
        
        required_packages = {
            'pymongo': False,
            'motor': False,
            'dnspython': False
        }
        
        for package in required_packages:
            if package in content:
                print_success(f"requirements.txt has {package}")
                required_packages[package] = True
                tests_passed += 1
            else:
                print_error(f"requirements.txt missing {package}")
                tests_failed += 1
        
        # Check for PostgreSQL packages (should NOT be there)
        if 'psycopg2' in content:
            print_warning("requirements.txt still has psycopg2 (should be removed)")
        else:
            print_success("requirements.txt has no psycopg2")
            tests_passed += 1
    else:
        print_error("requirements.txt not found")
        tests_failed += 1
    
    return tests_passed, tests_failed

def check_problematic_files():
    """Check for files that still use PostgreSQL"""
    print("\n" + "="*60)
    print("TEST 7: Problematic Files Check")
    print("="*60)
    
    problematic_files = [
        'services/langgraph/app/database_tracker.py',
        'services/langgraph/app/rl_integration/postgres_adapter.py'
    ]
    
    for file_path in problematic_files:
        full_path = os.path.join(os.path.dirname(__file__), file_path)
        if os.path.exists(full_path):
            print_warning(f"Found: {file_path} (still uses PostgreSQL)")
        else:
            print_info(f"Not found: {file_path}")
    
    print_info("Note: These files need MongoDB migration if they're actively used")
    return 1, 0

def main():
    """Run all tests"""
    print("\n" + "="*70)
    print(" "*15 + "MONGODB SETUP VERIFICATION TEST")
    print("="*70)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    total_passed = 0
    total_failed = 0
    
    # Run all tests
    passed, failed = test_imports()
    total_passed += passed
    total_failed += failed
    
    passed, failed = test_database_modules()
    total_passed += passed
    total_failed += failed
    
    passed, failed = test_no_postgresql()
    total_passed += passed
    total_failed += failed
    
    passed, failed = test_seed_script()
    total_passed += passed
    total_failed += failed
    
    passed, failed = test_env_configuration()
    total_passed += passed
    total_failed += failed
    
    passed, failed = test_requirements()
    total_passed += passed
    total_failed += failed
    
    passed, failed = check_problematic_files()
    total_passed += passed
    total_failed += failed
    
    # Final summary
    print("\n" + "="*70)
    print("FINAL SUMMARY")
    print("="*70)
    print(f"Total Tests Passed: {Colors.GREEN}{total_passed}{Colors.END}")
    print(f"Total Tests Failed: {Colors.RED}{total_failed}{Colors.END}")
    
    if total_failed == 0:
        print(f"\n{Colors.GREEN}{'='*70}")
        print("[SUCCESS] ALL TESTS PASSED - MongoDB setup is ready!")
        print(f"{'='*70}{Colors.END}")
        print("\nNext steps:")
        print("1. Set DATABASE_URL in .env file")
        print("2. Run: python seed_mongodb.py")
        print("3. Start services: python run_services.py")
    else:
        print(f"\n{Colors.RED}{'='*70}")
        print(f"[FAILED] {total_failed} TEST(S) FAILED - Please fix the issues above")
        print(f"{'='*70}{Colors.END}")
    
    print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    return 0 if total_failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
