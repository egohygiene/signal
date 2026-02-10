"use strict";

const REPORT_PATH = "./mega-linter-report.json";

let allIssues = [];

document.addEventListener("DOMContentLoaded", () => {
  loadReport();
  setupFilters();
});

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

function extractIssues(reportJson) {
  /*
    MegaLinter v8 reports usually expose issues under:
    reportJson.results or reportJson.report or similar.

    Adjust this function if your structure differs.
  */

  const issues = reportJson.results || [];

  return issues.map((issue) => ({
    severity: issue.severity || "unknown",
    linter: issue.linter || "unknown",
    rule: issue.rule || "",
    message: issue.message || "",
    file: issue.file || ""
  }));
}

function renderSummary(issues) {
  document.getElementById("total-issues").textContent = issues.length;

  document.getElementById("severity-error").textContent =
    issues.filter((i) => i.severity === "error").length;

  document.getElementById("severity-warning").textContent =
    issues.filter((i) => i.severity === "warning").length;

  document.getElementById("severity-info").textContent =
    issues.filter((i) => i.severity === "info").length;
}

function populateLinterFilter(issues) {
  const select = document.getElementById("linter-filter");
  const linters = Array.from(new Set(issues.map((i) => i.linter))).sort();

  linters.forEach((linter) => {
    const option = document.createElement("option");
    option.value = linter;
    option.textContent = linter;
    select.appendChild(option);
  });
}

function setupFilters() {
  document.getElementById("linter-filter").addEventListener("change", applyFilters);
  document.getElementById("severity-filter").addEventListener("change", applyFilters);
}

function applyFilters() {
  const linter = document.getElementById("linter-filter").value;
  const severity = document.getElementById("severity-filter").value;

  const filtered = allIssues.filter((issue) => {
    if (linter && issue.linter !== linter) {
      return false;
    }
    if (severity && issue.severity !== severity) {
      return false;
    }
    return true;
  });

  renderTable(filtered);
}

function renderTable(issues) {
  const tbody = document.getElementById("issues-table-body");
  tbody.innerHTML = "";

  issues.forEach((issue) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${issue.severity}</td>
      <td>${issue.linter}</td>
      <td>${issue.rule}</td>
      <td>${issue.message}</td>
      <td>${issue.file}</td>
    `;

    tbody.appendChild(row);
  });
}