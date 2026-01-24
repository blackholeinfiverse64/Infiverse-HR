#!/usr/bin/env python3
"""
Final verification that Gateway → LangGraph integration is fixed
"""

import sys
import os

# Set up environment for MongoDB
os.environ['DATABASE_URL'] = 'mongodb://localhost:27017/bhiv_hr'
os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/bhiv_hr'
os.environ['MONGODB_DB_NAME'] = 'bhiv_hr'
os.environ['API_KEY_SECRET'] = 'test_api_key_12345'
os.environ['JWT_SECRET'] = 'test_jwt_secret_12345'
os.environ['CANDIDATE_JWT_SECRET'] = 'test_candidate_jwt_12345'
os.environ['AGENT_SERVICE_URL'] = 'http://localhost:9000'
os.environ['ENVIRONMENT'] = 'development'

# Add paths
services_dir = os.path.join(os.path.dirname(__file__), 'services')
gateway_dir = os.path.join(services_dir, 'gateway')
app_dir = os.path.join(gateway_dir, 'app')
sys.path.insert(0, gateway_dir)
sys.path.insert(0, app_dir)

def main():
    print("BHIV HR Platform - Final Verification")
    print("=" * 50)
    
    try:
        # Import FastAPI app
        from main import app
        print("SUCCESS: FastAPI app imported")
        
        # Count routes
        total_routes = len(app.routes)
        print(f"Total routes: {total_routes}")
        
        # Find LangGraph routes
        langgraph_count = 0
        webhook_count = 0
        
        for route in app.routes:
            if hasattr(route, 'path'):
                if '/api/v1/workflow' in route.path:
                    langgraph_count += 1
                elif '/api/v1/webhooks' in route.path:
                    webhook_count += 1
        
        print(f"LangGraph workflow routes: {langgraph_count}")
        print(f"LangGraph webhook routes: {webhook_count}")
        
        total_langgraph = langgraph_count + webhook_count
        print(f"Total LangGraph routes: {total_langgraph}")
        
        if total_langgraph >= 7:
            print("\nSUCCESS: All LangGraph routes are integrated!")
            print("The 404 errors should be RESOLVED.")
            print("\nNext steps:")
            print("1. Restart Docker containers")
            print("2. Test endpoints that were failing")
            print("3. Verify with: curl http://localhost:8000/api/v1/workflow/health")
            return True
        else:
            print(f"\nWARNING: Only {total_langgraph} LangGraph routes found")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\nFIXES VERIFIED SUCCESSFULLY!")
    else:
        print("\nSome issues remain.")