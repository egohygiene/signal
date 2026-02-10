"use strict";

/*
  MegaLinter Static Report Dashboard
  =================================
  Schema-aware for MegaLinter v8
  - Read-only
  - Static
  - Defensive
*/

/* -------------------------------------------------
   Configuration
------------------------------------------------- */

const REPORT_PATHS = [
  "mega-linter-report.json",
  "/reports/megalinter/mega-linter-report.json"
];

const LOG_PATHS = [
  "mega-linter.log",
  "/reports/megalinter/mega-linter.log"
];

let currentReportPathIndex = 0;
let currentLogPathIndex = 0;

/* -------------------------------------------------
   State
------------------------------------------------- */

let allIssues = [];

/* -------------------------------------------------
   Boot
------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  console.log("MegaLinter dashboard booting…");
  loadReport();
  loadLog();
  setupFilters();
  setupDetailPanel();
});

/* -------------------------------------------------
   Load JSON
------------------------------------------------- */

function loadReport() {
  const reportPath = REPORT_PATHS[currentReportPathIndex];
  console.log("Attempting to fetch report:", reportPath);

  fetch(reportPath)
    .then((response) => {
      if (!response.ok) {
        if (currentReportPathIndex < REPORT_PATHS.length - 1) {
          currentReportPathIndex++;
          return loadReport();
        }
        throw new Error("Failed to load MegaLinter report");
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;

      console.log("MegaLinter report loaded");

      renderRunOverview(data);

      allIssues = extractIssuesFromMegaLinter(data);

      renderSummary(allIssues);
      populateLinterFilter(allIssues);
      renderTable(allIssues);
    })
    .catch((error) => {
      console.error(error);
      alert("Could not load MegaLinter report. See console.");
    });
}

/* -------------------------------------------------
   Run Overview
------------------------------------------------- */

function renderRunOverview(report) {
  setText("run-status", humanizeStatus(report.status));
  setText("megalinter-flavor", report.megalinter_flavor);
  setText("return-code", report.return_code);
  setText("validate-all-code", yesNo(report.validate_all_code_base));
  setText("output-sarif", yesNo(report.output_sarif));
  setText("show-elapsed-time", yesNo(report.show_elapsed_time));
  setText("workspace", report.workspace);
  setText("report-folder", report.report_folder);
  setText("request-id", report.request_id);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent =
      value === undefined || value === null || value === ""
        ? "—"
        : value;
  }
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function humanizeStatus(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/* -------------------------------------------------
   Issue Extraction (Correct)
------------------------------------------------- */

function extractIssuesFromMegaLinter(report) {
  const issues = [];

  if (!Array.isArray(report.linters)) {
    return issues;
  }

  report.linters.forEach((linter) => {
    const linterName =
      linter.linter_name || linter.name || "Unknown";

    if (!Array.isArray(linter.files_lint_results)) {
      return;
    }

    linter.files_lint_results.forEach((fileResult) => {
      issues.push({
        severity: normalizeSeverity(fileResult.status),
        linter: linterName,
        rule: extractRuleFromStdout(fileResult.stdout),
        message: summarizeStdout(fileResult.stdout),
        file: fileResult.file,
        stdout: fileResult.stdout || "",
        errorCount: fileResult.errors_number || 0,
        warningCount: fileResult.warnings_number || 0
      });
    });
  });

  return issues;
}

function normalizeSeverity(status) {
  if (!status) return "info";
  const value = status.toLowerCase();
  if (value === "error") return "error";
  if (value === "warning") return "warning";
  return "info";
}

/* -------------------------------------------------
   Stdout Helpers
------------------------------------------------- */

function summarizeStdout(stdout) {
  if (!stdout) return "No output";
  const firstLine = stdout.split("\n")[0];
  return firstLine.length > 120
    ? firstLine.slice(0, 117) + "…"
    : firstLine;
}

function extractRuleFromStdout(stdout) {
  if (!stdout) return "—";
  const match = stdout.match(/\bSC\d+\b/);
  return match ? match[0] : "—";
}

/* -------------------------------------------------
   Summary
------------------------------------------------- */

function renderSummary(issues) {
  setText("total-issues", issues.length);
  setText(
    "severity-error",
    issues.filter((i) => i.severity === "error").length
  );
  setText(
    "severity-warning",
    issues.filter((i) => i.severity === "warning").length
  );
  setText(
    "severity-info",
    issues.filter((i) => i.severity === "info").length
  );
}

/* -------------------------------------------------
   Filters
------------------------------------------------- */

function populateLinterFilter(issues) {
  const select = document.getElementById("linter-filter");
  select.innerHTML = '<option value="">All</option>';

  const linters = Array.from(
    new Set(issues.map((i) => i.linter))
  ).sort();

  linters.forEach((linter) => {
    const option = document.createElement("option");
    option.value = linter;
    option.textContent = linter;
    select.appendChild(option);
  });
}

function setupFilters() {
  document
    .getElementById("linter-filter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("severity-filter")
    .addEventListener("change", applyFilters);
}

function applyFilters() {
  const linter = document.getElementById("linter-filter").value;
  const severity = document.getElementById("severity-filter").value;

  renderTable(
    allIssues.filter((i) => {
      if (linter && i.linter !== linter) return false;
      if (severity && i.severity !== severity) return false;
      return true;
    })
  );
}

/* -------------------------------------------------
   Table
------------------------------------------------- */

function renderTable(issues) {
  const tbody = document.getElementById("issues-table-body");
  tbody.innerHTML = "";

  if (issues.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No issues to display";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  issues.forEach((issue) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td data-severity="${issue.severity}">${issue.severity}</td>
      <td>${issue.linter}</td>
      <td>${issue.rule}</td>
      <td>${issue.message}</td>
      <td>${issue.file}</td>
    `;

    row.addEventListener("click", () => {
      showIssueDetail(issue, row);
    });

    tbody.appendChild(row);
  });
}

/* -------------------------------------------------
   Detail Panel
------------------------------------------------- */

function showIssueDetail(issue, row) {
  const panel = document.getElementById("issue-detail-panel");
  if (!panel) return;

  setText("detail-severity", issue.severity);
  setText("detail-linter", issue.linter);
  setText("detail-rule", issue.rule);
  setText("detail-message", issue.stdout);
  setText("detail-file", issue.file);

  panel.removeAttribute("hidden");

  document
    .querySelectorAll("#issues-table-body tr")
    .forEach((r) => r.classList.remove("selected"));

  row.classList.add("selected");
}

function setupDetailPanel() {
  const closeBtn = document.getElementById("close-detail");
  if (!closeBtn) return;

  closeBtn.addEventListener("click", () => {
    document
      .getElementById("issue-detail-panel")
      .setAttribute("hidden", "");
  });
}

/* -------------------------------------------------
   Log Viewer
------------------------------------------------- */

function loadLog() {
  const logPath = LOG_PATHS[currentLogPathIndex];
  console.log("Attempting to fetch log:", logPath);

  fetch(logPath)
    .then((response) => {
      if (!response.ok) {
        if (currentLogPathIndex < LOG_PATHS.length - 1) {
          currentLogPathIndex++;
          return loadLog();
        }
        throw new Error("Log file not found");
      }
      return response.text();
    })
    .then((logText) => {
      console.log("MegaLinter log loaded");
      displayLog(logText || "(empty log file)");
    })
    .catch((error) => {
      console.warn("Could not load MegaLinter log:", error.message);
      displayLogError(`Log file not available: ${error.message}`);
    });
}

function displayLog(logText) {
  const logContent = document.getElementById("log-content");
  if (!logContent) return;

  const parsedContent = parseGitHubActionsGroups(logText);
  logContent.innerHTML = parsedContent;
  logContent.classList.remove("error");
}

/* -------------------------------------------------
   GitHub Actions Log Group Parser
------------------------------------------------- */

function parseGitHubActionsGroups(logText) {
  const lines = logText.split("\n");
  const result = [];
  const groupStack = [];
  let currentContent = [];

  // Helper to get the current parent container
  const getCurrentParent = () => {
    return groupStack.length > 0 
      ? groupStack[groupStack.length - 1].content 
      : result;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const groupMatch = line.match(/^::group::(.+)$/);
    const endGroupMatch = line.match(/^::endgroup::$/);

    if (groupMatch) {
      // Save any content before this group
      if (currentContent.length > 0) {
        getCurrentParent().push({ type: 'text', content: currentContent.join("\n") });
        currentContent = [];
      }

      // Start a new group
      const groupTitle = groupMatch[1];
      const group = { type: 'group', title: groupTitle, content: [] };
      
      getCurrentParent().push(group);
      groupStack.push(group);
    } else if (endGroupMatch) {
      // End the current group
      if (currentContent.length > 0 && groupStack.length > 0) {
        groupStack[groupStack.length - 1].content.push({ 
          type: 'text', 
          content: currentContent.join("\n") 
        });
        currentContent = [];
      }
      // Only pop if there's a group to close
      if (groupStack.length > 0) {
        groupStack.pop();
      }
    } else {
      // Regular content line
      currentContent.push(line);
    }
  }

  // Add any remaining content
  if (currentContent.length > 0) {
    getCurrentParent().push({ type: 'text', content: currentContent.join("\n") });
  }

  return renderLogContent(result);
}

function renderLogContent(items) {
  return items.map(item => {
    if (item.type === 'text') {
      return escapeHtml(item.content);
    } else if (item.type === 'group') {
      const innerContent = renderLogContent(item.content);
      return `<details class="log-group">
  <summary class="log-group-title">${escapeHtml(item.title)}</summary>
  <div class="log-group-content">${innerContent}</div>
</details>`;
    }
    return '';
  }).join('');
}

function escapeHtml(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Use DOM API for safe HTML escaping
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displayLogError(message) {
  const logContent = document.getElementById("log-content");
  if (!logContent) return;

  logContent.textContent = message;
  logContent.classList.add("error");
}
