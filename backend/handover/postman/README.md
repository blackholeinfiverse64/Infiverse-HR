# BHIV HR Platform - Postman Testing

## Files Included

### 1. **postman_collection.json**
- Complete collection with 119 endpoints
- Gateway Service (88 endpoints)
- Agent Service (6 endpoints) 
- LangGraph Service (25 endpoints)
- Pre-configured timeouts and authentication

### 2. **bhiv-local-env.json**
- Environment variables for local testing
- API keys, credentials, test data
- Service URLs (localhost)
- Current TOTP code: 582299

## Setup Instructions

1. **Import Collection**: Import `postman_collection.json` into Postman
2. **Import Environment**: Import `bhiv-local-env.json` as environment
3. **Select Environment**: Choose "BHIV HR Local Development" 
4. **Run Collection**: Use Collection Runner with recommended settings

## Recommended Runner Settings

- **Environment**: BHIV HR Local Development
- **Iterations**: 1
- **Delay**: 20000 ms
- **Persist responses**: ✅ Checked
- **Keep variable values**: ✅ Checked
- **Stop on error**: ❌ Unchecked

## Credentials

- **API Key**: `prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o`
- **Admin**: admin/admin123
- **Client**: TECH001/demo123
- **TOTP**: 582299

## Service URLs (Local)

- Gateway: http://localhost:8000
- Agent: http://localhost:9000
- LangGraph: http://localhost:9001