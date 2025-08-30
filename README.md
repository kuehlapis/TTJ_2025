## LeCompliance
A prototype system that utilizes LLM capabilities to flag features that require geo-specific compliance logic.

## 📄 Documentation

For full project documentation, see: [Project Docs](https://docs.google.com/document/d/1voDWtOC-vWqSAmjqzOxv-83WxojZyhrVTPsLfnfVrT8/edit?usp=sharing)

# Repository Setup
## Clone the repository:
```bash
git clone <repo-url>
cd TTJ_2025/frontend
```

# Set up Instructions for Backend with UV
This guide explains how to set up and run the backend of the project using **UV** with **FastAPI**. 
---

## Prerequisites 
- Python 3.10+ installed 
- uv package manager

## 1. Install UV if not installed
```bash
pip install uv
```

## 2. Install Dependencies:
```bash
cd backend

uv sync
```

## 3. Run backend
```bash
uv run fastapi dev main.py
```
## After starting the development server, you can access the backend at:
  ➜ localhost: http://127.0.0.1:8000/docs

# Setup instructions for Frontend
This guide explains how to set up and run the frontend of the project. 
---

## 1. Install dependencies:
```bash
cd frontend
npm i
```
## 2. Run the frontend:
```bash
npm run dev
```

## After starting the development server, you can access the frontend at:
  ➜  Local:   http://localhost:8080/

# Docker Setup

To run both backend and frontend using Docker Compose:

```bash
docker compose up --build
```

To stop and remove containers:

```bash
docker compose down
```

To clear Docker memory cache and volumes:

```bash
docker system prune -a
docker system prune --volumes
```
