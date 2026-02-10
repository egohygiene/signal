"use strict";

/*
  MegaLinter Static Report Dashboard
  =================================
  - Single source of truth: mega-linter-report.json
  - No mutation
  - No network calls beyond local fetch
  - MegaLinter v8–aware
  - Defensive + inspectable
*/

/* -------------------------------------------------
   Configuration
------------------------------------------------- */

/*
  IMPORTANT:
  Your site root is https://signal.egohygiene.io/
  Your report lives at /reports/megalinter/
  
  Try local path first (for local testing), then production path
*/

const REPORT_PATHS = [
  "mega-linter-report.json",
  "/reports/megalinter/mega-linter-report.json"
];

let currentReportPathIndex = 0;

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
  setupFilters();
  setupDetailPanel();
});

/* -------------------------------------------------
   Load + Inspect JSON
------------------------------------------------- */

function loadReport() {
  const reportPath = REPORT_PATHS[currentReportPathIndex];
  console.log("Attempting to fetch report:", reportPath);

  fetch(reportPath)
    .then((response) => {
      if (!response.ok) {
        // Try next path if available
        if (currentReportPathIndex < REPORT_PATHS.length - 1) {
          currentReportPathIndex++;
          console.log("Trying alternate path...");
          loadReport();
          return null;
        }
        throw new Error(
          "Failed to load mega-linter-report.json (HTTP " +
            response.status +
            ")"
        );
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return; // Skip if trying alternate path

      console.group("MegaLinter report loaded");
      console.log("Top-level keys:", Object.keys(data));
      console.log("Raw report object:", data);
      console.groupEnd();

      allIssues = extractIssuesFromMegaLinterV8(data);

      console.group("MegaLinter extraction result");
      console.log("Extracted issues:", allIssues);
      console.log("Total issues:", allIssues.length);
      console.groupEnd();

      renderSummary(allIssues);
      populateLinterFilter(allIssues);
      renderTable(allIssues);
    })
    .catch((error) => {
      console.error("MegaLinter load failure:", error);
      alert(
        "MegaLinter report could not be loaded.\n" +
          "Open DevTools → Console for details."
      );
    });
}

/* -------------------------------------------------
   MegaLinter v8 Extraction
------------------------------------------------- */

function extractIssuesFromMegaLinterV8(report) {
  const issues = [];

  /*
    Expected MegaLinter v8 structure (simplified):

    {
      linters: {
        ESLINT: {
          issues: [ { severity, rule, message, file, ... } ]
        },
        YAML_LINT: {
          issues: [ ... ]
        }
      }
    }
  */

  if (!report || typeof report !== "object") {
    console.warn("Report is not an object");
    return issues;
  }

  if (!report.linters || typeof report.linters !== "object") {
    console.warn("No report.linters object found");
    return issues;
  }

  Object.entries(report.linters).forEach(
    ([linterName, linterData]) => {
      if (
        !linterData ||
        !Array.isArray(linterData.issues)
      ) {
        return;
      }

      linterData.issues.forEach((issue) => {
        issues.push({
          severity: normalizeSeverity(issue.severity),
          linter: linterName,
          rule:
            issue.rule ||
            issue.code ||
            issue.id ||
            "",
          message:
            issue.message ||
            issue.description ||
            "",
          file:
            issue.file ||
            issue.path ||
            ""
        });
      });
    }
  );

  return issues;
}

/* -------------------------------------------------
   Helpers
------------------------------------------------- */

function normalizeSeverity(rawSeverity) {
  if (!rawSeverity) {
    return "info";
  }

  const value = rawSeverity.toString().toLowerCase();

  if (value.includes("error")) {
    return "error";
  }
  if (value.includes("warn")) {
    return "warning";
  }

  return "info";
}

/* -------------------------------------------------
   Summary
------------------------------------------------- */

function renderSummary(issues) {
  document.getElementById("total-issues").textContent =
    issues.length;

  document.getElementById("severity-error").textContent =
    issues.filter((i) => i.severity === "error").length;

  document.getElementById("severity-warning").textContent =
    issues.filter((i) => i.severity === "warning").length;

  document.getElementById("severity-info").textContent =
    issues.filter((i) => i.severity === "info").length;
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
  const selectedLinter =
    document.getElementById("linter-filter").value;

  const selectedSeverity =
    document.getElementById("severity-filter").value;

  const filteredIssues = allIssues.filter((issue) => {
    if (
      selectedLinter &&
      issue.linter !== selectedLinter
    ) {
      return false;
    }

    if (
      selectedSeverity &&
      issue.severity !== selectedSeverity
    ) {
      return false;
    }

    return true;
  });

  renderTable(filteredIssues);
}

/* -------------------------------------------------
   Table Rendering
------------------------------------------------- */

function renderTable(issues) {
  const tbody = document.getElementById(
    "issues-table-body"
  );

  tbody.innerHTML = "";

  if (issues.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.textContent = "No issues to display";
    cell.style.textAlign = "center";
    cell.style.color = "#64748b";

    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  issues.forEach((issue, index) => {
    const row = document.createElement("tr");
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.setAttribute("data-issue-index", index);

    const severityCell = document.createElement("td");
    severityCell.textContent = issue.severity;
    severityCell.setAttribute(
      "data-severity",
      issue.severity
    );

    const linterCell = document.createElement("td");
    linterCell.textContent = issue.linter;

    const ruleCell = document.createElement("td");
    ruleCell.textContent = issue.rule;

    const messageCell = document.createElement("td");
    messageCell.textContent = issue.message;

    const fileCell = document.createElement("td");
    fileCell.textContent = issue.file;

    row.appendChild(severityCell);
    row.appendChild(linterCell);
    row.appendChild(ruleCell);
    row.appendChild(messageCell);
    row.appendChild(fileCell);

    // Add click handler to show detail panel
    row.addEventListener("click", () => {
      showIssueDetail(issue, row);
    });

    // Add keyboard handler for accessibility
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showIssueDetail(issue, row);
      }
    });

    tbody.appendChild(row);
  });
}

/* -------------------------------------------------
   Detail Panel
------------------------------------------------- */

function showIssueDetail(issue, row) {
  const panel = document.getElementById("issue-detail-panel");

  // Update panel content
  const severityEl = document.getElementById("detail-severity");
  severityEl.textContent = issue.severity;
  severityEl.setAttribute("data-severity", issue.severity);

  document.getElementById("detail-linter").textContent =
    issue.linter;

  document.getElementById("detail-rule").textContent =
    issue.rule || "—";

  document.getElementById("detail-message").textContent =
    issue.message || "No message provided";

  document.getElementById("detail-file").textContent =
    issue.file || "—";

  // Show panel
  panel.removeAttribute("hidden");

  // Update row selection
  const allRows = document.querySelectorAll(
    "#issues-table-body tr"
  );
  allRows.forEach((r) => r.classList.remove("selected"));
  row.classList.add("selected");

  // Scroll panel into view on smaller screens
  if (window.innerWidth <= 1200) {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function hideIssueDetail() {
  const panel = document.getElementById("issue-detail-panel");
  panel.setAttribute("hidden", "");

  // Remove selection from all rows
  const allRows = document.querySelectorAll(
    "#issues-table-body tr"
  );
  allRows.forEach((r) => r.classList.remove("selected"));
}

/* -------------------------------------------------
   Setup Detail Panel Controls
------------------------------------------------- */

function setupDetailPanel() {
  const closeBtn = document.getElementById("close-detail");

  closeBtn.addEventListener("click", () => {
    hideIssueDetail();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const panel = document.getElementById(
        "issue-detail-panel"
      );
      if (!panel.hasAttribute("hidden")) {
        hideIssueDetail();
      }
    }
  });
}