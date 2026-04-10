#!/usr/bin/env bash
set -euo pipefail

: "${AGENT_DECISION_API_URL:?Set AGENT_DECISION_API_URL from your local portal-backed setup.}"
: "${AGENT_DECISION_API_KEY:?Set AGENT_DECISION_API_KEY from the one-shot reveal.}"

SENTINEL_HOST="${SENTINEL_HOST:-claude-code}"
SENTINEL_REQUEST="${SENTINEL_REQUEST:-update sensitive config in prod}"
SENTINEL_ENVIRONMENT="${SENTINEL_ENVIRONMENT:-prod}"
SENTINEL_TARGET="${SENTINEL_TARGET:-config/prod.env}"

curl -fsS "${AGENT_DECISION_API_URL%/}/evaluate" \
  -H 'content-type: application/json' \
  -H "x-api-key: $AGENT_DECISION_API_KEY" \
  -d "{
    \"userRequest\": \"${SENTINEL_REQUEST}\",
    \"host\": \"${SENTINEL_HOST}\",
    \"environment\": \"${SENTINEL_ENVIRONMENT}\",
    \"target\": \"${SENTINEL_TARGET}\"
  }"
echo

