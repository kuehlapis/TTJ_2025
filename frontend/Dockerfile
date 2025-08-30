# syntax=docker/dockerfile:1
FROM python:3.12-slim

# System deps (Tesseract only if you use OCR; remove if not needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Helpful defaults
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

WORKDIR /backend

# Copy only project metadata first for better layer caching
COPY pyproject.toml uv.lock* ./

# Install Astral uv and sync deps into a .venv managed by uv
RUN pip install --no-cache-dir uv \
 && uv sync --frozen || uv sync

# Now copy your source
COPY backend/ ./backend/

# Ensure runtime data dir exists if you write a SQLite DB here
RUN mkdir -p /data

EXPOSE 8000

# Run the app (bind to all interfaces inside container)
CMD ["uv", "run", "uvicorn", "backend.main", "--host", "0.0.0.0", "--port", "8000"]
