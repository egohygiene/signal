"use strict";

/*
  Static MegaLinter Report Dashboard
  ---------------------------------
  - Reads mega-linter-report.json locally
  - Does not modify data
  - Does not send data anywhere
  - Safe to open in a browser
*/

const REPORT_PATH = "./mega-linter-report.json";

let allIssues = [];

document.addEventListener("DOMContentLoaded", () => {
  loadReport();
  setupFilters();
});

/* -------------------------------------------------
   Data Loading
------------------------------------------------- */

function loadReport() {
  fetch(REPORT_PATH)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load mega-linter-report.json");
      }
      return response.json();
    })
    .then((data) => {
      allIssues = extractIssues(data);
      renderSummary(allIssues);
      populateLinterFilter(allIssues);
      renderTable(allIssues);
    })
    .catch((error) => {
      console.error(error);
      alert("Could not load MegaLinter report. See console for details.");
    });
}

/* -------------------------------------------------
   Normalization
------------------------------------------------- */

function extractIssues(reportJson) {
  /*
    MegaLinter v8 typically exposes issues under:
    - reportJson.results

    This function acts as a normalization layer so
    future schema changes are isolated here.
  */

  const rawIssues = Array.isArray(reportJson.results)
    ? reportJson.results
    : [];

  return rawIssues.map((issue) => ({
    severity: issue.severity || "unknown",
    linter: issue.linter || "unknown",
    rule: issue.rule || "",
    message: issue.message || "",
    file: issue.file || ""
  }));
}

/* -------------------------------------------------
   Summary Rendering
------------------------------------------------- */

function renderSummary(issues) {
  document.getElementById("total-issues").textContent = issues.length;

  document.getElementById("severity-error").textContent =
    issues.filter((issue) => issue.severity === "error").length;

  document.getElementById("severity-warning").textContent =
    issues.filter((issue) => issue.severity === "warning").length;

  document.getElementById("severity-info").textContent =
    issues.filter((issue) => issue.severity === "info").length;
}

/* -------------------------------------------------
   Filters
------------------------------------------------- */

function populateLinterFilter(issues) {
  const select = document.getElementById("linter-filter");
  const linters = Array.from(
    new Set(issues.map((issue) => issue.linter))
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
    if (selectedLinter && issue.linter !== selectedLinter) {
      return false;
    }
    if (selectedSeverity && issue.severity !== selectedSeverity) {
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
  const tbody = document.getElementById("issues-table-body");
  tbody.innerHTML = "";

  issues.forEach((issue) => {
    const row = document.createElement("tr");

    // Severity cell (semantic + stylable)
    const severityCell = document.createElement("td");
    severityCell.textContent = issue.severity;
    severityCell.setAttribute("data-severity", issue.severity);

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

    tbody.appendChild(row);
  });
}