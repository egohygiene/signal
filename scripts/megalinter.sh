#!/usr/bin/env bash

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
  oxsecurity/megalinter:v8.8.0

