"""
MongoDB Atlas Connection Test Script
Tests connection to MongoDB Atlas using the connection string from .env file
"""
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get connection string
uri = os.getenv("DATABASE_URL")

if not uri:
    print("❌ DATABASE_URL not found in environment variables")
    print("Please check your .env file")
    print("\nExpected format:")
    print("DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority")
    exit(1)

# Mask password in display
display_uri = uri.split('@')[1] if '@' in uri else uri
print(f"🔗 Connecting to: {display_uri}")

try:
    # Connect to MongoDB Atlas
    print("\n⏳ Connecting to MongoDB Atlas...")
    client = MongoClient(uri, serverSelectionTimeoutMS=10000)
    
    # Test connection
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # List databases
    databases = client.list_database_names()
    print(f"\n📊 Available databases: {databases}")
    
    # Access your database
    db = client['bhiv_hr']
    print(f"📁 Using database: bhiv_hr")
    
    # List collections (will be empty initially)
    collections = db.list_collection_names()
    print(f"📋 Collections in 'bhiv_hr': {collections if collections else '(empty - no collections yet)'}")
    
    # Get database stats
    stats = db.command('dbStats')
    print(f"\n📈 Database Stats:")
    print(f"   - Data Size: {stats.get('dataSize', 0)} bytes")
    print(f"   - Storage Size: {stats.get('storageSize', 0)} bytes")
    print(f"   - Collections: {stats.get('collections', 0)}")
    
    print("\n🎉 MongoDB Atlas connection successful!")
    print("✅ You're ready to continue with migration!")
    print("\nNext steps:")
    print("1. Update production environment variables in Render.com")
    print("2. Continue with query migration (Phase 4)")
    print("3. Migrate data from PostgreSQL to MongoDB")
    
except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    print("\n🔍 Troubleshooting:")
    print("1. Check your internet connection")
    print("2. Verify IP address is whitelisted in Atlas (should be 0.0.0.0/0)")
    print("3. Check username and password are correct")
    print("4. Verify connection string format (password should be URL-encoded)")
    print("5. Check MongoDB Atlas cluster status")
    print("\nConnection string format:")
    print("mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority")
    exit(1)
