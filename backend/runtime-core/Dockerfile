# Multi-stage Dockerfile for Sovereign Application Runtime (SAR)
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the SAR runtime core
COPY . /app/

# Create a main application file to run the SAR
RUN echo 'from fastapi import FastAPI\n\napp = FastAPI(title="Sovereign Application Runtime", version="1.0.0")\n\n@app.get("/health")\nasync def health_check():\n    return {"status": "healthy", "service": "SAR"}\n\n# Import and include all SAR modules\ntry:\n    from auth.router import router as auth_router\n    app.include_router(auth_router, prefix="/auth")\nexcept ImportError:\n    pass\n\ntry:\n    from tenancy.router import router as tenancy_router\n    app.include_router(tenancy_router, prefix="/tenancy")\nexcept ImportError:\n    pass\n\ntry:\n    from role_enforcement.router import router as role_router\n    app.include_router(role_router, prefix="/role")\nexcept ImportError:\n    pass\n\ntry:\n    from audit_logging.router import router as audit_router\n    app.include_router(audit_router, prefix="/audit")\nexcept ImportError:\n    pass\n\ntry:\n    from workflow.router import router as workflow_router\n    app.include_router(workflow_router, prefix="/workflow")\nexcept ImportError:\n    pass\n' > main.py

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]