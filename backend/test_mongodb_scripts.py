"""
Test Script for MongoDB Schema Management Scripts
Tests the 3 MongoDB scripts:
1. verify_mongodb_schema.py
2. create_mongodb_indexes.py
3. migrate_mongodb_schema.py
"""
import subprocess
import sys
import os
import codecs
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuration
GATEWAY_DIR = Path(__file__).parent / "services" / "gateway"
TEST_RESULTS = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_test(test_name, passed, message=""):
    """Log test result"""
    if passed:
        TEST_RESULTS["passed"].append(test_name)
        print(f"[OK] {test_name}: PASSED")
        if message:
            print(f"   {message}")
    else:
        TEST_RESULTS["failed"].append(test_name)
        print(f"[ERROR] {test_name}: FAILED")
        if message:
            print(f"   {message}")

def test_verify_mongodb_schema():
    """Test verify_mongodb_schema.py script"""
    print("\n" + "="*60)
    print("TEST 1: verify_mongodb_schema.py")
    print("="*60)
    
    script_path = GATEWAY_DIR / "verify_mongodb_schema.py"
    
    if not script_path.exists():
        log_test("verify_mongodb_schema.py exists", False, f"Script not found: {script_path}")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            cwd=str(GATEWAY_DIR),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=30
        )
        
        # Check if script ran successfully (exit code 0 or 1 is OK - 1 means issues found)
        if result.returncode in [0, 1]:
            output = (result.stdout or "") + (result.stderr or "")
            # Check for key indicators
            if "[OK] Connected to MongoDB" in output or "[ERROR]" in output:
                log_test("verify_mongodb_schema.py execution", True, 
                        f"Script executed (exit code: {result.returncode})")
                # Check if it found collections
                if "candidates" in output and "clients" in output:
                    log_test("verify_mongodb_schema.py - Collections found", True, 
                            "Found candidates and clients collections")
                else:
                    log_test("verify_mongodb_schema.py - Collections found", False, 
                            "Did not find expected collections")
                return True
            else:
                log_test("verify_mongodb_schema.py execution", False, 
                        f"Unexpected output: {output[:200]}")
                return False
        else:
            log_test("verify_mongodb_schema.py execution", False, 
                    f"Script failed with exit code: {result.returncode}\n{result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        log_test("verify_mongodb_schema.py execution", False, "Script timed out")
        return False
    except Exception as e:
        log_test("verify_mongodb_schema.py execution", False, f"Error: {str(e)}")
        return False

def test_create_mongodb_indexes():
    """Test create_mongodb_indexes.py script"""
    print("\n" + "="*60)
    print("TEST 2: create_mongodb_indexes.py")
    print("="*60)
    
    script_path = GATEWAY_DIR / "create_mongodb_indexes.py"
    
    if not script_path.exists():
        log_test("create_mongodb_indexes.py exists", False, f"Script not found: {script_path}")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            cwd=str(GATEWAY_DIR),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=30
        )
        
        # Check if script ran successfully
        if result.returncode == 0:
            output = (result.stdout or "") + (result.stderr or "")
            # Check for success indicators
            if "[OK] Connected to MongoDB" in output or "[SUCCESS]" in output:
                log_test("create_mongodb_indexes.py execution", True, 
                        "Script executed successfully")
                # Check if indexes were created or already exist
                if "index" in output.lower() or "already exists" in output.lower():
                    log_test("create_mongodb_indexes.py - Indexes", True, 
                            "Index creation/verification completed")
                else:
                    log_test("create_mongodb_indexes.py - Indexes", False, 
                            "No index information in output")
                return True
            else:
                log_test("create_mongodb_indexes.py execution", False, 
                        f"Unexpected output: {output[:200]}")
                return False
        else:
            log_test("create_mongodb_indexes.py execution", False, 
                    f"Script failed with exit code: {result.returncode}\n{result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        log_test("create_mongodb_indexes.py execution", False, "Script timed out")
        return False
    except Exception as e:
        log_test("create_mongodb_indexes.py execution", False, f"Error: {str(e)}")
        return False

def test_migrate_mongodb_schema():
    """Test migrate_mongodb_schema.py script"""
    print("\n" + "="*60)
    print("TEST 3: migrate_mongodb_schema.py")
    print("="*60)
    
    script_path = GATEWAY_DIR / "migrate_mongodb_schema.py"
    
    if not script_path.exists():
        log_test("migrate_mongodb_schema.py exists", False, f"Script not found: {script_path}")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            cwd=str(GATEWAY_DIR),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=30
        )
        
        # Check if script ran successfully (exit code 0 or 1 is OK)
        if result.returncode in [0, 1]:
            output = (result.stdout or "") + (result.stderr or "")
            # Check for success indicators
            if "[OK] Connected to MongoDB" in output or "[SUCCESS]" in output or "[MIGRATION" in output:
                log_test("migrate_mongodb_schema.py execution", True, 
                        f"Script executed (exit code: {result.returncode})")
                # Check if migration ran
                if "MIGRATION" in output or "migration" in output.lower():
                    log_test("migrate_mongodb_schema.py - Migration", True, 
                            "Migration script executed")
                else:
                    log_test("migrate_mongodb_schema.py - Migration", False, 
                            "No migration information in output")
                return True
            else:
                log_test("migrate_mongodb_schema.py execution", False, 
                        f"Unexpected output: {output[:200]}")
                return False
        else:
            log_test("migrate_mongodb_schema.py execution", False, 
                    f"Script failed with exit code: {result.returncode}\n{result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        log_test("migrate_mongodb_schema.py execution", False, "Script timed out")
        return False
    except Exception as e:
        log_test("migrate_mongodb_schema.py execution", False, f"Error: {str(e)}")
        return False

def main():
    """Run all MongoDB script tests"""
    print("="*60)
    print("MONGODB SCRIPTS TEST SUITE")
    print("="*60)
    print(f"Gateway Directory: {GATEWAY_DIR}")
    print(f"Python: {sys.executable}")
    
    # Test 1: Verify MongoDB Schema
    test_verify_mongodb_schema()
    
    # Test 2: Create MongoDB Indexes
    test_create_mongodb_indexes()
    
    # Test 3: Migrate MongoDB Schema
    test_migrate_mongodb_schema()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"[OK] Passed: {len(TEST_RESULTS['passed'])}")
    print(f"[ERROR] Failed: {len(TEST_RESULTS['failed'])}")
    print(f"[WARN] Warnings: {len(TEST_RESULTS['warnings'])}")
    
    if TEST_RESULTS['passed']:
        print("\n[OK] Passed Tests:")
        for test in TEST_RESULTS['passed']:
            print(f"   - {test}")
    
    if TEST_RESULTS['failed']:
        print("\n[ERROR] Failed Tests:")
        for test in TEST_RESULTS['failed']:
            print(f"   - {test}")
    
    print("\n" + "="*60)
    if len(TEST_RESULTS['failed']) == 0:
        print("[SUCCESS] ALL TESTS PASSED!")
    else:
        print(f"[WARN] {len(TEST_RESULTS['failed'])} test(s) failed.")
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

