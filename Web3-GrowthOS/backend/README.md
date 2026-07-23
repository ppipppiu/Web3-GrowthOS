# Web3 GrowthOS Backend

This directory contains the FastAPI backend for Web3 GrowthOS Mini Demo v0.1.

## Current Features

- FastAPI project initialization
- Root API endpoint
- Health-check endpoint

## Local Setup

Run the following commands from the project root.

### 1. Create a virtual environment

```bash
python -m venv .venv
```
### 2. Activate the virtual environment

Windows PowerShell:
```bash
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies
```bash
pip install -r backend/requirements.txt
```

### 4. Start the development server
```bash
uvicorn backend.app.main:app --reload
```

Local URLs
- Root API: http://127.0.0.1:8000/
- Health check: http://127.0.0.1:8000/health
- Swagger UI: http://127.0.0.1:8000/docs