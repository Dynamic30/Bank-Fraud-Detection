FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir fastapi uvicorn "psycopg[binary]"
COPY backend backend
COPY frontend frontend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
