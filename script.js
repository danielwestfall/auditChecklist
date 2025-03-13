const inputFields = document.querySelectorAll("input, textarea");

// Save data to sessionStorage on input change
inputFields.forEach((input) => {
  input.addEventListener("input", () => {
    sessionStorage.setItem(input.id, input.value);
  });
});

// Load data from sessionStorage on page load
window.addEventListener("load", () => {
  inputFields.forEach((input) => {
    const savedValue = sessionStorage.getItem(input.id);
    if (savedValue) {
      input.value = savedValue;
    }
  });
});

// Function to show the selected tab
function showTab(tabId) {
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((tab) => tab.classList.remove("active"));
  document.getElementById(tabId + "-content").classList.add("active");
}

// Event listeners for radio button changes
const radioButtons = document.querySelectorAll('input[name="guideline"]');
radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    showTab(radio.id);
  });
});

function generateReport() {
  const table = document.getElementById("report-table");
  const pageName = document.getElementById("page-name").value;
  const pageAddress = document.getElementById("page-address").value;
  const auditDate = document.getElementById("audit-date").value;
  table.innerHTML = ""; // Clear previous table data

  const firstRow = table.insertRow();
  firstRow.insertCell().textContent = "Page Name:";
  firstRow.insertCell().textContent = pageName;
  firstRow.insertCell().textContent = "Page Address:";
  firstRow.insertCell().textContent = pageAddress;
  firstRow.insertCell().textContent = auditDate;

  // Add table header (after the input field row)
  const headerRow = table.insertRow();
  headerRow.insertCell().textContent = "Guideline";
  headerRow.insertCell().textContent = "Success Criterion";
  headerRow.insertCell().textContent = "Notes";
  headerRow.insertCell().textContent = "Completed";
  headerRow.insertCell().textContent = "Applicable";

  // Function to process each guideline
  function processGuideline(guidelineId, guidelineName) {
    const iframe = document.getElementById(guidelineId + "-iframe");
    const completed = document.getElementById(
      guidelineId + "-completed"
    ).checked;
    const checklistData = JSON.parse(iframe.contentWindow.getChecklistData());

    for (const sc in checklistData) {
      const row = table.insertRow();
      row.insertCell().textContent = guidelineName;
      row.insertCell().textContent = sc;
      row.insertCell().textContent = checklistData[sc].notes; // Access notes from the object
      row.insertCell().textContent = completed ? "Yes" : "No";
      row.insertCell().textContent = checklistData[sc].applicable
        ? "Yes"
        : "N/A"; // Add "Applicable" status
    }
  }

  // Process each guideline
  processGuideline("guideline-1.1", "1.1 Text Alternatives");
  processGuideline("guideline-1.2", "1.2 Time-based Media");
  processGuideline("guideline-1.3", "1.3 Adaptable");
  processGuideline("guideline-1.4", "1.4 Distinguishable");
  processGuideline("guideline-2.1", "2.1 Keyboard Accessible");
  processGuideline("guideline-2.2", "2.2 Enough Time");
  processGuideline("guideline-2.3", "2.3 Seizures");
  processGuideline("guideline-2.4", "2.4 Navigable");
  processGuideline("guideline-2.5", "2.5 Input Modalities");
  processGuideline("guideline-3.1", "3.1 Readable");
  processGuideline("guideline-3.2", "3.2 Predictable");
  processGuideline("guideline-3.3", "3.3 Input Assistance");
  processGuideline("guideline-4.1", "4.1 Compatible");

  document.getElementById("download-button").style.display = "inline-block";
}

function downloadTable() {
  const table = document.getElementById("report-table");
  const pageName = document.getElementById("page-name").value;
  const pageAddress = document.getElementById("page-address").value;
  const auditDate = document.getElementById("audit-date").value;
  let csvContent = "data:text/csv;charset=utf-8,"; // Add this line

  // Add input field values to separate rows in CSV
  csvContent += '"Page Name:","' + pageName + '","","",""\r\n';
  csvContent += '"Page Address:","' + pageAddress + '","","",""\r\n';
  csvContent += '"Audit Date:","' + auditDate + '","","",""\r\n';

  // Add regular header
  csvContent +=
    '"Guideline","Success Criterion","Notes","Completed","Applicable"\r\n';

  // Loop through original table rows (excluding the input field rows)
  const rows = table.querySelectorAll("tr");
  for (let i = 3; i < rows.length; i++) {
    // Start from index 3 to skip the input field rows
    const row = rows[i];
    const rowData = [];
    const cells = row.querySelectorAll("th, td");

    cells.forEach(function (cell) {
      let cellData = cell.textContent.replace(/,/g, "");
      cellData = '"' + cellData + '"';
      rowData.push(cellData);
    });

    csvContent += rowData.join(",") + "\r\n";
  }

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "wcag_audit_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
document.getElementById("audit-date").value = today;

const accordionTriggers = document.querySelectorAll(".accordion-trigger");

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetId = trigger.dataset.target;
    const targetContent = document.getElementById(targetId);

    // Toggle visibility
    if (targetContent.style.display === "block") {
      targetContent.style.display = "none";
    } else {
      // Close other accordion items
      document.querySelectorAll(".accordion-content").forEach((content) => {
        content.style.display = "none";
      });
      targetContent.style.display = "block";
    }
  });
});
