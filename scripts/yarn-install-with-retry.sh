#!/usr/bin/env bash
# Retry yarn install to survive transient npm/yarn registry 429s on CI (e.g. Vercel).
set -euo pipefail

MAX_ATTEMPTS="${YARN_INSTALL_MAX_ATTEMPTS:-5}"
SLEEP_SECONDS="${YARN_INSTALL_RETRY_SLEEP:-30}"

attempt=1
while true; do
  echo "yarn install (attempt ${attempt}/${MAX_ATTEMPTS})..."
  if yarn install --frozen-lockfile --network-timeout 600000 --network-concurrency 1; then
    exit 0
  fi

  if [ "${attempt}" -ge "${MAX_ATTEMPTS}" ]; then
    echo "yarn install failed after ${MAX_ATTEMPTS} attempts" >&2
    exit 1
  fi

  echo "Install failed (likely registry rate limit). Retrying in ${SLEEP_SECONDS}s..." >&2
  sleep "${SLEEP_SECONDS}"
  attempt=$((attempt + 1))
  # Back off a bit on each retry
  SLEEP_SECONDS=$((SLEEP_SECONDS + 15))
done
