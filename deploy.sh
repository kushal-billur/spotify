#!/usr/bin/env bash

# Simple build-and-run script for the Spotify-like web app
# Requirements:
#   - Docker installed and running
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh

set -euo pipefail

IMAGE_NAME="spotify-web-app"
CONTAINER_NAME="spotify-web-app-container"
PORT="8080"

# Build Docker image
echo "[deploy] Building Docker image: ${IMAGE_NAME}..."
docker build -t "${IMAGE_NAME}" .

# Stop and remove any existing container with the same name
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"; then
  echo "[deploy] Stopping existing container: ${CONTAINER_NAME}..."
  docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  echo "[deploy] Removing existing container: ${CONTAINER_NAME}..."
  docker rm "${CONTAINER_NAME}" >/dev/null 2>&1 || true
fi

# Run new container
echo "[deploy] Starting container ${CONTAINER_NAME} on http://localhost:${PORT} ..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:8080" \
  "${IMAGE_NAME}"

# Final status
sleep 2
if docker ps --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"; then
  echo "[deploy] Container is running. Open: http://localhost:${PORT}"
else
  echo "[deploy] ERROR: Container failed to start. Check 'docker logs ${CONTAINER_NAME}' for details." >&2
  exit 1
fi
