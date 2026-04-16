#!/usr/bin/env bash
set -euo pipefail

SENTINEL_CLAUDE_SHADOW_STATE_DIR="${SENTINEL_CLAUDE_SHADOW_STATE_DIR:-/tmp/sentinel-pilot-claude-shadow-state}"
SENTINEL_CLAUDE_SHADOW_FILE="${SENTINEL_CLAUDE_SHADOW_FILE:-}"
SENTINEL_CLAUDE_SHADOW_TAIL_LINES="${SENTINEL_CLAUDE_SHADOW_TAIL_LINES:-10}"

mkdir -p "$SENTINEL_CLAUDE_SHADOW_STATE_DIR"

resolve_shadow_file() {
  if [[ -n "$SENTINEL_CLAUDE_SHADOW_FILE" ]]; then
    printf '%s\n' "$SENTINEL_CLAUDE_SHADOW_FILE"
    return 0
  fi

  find "$SENTINEL_CLAUDE_SHADOW_STATE_DIR" -maxdepth 1 -type f -name '*.jsonl' -printf '%T@ %p\n' \
    | sort -nr \
    | head -n 1 \
    | cut -d' ' -f2-
}

echo "Watching Claude shadow traces in: $SENTINEL_CLAUDE_SHADOW_STATE_DIR"

while true; do
  shadow_file="$(resolve_shadow_file)"

  if [[ -n "$shadow_file" ]]; then
    echo "Following: $shadow_file"
    exec tail -n "$SENTINEL_CLAUDE_SHADOW_TAIL_LINES" -F "$shadow_file"
  fi

  echo "Waiting for the first Claude shadow trace file..."
  sleep 1
done
