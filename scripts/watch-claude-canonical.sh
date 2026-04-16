#!/usr/bin/env bash
set -euo pipefail

SENTINEL_CLAUDE_SHADOW_STATE_DIR="${SENTINEL_CLAUDE_SHADOW_STATE_DIR:-/tmp/sentinel-pilot-claude-shadow-state}"
SENTINEL_CLAUDE_CANONICAL_FILE="${SENTINEL_CLAUDE_CANONICAL_FILE:-}"
SENTINEL_CLAUDE_CANONICAL_TAIL_LINES="${SENTINEL_CLAUDE_CANONICAL_TAIL_LINES:-10}"

mkdir -p "$SENTINEL_CLAUDE_SHADOW_STATE_DIR"

resolve_canonical_file() {
  if [[ -n "$SENTINEL_CLAUDE_CANONICAL_FILE" ]]; then
    printf '%s\n' "$SENTINEL_CLAUDE_CANONICAL_FILE"
    return 0
  fi

  find "$SENTINEL_CLAUDE_SHADOW_STATE_DIR" -maxdepth 1 -type f -name '*.canonical.jsonl' -printf '%T@ %p\n' \
    | sort -nr \
    | head -n 1 \
    | cut -d' ' -f2-
}

echo "Watching Claude canonical events in: $SENTINEL_CLAUDE_SHADOW_STATE_DIR"

while true; do
  canonical_file="$(resolve_canonical_file)"

  if [[ -n "$canonical_file" ]]; then
    echo "Following: $canonical_file"
    exec tail -n "$SENTINEL_CLAUDE_CANONICAL_TAIL_LINES" -F "$canonical_file"
  fi

  echo "Waiting for the first Claude canonical event file..."
  sleep 1
done
