#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

removed=0

for workspace_root in apps packages; do
  if [ ! -d "$workspace_root" ]; then
    continue
  fi

  for dir in "$workspace_root"/*; do
    [ -d "$dir" ] || continue
    nested="$dir/node_modules"
    if [ -d "$nested" ]; then
      echo "Removing $nested"
      rm -rf "$nested"
      removed=$((removed + 1))
    fi
  done
done

echo "Removed $removed nested node_modules directories."
