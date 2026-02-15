#!/usr/bin/env bash

set -euo pipefail

# If first argument exists, treat it as ENABLE_LINTERS override
ENABLE_LINTERS_ARG="${1:-}"

docker run \
  --rm \
  --interactive \
  --tty \
  --platform "linux/amd64" \
  --volume "$(pwd)":/github/workspace \
  --workdir /github/workspace \
  --env GITHUB_WORKSPACE="/github/workspace" \
  --env GITHUB_REPOSITORY="egohygiene/signal" \
  --env GITHUB_REF="refs/heads/main" \
  --env GITHUB_RUN_ID="local-run" \
  --env PYTHONWARNINGS="ignore:Possible nested set:FutureWarning,ignore:pkg_resources is deprecated:UserWarning" \
  ${ENABLE_LINTERS_ARG:+--env ENABLE_LINTERS="$ENABLE_LINTERS_ARG"} \
  oxsecurity/megalinter:v9.3.0
