#!/usr/bin/env bash
set -euo pipefail

# ================================
# Normalize Input
# ================================

RAW_INPUT="${1:-}"

# Allow comma-separated input
IFS=',' read -ra INPUT_ARRAY <<< "${RAW_INPUT}"

# ================================
# Linter Mapping
# ================================

declare -A LINTER_MAP

# -------- Repository --------
LINTER_MAP["secretlint"]="REPOSITORY_SECRETLINT"
LINTER_MAP["REPOSITORY_SECRETLINT"]="REPOSITORY_SECRETLINT"

LINTER_MAP["checkov"]="REPOSITORY_CHECKOV"
LINTER_MAP["gitleaks"]="REPOSITORY_GITLEAKS"
LINTER_MAP["semgrep"]="REPOSITORY_SEMGREP"
LINTER_MAP["trivy"]="REPOSITORY_TRIVY"
LINTER_MAP["trivy_sbom"]="REPOSITORY_TRIVY_SBOM"
LINTER_MAP["syft"]="REPOSITORY_SYFT"
LINTER_MAP["trufflehog"]="REPOSITORY_TRUFFLEHOG"
LINTER_MAP["ls_lint"]="REPOSITORY_LS_LINT"
LINTER_MAP["devskim"]="REPOSITORY_DEVSKIM"
LINTER_MAP["dustilock"]="REPOSITORY_DUSTILOCK"
LINTER_MAP["kics"]="REPOSITORY_KICS"
LINTER_MAP["kingfisher"]="REPOSITORY_KINGFISHER"

# -------- Spell --------
LINTER_MAP["cspell"]="SPELL_CSPELL"
LINTER_MAP["proselint"]="SPELL_PROSELINT"
LINTER_MAP["vale"]="SPELL_VALE"
LINTER_MAP["lychee"]="SPELL_LYCHEE"
LINTER_MAP["codespell"]="SPELL_CODESPELL"

# -------- Python --------
LINTER_MAP["pylint"]="PYTHON_PYLINT"
LINTER_MAP["black"]="PYTHON_BLACK"
LINTER_MAP["flake8"]="PYTHON_FLAKE8"
LINTER_MAP["isort"]="PYTHON_ISORT"
LINTER_MAP["bandit"]="PYTHON_BANDIT"
LINTER_MAP["mypy"]="PYTHON_MYPY"
LINTER_MAP["pyright"]="PYTHON_PYRIGHT"
LINTER_MAP["ruff"]="PYTHON_RUFF"
LINTER_MAP["ruff_format"]="PYTHON_RUFF_FORMAT"

# -------- JavaScript / TS --------
LINTER_MAP["eslint"]="JAVASCRIPT_ES"
LINTER_MAP["standard"]="JAVASCRIPT_STANDARD"
LINTER_MAP["prettier_js"]="JAVASCRIPT_PRETTIER"
LINTER_MAP["ts_eslint"]="TYPESCRIPT_ES"
LINTER_MAP["ts_standard"]="TYPESCRIPT_STANDARD"
LINTER_MAP["ts_prettier"]="TYPESCRIPT_PRETTIER"

# -------- YAML / JSON --------
LINTER_MAP["yamllint"]="YAML_YAMLLINT"
LINTER_MAP["yaml_prettier"]="YAML_PRETTIER"
LINTER_MAP["v8r"]="YAML_V8R"
LINTER_MAP["jsonlint"]="JSON_JSONLINT"
LINTER_MAP["json_prettier"]="JSON_PRETTIER"

# -------- Docker / Infra --------
LINTER_MAP["hadolint"]="DOCKERFILE_HADOLINT"
LINTER_MAP["terraform_tflint"]="TERRAFORM_TFLINT"
LINTER_MAP["terraform_terragrunt"]="TERRAFORM_TERRAGRUNT"
LINTER_MAP["terraform_terrascan"]="TERRAFORM_TERRASCAN"
LINTER_MAP["cloudformation"]="CLOUDFORMATION_CFN_LINT"

# -------- Go --------
LINTER_MAP["golangci"]="GO_GOLANGCI_LINT"
LINTER_MAP["revive"]="GO_REVIVE"

# -------- Rust --------
LINTER_MAP["clippy"]="RUST_CLIPPY"

# -------- Bash --------
LINTER_MAP["shellcheck"]="BASH_SHELLCHECK"
LINTER_MAP["bash_exec"]="BASH_EXEC"
LINTER_MAP["shfmt"]="BASH_SHFMT"

# -------- SQL --------
LINTER_MAP["sqlfluff"]="SQL_SQLFLUFF"
LINTER_MAP["tsqlint"]="SQL_TSQLINT"

# -------- Markdown --------
LINTER_MAP["markdownlint"]="MARKDOWN_MARKDOWNLINT"
LINTER_MAP["remark"]="MARKDOWN_REMARK_LINT"
LINTER_MAP["markdown_table"]="MARKDOWN_MARKDOWN_TABLE_FORMATTER"
LINTER_MAP["rmd"]="MARKDOWN_RMDLINT"

# -------- C / C++ --------
LINTER_MAP["cppcheck"]="C_CPPCHECK"
LINTER_MAP["cpplint"]="C_CPPLINT"
LINTER_MAP["clang_format"]="C_CLANG_FORMAT"

# -------- C# --------
LINTER_MAP["dotnet_format"]="CSHARP_DOTNET_FORMAT"
LINTER_MAP["csharpier"]="CSHARP_CSHARPIER"
LINTER_MAP["roslynator"]="CSHARP_ROSLYNATOR"

# -------- Java --------
LINTER_MAP["checkstyle"]="JAVA_CHECKSTYLE"
LINTER_MAP["pmd"]="JAVA_PMD"

# -------- Kotlin --------
LINTER_MAP["ktlint"]="KOTLIN_KTLINT"
LINTER_MAP["detekt"]="KOTLIN_DETEKT"

# -------- Lua --------
LINTER_MAP["luacheck"]="LUA_LUACHECK"
LINTER_MAP["selene"]="LUA_SELENE"
LINTER_MAP["stylua"]="LUA_STYLUA"

# -------- PHP --------
LINTER_MAP["phpcs"]="PHP_PHPCS"
LINTER_MAP["phpstan"]="PHP_PHPSTAN"
LINTER_MAP["psalm"]="PHP_PSALM"
LINTER_MAP["phplint"]="PHP_PHPLINT"
LINTER_MAP["php_cs_fixer"]="PHP_PHPCS_FIXER"

# -------- Ruby --------
LINTER_MAP["rubocop"]="RUBY_RUBOCOP"

# -------- R --------
LINTER_MAP["lintr"]="R_LINTR"

# -------- Misc --------
LINTER_MAP["graphql"]="GRAPHQL_GRAPHQL_SCHEMA_LINTER"
LINTER_MAP["htmlhint"]="HTML_HTMLHINT"
LINTER_MAP["djlint"]="HTML_DJLINT"
LINTER_MAP["rstcheck"]="RST_RSTCHECK"
LINTER_MAP["rstlint"]="RST_RST_LINT"
LINTER_MAP["protobuf"]="PROTOBUF_PROTOLINT"
LINTER_MAP["snakemake"]="SNAKEMAKE_SNAKEMAKE_LINT"
LINTER_MAP["robotframework"]="ROBOTFRAMEWORK_ROBOCOP"

# ================================
# Resolve ENABLE_LINTERS
# ================================

if [[ -z "$RAW_INPUT" ]]; then
  ENABLE_LINTERS=""
else
  RESOLVED=()
  for ITEM in "${INPUT_ARRAY[@]}"; do
    KEY="$(echo "$ITEM" | tr '[:upper:]' '[:lower:]')"
    RESOLVED+=("${LINTER_MAP[$KEY]:-$ITEM}")
  done
  ENABLE_LINTERS="$(IFS=','; echo "${RESOLVED[*]}")"
fi

echo "ENABLE_LINTERS=${ENABLE_LINTERS:-ALL}"

# ================================
# Run Docker
# ================================

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
  --env NPM_CONFIG_AUDIT=false \
  --env NPM_CONFIG_FUND=false \
  --env NPM_CONFIG_LOGLEVEL=error \
  ${ENABLE_LINTERS:+--env ENABLE_LINTERS="$ENABLE_LINTERS"} \
  oxsecurity/megalinter:v9.3.0
