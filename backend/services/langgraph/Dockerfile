FROM python:3.10-slim AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir \
    --prefix=/install \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements.txt

FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends libgomp1 curl && \
    rm -rf /var/lib/apt/lists/*


COPY --from=builder /install /usr/local

COPY . .

RUN adduser --disabled-password --gecos "" langgraph

RUN mkdir -p /app/data/cache && \
    chown -R langgraph:langgraph /app

USER langgraph

EXPOSE 9001

HEALTHCHECK CMD curl --fail http://localhost:9001/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9001"]