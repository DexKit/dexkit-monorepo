#!/usr/bin/env bash
# Retry yarn install to survive transient npm registry 429s on CI (e.g. Vercel).
# Lockfile tarballs should use registry.npmjs.org — registry.yarnpkg.com is often
# rate-limited on shared CI IPs while npmjs.org still serves the same packages.
set -euo pipefail

MAX_ATTEMPTS="${YARN_INSTALL_MAX_ATTEMPTS:-5}"
SLEEP_SECONDS="${YARN_INSTALL_RETRY_SLEEP:-60}"

# Authenticated npm requests get much higher rate limits on shared CI egress IPs.
if [[ -n "${NPM_TOKEN:-}" ]]; then
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> "${HOME}/.npmrc"
  echo "Configured npm auth from NPM_TOKEN" >&2
elif [[ "${VERCEL:-}" == "1" ]]; then
  echo "Warning: NPM_TOKEN is not set. Anonymous CI installs are more likely to hit 429s." >&2
  echo "Add a read-only npm automation token as NPM_TOKEN in Vercel env vars." >&2
fi

yarn config set registry https://registry.npmjs.org >/dev/null

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
  SLEEP_SECONDS=$((SLEEP_SECONDS + 60))
done
