## 📄 Documentation

For full project documentation, see: [Project Docs](https://docs.google.com/document/d/1voDWtOC-vWqSAmjqzOxv-83WxojZyhrVTPsLfnfVrT8/edit?usp=sharing)

# TTJ_2025

## Repository Setup

1. Clone the repository:
	```bash
	git clone <repo-url>
	cd TTJ_2025/frontend
	```

## Setup Instructions

# Project Backend Setup with UV 
This guide explains how to set up and run the backend of the project using **UV** with **FastAPI**. 
---

## Prerequisites 
- Python 3.10+ installed 
- uv package manager

## Install UV if not installed
```bash
pip install uv
```
## Backend
2. Install Dependencies:
	```bash
	cd backend

	uv sync
	```

3.	Run backend

	uv run fastapi dev main.py

	localhost: http://127.0.0.1:8000/docs

# Project Frontend Setup 
This guide explains how to set up and run the frontend of the project. 
---

## Frontend
4. Install dependencies:
	```bash
	cd frontend
	npm i
	```

5. Run the frontend:
	```bash
	npm run dev
	```

After starting the development server, you can access the frontend at:

  ➜  Local:   http://localhost:8080/

## Docker Setup

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
