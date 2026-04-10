#!/usr/bin/env bash
set -euo pipefail

: "${AGENT_DECISION_API_URL:?Set AGENT_DECISION_API_URL from your local portal-backed setup.}"

curl -fsS "${AGENT_DECISION_API_URL%/}/health"
echo

