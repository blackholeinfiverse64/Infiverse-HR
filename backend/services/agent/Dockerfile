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

RUN adduser --disabled-password --gecos "" agent

RUN mkdir -p /app/data/cache && \
    chown -R agent:agent /app

USER agent

EXPOSE 9000

HEALTHCHECK CMD curl --fail http://localhost:9000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "9000"]